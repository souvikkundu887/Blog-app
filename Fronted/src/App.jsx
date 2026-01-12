
import { useState } from 'react';
import './App.css'
import { Router, Routes, Route } from 'react-router-dom';
import { ShowBlog } from './components/ShowBlog';
import { SignUp } from './components/SignUp';
import CreateBlog from './components/createBlog';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import { Authform } from './components/Signin';
import Addblog from './components/Addblog';
import Blogpage from './components/Blogpage';
import { VerifyUser } from './components/VerifyUser';

function App() {
  const [count, setcount] = useState(0);
  console.log(import.meta.env.VITE_BACKEND_URL)
  return (

    <Routes>
      <Route path='/' element={<Navbar />}>
        <Route path='/signin' element={<Authform type={"signin"} />}></Route>
        <Route path='/signup' element={<Authform type={"signup"} />}></Route>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/addblog" element={<Addblog />}></Route>
        <Route path="/blog/:id" element={<Blogpage />}></Route>
        <Route path="editblog/:id" element={<Addblog />}></Route>
      </Route>

      <Route path='/Signup' element={<SignUp />}></Route>
      <Route path='/verify-email/:verificationToken' element={<VerifyUser />}></Route>
      <Route path='/ShowBlog' element={<ShowBlog />}></Route>
    </Routes>


  )

}

export default App
