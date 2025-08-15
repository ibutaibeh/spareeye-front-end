const StartingOptions = ({m, pickOption}) => {
    return (
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
    )
}

export default StartingOptions;