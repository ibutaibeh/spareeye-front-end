import { useState, useRef, useEffect,useContext } from "react";
import axios from "axios";
import { analyzeRequest } from "../../services/analyzeService"; // adjust path
import {UserContext} from "../../contexts/UserContext"
import {createRequest} from "../../services/requestService"
const AddNewRequest = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]);
  const [sending, setSending] = useState(false);
  const [previews, setPreviews] = useState([]);
  const endRef = useRef(null);

//handle change and submit for "Add New Request" form ... work in progress 
//-------------------------------------------------------------------------
  const {user}= useContext(UserContext)
  const [formData,setFormData]=useState({
    name:'',
    carDetails:{
      carType:'',
      carModel:'',
      carMade:'',
      carYear:''
    },
    image:'',
    description:''
  })
  const {name,carDetails:{carType,carModel,carMade,carYear},image,description } = formData


  const handleChange =(evt)=>{ 
        setFormData({...formData, [evt.target.name]:evt.target.value})
    };
   const handleCarDetailsChange=(evt)=>{
    setFormData({
      ...formData, carDetails:{...formData.carDetails,[evt.target.name]:evt.target.value}
    })
   } 
const handleSubmit = async (evt)=>{
  evt.preventDefault();
  await createRequest(formData);
  setFormData({
    name:'',
    carDetails:{
      carType:'',
      carModel:'',
      carMade:'',
      carYear:''
    },
    image:'',
    description:''
  })
}

//----------------------------------------------------------------------------

  useEffect(() => {
    console.log(endRef)
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const created = files.map((f) => ({
      url: URL.createObjectURL(f),
      name: f.name,
      size: f.size,
    }));
    setPreviews(created);
    return () => {
      created.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [files]);

  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const removeFileAt = (idx) => {
    setFiles((arr) => arr.filter((_, i) => i !== idx));
  };

  const clearFiles = () => setFiles([]);

  const handleSend = async () => {
    if ((!input && files.length === 0) || sending) return;

    setMessages((m) => [...m, { role: "user", text: input, files }]);
    setSending(true);

    const form = new FormData();
    form.append("userText", input);
    files.forEach((f) => form.append("images", f));

    setInput("");
    setFiles([]);

    try {
      const { result } = await analyzeRequest({ userText: input, files });
      console.log(result)
      const assistantText = [
        `Diagnosis: ${result.diagnosis}`,
        `Severity: ${result.severity}`,
        `Likely part: ${result.likely_part_name}`,
        `Repair steps:\n- ${result.repair_steps.join("\n- ")}`,
        `Tools needed:\n- ${result.tools_needed.join("\n- ")}`,
        result?.safety_notes?.length ? `Safety:\n- ${result.safety_notes.join("\n- ")}` : "",
        result?.recommended_sites?.length
          ? `Recommended sites:\n${result.recommended_sites.map((s) => `- ${s.title}: ${s.url}`).join("\n")}`
          : "",
      ].filter(Boolean).join("\n\n");

      setMessages((m) => [...m, { role: "assistant", text: assistantText }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Sorry—something went wrong while analyzing. Please try again." },
      ]);
    } finally {
      setSending(false);
    }

  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 font-sans">
      <h1 className="mb-6 text-2xl font-semibold text-white-100">Add New Request</h1>
        <div className="rounded-2xl border border-gray-200 bg-white text-gray-800 p-4 shadow-sm">
          
          <form onSubmit={handleSubmit}>
            <div className=".gap-1 flex gap-10  ">
                <label htmlFor="name">Name :</label>
                <input className="rounded-2xl border border-gray-200 bg-white text-gray-800 p-1 shadow-sm"
                 type="text"
                 id="name"
                 name="name"
                 value={formData.name}
                 onChange={handleChange} required/>
            </div>
            <div className=".gap-1 flex gap-10  ">
                <label htmlFor="carType">carType :</label>
                <input className="rounded-2xl border border-gray-200 bg-white text-gray-800 p-1 shadow-sm"
                 type="text"
                 id="carType"
                 name="carType"
                 value={formData.carDetails.carType}
                 onChange={handleCarDetailsChange} required/>
            </div>
            <div className=".gap-1 flex gap-10  ">
                <label htmlFor="carModel">carModel :</label>
                <input className="rounded-2xl border border-gray-200 bg-white text-gray-800 p-1 shadow-sm"
                 type="text"
                 id="carModel"
                 name="carModel"
                 value={formData.carDetails.carModel}
                 onChange={handleCarDetailsChange} required/>
            </div>
            <div className=".gap-1 flex gap-10  ">
                <label htmlFor="carMade">carMade :</label>
                <input className="rounded-2xl border border-gray-200 bg-white text-gray-800 p-1 shadow-sm"
                 type="text"
                 id="carMade"
                 name="carMade"
                 value={formData.carDetails.carMade}
                 onChange={handleCarDetailsChange} required/>
            </div>
                        <div className=".gap-1 flex gap-10  ">
                <label htmlFor="carYear">carYear :</label>
                <input className="rounded-2xl border border-gray-200 bg-white text-gray-800 p-1 shadow-sm"
                 type="text"
                 id="carYear"
                 name="carYear"
                 value={formData.carDetails.carYear}
                 onChange={handleCarDetailsChange} required/>
            </div>
            <div className=".gap-1 flex gap-10  ">
                <label htmlFor="image">image :</label>
                <input className="rounded-2xl border border-gray-200 bg-white text-gray-800 p-1 shadow-sm"
                 type="text"
                 id="image"
                 name="image"
                 value={formData.image}
                 onChange={handleChange} required/>
            </div>
            <div className=".gap-1 flex gap-10  ">
                <label htmlFor="description">description :</label>
                <textarea className="rounded-2xl border border-gray-200 bg-white text-gray-800 p-1 shadow-sm"
                 name="description"
                 id="description"
                 rows="8"
                 cols="35"
                 value={formData.description}
                 onChange={handleChange} required/>
            </div>
            <button>Submit Request</button>
          </form>


        </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 max-h-[60vh] overflow-y-auto rounded-xl border border-gray-100 bg-gray-50 p-4">
          {messages.length === 0 && (
            <p className="text-sm text-gray-500">
              Start by describing the issue and/or attaching photos of the damaged spare part.
            </p>
          )}

          <ul className="space-y-4">
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <li key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-900 shadow border border-gray-200"
                      }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>

                    {m.files && m.files.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.files.map((f, idx) => (
                          <img
                            key={idx}
                            src={URL.createObjectURL(f)}
                            alt=""
                            className="h-20 w-20 rounded-lg object-cover ring-1 ring-inset ring-black/10"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
            <div ref={endRef} />
          </ul>
        </div>

        {previews.length > 0 && (
          <div className="mb-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3">
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {previews.map((p, idx) => (
                <div
                  key={p.url}
                  className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                >
                  <img
                    src={p.url}
                    alt={p.name || `Selected ${idx + 1}`}
                    className="h-28 w-full object-cover"
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

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-within:ring-2 focus-within:ring-gray-900/10">
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
            placeholder="Describe the issue...."
            className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
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
  );
};

export default AddNewRequest;