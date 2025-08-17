export const LinkCardGrid = ({ links }) => {
    if (!Array.isArray(links) || links.length === 0) return null;

    const getFavicon = (href) => {
        try {
            const u = new URL(href);
            return `${u.origin}/favicon.ico`;
        } catch {
            return "";
        }
    };

    const getPreviewImage = (lnk) => (lnk?.image ? lnk.image : getFavicon(lnk?.url || ""));

    return (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {links.map((lnk, idx) => {
                const imgSrc = getPreviewImage(lnk);
                const label = lnk.label || "Open link";
                const url = lnk.url;

                return (
                    <a
                        key={url + idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        aria-label={label}
                        title={url}
                    >
                        <div className="w-full aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                            {imgSrc ? (
                                <img
                                    src={imgSrc}
                                    alt={label}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                        const fallback = getFavicon(url);
                                        if (fallback && e.currentTarget.src !== fallback) {
                                            e.currentTarget.src = fallback;
                                        } else {
                                            e.currentTarget.replaceWith(document.createElement("div"));
                                        }
                                    }}
                                />
                            ) : (
                                <div className="text-xs text-gray-500">No preview</div>
                            )}
                        </div>
                        <div className="p-3">
                            <div className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-gray-700">
                                {label}
                            </div>
                            <div className="mt-1 text-xs text-gray-500 truncate">{url}</div>
                        </div>
                    </a>
                );
            })}
        </div>
    );
}

