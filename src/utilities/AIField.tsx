import { useState } from "react";

type AIFieldProps = {
    onClose: () => void;
};

function AIField({ onClose }: AIFieldProps) {
    const MAX_CHAR_LIMIT = 4096;
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [toxicityScore, setToxicityScore] = useState<number | null>(null);
    
    const API_KEY = "AIzaSyD_b7U6B39Zil88IuVPuwm5ygHaFZxFVEQ";

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= MAX_CHAR_LIMIT) {
            setInput(e.target.value);
        }
    };

    const handleSend = async () => {
        if (input.trim() === "") return;
        
        setLoading(true);
        
        try {
            const response = await fetch(
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

            const data = await response.json();
            const score = data.attributeScores?.TOXICITY?.summaryScore?.value || 0;

            setToxicityScore(score);
        } catch (error) {
            console.error("Error analyzing text:", error);
        } finally {
            setLoading(false);
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

                {toxicityScore !== null && (
                    <p className={`mt-2 text-sm font-bold ${toxicityScore > 0.7 ? "text-red-600" : "text-green-600"}`}>
                        {toxicityScore > 0.7
                            ? `⚠️ High toxicity detected! (Score: ${toxicityScore.toFixed(2)})`
                            : `✅ Safe message (Score: ${toxicityScore.toFixed(2)})`}
                    </p>
                )}
            </div>
        </div>
    );
}

export default AIField;
