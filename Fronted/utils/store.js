import {  configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice'
import blogSlice from './blogSlice'
import likeSlice from './changeLikes'
import CommentSlice from './commentSlice'
const store=configureStore(
    {
        reducer:{
            user:userSlice,
            blog:blogSlice,
            likes:likeSlice,
            comment:CommentSlice
        },
    }
)
export default store