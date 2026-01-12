import { useState } from "react"
export function ShowBlog() {
    const [Blogs, SetBlogs] = useState([])
    async function FetchBlogs() {
        const data = await fetch("http://localhost:3000/api/v1/blogs", {
            method: "GET"
        });
        const res = await data.json();
        console.log(res)
        SetBlogs(res.blog)
}
    return (<div>
        <div style={{ margin: "1rem" }}>
            <button onClick={FetchBlogs} style={{ textAlign: "center" }}>GetBlogs</button>
           
                {
                    Blogs.map(({ title, Desc }) => (
                        <div>
                            <p>{title}</p>
                            <p>{Desc}</p>
                            <button>update</button>
                            <button>like</button>
                        </div>

                    ))
                }
           
        </div>
    </div>)
}