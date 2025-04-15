import { useState } from "react";
import { chat } from "../api/GptApi";
import { Notice } from "../models/Notice";
import NoticeCard from "../utilities/NoticeCard"

type AIFieldProps = {
    onClose: () => void;
};

function AIField({ onClose }: AIFieldProps) {
    const MAX_CHAR_LIMIT = 4096;
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [toxicityScore, setToxicityScore] = useState<number | null>(null);
    const [notices, setNotices] = useState<Notice[]>([]);

    const API_KEY = import.meta.env.VITE_PERSPECTIVE_API;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= MAX_CHAR_LIMIT) {
            setInput(e.target.value);
        }
    };

    const handleSend = async () => {
        if (input.trim() === "") return;
        
        setLoading(true);
        
        try {
            // Analyze toxicity
            const toxicityResponse = await fetch(
                `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${API_KEY}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        comment: { text: input },
                        languages: ["en"],
                        requestedAttributes: { TOXICITY: {} },
                    }),
                }
            );
            const toxicityData = await toxicityResponse.json();
            const toxicityScore = toxicityData.attributeScores?.TOXICITY?.summaryScore?.value || 0;

            setToxicityScore(toxicityScore);

            if (toxicityScore > 0.7) {
                // If the toxicity score is high, don't proceed with the GPT API call
                alert("High toxicity detected. Please modify your message.");
                return;
            }

            // Call GPT API if toxicity is acceptable
            const chatResponse = await chat(input);
            
            // Ensure that chatResponse is a string
            setNotices(chatResponse); // Store the notices directly
        } catch (error) {
            console.error("Error processing the request:", error);
        } finally {
            setLoading(false);
            setInput('');
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

            {notices.length > 0 && (
                <div className="mt-4 p-4 bg-gray-100 border rounded-lg max-h-[300px] overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-2">AI Generated Notices:</h3>
                    {notices.map((notice) => (
                        <NoticeCard key={notice.id} notice={notice} />
                    ))}
                </div>
            )}

            {notices.length === 0 && !loading && (
                <p className="text-gray-500 text-sm"> No related notices found.</p>
            )}

            <div className="mt-auto">
                <textarea
                    className="w-full border border-gray-300 rounded-lg p-2 resize-none"
                    placeholder="Type in your message..."
                    value={input}
                    onChange={handleChange}
                    rows={4}
                />
                <div className="text-right text-gray-500 text-sm mt-1">
                    {input.length} / {MAX_CHAR_LIMIT} characters
                </div>
                <button
                    className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                    onClick={handleSend}
                    disabled={input.length === 0 || loading}
                >
                    {loading ? "Analyzing..." : "Send"}
                </button>
            </div>
        </div>
    );
}

export default AIField;
