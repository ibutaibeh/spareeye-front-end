import Thumbs from "../ChatBotComponenets/Thumbs";

const BottomComposerEdit = ({setInput, onKeyDown, onSend, files, onPickFiles, input, step}) => {
    return (
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
                    placeholder={step === 5 ? "Describe the issue…" : "Type a message…"}
                    className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-2"
                />

                <button
                    onClick={onSend}
                    className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-black/90"
                >
                    Send
                </button>
            </div>

            {/* Preview thumbnails for newly selected files */}
            {files.length > 0 && (
                <div className="mx-auto max-w-5xl px-4 pb-3">
                    <p className="text-xs text-gray-600 mb-2">Selected images ({files.length})</p>
                    <Thumbs files={files} size={64} />
                </div>
            )}
        </div>
    )
}

export default BottomComposerEdit