// src/pages/EditRequest.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { getRequest, updateRequest } from "../../services/requestService";

export default function EditRequest() {
  const { reqId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

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
  const [files, setFiles] = useState([]); // for the next outgoing message

  const endRef = useRef(null);

  // Load request once
  useEffect(() => {
    async function load() {
      try {
        const data = await getRequest(reqId);
        const safe = {
          name: data?.name || "",
          carDetails: {
            carType: data?.carDetails?.carType || "",
            carMade: data?.carDetails?.carMade || "",
            carModel: data?.carDetails?.carModel || "",
            carYear: data?.carDetails?.carYear || "",
          },
          image: data?.image || "",
          description: data?.description || "",
          owner: data?.owner || "",
          messages: Array.isArray(data?.messages) ? data.messages : [],
        };
        setReq(safe);
        setMessages(safe.messages);

      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [reqId]);

  // Keep view pinned to the latest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ------- Form handlers -------
  function onFormChange(e) {
    const { name, value } = e.target;
    if (name in (req.carDetails || {})) {
      setReq((r) => ({ ...r, carDetails: { ...r.carDetails, [name]: value } }));
    } else {
      setReq((r) => ({ ...r, [name]: value }));
    }
  }

  async function onSaveDetails(e) {
    e.preventDefault();
    
    if (req.owner.id && user?._id && String(req.owner) !== String(user._id)) {
      alert("You are not allowed to edit this request.");
      
      return;
    }
    try {
      await updateRequest(reqId, { ...req, messages });
      navigate("/requests");
    } catch (e) {
      console.error(e);
      alert("Failed to save. Please try again.");
    }
  }

  // ------- Chat handlers -------
  function onPickFiles(e) {
    setFiles(Array.from(e.target.files || []));
  }

  async function sendMessage(text) {
    if (sending) return;
    const trimmed = (text ?? "").trim();
    if (!trimmed && files.length === 0) return;

    setSending(true);

    const fileDisplay = files.map((f) => ({ url: "", name: f.name, size: f.size }));
    const userTurn = {
      role: "user",
      text: trimmed || (files.length ? "[images attached]" : ""),
      files: fileDisplay.length ? fileDisplay : undefined,
    };

    const newMessages = [...messages, userTurn];
    setMessages(newMessages);
    setInput("");
    setFiles([]);

    try {
      await updateRequest(reqId, { ...req, messages: newMessages });
      setReq((r) => ({ ...r, messages: newMessages }));
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  }

  function onSend() {
    sendMessage(input);
  }

  function onQuickOption(opt) {
    sendMessage(opt);
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div className="min-h-screen w-full text-gray-900 bg-gray-50 flex flex-col">
      {/* ---------- TOP FORM (always visible; page scrolls) ---------- */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-4">
        <form onSubmit={onSaveDetails} className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
          <h2 className="text-lg font-semibold">Edit Request</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex flex-col text-sm">
              <span className="mb-1">Name</span>
              <input
                name="name"
                value={req.name}
                onChange={onFormChange}
                className="border rounded-lg px-3 py-2"
                placeholder="Optional title"
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-1">Car Type</span>
              <input
                name="carType"
                value={req.carDetails.carType}
                onChange={onFormChange}
                className="border rounded-lg px-3 py-2"
                placeholder="e.g., Sedan"
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-1">Car Make</span>
              <input
                name="carMade"
                value={req.carDetails.carMade}
                onChange={onFormChange}
                className="border rounded-lg px-3 py-2"
                placeholder="e.g., Toyota"
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-1">Car Model</span>
              <input
                name="carModel"
                value={req.carDetails.carModel}
                onChange={onFormChange}
                className="border rounded-lg px-3 py-2"
                placeholder="e.g., Corolla"
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-1">Car Year</span>
              <input
                name="carYear"
                value={req.carDetails.carYear}
                onChange={onFormChange}
                className="border rounded-lg px-3 py-2"
                placeholder="e.g., 2020"
              />
            </label>

            <label className="flex flex-col text-sm md:col-span-2">
              <span className="mb-1">Image (URL)</span>
              <input
                name="image"
                value={req.image}
                onChange={onFormChange}
                className="border rounded-lg px-3 py-2"
                placeholder="Paste an image URL (optional)"
              />
            </label>

            <label className="flex flex-col text-sm md:col-span-2">
              <span className="mb-1">Description</span>
              <textarea
                name="description"
                value={req.description}
                onChange={onFormChange}
                rows={3}
                className="border rounded-lg px-3 py-2"
                placeholder="Describe the issue"
              />
            </label>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="rounded-lg bg-gray-900 text-white text-sm font-semibold px-4 py-2 hover:bg-black/90">
              Save Changes
            </button>
            <button type="button" onClick={() => navigate("/requests")} className="rounded-lg border border-gray-300 text-sm px-4 py-2">
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* ---------- CHAT (scrolls between form and composer) ---------- */}
      <div className="flex-1 mx-auto w-full max-w-5xl px-4 pt-4 overflow-y-auto">
        <ul className="space-y-4">
          {messages.map((m, i) => {
            const isUser = m.role === "user";
            const isLatestAssistantWithOptions =
              !isUser && i === messages.length - 1 && Array.isArray(m.options) && m.options.length > 0;

            return (
              <li key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isUser ? "bg-blue-600 text-white" : "bg-white text-gray-900 border border-gray-200"
                }`}>
                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {!!m.files?.length && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.files.map((f, idx) => (
                        <span key={(f.name || "file") + idx} className="text-xs border rounded px-2 py-1">
                          {f.name || "file"}
                        </span>
                      ))}
                    </div>
                  )}

                  {isLatestAssistantWithOptions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {m.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => onQuickOption(opt)}
                          type="button"
                          className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs text-gray-800 hover:bg-gray-100"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {!!m.links?.length && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {m.links.map((lnk, idx) => (
                        <a
                          key={(lnk.url || "link") + idx}
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

      {/* ---------- STICKY COMPOSER (never hides content) ---------- */}
      <div className="sticky bottom-0 w-full border-t border-gray-200 bg-white">
        <div className="mx-auto w-full max-w-5xl px-4 py-3 flex flex-col gap-3 sm:flex-row">
          <label className="inline-flex cursor-pointer items-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm">
            <input type="file" accept="image/*" multiple onChange={onPickFiles} className="hidden" />
            <span>Upload Images</span>
          </label>

          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message (or tap a chip above)…"
            className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-2"
          />

          <button
            onClick={onSend}
            className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-black/90"
          >
            Send
          </button>
        </div>

        {/* Simple file list preview */}
        {files.length > 0 && (
          <div className="mx-auto max-w-5xl px-4 pb-3">
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