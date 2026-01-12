import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { addLike } from "../../utils/changeLikes"
import CommentCompo from "./Comment"

function Homepage() {
    const [blogs, setblogs] = useState([])
    // const [isLike, setLike] = useState(false)
    const { token, id } = useSelector((state) => (state.user));

    const { comments } = useSelector(state => state.blog)

    const { likes } = useSelector(state => state.likes)
    // console.log(like)
    async function fetchblogs() {
        try {
            let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs`)
            console.log(res?.data?.blog)
            setblogs(res?.data?.blog)
        }
        catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        fetchblogs()
    }, [])
    return (
        <>
            <div className=" mx-auto w-[60%]">
                {
                    blogs.map((data) => (
                        <Link to={`blog/${data.blogId}`}>
                            <div className="my-5 flex items-center gap-4 border p-4" key={data._id}>
                                <div className="w-3/4 flex flex-col gap-3">
                                    <div>
                                        <p className="font-bold text-gray-500">{data?.creator?.name}</p>

                                    </div>
                                    <p className="font-bold text-xl">My first blog</p>
                                    <h2 className="line-clamp-2">{data.title}</h2>
                                    <h3>{data.Desc}</h3>
                                    <div className="flex gap-4 items-center">
                                        <p>{new Date(data.createdAt).toDateString()}</p>
                                        <LikeCompo len={{ count: data.likes.length, blogid: data.blogId, likes: data.likes, token: token, id: id }} />
                                        <CommentCompo len={data.comments?.length} />
                                    </div>
                                </div>
                                <div className="w-[30%]">
                                    <img src={data.image} className="w-[200px]" alt="" />
                                </div>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </>
    )
}

export function LikeCompo({ len }) {
    const { blogid, likes, token, id } = len
    const [isLike, setLike] = useState(likes.includes(id))
    const [Likes, seLikes] = useState(likes.length);
    const dispatch = useDispatch()
    async function handleLike(e) {
        e.preventDefault()
        try {
            if (token) {
                let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blogs/like/${blogid}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                // console.log(res.data)
                dispatch(addLike(id))
                setLike(res.data.blog.likes.includes(id))
                seLikes(res.data.blog.likes.length)

            } else {
                return alert("please sign in first!")
            }
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <>
            <p className="flex justify-center align-middle gap-2 text-center " onClick={(e) => { handleLike(e) }}>{Likes}
                {isLike && <i class="fi fi-sr-heart"></i>}
                {!isLike && <i className="fi fi-rr-heart"></i>}
            </p>
        </>
    )
}




export default Homepage