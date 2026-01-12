import { createSlice } from "@reduxjs/toolkit";

const CommentSlice = createSlice({
    name: "Comment",
    initialState: {
        isOpen: false
    },
    reducers: {
        SetisOpen: (state, action) => {
            const { payload } = action
            console.log(payload)
            state.isOpen =  payload===false?false:!state.isOpen
        }
    }
})
export const { SetisOpen } = CommentSlice.actions
export default CommentSlice.reducer