// src/pages/AddNewRequest.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { analyzeRequest } from "../../services/analyzeService";
import { createRequest } from "../../services/requestService";
import { UserContext } from "../../contexts/UserContext";
import {
  CAR_TYPES,
  MAKES_BY_TYPE, MODELS,
  makeYears,
  looksLikeProduct,
  makeLinkLabel

} from "../../Helpers/AddRequestHelpers"

const AddNewRequest = () => {
  const { user } = useContext(UserContext);

  // steps: 1=carType, 2=carMade, 3=carModel, 4=carYear, 5=description, 6=image, 7=analyze
  const [step, setStep] = useState(1);

  const [data, setData] = useState({
    carDetails: { carType: "", carMade: "", carModel: "", carYear: "" },
    description: "",
    image: "",
  });

  // chat messages: {role: 'assistant'|'user', text, options?, links?}
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // files for step 6
  const [files, setFiles] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const endRef = useRef(null);

  // scroll to bottom when messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // first greeting + first question
  useEffect(() => {
    const hello = {
      role: "assistant",
      text: `Hello ${user?.username || "there"}, let's collect your car details.`,
    };
    setMessages([hello]);
    askNext(1, {
      carDetails: { carType: "", carMade: "", carModel: "", carYear: "" },
      description: "",
      image: "",
    });
  }, [user?.username]);

  const askNext = (s, currentData) => {
    let prompt = "";
    let options = [];

    if (s === 1) {
      prompt = "Select your car type (or type your own):";
      options = CAR_TYPES;
    } else if (s === 2) {
      prompt = `Select the car make for ${currentData.carDetails.carType}:`;
      options = MAKES_BY_TYPE[currentData.carDetails.carType] || [];
    } else if (s === 3) {
      prompt = `Select the model for ${currentData.carDetails.carMade}:`;
      const byMake = MODELS[currentData.carDetails.carMade] || {};
      options = byMake[currentData.carDetails.carType] || [];
    } else if (s === 4) {
      prompt = "Select the year of manufacture:";
      options = makeYears(2000);
    } else if (s === 5) {
      prompt = "Describe the issue (you can type it below):";
      options = [];
    } else if (s === 6) {
      prompt = "Attach photos (optional) or type 'Skip':";
      options = ["Skip"];
    } else if (s === 7) {
      prompt = "Analyzing your data…";
      options = [];
    }

    setMessages((m) => [...m, { role: "assistant", text: prompt, options }]);
  }

  function pushUserMessage(text) {
    setMessages((m) => [...m, { role: "user", text }]);
  }

  async function handleAnswer(answerText) {
    // show user turn
    pushUserMessage(answerText);

    // save to data
    let d = { ...data };
    if (step === 1) d.carDetails.carType = answerText;
    if (step === 2) d.carDetails.carMade = answerText;
    if (step === 3) d.carDetails.carModel = answerText;
    if (step === 4) d.carDetails.carYear = answerText;
    if (step === 5) d.description = answerText;
    if (step === 6) d.image = answerText === "Skip" ? "" : answerText;

    setData(d);

    // next step
    const next = step + 1;
    setStep(next);

    if (next === 7) {
      // analysis
      setMessages((m) => [...m, { role: "assistant", text: "Analyzing your data…" }]);
      await runAnalysis(d, allFiles);
      setStep(1)
      return;
    }

    // ask next question
    askNext(next, d);
  }

  async function runAnalysis(d, filesToSend) {
    // Build a clear prompt that forces deep product links
    const prompt =
      `I have a ${d.carDetails.carMade} ${d.carDetails.carModel} ${d.carDetails.carType} ${d.carDetails.carYear} car.\n` +
      `Problem description: ${d.description}.\n\n` +
      `VERY IMPORTANT: In the JSON field "recommended_websites", return ONLY direct product pages (deep links) for the exact spare part(s)` +
      ` that match this car make/model/year and the likely part. No homepages or generic category pages. Provide 3–8 items,` +
      ` each as {"title":"...","url":"https://..."} with full URLs (not shortened).`;

    try {
      const { result } = await analyzeRequest({ userText: prompt, files: filesToSend || [] });

      // show main text
      const parts = [];
      if (result?.diagnosis) parts.push(`Diagnosis: ${result.diagnosis}`);
      if (result?.severity) parts.push(`Severity: ${result.severity}`);
      if (result?.likely_part_name) parts.push(`Likely part: ${result.likely_part_name}`);
      if (Array.isArray(result?.repair_steps) && result.repair_steps.length) {
        parts.push("Repair steps:\n- " + result.repair_steps.join("\n- "));
      }
      if (Array.isArray(result?.tools_needed) && result.tools_needed.length) {
        parts.push("Tools needed:\n- " + result.tools_needed.join("\n- "));
      }
      if (Array.isArray(result?.safety_notes) && result.safety_notes.length) {
        parts.push("Safety:\n- " + result.safety_notes.join("\n- "));
      }

      const text = parts.length ? parts.join("\n\n") : "Analysis complete.";
      setMessages((m) => [...m, { role: "assistant", text }]);

      if (Array.isArray(result?.recommended_websites) && result.recommended_websites.length) {
        const links = result.recommended_websites
          .map((x) => {
            if (typeof x === "string") return { label: makeLinkLabel(x), url: x };
            if (x && typeof x === "object") return { label: x.title || makeLinkLabel(x.url || ""), url: x.url || "" };
            return null;
          })
          .filter((x) => x && x.url);

        const deepFirst = links.filter((x) => looksLikeProduct(x.url));
        const finalLinks = deepFirst.length ? deepFirst : links;

        if (finalLinks.length) {
          setMessages((m) => [
            ...m,
            {
              role: "assistant",
              text: "Suggested parts (direct product pages):",
              links: finalLinks.slice(0, 8),
            },
          ]);
        }
      }
    } catch (e) {
      console.error(e);
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Sorry—something went wrong while analyzing. Please try again." },
      ]);
    }

    // Save to DB
    try {
      await createRequest({ ...d, messages: messages });
    } catch (e) {
      console.error(e);
    }
  }

  // Send text
  const onSend = async () => {
    const txt = input.trim();

    if (!txt && step !== 6) return;

    if (step === 6 && files.length) {
      setAllFiles((prev) => [...prev, ...files]);
      setFiles([]);
      await handleAnswer("[images attached]");
      setInput("");
      return;
    }

    await handleAnswer(txt);
    setInput("");
  };

  const pickOption = async (opt) => {
    await handleAnswer(opt);
  };

  const onChooseFiles = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list);
  };

  return (
    <div className="w-full overflow-hidden text-gray-900 relative">
      {/* Messages area */}
      <div className="h-full mx-auto w-full max-w-5xl px-4 pt-4 overflow-y-auto" style={{ paddingBottom: 112 }}>
        <ul className="space-y-4">
          {messages.map((m, i) => {
            const isUser = m.role === "user";
            const isLast = i === messages.length - 1;
            const hasOptions = Array.isArray(m.options) && m.options.length > 0;
            const hasLinks = Array.isArray(m.links) && m.links.length > 0;

            return (
              <li key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-900"}`}>
                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {!isUser && isLast && hasOptions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {m.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => pickOption(opt)}
                          className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs text-gray-800 hover:bg-gray-100"
                          type="button"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* link buttons for recommended websites */}
                  {!isUser && hasLinks && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {m.links.map((lnk, idx) => (
                        <a
                          key={lnk.url + idx}
                          href={lnk.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs text-gray-800 hover:bg-gray-100"
                          title={lnk.url}
                        >
                          {lnk.label || "Open link"}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <div ref={endRef} />
      </div>

      <div className="fixed bottom-0 right-0 left-64 border-t border-gray-200 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-3 sm:flex-row">
          <label className="inline-flex cursor-pointer items-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm">
            <input type="file" accept="image/*" multiple onChange={onChooseFiles} className="hidden" />
            <span>Upload Images</span>
          </label>

          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder={step === 5 ? "Describe the issue…" : "Type here (or tap a chip above)…"}
            className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-2"
          />

          <button
            onClick={onSend}
            className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-black/90"
          >
            Send
          </button>
        </div>

        {/* thumbnails preview for the current chosen files */}
        {files.length > 0 && (
          <div className="px-4 pb-3">
            <p className="text-xs text-gray-600 mb-2">Selected images ({files.length})</p>
            <div className="flex gap-2 flex-wrap">
              {files.map((f, idx) => (
                <span key={idx} className="text-xs text-gray-700 border px-2 py-1 rounded">
                  {f.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddNewRequest;