import Thumbs from "../ChatBotComponenets/Thumbs";
import { toAbs } from "../../Helpers/AddRequestHelpers";

const BottomComposer = ({onSend, onChooseFiles, input, step, setInput, files}) => {
    return (
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

            {files.length > 0 && (
                <div className="px-4 pb-3">
                    <p className="text-xs text-gray-600 mb-2">Selected images ({files.length})</p>
                    <Thumbs toAbs={toAbs} files={files} size={64} />
                </div>
            )}
        </div>
    )
}

export default BottomComposer