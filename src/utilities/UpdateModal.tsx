import { useState } from "react";

interface UpdateModalProps {
    messageText: string;
    onUpdate: (updatedText: string) => void;
    onCancel: () => void;
}

function UpdateModal({ messageText, onUpdate, onCancel }: UpdateModalProps) {
    const [updatedText, setUpdatedText] = useState(messageText);

    const handleSave = () => {
        onUpdate(updatedText);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-xl font-semibold mb-4">Update Message</h2>
                <textarea
                    value={updatedText}
                    onChange={(e) => setUpdatedText(e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end mt-4 space-x-4">
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                    >
                        Save
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpdateModal;
