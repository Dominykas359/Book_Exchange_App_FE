import React, { useEffect, useState } from "react";
import { CommentEntry } from "../models/CommentEntry";
import { User } from "../models/User";

interface ManageCommentProps {
    onPost: (newComment: CommentEntry) => void;
    onCancel: () => void;
    noticeId?: string;
    commentId?: string;
    message: string;
    initialContent?: string; // New prop for initial content
}

const ManageComment: React.FC<ManageCommentProps> = ({ onPost, onCancel, noticeId, commentId, message, initialContent }) => {
    const [content, setContent] = useState<string>(initialContent || ""); // Initialize with initial content if editing
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const initializeUser = async () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                const data = JSON.parse(userData);
                setCurrentUser(data);
            }
        };

        initializeUser();
    }, []);

    const handleSubmit = () => {
        if (!currentUser) {
            return;
        }

        const newComment: CommentEntry = {
            id: commentId || '',
            userId: currentUser.id,
            noticeId: noticeId || '',
            timeSent: new Date(),
            content,
            commentId: commentId || '',
            replies: []
        };
        onPost(newComment);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">{message}</h3>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your comment here"
                    className="w-full h-32 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageComment;
