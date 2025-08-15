import Thumbs from "../ChatBotComponenets/Thumbs";

const TopForm = ({setReq, updateData, navigate, req, data, galleryUrls, setData, messages}) => {
    return (
        <div className="mx-auto w-full max-w-5xl px-4 pt-4">
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    if (req.owner.id && user?._id && String(req.owner) !== String(user._id)) {
                        alert("You are not allowed to edit this request.");
                        return;
                    }
                    try {
                        await updateData(data, messages);
                        navigate("/requests");
                    } catch (e2) {
                        console.error(e2);
                        alert("Failed to save. Please try again.");
                    }
                }}
                className="rounded-xl border border-gray-200 bg-white p-4 space-y-4"
            >
                <h2 className="text-lg font-semibold">Edit Request</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="flex flex-col text-sm">
                        <span className="mb-1">Name</span>
                        <input
                            name="name"
                            value={req.name}
                            onChange={(e) => setReq((r) => ({ ...r, name: e.target.value }))}
                            className="border rounded-lg px-3 py-2"
                            placeholder="Optional title"
                        />
                    </label>

                    <label className="flex flex-col text-sm">
                        <span className="mb-1">Car Type</span>
                        <input
                            name="carType"
                            value={data.carDetails.carType}
                            onChange={(e) => setData((d) => ({ ...d, carDetails: { ...d.carDetails, carType: e.target.value } }))}
                            className="border rounded-lg px-3 py-2"
                            placeholder="e.g., Sedan"
                        />
                    </label>

                    <label className="flex flex-col text-sm">
                        <span className="mb-1">Car Make</span>
                        <input
                            name="carMade"
                            value={data.carDetails.carMade}
                            onChange={(e) => setData((d) => ({ ...d, carDetails: { ...d.carDetails, carMade: e.target.value } }))}
                            className="border rounded-lg px-3 py-2"
                            placeholder="e.g., Toyota"
                        />
                    </label>

                    <label className="flex flex-col text-sm">
                        <span className="mb-1">Car Model</span>
                        <input
                            name="carModel"
                            value={data.carDetails.carModel}
                            onChange={(e) => setData((d) => ({ ...d, carDetails: { ...d.carDetails, carModel: e.target.value } }))}
                            className="border rounded-lg px-3 py-2"
                            placeholder="e.g., Corolla"
                        />
                    </label>

                    <label className="flex flex-col text-sm">
                        <span className="mb-1">Car Year</span>
                        <input
                            name="carYear"
                            value={data.carDetails.carYear}
                            onChange={(e) => setData((d) => ({ ...d, carDetails: { ...d.carDetails, carYear: e.target.value } }))}
                            className="border rounded-lg px-3 py-2"
                            placeholder="e.g., 2020"
                        />
                    </label>

                    <label className="flex flex-col text-sm md:col-span-2">
                        <span className="mb-1">Attached Images</span>

                        {galleryUrls.length > 0 ? (
                            <Thumbs urls={galleryUrls} size={80} rounded="rounded-lg" />
                        ) : (
                            <div className="border rounded-lg px-3 py-2 bg-gray-50 text-xs text-gray-500">
                                No images attached yet. Use “Upload Images” in the chat below to add photos.
                            </div>
                        )}
                    </label>

                    <label className="flex flex-col text-sm md:col-span-2">
                        <span className="mb-1">Description</span>
                        <textarea
                            name="description"
                            value={data.description}
                            onChange={(e) => setData((d) => ({ ...d, description: e.target.value }))}
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
    )
}

export default TopForm