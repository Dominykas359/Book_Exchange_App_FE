import { useState } from "react";

type AIFieldProps = {
    onClose: () => void;
};

function AIField({ onClose }: AIFieldProps) {
    const MAX_CHAR_LIMIT = 4096;
    const [input, setInput] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= MAX_CHAR_LIMIT) {
            setInput(e.target.value);
        }
    };

    return (
        <div className="fixed right-0 top-0 h-full w-1/2 bg-white shadow-lg p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">AI Assistant</h2>
                <button
                    className="text-lg font-bold text-gray-600 hover:text-black"
                    onClick={onClose}
                >
                    X
                </button>
            </div>

            <p className="mb-4">How can I help you today?</p>

            <div className="mt-auto">
                <textarea
                    className="w-full border border-gray-300 rounded-lg p-2 resize-none"
                    placeholder="Type in your book desrciption..."
                    value={input}
                    onChange={handleChange}
                    rows={4}
                />
                <div className="text-right text-gray-500 text-sm mt-1">
                    {input.length} / {MAX_CHAR_LIMIT} characters
                </div>
                <button
                    className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    disabled={input.length === 0}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default AIField;
