// src/pages/AddNewRequest.jsx
import {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  useMemo,
  useRef,
} from "react";
import { analyzeRequest } from "../../services/analyzeService";
import { UserContext } from "../../contexts/UserContext";
import { createRequest } from "../../services/requestService";

const AddNewRequest = () => {
  /* ------------------------------ Initial Data ------------------------------ */
  const INITIAL = {
    name: "",
    carDetails: { carType: "", carModel: "", carMade: "", carYear: "" },
    image: "",
    description: "",
  };

  /* --------------------------------- State --------------------------------- */
  const { user } = useContext(UserContext);
  const [requestData, setRequestData] = useState(INITIAL);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]); // File objects
  const [previews, setPreviews] = useState([]); // { url, name, size }
  const [sending, setSending] = useState(false);

  // Wizard step: 0 = greeting, then 1..7 for fields, 8 = analyze/summary
  const [step, setStep] = useState(0);
  const hasStarted = useMemo(
    () => messages.some((m) => m.role === "user"),
    [messages]
  );

  /* ------------------------- AUTOSCROLL REFS & HELPERS ------------------------- */
  const scrollRef = useRef(null); // scrollable messages container
  const tailRef = useRef(null); // sentinel at the end of the list
  const composerRef = useRef(null); // fixed composer
  const [composerH, setComposerH] = useState(112); // dynamic bottom inset for messages

  const scrollToBottom = (behavior = "auto") => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior,
        });
      });
    } else if (tailRef.current) {
      tailRef.current.scrollIntoView({ block: "end", behavior });
    }
  };

  // Scroll on first render and whenever messages change
  const initialScrollDone = useRef(false);
  useEffect(() => {
    scrollToBottom(initialScrollDone.current ? "smooth" : "auto");
    initialScrollDone.current = true;
  }, [messages]);

  // Scroll when previews (images) change
  useEffect(() => {
    scrollToBottom("smooth");
  }, [previews]);

  // Keep input visible on resize (e.g., virtual keyboards)
  useEffect(() => {
    const onResize = () => scrollToBottom("auto");
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Measure composer height dynamically so messages area stops right above it
  useLayoutEffect(() => {
    if (!composerRef.current) return;
    const el = composerRef.current;
    const setH = () => setComposerH(el.offsetHeight || 112);
    setH();

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => setH());
      ro.observe(el);
    } else {
      window.addEventListener("resize", setH);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", setH);
    };
  }, []);

  /* ------------------------------ Step Config ------------------------------- */
  const STEP_FLOW = [
    null,
    {
      key: "name",
      prompt: "What is your car type?",
      apply: (d, v) => ({ ...d, name: v }),
    },
    {
      key: "carType",
      prompt: "What is your car model?",
      apply: (d, v) => ({ ...d, carDetails: { ...d.carDetails, carType: v } }),
    },
    {
      key: "carModel",
      prompt: "What is your car make?",
      apply: (d, v) => ({ ...d, carDetails: { ...d.carDetails, carModel: v } }),
    },
    {
      key: "carMade",
      prompt: "What is the manufacture year?",
      apply: (d, v) => ({ ...d, carDetails: { ...d.carDetails, carMade: v } }),
    },
    {
      key: "carYear",
      prompt: "Do you want to share more details?",
      apply: (d, v) => ({ ...d, carDetails: { ...d.carDetails, carYear: v } }),
    },
    {
      key: "description",
      prompt: "Do you have a photo of the damaged part?",
      apply: (d, v) => ({ ...d, description: v }),
    },
    {
      key: "image",
      prompt: "Please wait while I analyze the data...",
      apply: (d, v) => ({ ...d, image: v }),
    },
  ];
  const LAST_STEP_INDEX = 7;

  /* ------------------------------ Side Effects ------------------------------ */
  // Initial greeting
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        text: `Hello ${user?.username || "there"}, how can I assist you today?`,
      },
    ]);
    setStep(1);
  }, [user?.username]);

  // Generate preview URLs for selected files; clean up on change
  useEffect(() => {
    const created = files.map((f) => ({
      url: URL.createObjectURL(f),
      name: f.name,
      size: f.size,
    }));
    setPreviews(created);
    return () => created.forEach((p) => URL.revokeObjectURL(p.url));
  }, [files]);

  /* -------------------------------- Handlers -------------------------------- */
  const handleFiles = (e) => setFiles(Array.from(e.target.files || []));
  const removeFileAt = (idx) => setFiles((arr) => arr.filter((_, i) => i !== idx));
  const clearFiles = () => setFiles([]);

  const pushMessage = (msg) => setMessages((m) => [...m, msg]);

  const handleSend = async () => {
    if (sending || (!input && files.length === 0)) return;

    // Snapshot current inputs to attach to this user turn
    const userText = input.trim();
    const userFiles = files.slice();
    const userPreviewSnapshot = previews.slice(); // avoid losing previews after clear

    // Show user message
    pushMessage({ role: "user", text: userText, files: userPreviewSnapshot });
    setSending(true);

    // Clear composer immediately for a snappy UX
    setInput("");
    setFiles([]);
    scrollToBottom("smooth");

    try {
      // Apply current step's data mapping and ask next question
      if (step >= 1 && step <= LAST_STEP_INDEX) {
        const { apply, prompt } = STEP_FLOW[step];

        setRequestData((prev) => apply(prev, userText));
        pushMessage({ role: "assistant", text: prompt });

        const next = step + 1;
        setStep(next);

        // If we just advanced beyond LAST_STEP_INDEX, run analysis next
        if (next > LAST_STEP_INDEX) {
          await runAnalysisAndPersist(userFiles);
        }
      } else {
        // Post-analysis free chat (optional extension point)
      }
    } catch {
      pushMessage({
        role: "assistant",
        text: "Sorry—something went wrong. Please try again.",
      });
    } finally {
      setSending(false);
      scrollToBottom("smooth");
    }
  };

  const runAnalysisAndPersist = async (attachedFiles) => {
    // Build prompt from latest requestData (use functional read to avoid staleness)
    const d = ((fn) => {
      let snap;
      setRequestData((prev) => ((snap = prev), prev));
      return snap ?? requestData;
    })();

    const prompt = `I have a ${d.carDetails.carMade} ${d.carDetails.carModel} ${d.carDetails.carType} ${d.carDetails.carYear} car. The issue: ${d.description}.`;

    try {
      const { result } = await analyzeRequest({
        userText: prompt,
        files: attachedFiles,
      });

      const assistantText = [
        result?.diagnosis && `Diagnosis: ${result.diagnosis}`,
        result?.severity && `Severity: ${result.severity}`,
        result?.likely_part_name && `Likely part: ${result.likely_part_name}`,
        Array.isArray(result?.repair_steps) && result.repair_steps.length
          ? `Repair steps:\n- ${result.repair_steps.join("\n- ")}`
          : "",
        Array.isArray(result?.tools_needed) && result.tools_needed.length
          ? `Tools needed:\n- ${result.tools_needed.join("\n- ")}`
          : "",
        Array.isArray(result?.safety_notes) && result.safety_notes.length
          ? `Safety:\n- ${result.safety_notes.join("\n- ")}`
          : "",
        Array.isArray(result?.recommended_websites) &&
        result.recommended_websites.length
          ? `Where to buy:\n${result.recommended_websites.join("\n")}`
          : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      pushMessage({
        role: "assistant",
        text: assistantText || "Analysis complete.",
      });
    } catch {
      pushMessage({
        role: "assistant",
        text: "Sorry—something went wrong while analyzing. Please try again.",
      });
    }

    // Persist request with full conversation snapshot
    try {
      const payload = { ...requestData, messages: [...messages] };
      await createRequest(payload);
    } catch {
      // Optional: toast error; keep silent
    } finally {
      scrollToBottom("smooth");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ---------------------------------- UI ----------------------------------- */
  return (
    // IMPORTANT: this page stays overflow-hidden so only the messages area scrolls
    <div className="h-screen w-full overflow-hidden text-gray-900 relative">
      {!hasStarted ? (
        // Landing: centered input like ChatGPT's first screen
        <div className="h-full mx-auto max-w-3xl px-4 flex flex-col items-center justify-center">
          <div className="w-full space-y-6">
            <h1 className="text-center text-2xl font-semibold">New Request</h1>

            {previews.length > 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">
                    Selected images ({previews.length})
                  </p>
                  <button
                    type="button"
                    onClick={clearFiles}
                    className="text-xs font-medium text-gray-600 hover:text-gray-900"
                    aria-label="Clear all selected images"
                  >
                    Clear
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {previews.map((p, idx) => (
                    <div
                      key={p.url}
                      className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                    >
                      <img
                        src={p.url}
                        alt={p.name || `Selected ${idx + 1}`}
                        className="h-28 w-full object-cover"
                        onLoad={() => scrollToBottom("auto")}
                      />
                      <button
                        type="button"
                        onClick={() => removeFileAt(idx)}
                        className="absolute right-1 top-1 rounded-md bg-black/60 px-1.5 py-0.5 text-xs text-white hover:bg-black/80"
                        aria-label={`Remove ${p.name || `image ${idx + 1}`}`}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFiles}
                  className="hidden"
                />
                <span>Upload Images</span>
              </label>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe the issue..."
                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              />

              <button
                type="button"
                onClick={handleSend}
                className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={sending || (!input && files.length === 0)}
              >
                {sending ? "Sending…" : "Send"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Chat mode: messages scroll; composer fixed to content area (not under sidebar)
        <>
          {/* Scrollable messages only — centered column.
              Bottom padding matches dynamic composer height so content never hides. */}
          <div
            ref={scrollRef}
            className="h-full mx-auto w-full max-w-5xl px-4 pt-4 overflow-y-auto"
            style={{ paddingBottom: composerH }}
          >
            <ul className="space-y-4">
              {messages.map((m, i) => {
                const isUser = m.role === "user";
                return (
                  <li
                    key={i}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isUser
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white text-gray-900 shadow border border-gray-200"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>

                      {!!m.files?.length && (
                        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                          {m.files.map((p) => (
                            <img
                              key={p.url}
                              src={p.url}
                              alt={p.name || "attached"}
                              className="h-24 w-full rounded-lg object-cover border border-gray-200"
                              onLoad={() => scrollToBottom("auto")}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* sentinel for autoscroll */}
            <div ref={tailRef} className="h-2" />
          </div>

          {/* FULL-WIDTH composer across the content area only.
              NOTE: left-64 aligns with the fixed sidebar width (16rem). */}
          <div
            ref={composerRef}
            className="fixed bottom-0 right-0 left-64 border-t border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60"
          >
            {/* Inner width spans full content area; keep some horizontal padding */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
              {previews.length > 0 && (
                <div className="mb-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">
                      Selected images ({previews.length})
                    </p>
                    <button
                      type="button"
                      onClick={clearFiles}
                      className="text-xs font-medium text-gray-600 hover:text-gray-900"
                    >
                      Clear
                    </button>
                  </div>

                  {/* Thumbnails inside composer — do NOT affect messages scroll */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
                    {previews.map((p, idx) => (
                      <div
                        key={p.url}
                        className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                      >
                        <img
                          src={p.url}
                          alt={p.name || `Selected ${idx + 1}`}
                          className="h-24 w-full object-cover"
                          onLoad={() => scrollToBottom("auto")}
                        />
                        <button
                          type="button"
                          onClick={() => removeFileAt(idx)}
                          className="absolute right-1 top-1 rounded-md bg-black/60 px-1.5 py-0.5 text-xs text-white hover:bg-black/80"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFiles}
                    className="hidden"
                  />
                  <span>Upload Images</span>
                </label>

                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe the issue..."
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />

                <button
                  type="button"
                  onClick={handleSend}
                  className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-gray-900/20 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={sending || (!input && files.length === 0)}
                >
                  {sending ? "Sending…" : "Send"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddNewRequest;