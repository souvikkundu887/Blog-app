import { Navigate } from "react-router-dom";
import { SignUp } from "./SignUp";
import { useState } from "react";

function CreateBlog() {

    const [BlogData,setBlogData]=useState({
        title:"",
        Desc:"",
    })
    const token=JSON.parse(localStorage.getItem("user"))?.user?.token
    console.log(token)
     async function handlesubmit() {
        alert(JSON.stringify(BlogData))
        const data = await fetch(`${import.meta.env.VITE_BACKEND_URL}blogs`, {
            method: "POST",
            body: JSON.stringify(BlogData),
            headers: {
                "Authorization":'Bearer '+token,
                "Content-Type": "application/json"
            }
        })
        let res = await data.json();
        // settoken(res.token)
        console.log(res)
        
    }
  
    // console.log(token)
    // if (!token) {
    //     return <Navigate to={<SignUp/>}></Navigate>
    // }
    return (
        <>
           <input type="text" placeholder="title" onChange={(e)=>{setBlogData((prev)=>({...prev,title:e.target.value}))}} />
           <input type="text" placeholder="description" onChange={(e)=>{setBlogData((prev)=>({...prev,Desc:e.target.value}))}}/>
           <button onClick={handlesubmit}>Submit</button>
        </>
    )
}
export default CreateBlog;