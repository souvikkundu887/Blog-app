import { useDispatch, useSelector } from "react-redux";
import { SetisOpen } from "../../utils/commentSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { setCommentLike, setComments, setReplies, setUpdatedComment, deleteComment } from "../../utils/blogSlice";
function CommentCompo({ len }) {
    const { token } = useSelector((state) => (state.user));
    const { comments } = useSelector((state) => (state.blog))
    // const [cntlen, setlen] = useState(0)
    // function countLen(comments) {
    //     if (comments?.length == 0)
    //         return 0
    //     let len = 0
    //     for (const comment of comments) {
    //         len = len + 1 + countLen(comment.replies)
    //     }

    //     return len
    // }

    // useEffect(() => {
    //     let countlen = countLen(comments)
    //     setlen(countlen)
    // }, [])

    const dispatch = useDispatch();
    function handleComment(e) {
        e.preventDefault();
        if (token) {
            dispatch(SetisOpen())
        }
        else {
            return alert("please sign in first")
        }
    }
    return (
        <>
            <p className="flex justify-center items-center gap-2 " onClick={(e) => {
                handleComment(e)
            }}>{len}
                <i class="fi fi-rr-comment-alt"></i>
            </p>
        </>
    )
}

export function Comment() {
    const [comment, setcomment] = useState('')
    const dispatch = useDispatch();
    const { blogId, comments, creator: { _id: creatorId } } = useSelector(state => state.blog)
    // console.log(creatorId)
    const [activeReply, setactiveReply] = useState(null)
    const [currPop, setCurrPop] = useState(null)
    const [currEditComment, setcurrEditComment] = useState(null)
    // console.log(blogId)
    const { token, id: userid } = useSelector(state => state.user)
    async function handleComment(e) {
        try {
            let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blogs/comment/${blogId}`, { comment }, {

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }

            })
            // console.log(res.data)
            dispatch(setComments(res.data.newComment))
            dispatch(setCountcomment(res.data.newComment))
            setcomment('')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <div className="min-h-screen absolute top-0 right-0 w-[400px] bg-white p-4  border-l drop-shadow-xl flex flex-col gap-4 overflow-scroll">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-medium">Comments({comments.length})</h1>
                    <i class="fi fi-br-cross text-shadow-lg cursor-pointer" onClick={() => dispatch(SetisOpen())}></i>
                </div>


                <div className="flex flex-col gap-2">
                    <textarea name="" id="" placeholder="comment here........." className="drop-shadow w-full focus:outline-none p-4 border resize-none" onChange={(e) => { setcomment(e.target.value) }} value={comment}></textarea>
                    <button className="bg-gray-400 p-2 rounded-xl w-[15%]" onClick={handleComment}>Add</button>
                </div>

                <div className="flex flex-col gap-4 p-4">
                    <h1>Most recent Comments</h1>
                    <div>
                        <DisplayComment comments={comments} userid={userid} blogId={blogId} token={token} val={0} activeReply={activeReply} setactiveReply={setactiveReply} setComments={setComments} currPop={currPop} setCurrPop={setCurrPop} dispatch={dispatch} currEditComment={currEditComment} setcurrEditComment={setcurrEditComment} setcomment={setcomment} creatorId={creatorId} />
                    </div>
                </div>
            </div>

        </>
    )
}

function DisplayComment({ comments, userid, blogId, token, val, activeReply, setactiveReply, setComments, dispatch, currPop, setCurrPop, currEditComment, setcurrEditComment, setcomment, creatorId }) {
    const [reply, setreply] = useState('')
    const [updatedCommentContent, setupdateComment] = useState('')
    async function handleCommentlike(commentId) {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blogs/likecomment/${commentId}`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(res)
            dispatch(setCommentLike({ commentId, userid }))
        }
        catch (err) {
            console.log(err);
        }
    }

    async function handleReply(commentId) {
        try {
            let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/comment/${commentId}/${blogId}`, { reply }, {

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }

            })
            // console.log(res.data)
            dispatch(setReplies(res.data.newReply))
            setreply('')
            // console.log(blogs[0].comments[0].replies);

            // dispatch(setComments(res.data.newComment))
            setreply('')
        } catch (err) {
            console.log(err)
        }
    }

    async function handleEdit(commentId) {
        try {
            let res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/blogs/editcomment/${commentId}`, { updatedCommentContent }, {

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }

            })
            console.log(res.data)
            setcurrEditComment(null)
            dispatch(setUpdatedComment(res.data.updatedComment))
        }
        catch (err) {
            console.log(err)
        }
    }

    async function handleCommentDelete(commentId) {
        try {
            let res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/blogs/comment/${commentId}`, {

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }

            })
            console.log(res.data)
            setcurrEditComment(null)
            dispatch(deleteComment(res.data.deleteComment))
            // setcomment(res.data.updatedComment.comment)
        }
        catch (err) {
            console.log(err)
        }
    }

    return <>
        {
            comments.map(({ comment, likes, _id, updatedAt, user: { name, _id: userCommentId }, replies }, i) => (
                <>

                    <div key={_id} className={"my-2 flex flex-col "}>

                        {currEditComment === _id ? <div className="flex flex-col gap-2">
                            <textarea name="" id="" placeholder="comment here........." className="drop-shadow w-full focus:outline-none p-4 border resize-none" onChange={(e) => { setupdateComment(e.target.value) }} defaultValue={comment} ></textarea>
                            <div className="flex gap-4">
                                <button className="bg-green-400 p-2 rounded-xl w-[15%] hover:cursor-pointer" onClick={() => { handleEdit(_id) }}>Edit</button>
                                <button className="bg-red-400 p-2 rounded-xl w-[25%] hover:cursor-pointer"
                                    onClick={() => setcurrEditComment(null)}>Cancel</button>
                            </div>
                        </div> : <>
                            <div className="flex justify-between ">
                                <div className="flex gap-2 items-center">
                                    <div className="w-[8%]">
                                        <img src={`https://api.dicebear.com/9.x/initials/svg?seed=${name}`} alt="" className="w-full  rounded-2xl" />
                                    </div>
                                    <div className="flex flex-col  justify-center items-center">
                                        <p className="capitalize font-medium">{name}</p>
                                        <p className="text-sm ">{new Date(updatedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div>
                                    {
                                        userid == userCommentId || userid == creatorId ? <>
                                            {/* <h1>{userCommentId}</h1> */}
                                            {currPop === _id ? <div className="bg-gray-200 w-[70px] p-1 relative rounded-xl">
                                                <i class="fi fi-br-cross text-shadow-lg text-xs m-2 P-1 cursor-pointer absolute right-0 top-0" onClick={() => { setCurrPop((prev) => prev == _id ? null : _id) }} ></i>
                                                <div className="mt-5">
                                                    {userid == userCommentId ? <p className="hover:bg-blue-300 px-2 hover:cursor-pointer "
                                                        onClick={() => {
                                                            setCurrPop(null)
                                                            setcurrEditComment((prev) => prev === _id ? null : _id)
                                                        }
                                                            //handle commentUpdate
                                                        }>Edit</p> : ""}
                                                    <p className="hover:bg-blue-300 px-2 hover:cursor-pointer" onClick={
                                                        () => {
                                                            setCurrPop(null)
                                                            handleCommentDelete(_id)
                                                        }
                                                        //handle CommentDelete

                                                    }>Delete</p>
                                                </div>
                                            </div> : <i class="fi fi-rr-menu-dots-vertical" onClick={() => { setCurrPop((prev) => prev == _id ? null : _id) }}></i>}
                                        </> : ""
                                    }



                                </div>
                            </div>
                            <div className="flex items-start">
                                {comment}
                            </div>
                            <div className="flex gap-10 py-1">
                                <div className="flex justify-start items-center gap-2">
                                    {
                                        likes.includes(userid) ? <i class="fi fi-sr-heart text-sm" onClick={() => handleCommentlike(_id)}></i> : <i class="fi fi-rr-heart text-sm" onClick={() => handleCommentlike(_id)}></i>
                                    }
                                    {likes.length}
                                </div>

                                <div className="flex items-center justify-center gap-1">
                                    <i class="fi fi-sr-comment-alt flex items-center justify-center"></i>
                                    <p>{(replies.length)}</p>
                                </div>
                                <div className="hover:underline hover:cursor-pointer" onClick={() => { setactiveReply((prev) => prev == _id ? null : _id) }}>
                                    <p>reply</p>
                                </div>
                            </div></>}

                        {
                            activeReply === _id && <div>
                                <textarea name="" id="" placeholder="comment here........." className="drop-shadow w-full focus:outline-none p-4 shadow-xl resize-none" onChange={(e) => { setreply(e.target.value) }} value={reply} ></textarea>
                                <button className="bg-gray-400 p-2 rounded-xl w-[20%] font-bold" onClick={() => { handleReply(_id) }} >Reply</button>
                            </div>
                        }
                    </div>
                    {replies.length &&
                        <div className="p-2 border-b-1">
                            <DisplayComment comments={replies} userid={userid} blogId={blogId} token={token} val={1} activeReply={activeReply} setactiveReply={setactiveReply} setComments={setComments} currPop={currPop} setCurrPop={setCurrPop} dispatch={dispatch} currEditComment={currEditComment} setcurrEditComment={setcurrEditComment} setcomment={setcomment} creatorId={creatorId} />
                        </div>
                    }
                    {!val ? <hr className="text-shadow-2xs" /> : ""}
                </>

            ))
        }
    </>
}
export default CommentCompo