import { createSlice } from "@reduxjs/toolkit"


const userSlice = createSlice({
    name: "userSlice",
    initialState:JSON.parse(localStorage.getItem("user")) || { token: null },
    reducers: {
        logIn: (state, action) => {
            const { payload } = action;
            console.log(state.user)
            // console.log(state.token)
            state.user=payload;
            console.log(state.user)
            localStorage.setItem('user',JSON.stringify(payload))
            // return payload;
        },
        logOut: (state, action) => {
            const { payload } = action;
            console.log(action.payload)
        }
    },
})
export const {logIn,logOut } = userSlice.actions
export default userSlice.reducer