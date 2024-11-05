import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CommentEntry } from "../../models/CommentEntry";
import { getCommentsForNotice, postComment } from "../../api/CommentApi";
import SingleComment from "../../utilities/SingleComment";
import { AppRoutes } from "../../utilities/Routes";
import ManageComment from "../../utilities/ManageComment";

function Comments() {

    const location = useLocation();
    const { notice, publication } = location.state || {};

    const[comments, setComments] = useState<CommentEntry[]>([]);
    const[createComment, setCreateComment] = useState<boolean>(false);

    useEffect(() => {
        const fetchComments = async (id: string) => {
            const data = await getCommentsForNotice(id);
            setComments(data);
        }

        fetchComments(notice.id);
    }, [comments]);

    const handleCreateCommentModal = () => {
        setCreateComment(true);
    }

    const handleCancelCreateCommentModal = () => {
        setCreateComment(false);
    }

    const handlePostComment = async (newComment: CommentEntry) => {
        await postComment(newComment);
        setCreateComment(false);
        setComments([...comments, newComment]);
    };
    
    return (
        <div>
            <h2>Comments about {publication.title}</h2>
            {comments.length > 0 ? (
                comments.map(comment => (
                    <SingleComment key={comment.id} comment={comment} />
                ))
            ) : (
                <p>No comments available</p>
            )}
            <div>
                <Link to={AppRoutes.NOTICES}>Back to notices</Link>
                <button onClick={handleCreateCommentModal}>Post comment</button>
            </div>

            {createComment && (
                <ManageComment 
                    onPost={handlePostComment} 
                    onCancel={handleCancelCreateCommentModal} 
                    noticeId={notice.id} 
                    message="New comment"
                />
            )}
        </div>
    );
}

export default Comments;
