import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios";

export function VerifyUser() {
    const { verificationToken } = useParams();
    // console.log(verificationToken)
    const navigate=useNavigate()
    async function verifyEmail() {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/verify-email/${verificationToken}`)
            console.log(res)
            // alert(res?.data?.message)
            // navigate('/signin')
        }
        catch (err) {
            // alert(err?.response?.data?.message)
        }finally{
            navigate('/signin')
        }
    }

    useEffect(() => {
        verifyEmail();
    }, [])
    return (
        <>
            <div>
                verify user
            </div>
        </>
    )
}