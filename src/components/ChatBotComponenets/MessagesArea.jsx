import { LinkCardGrid } from "../ChatBotComponenets/LinkCardGrid";
import StartingOptions from "./StartingOptions";
import Thumbs from "../ChatBotComponenets/Thumbs";

const MessagesArea = ({messages, pickOption, endRef}) => {
    return (
        <div
            className="h-full mx-auto w-full max-w-5xl px-4 pt-4 overflow-y-auto"
            style={{ paddingBottom: 140 }}
        >
            <ul className="space-y-4">
                {(Array.isArray(messages) ? messages : []).map((m, i) => {
                    const isUser = m.role === "user";
                    const isLast = i === messages.length - 1;
                    const hasOptions = Array.isArray(m.options) && m.options.length > 0;
                    const hasLinks = Array.isArray(m.links) && m.links.length > 0;

                    return (
                        <li key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-900"
                                    }`}
                            >
                                <p className="whitespace-pre-wrap">{m.text}</p>

                                {/* Image attachments (thumbnails) */}
                                {Array.isArray(m.imageUrls) && m.imageUrls.length > 0 && (
                                    <Thumbs urls={m.imageUrls} size={96} rounded={isUser ? "rounded-lg" : "rounded-lg"} />
                                )}

                                {/* Option (for steps 1–6) */}
                                {!isUser && isLast && hasOptions && (<StartingOptions m={m} pickOption={pickOption} />)}

                                {/* Link cards for recommended websites */}
                                {!isUser && hasLinks && <LinkCardGrid links={m.links} />}
                            </div>
                        </li>
                    );
                })}
            </ul>
            <div ref={endRef} />
        </div>
    )
}

export default MessagesArea