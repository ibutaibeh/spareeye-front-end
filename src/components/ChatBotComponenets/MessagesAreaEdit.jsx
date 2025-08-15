import { LinkCardGrid } from "../ChatBotComponenets/LinkCardGrid";
import Thumbs from "../ChatBotComponenets/Thumbs";

const MessagesAreaEdit = ({messages, onSendAnswer, endRef, toAbs}) => {
    return (
        <div className="flex-1 mx-auto w-full max-w-5xl px-4 pt-4 overflow-y-auto">
            <ul className="space-y-4">
                {messages.map((m, i) => {
                    const isUser = m.role === "user";
                    const hasOptions = Array.isArray(m.options) && m.options.length > 0;
                    const isLatestAssistantWithOptions = !isUser && i === messages.length - 1 && hasOptions;

                    return (
                        <li key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser ? "bg-blue-600 text-white" : "bg-white text-gray-900 border border-gray-200"
                                    }`}
                            >
                                <p className="whitespace-pre-wrap">{m.text}</p>

                                {/* Persisted image thumbnails */}
                                {Array.isArray(m.imageUrls) && m.imageUrls.length > 0 && (
                                    <Thumbs urls={m.imageUrls} size={96} rounded={isUser ? "rounded-lg" : "rounded-lg"} />
                                )}

                                {/* Link cards (if previous analysis added them) */}
                                {!isUser && Array.isArray(m.links) && m.links.length > 0 && <LinkCardGrid links={m.links} />}

                                {/* Quick option chips */}
                                {isLatestAssistantWithOptions && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {m.options.map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => onSendAnswer(opt)}
                                                type="button"
                                                className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs text-gray-800 hover:bg-gray-100"
                                            >
                                                {opt}
                                            </button>
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
    )
}

export default MessagesAreaEdit