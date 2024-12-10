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
            <h1 className="text-3xl ml-2 mt-2 mb-2">Comments about {publication.title}</h1>
            <div>
                <Link to={AppRoutes.NOTICES} className="border solid text-xl px-3 py-1 rounded-3xl my-1 bg-blue-300 text-white">Back to notices</Link>
                <button onClick={handleCreateCommentModal} className="border solid text-lg px-3 py-1 rounded-3xl my-1 bg-blue-500 text-white">Post comment</button>
            </div>
            {comments.length > 0 ? (
                comments.map(comment => (
                    <SingleComment key={comment.id} comment={comment} />
                ))
            ) : (
                <p>No comments available</p>
            )}
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
