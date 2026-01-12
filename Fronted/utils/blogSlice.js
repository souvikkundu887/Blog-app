import { createSlice, current } from "@reduxjs/toolkit";

const blogSilce = createSlice({
    name: "blogslice",
    initialState: JSON.parse(localStorage.getItem('blog')) || {},
    reducers: {
        addBlog: (state, action) => {
            localStorage.setItem('blog', JSON.stringify(action.payload))
            return action.payload
        },
        removeBlog: (state, action) => {
            localStorage.removeItem('blog')
            return action.payload
        },
        setComments: (state, action) => {
            state.comments = [...state.comments, action.payload]
            console.log(state.comments.length)
        },

        setReplies: (state, action) => {
            // console.log(action.payload)
            let newReply = action.payload


            function FindParentComment(comments) {

                let GetParComment

                for (const comment of comments) {
                    if (comment._id === newReply.parentComment) {
                        GetParComment = comment
                        break;
                    }

                    if (comment.replies.length > 0) {
                        GetParComment = FindParentComment(comment.replies)
                        if (GetParComment)
                            break;
                    }
                }

                return GetParComment

            }

            let parentComment = FindParentComment(state.comments);

            parentComment.replies = [...parentComment.replies, newReply]


        },

        setCommentLike: (state, action) => {
            let { commentId, userid } = action.payload
            function toogleLike(comments) {
                return comments.map((comment) => {
                    if (comment._id === commentId) {
                        if (comment.likes.includes(userid)) {
                            comment.likes = comment.likes.filter((like) => like != userid);
                            return comment
                        }
                        else {
                            comment.likes = [...comment.likes, userid]
                            return comment
                        }
                    }

                   else if (comment.replies && comment.replies.length > 0) {
                        return { ...comment, replies: toogleLike(comment.replies) }
                    }

                    return comment
                })
            }
            state.comments = toogleLike(state.comments)

        },

        setUpdatedComment: (state, action) => {
            let commentId = action.payload._id
            let comment = action.payload.comment

            function updateComment(comments) {
                return comments.map((comment) =>
                    comment._id == commentId ? { ...comment, comment: action.payload.comment } : comment.replies.length > 0 ?
                        { ...comment, replies: updateComment(comment.replies) } : comment)
            }

            state.comments = updateComment(state.comments)

            // let GetComment = FindComment(state.comments)
        },

        deleteComment: (state, action) => {

            function deleteComments(comments) {
                return comments.filter((comment) => comment._id !== action.payload._id).map((comment) => comment.replies && comment.replies.length > 0 ? { ...comment, replies: deleteComments(comment.replies) } : comment)
            }

            state.comments = deleteComments(state.comments)
        },
       

    }
})
export const { addBlog, removeBlog, setComments, setCommentLike, setReplies, setCountcomment, setUpdatedComment, deleteComment } = blogSilce.actions
export default blogSilce.reducer