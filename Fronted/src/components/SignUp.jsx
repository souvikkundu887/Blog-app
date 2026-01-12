import { useState } from "react"
export function SignUp() {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [visible, setVisible] = useState(true)
    const [Blogs, SetBlogs] = useState([])


    async function handlesubmit() {
        alert(JSON.stringify(userData))
        const data = await fetch("http://localhost:3000/api/v1/users", {
            method: "POST",
            body: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        })
        let res = await data.json();
        console.log(res);
        if (res.success)
            localStorage.setItem("user", JSON.stringify(res))
        setVisible(res.success)
    }
    return (<>
        <div class="min-h-screen flex justify-center items-center bg-red-300">
            <div class="bg-amber-100 flex flex-col justify-center items-center gap-4 px-8 py-6 rounded-xl">
                <h1 class="font-bold text-2xl">Welcome to Blog App</h1>
                <h2 class="font-bold text-xl">Sign In</h2>

                <input
                    type="email"
                    placeholder="Enter your name"
                    onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                    class="text-center  outline-1 rounded-md px-2 py-1"
                />

                <input
                    type="password"
                    placeholder="Enter your password"
                    onChange={(e) => setUserData((prev) => ({ ...prev, password: e.target.value }))}
                    class="text-center  outline-1 rounded-md px-2 py-1"
                />

                {response.message == "email" && (
                    <p class="text-red-600">User does not exist. Please sign up.</p>
                )}
                {response.message == "password" && (
                    <p class="text-red-600">Invalid password</p>
                )}

                <button
                    onClick={submit}
                    class="bg-gray-300 px-4 py-2 rounded-xl font-bold hover:bg-gray-400 transition"
                >
                    Sign In
                </button>

                <p>
                    Don’t have an account?
                    <Link to={"/Signup"}>
                        <span class="text-blue-600 underline">Sign up</span>
                    </Link>
                </p>
            </div>
        </div>
    </>)
    //  <input type="text" placeholder='Name' onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))} />

    //             <input type="text" placeholder='email' onChange={(e) => setUserData((prev) => ({ ...prev, email: e.target.value }))} />

    //             <input type="text" placeholder='password' onChange={(e) => setUserData((prev) => ({ ...prev, password: e.target.value }))} />

    //             <button onClick={handlesubmit}>Submit</button>
}