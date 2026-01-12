import { Link, Navigate, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useDispatch } from "react-redux"

import axios from "axios"
import { logIn } from "../../utils/userSlice"
import Input from "./input"
export function Authform({ type }) {
    
    const [Val, setVal] = useState({ name: "", email: " ", password:"" })

    const dispatch = useDispatch()
    const navigate=useNavigate()
    const [res, setresponse] = useState({ success: true, message: "" })
    async function submit() {
        // let data = await fetch(`http://localhost:3000/api/v1/${type}`, {
        //     method: "POST",
        //     body: JSON.stringify(Val),
        //     headers: {
        //         "Content-Type": "application/json"
        //     }
        // })
        try {
            console.log(type)
            const result = await axios.post(`http://localhost:3000/api/v1/${type}`, Val)

            const { data } = result?.response || result
            // console.log(result?.response?.data)
            console.log(result)
            console.log(data)
            setresponse((prev) => ({ ...prev, success: data?.success }));
            setresponse((prev) => ({ ...prev, message: data?.message }));
            if (data?.success) {
                console.log(data.user)
            }
            if (data?.success && type == "signin") {
                alert("logged in succesfully")
                navigate('/')
                 dispatch(logIn(data.user))
            }
            else {
                 dispatch(logIn(data.user))
                alert("sign up successfully")
            }
            console.log(res)
        } catch (err) {
            if (err.response) {
                setresponse((prev) => ({ ...prev, success: false, message: err.response.data?.message || "Server Error" }));
            } else {
                setresponse((prev) => ({ ...prev, success: false, message: err.message }));
            }
        }
        finally{
            setVal({
                name:"",
                email:"",
                password:""
            })
        }

        // console.log(Val);
    }
    return (
        <div class="min-h-screen flex justify-center items-center bg-red-300">
            <div class="bg-amber-100 flex flex-col justify-center items-center gap-4 px-8 py-6 rounded-xl">
                <h1 class="font-bold text-2xl">Welcome to Blog App</h1>
                <h2 class="font-bold text-xl">{type == "signin" ? "signin" : "Register"}</h2>

                {type == "signup" && <Input type={"text"} placeholder={"Enter your name"} setVal={setVal} field={'name'} value={Val.name}/>}

                {/* <input
                    type="email"
                    placeholder="Enter your email"
                    onChange={(e) => setVal((prev) => ({ ...prev, email: e.target.value }))}
                    class="text-center  outline-1 rounded-md px-2 py-1"
                /> */}
                <Input type={"email"} placeholder={"Enter your email"} setVal={setVal} field={'email'} value={Val.email}/>

                {/* <input
                    type="password"
                    placeholder="Enter your password"
                    onChange={(e) => setVal((prev) => ({ ...prev, password: e.target.value }))}
                    class="text-center  outline-1 rounded-md px-2 py-1"
                /> */}
                <Input type={"password"} placeholder={"Enter your password"} setVal={setVal} field={'password'} value={Val.password}/>

                {res.message == "email" && type == "signin" && (
                    <p class="text-red-600">User does not exist. Please sign up.</p>
                )}
                {res.message == "password" && type == "signin" && (
                    <p class="text-red-600">Invalid password</p>
                )}
                {!res.success && type == "signup" && (
                    <p class="text-red-600">{res.message}</p>
                )}

                <button
                    onClick={submit}
                    class="bg-gray-300 px-4 py-2 rounded-xl font-bold hover:bg-gray-400 transition"
                >
                    {type == "signin" ? "Sign in" : "Sign up"}
                </button>

                {
                    type == "signin" && <p>
                        Don’t have an account?
                        <Link to={"/Signup"}>
                            <span class="text-blue-600 underline">Sign up</span>
                        </Link>
                    </p>}
            </div>
        </div>


    )
}
export default Authform