// src/pages/EditRequest.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getRequest,
  updateRequest,
  uploadImages as uploadImagesAPI,
} from "../../services/requestService";
import { analyzeRequest } from "../../services/analyzeService";
import {
  CAR_TYPES,
  MAKES_BY_TYPE,
  MODELS,
  makeYears,
  looksLikeProduct,
  makeLinkLabel,
  toAbs
} from "../../Helpers/AddRequestHelpers";
import TopForm from "./TopForm";
import MessagesAreaEdit from "../ChatBotComponenets/MessagesAreaEdit";
import BottomComposerEdit from "../ChatBotComponenets/BottomComposerEdit";

/* ----------------------------- Component ----------------------------- */
export default function EditRequest({user}) {
  const { reqId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    carDetails: { carType: "", carMade: "", carModel: "", carYear: "" },
    description: "",
    image: "",
  });

  const [req, setReq] = useState({
    name: "",
    carDetails: { carType: "", carMade: "", carModel: "", carYear: "" },
    image: "",
    description: "",
    owner: "",
    messages: [],
  });

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [files, setFiles] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const endRef = useRef(null);

  const galleryUrls = useMemo(() => {
    const fromMessages = [];
    const arr = Array.isArray(messages) ? messages : [];

    for (let i = 0; i < arr.length; i++) {
      const m = arr[i];
      if (m && Array.isArray(m.imageUrls)) {
        for (let j = 0; j < m.imageUrls.length; j++) {
          const u = m.imageUrls[j];
          if (u) fromMessages.push(u);
        }
      }
    }

    const fromReqImage = req && req.image ? [req.image] : [];
    const merged = fromMessages.concat(fromReqImage)
      .map((u) => toAbs(u))
      .filter(Boolean);

    const unique = [];
    const seen = new Set();
    for (let k = 0; k < merged.length; k++) {
      const u = merged[k];
      if (!seen.has(u)) {
        seen.add(u);
        unique.push(u);
      }
    }
    return unique;
  }, [messages, req && req.image]);

  /* ---------------------------- Load & init ---------------------------- */
  useEffect(() => {
    async function load() {
      try {
        const doc = await getRequest(reqId);
        const safeReq = {
          name: doc?.name || "",
          carDetails: {
            carType: doc?.carDetails?.carType || "",
            carMade: doc?.carDetails?.carMade || "",
            carModel: doc?.carDetails?.carModel || "",
            carYear: doc?.carDetails?.carYear || "",
          },
          image: doc?.image || "",
          description: doc?.description || "",
          owner: doc?.owner || "",
          messages: Array.isArray(doc?.messages) ? doc.messages : [],
        };
        setReq(safeReq);
        setMessages(safeReq.messages);
        setData({
          carDetails: safeReq.carDetails,
          description: safeReq.description,
          image: safeReq.image || "",
        });

        const priorUrls =
          safeReq.messages
            .filter((m) => Array.isArray(m.imageUrls) && m.imageUrls.length > 0)
            .flatMap((m) => m.imageUrls) || [];
        setAllFiles(priorUrls);

        const s = computeCurrentStep(safeReq.carDetails, safeReq.description, safeReq.messages);
        setStep(s);
        showPrompt(s, safeReq.carDetails);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [reqId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* -------------------------- Wizard helpers -------------------------- */
  function imageStepCompleted(msgs = []) {
    return msgs.some(
      (m) => m.role === "user" && ((Array.isArray(m.imageUrls) && m.imageUrls.length > 0) || (m.text || "").toLowerCase() === "skip")
    );
  }

  function computeCurrentStep(carDetails, description, msgs) {
    if (!carDetails?.carType) return 1;
    if (!carDetails?.carMade) return 2;
    if (!carDetails?.carModel) return 3;
    if (!carDetails?.carYear) return 4;
    if (!description) return 5;
    if (!imageStepCompleted(msgs)) return 6;
    return 7;
  }

  function promptAndOptionsForStep(s, currentData) {
    if (s === 1) return { text: "Select your car type (or type your own):", options: CAR_TYPES };
    if (s === 2) return { text: `Select the car make for ${currentData.carType}:`, options: MAKES_BY_TYPE[currentData.carType] || [] };
    if (s === 3) {
      const byMake = MODELS[currentData.carMade] || {};
      return { text: `Select the model for ${currentData.carMade}:`, options: byMake[currentData.carType] || [] };
    }
    if (s === 4) return { text: "Select the year of manufacture:", options: makeYears(2000) };
    if (s === 5) return { text: "Describe the issue (you can type it below):", options: [] };
    if (s === 6) return { text: "Attach photos (optional) or type 'Skip':", options: ["Skip"] };
    if (s === 7) return { text: "Analyzing your data…", options: [] };
    return { text: "", options: [] };
  }

  function showPrompt(s, car) {
    const { text, options } = promptAndOptionsForStep(s, car);
    if (!text) return;
    const last = messages[messages.length - 1];
    const already = last && last.role === "assistant" && last.text === text;
    if (!already) {
      setMessages((m) => [...m, { role: "assistant", text, options }]);
    }
  }

  /* -------------------------- Save Data helper -------------------------- */
  async function updateData(data, messagesSnapshot) {
    const updatedData = {
      carDetails: data.carDetails,
      image: data.image || "",
      description: data.description || "",
      messages: messagesSnapshot,
      name: req.name || "",
    };
    try {
      await updateRequest(reqId, updatedData);
      setReq((r) => ({ ...r, ...updatedData }));
    } catch (err) {
      console.error(err);
    }
  }

  /* ---------------------------- Chat actions --------------------------- */
  function buildUserTurn(text, imageUrls = []) {
    const safeText = text && text.trim() ? text.trim() : (imageUrls.length ? "[images attached]" : "");
    return { role: "user", text: safeText, imageUrls };
  }

  async function handleAnswer(answerText, imageUrls = []) {
    // Select data based on step
    const dNext = { ...data };
    if (step === 1) dNext.carDetails.carType = answerText || dNext.carDetails.carType;
    if (step === 2) dNext.carDetails.carMade = answerText || dNext.carDetails.carMade;
    if (step === 3) dNext.carDetails.carModel = answerText || dNext.carDetails.carModel;
    if (step === 4) dNext.carDetails.carYear = answerText || dNext.carDetails.carYear;
    if (step === 5) dNext.description = answerText || dNext.description;
    if (step === 6) {
      if (imageUrls.length) dNext.image = imageUrls[0];
      if ((answerText || "").toLowerCase() === "skip") dNext.image = dNext.image || "";
    }
    setData(dNext);

    // Append the user message and update data on DB
    const userTurn = buildUserTurn(answerText, imageUrls);
    const nextMsgs = [...messages, userTurn];
    setMessages(nextMsgs);
    await updateData(dNext, nextMsgs);

    // Move flow forward
    const nextStep = computeCurrentStep(dNext.carDetails, dNext.description, nextMsgs);
    setStep(nextStep);

    if (nextStep === 7) {
      setMessages((m) => [...m, { role: "assistant", text: "Analyzing your data…" }]); // UI hint, not persisted yet
      await runAnalysis(dNext, allFiles);
      return;
    }

    // Show next prompt 
    showPrompt(nextStep, dNext.carDetails);
  }

  async function runAnalysis(d, urlsForAnalysis = []) {
    const hasImages = Array.isArray(urlsForAnalysis) && urlsForAnalysis.length > 0;

    const prompt =
      `I have a ${d.carDetails.carMade} ${d.carDetails.carModel} ${d.carDetails.carType} ${d.carDetails.carYear} car.\n` +
      `Problem description: ${d.description}.\n\n` +
      `VERY IMPORTANT: In the JSON field "recommended_websites", return ONLY direct product pages (deep links) for the exact spare part(s)` +
      ` that match this car make/model/year and the likely part. Provide 3–8 items,` +
      ` each as {"title":"...","url":"https://...","image":"https://...(optional og:image)"} with full URLs.`;

    const pendingAssistant = [];
    let preface = hasImages ? "" : "No images attached. Running text-only analysis.\n\n";

    let result = null;
    try {
      const { result: r } = await analyzeRequest({ userText: prompt, imageUrls: urlsForAnalysis || [] });
      result = r || null;
    } catch (e) {
      console.error(e);
      preface += hasImages
        ? "We couldn’t analyze your images due to an error. "
        : "Analysis encountered an error. ";
      preface += "You can try again or attach photos for better accuracy.\n\n";
    }

    if (result) {
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

      const body = parts.length ? parts.join("\n\n") : "Analysis complete (no specific findings).";
      pendingAssistant.push({ role: "assistant", text: preface + body });

      if (Array.isArray(result?.recommended_websites) && result.recommended_websites.length) {
        const links = result.recommended_websites
          .map((x) => {
            if (typeof x === "string") return { label: makeLinkLabel(x), url: x };
            if (x && typeof x === "object")
              return {
                label: x.title || makeLinkLabel(x.url || ""),
                url: x.url || "",
                image: x.image || "",
              };
            return null;
          })
          .filter(Boolean);
        const deepFirst = links.filter((x) => looksLikeProduct(x.url));
        const finalLinks = deepFirst.length ? deepFirst : links;
        if (finalLinks.length) {
          pendingAssistant.push({
            role: "assistant",
            text: "Suggested parts (direct product pages):",
            links: finalLinks.slice(0, 8),
          });
        }
      }
    } else {
      pendingAssistant.push({
        role: "assistant",
        text: preface || "Analysis could not run. Please try again.",
      });
    }

    // Append assistant messages,
    setMessages((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const next = [...safePrev, ...pendingAssistant];

      updateData(
        {
          carDetails: d.carDetails,
          image: d.image || "",
          description: d.description || "",
        },
        next
      ).catch(console.error);
      queueMicrotask(() => {
        setStep(1);
        showPrompt(1, d.carDetails);
      });

      return next;
    });

  }

  /* ------------------------------ UI events ----------------------------- */
  function onPickFiles(e) {
    setFiles(Array.from(e.target.files || []));
  }

  async function onSend() {
    if (sending) return;

    // Step 6: handle image upload
    if (step === 6 && files.length) {
      setSending(true);
      try {
        const { urls } = await uploadImagesAPI(files);
        const abs = (urls || []).map(toAbs);
        setFiles([]);
        setAllFiles((prev) => [...prev, ...abs]);
        await handleAnswer("", abs);
      } catch (e) {
        console.error(e);
        setMessages((m) => [...m, { role: "assistant", text: "Failed to upload images. Try again." }]);
      } finally {
        setSending(false);
      }
      return;
    }

    // Normal text entry
    const trimmed = (input || "").trim();
    if (!trimmed && step !== 6) return;
    setSending(true);
    try {
      await handleAnswer(trimmed);
      setInput("");
    } finally {
      setSending(false);
    }
  }

  function onQuickOption(opt) {
    setInput("");
    onSendAnswer(opt);
  }

  async function onSendAnswer(opt) {
    if (sending) return;
    setSending(true);
    try {
      await handleAnswer(opt);
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  /* -------------------------------- Render ------------------------------ */
  return (
    <div className="min-h-screen w-full text-gray-900 bg-gray-50 flex flex-col">
      {/* ---------- TOP FORM ---------- */}
      <TopForm user={user} setReq={setReq} messages={messages} setData={setData} updateData={updateData} navigate={navigate} data={data} req={req} galleryUrls={galleryUrls} />

      {/* ---------- CHAT ---------- */}
      <MessagesAreaEdit messages={messages} onSendAnswer={onSendAnswer} endRef={endRef} />

      {/* ---------- STICKY COMPOSER ---------- */}
      <BottomComposerEdit setInput={setInput} step={step} input={input} onKeyDown={onKeyDown} onSend={onSend} files={files} onPickFiles={onPickFiles} />
    </div>
  );
}