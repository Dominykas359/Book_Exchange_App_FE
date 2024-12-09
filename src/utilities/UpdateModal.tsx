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
        <div className="modal">
            <h2>Update Message</h2>
            <textarea
                value={updatedText}
                onChange={(e) => setUpdatedText(e.target.value)}
                rows={4}
                cols={50}
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
}

export default UpdateModal;
