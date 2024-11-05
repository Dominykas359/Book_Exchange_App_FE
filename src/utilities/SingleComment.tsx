import React, { useEffect, useState } from "react";
import { CommentEntry } from "../models/CommentEntry";
import { User } from "../models/User";
import { deleteComment, postComment, updateComment } from "../api/CommentApi";
import ManageComment from "./ManageComment";

interface CommentProps {
    comment: CommentEntry;
}

const SingleComment: React.FC<CommentProps> = ({ comment }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
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
        <div style={{ marginLeft: "20px", borderLeft: "1px solid #ddd", paddingLeft: "10px" }}>
            <p>{comment.content}</p>
            <small>By: {comment.userId} on {new Date(comment.timeSent).toLocaleString()}</small>
            <div>
                <button onClick={handleCreateCommentModal}>Reply</button>
                {currentUser?.id === comment.userId && (
                    <>
                        <button onClick={() => handleEditComment(comment)}>Edit</button>
                        <button onClick={() => handleDelete(comment.id)}>Delete</button>
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
                    message={`Reply to ${comment.userId}`} 
                />
            )}

            {editComment && editedComment && (
                <ManageComment 
                    onPost={handleUpdateComment} 
                    onCancel={() => setEditComment(false)} 
                    commentId={editedComment.id} 
                    message={`Edit comment`} 
                    initialContent={editedComment.content} // Pass initial content for editing
                />
            )}
        </div>
    );
};

export default SingleComment;
