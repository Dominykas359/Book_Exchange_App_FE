import React, { useEffect, useState } from "react";
import { CommentEntry } from "../models/CommentEntry";
import { User } from "../models/User";
import { deleteComment, postComment, updateComment } from "../api/CommentApi";
import ManageComment from "./ManageComment";
import { fetchUserById } from "../api/UserApi";

interface CommentProps {
    comment: CommentEntry;
}

const SingleComment: React.FC<CommentProps> = ({ comment }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [createComment, setCreateComment] = useState<boolean>(false);
    const [editComment, setEditComment] = useState<boolean>(false);
    const [editedComment, setEditedComment] = useState<CommentEntry | null>(null);

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

    useEffect(() => {
        const initializeCommentUser = async (id: string) => {
            const data = await fetchUserById(id);
            setUser(data);
        }

        initializeCommentUser(comment.userId);
    }, []);

    const handleDelete = async (id: string) => {
        await deleteComment(id);
    };

    const handleCreateCommentModal = () => {
        setCreateComment(true);
    };

    const handleCancelCreateCommentModal = () => {
        setCreateComment(false);
    };

    const handlePostComment = async (newComment: CommentEntry) => {
        await postComment(newComment);
        setCreateComment(false);
    };

    const handleEditComment = (commentToEdit: CommentEntry) => {
        setEditedComment(commentToEdit);
        setEditComment(true);
    };

    const handleUpdateComment = async (commentToUpdate: CommentEntry) => {
        await updateComment(commentToUpdate.id, commentToUpdate);
        setEditComment(false);
        setEditedComment(null);
    };

    return (
        <div className="ml-5 p-3 border solid rounded-2xl shadow-md">
            <p className="text-2xl">{comment.content}</p>
            <small>By: {user?.firstName} {user?.lastName} on {new Date(comment.timeSent).toLocaleString()}</small>
            <div>
                <button onClick={handleCreateCommentModal} className="border solid text-m px-3 py-1 rounded-3xl my-1 bg-blue-500 text-white">Reply</button>
                {currentUser?.id === comment.userId && (
                    <>
                        <button onClick={() => handleEditComment(comment)} className="border solid text-m px-3 py-1 rounded-3xl my-1 bg-blue-300 text-white">Edit</button>
                        <button onClick={() => handleDelete(comment.id)} className="border solid text-m px-3 py-1 rounded-3xl my-1 bg-blue-300 text-white">Delete</button>
                    </>
                )}
            </div>

            {/* Recursive rendering for replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                    {comment.replies.map(reply => (
                        <SingleComment key={reply.id} comment={reply} />
                    ))}
                </div>
            )}

            {createComment && (
                <ManageComment 
                    onPost={handlePostComment} 
                    onCancel={handleCancelCreateCommentModal} 
                    commentId={comment.id} 
                    message={`Reply to ${user?.firstName} ${user?.lastName}`} 
                />
            )}

            {editComment && editedComment && (
                <ManageComment 
                    onPost={handleUpdateComment} 
                    onCancel={() => setEditComment(false)} 
                    commentId={editedComment.id} 
                    message={`Edit comment`} 
                    initialContent={editedComment.content}
                />
            )}
        </div>
    );
};

export default SingleComment;
