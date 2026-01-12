import { useParams } from "react-router-dom"
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import userSlice from "../../utils/userSlice";
import { addBlog, removeBlog } from "../../utils/blogSlice";
import { LikeCompo } from "./Homepage";
import CommentCompo from "./Comment";
import { Comment } from "./Comment";
import { SetisOpen } from "../../utils/commentSlice";

function Blogpage() {

    const { id } = useParams();
    // console.log(id);
    const [response, setresponse] = useState(null)

    const dispatch = useDispatch()

    const { token, id: userid } = useSelector((state) => (state.user));
    const { comments, content } = useSelector(state => state.blog)
    const { isOpen } = useSelector((state) => state.comment)
    console.log(isOpen)
    // console.log(token)
    console.log(comments)
    async function fetchBlog() {
        try {
            let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`)

            setresponse(res.data.blog)
            console.log(res.data.blog)
            dispatch(addBlog(res.data.blog))
        }
        catch (err) {
            console.log(err);
            alert("there is an error ")
        }
    }
    useEffect(() => {
        fetchBlog();
        return () => {
            if (location.pathname == '/')
            dispatch(removeBlog())
        }
    }, [id])


    return (
        <>
            <div className="mx-auto max-w-[900px]    p-4">
                {
                    response ? <div className="flex flex-col gap-4 ">
                        <div className="p-4">
                            <h1 className="text-xl font-extrabold">{response.title}</h1>
                            <h2 className="text-lg font-bold">{response.creator.name}</h2>
                        </div>
                            <div className="px-4 border flex flex-col gap-4 p-4">
                            {
                                content?.blocks?.map((block) => {
                                    if (block.type == 'header') {
                                        if (block.data.level == "2") {
                                            return <h2 className="font-medium text-2xl" dangerouslySetInnerHTML={{ __html: block.data.text }}></h2>
                                        }
                                        else if (block.data.level == "3") {
                                            return <h3 className="font-medium text-xl" dangerouslySetInnerHTML={{ __html: block.data.text }}></h3>
                                        }
                                        else {
                                            return <h4 className="font-medium text-lg" dangerouslySetInnerHTML={{ __html: block.data.text }}></h4>
                                        }
                                    } else if (block.type == 'paragraph') {
                                        return <p dangerouslySetInnerHTML={{ __html: block.data.text }}></p>
                                    }
                                    else if(block.type=='image'){
                                        return <div className="w-[250px]">
                                            <img src={`${block.data.file.url}`} />
                                             <p className="font-bold text-center ">{block.data.caption}</p>
                                        </div>
                                    }
                                    else if(block.type=='List'){
                                        return <div>
                                            <ul>
                                                {
                                                    block.data.items.map((item,i)=>(
                                                        <li>{i+1}.{ item.content}</li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    }
                                })
                            }
                        </div>
                        <div className="w-1/2 flex flex-col gap-2 h-1/2 px-8 py-4  items-start">
                            <img src={response.image} alt="" />
                            <Link to={`/editblog/${response.blogId}`}><button className="bg-gray-400 w-full p-2 " >Edit</button></Link>
                            <div className="flex  gap-4">
                                <LikeCompo len={{ count: response.likes.length, blogid: response.blogId, token: token, id: userid, likes: response.likes }} />
                                <CommentCompo len={comments.length} />
                            </div>
                        </div>

                    

                    </div> : <h1>loading....</h1>


                }
                {isOpen && <Comment />}
            </div>

        </>
    )
}
export default Blogpage