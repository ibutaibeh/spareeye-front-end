import { useState, useEffect, useRef } from "react";
import { analyzeRequest, uploadImages } from "../../services/analyzeService";
import { createRequest, updateRequest } from "../../services/requestService";
import {
  CAR_TYPES,
  MAKES_BY_TYPE,
  MODELS,
  makeYears,
  looksLikeProduct,
  makeLinkLabel,
} from "../../Helpers/AddRequestHelpers";
import MessagesArea from "../ChatBotComponenets/MessagesArea";
import BottomComposer from "../ChatBotComponenets/BottomComposer";

/* --------------------------- Page Component --------------------------- */
const AddNewRequest = ({ user }) => {
  // steps: 1=carType, 2=carMade, 3=carModel, 4=carYear, 5=description, 6=image, 7=analyze
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    carDetails: { carType: "", carMade: "", carModel: "", carYear: "" },
    description: "",
    image: "",
  });

  const [messages, setMessages] = useState([]);
  const [requestId, setRequestId] = useState(null);
  const [input, setInput] = useState("");

  // files for step 6
  const [files, setFiles] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const endRef = useRef(null);

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

    // Assistant prompts
    setMessages((m) => [...m, { role: "assistant", text: prompt, options }]);

  };

  /* -------------------------- Save Data helper -------------------------- */
  async function updateData(data, messagesSnapshot) {
    const updatedData = {
      carDetails: data.carDetails,
      image: data.image || "",
      description: data.description || "",
      messages: messagesSnapshot,
    };

    // Either Create new Request or Update
    try {
      if (!requestId) {
        const created = await createRequest(updatedData);
        if (created?._id) setRequestId(created._id);
      } else {
        await updateRequest(requestId, updatedData);
      }
    } catch (err) {
      console.error(err);
    }
  }

  /* ------------------------------ Chat flow ------------------------------- */
  function buildUserTurn(text, imageUrls = []) {
    const safeText = text && text.trim() ? text.trim() : (imageUrls.length ? "" : "");
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
    if (step === 6) dNext.image = imageUrls.length ? imageUrls[0] : (answerText === "Skip" ? "" : dNext.image);
    setData(dNext);

    // Append the user message and update data on DB
    const userTurn = buildUserTurn(answerText, imageUrls);
    const nextUserMessages = [...messages, userTurn];
    setMessages(nextUserMessages);
    await updateData(dNext, nextUserMessages);

    // Move flow forward
    const next = step + 1;
    setStep(next);

    if (next === 7) {
      setMessages((m) => [...m, { role: "assistant", text: "Analyzing your data…" }]);
      await runAnalysis(dNext, allFiles);
      setStep(1);
      return;
    }

    askNext(next, dNext);
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

    // Commit all assistant messages
    setMessages((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const next = [...safePrev, ...pendingAssistant];
      updateData(d, next).catch(console.error);
      return next;
    });

  }

  // Upload selected files, return URLs
  const updateSelectedFiles = async () => {
    if (!files.length) return [];
    const { urls } = await uploadImages(files);
    return urls || [];
  };

  // Send text or images
  const onSend = async () => {
    const txt = input.trim();

    if (step === 6 && files.length) {
      try {
        const urls = await updateSelectedFiles();
        setFiles([]);
        setAllFiles((prev) => [...prev, ...urls]);
        await handleAnswer("", urls);
      } catch (e) {
        console.error(e);
        setMessages((m) => [...m, { role: "assistant", text: "Failed to upload images. Try again." }]);
      } finally {
        setInput("");
      }
      return;
    }

    if (!txt && step !== 6) return;
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
      <MessagesArea messages={messages} pickOption={pickOption} endRef={endRef} />

      {/* Bottom composer */}
      <BottomComposer
        setInput={setInput}
        step={step}
        input={input}
        files={files}
        onChooseFiles={onChooseFiles}
        onSend={onSend}
      />
    </div>
  );
};

export default AddNewRequest;