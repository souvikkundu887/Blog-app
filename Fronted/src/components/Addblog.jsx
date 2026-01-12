import { data, Navigate, useParams } from "react-router-dom";
// import {Authform} from "./signin";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { removeBlog } from "../../utils/blogSlice";
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header'
import EditorjsList from '@editorjs/list';
import Marker from '@editorjs/marker';
import Embed from '@editorjs/embed';
import ImageTool from '@editorjs/image';

function Addblog() {
    const { id } = useParams()
    const { token } = useSelector((state) => state.user)
    const formData = new FormData()
    const { title, Desc, image, content } = useSelector((state) => state.blog)
    const editorjsRef = useRef(null)
    console.log(editorjsRef)
    const dispatch = useDispatch()

    const [resonse, setresponse] = useState(null)
    const [blogData, setBlogData] = useState({
        title: "",
        Desc: "",
        image: null,
        content: ""
    })
    //  setBlogData((blogData)=>({...blogData,content:content}))
    function fetchBlog() {
        setBlogData({
            title,
            Desc,
            image,
            content
        })
    }

    useEffect(() => {
        if (id) {
            fetchBlog();
        }
    }, [id])

    async function handlepostblog() {
        try {
            formData.append('title', blogData.title)
            formData.append('Desc', blogData.Desc)
            formData.append('image', blogData.image)
            formData.append('content', JSON.stringify(blogData.content))

            blogData.content.blocks.forEach((block) => {
                if (block.type === 'image')
                    formData.append("images", block.data.file.image)
            })

            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blogs`, formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            console.log(res)

        } catch (err) {
            console.log(err)
        }
        // console.log(blogData)
    }
    async function handleUpdateblog() {
        try {
            console.log(blogData)
            let existingImages = []
            const formData = new FormData();
            formData.append('title', blogData.title)
            formData.append('Desc', blogData.Desc)
            formData.append('image', blogData.image)
            formData.append('content', JSON.stringify(blogData.content))
            blogData.content.blocks.forEach((block) => {
                if (block.type === 'image') {
                    if (block.data.file.image)
                        formData.append("images", block.data.file.image)
                    else {
                        existingImages.push(
                            {
                                url: block.data.file.url,
                                imageId: block.data.file.public_id
                            }
                        )
                    }
                }
            })
            // for (let data of formData.entries()) {
            //     console.log(data)
            // }
            // console.log(existingImages)
            formData.append('existingImages',JSON.stringify( existingImages));
            const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`, formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    }
                }
            )


        } catch (err) {
            console.log(err)
             if(!err.response.data.success){
                 alert(err.response.data.message)
           }
        }

    }
    function initiateEditor() {
        editorjsRef.current = new EditorJS({
            holder: 'editor',
            placeholder: 'write something....',
            data: content,

            tools: {
                header: {
                    class: Header,
                    shortcut: 'CMD+SHIFT+H',
                    inlineToolbar: true,
                    config: {
                        placeholder: 'Enter a header',
                        levels: [2, 3, 4],

                    }
                },
                List: {
                    class: EditorjsList,
                    inlineToolbar: true,
                    config: {
                        defaultStyle: 'unordered'
                    }
                },
                Marker: {
                    class: Marker,
                    inlineToolbar: true,
                    shortcut: 'CMD+SHIFT+M'
                },
                embed: {
                    class: Embed,
                    inlineToolbar: true,
                    config: {
                        services: {
                            youtube: true,
                            coub: true,
                            codepen: {
                                regex: /https?:\/\/codepen.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
                                embedUrl: 'https://codepen.io/<%= remote_id %>?height=300&theme-id=0&default-tab=css,result&embed-version=2',
                                html: "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
                                height: 300,
                                width: 600,
                                id: (groups) => groups.join('/embed/')
                            }
                        }
                    }
                },
                image: {
                    class: ImageTool,
                    inlineToolbar: true,
                    config: {
                        uploader: {
                            uploadByFile: async (image) => {
                                return {
                                    success: 1,
                                    file: {
                                        url: URL.createObjectURL(image),
                                        image
                                    }
                                }
                            }
                        }
                    }

                },
            },
            onChange: async () => {
                console.log("ui")
                console.log(editorjsRef.current)
                let data = await editorjsRef.current.save();
                setBlogData((blogData) => ({ ...blogData, content: data }))
                console.log(data)
            }
        })
    }
    useEffect(() => {
        if (editorjsRef.current == null)
            initiateEditor()
    }, [])


    return token == null ? <Navigate to={"/signin"}></Navigate> : <div className="">
        <div className="flex flex-col gap-2 w-[70%]  mx-auto  my-2">
            <label htmlFor="" className="font-bold  ">Add Title</label>
            <input type="text" placeholder="Title" className=" focus:outline-none w-3/4 p-2 rounded-lg shadow-xl" onChange={(e) => (setBlogData((blogData) => ({ ...blogData, title: e.target.value })))} value={blogData.title} />
            <br />

            <label htmlFor="" className="font-bold ">Description</label>
            <textarea type="text" placeholder="Description" className="focus:outline-none p-2 rounded-lg shadow-2xl focus:none focus:border-none h-[100px] " onChange={(e) => (setBlogData((blogData) => ({ ...blogData, Desc: e.target.value })))} value={blogData.Desc} ></textarea>
            <br />
            <label htmlFor="" className="font-bold ">Content</label>
            <div id="editor" className="focus:outline-none p-4 rounded-xl shadow-2xl "></div>
            <div>
                <label htmlFor="image" className="bg-black w-[200px] md:w-[500px] ">
                    {
                        blogData?.image ? <img src={typeof (blogData.image) == "string" ? blogData.image : URL.createObjectURL(blogData.image)} alt="" className="h-[400px] w-[500px]" /> :
                            <div className="aspect-video border rounded-xl h-[400px] w-full md:w-[500px]  bg-slate-500 flex justify-center items-center text-xl">
                                select image
                            </div>
                    }
                </label>
                <input id="image" type="File" accept=".jpeg,.png,.jpg" placeholder="image" className="border hidden shadow-xl" onChange={(e) => (setBlogData((blogData) => ({ ...blogData, image: e.target.files[0] })))} />
            </div>

            <button onClick={id ? handleUpdateblog : handlepostblog} className="bg-gray-400 w-[200px] rounded-xl font-semibold  shadow-xl p-2">{id ? "Update blog" : "Post Blog"}</button>
        </div>
    </div>

}
export default Addblog
