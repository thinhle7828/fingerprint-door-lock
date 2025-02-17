import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        users: {
            allUsers: null,
            isFetching: false,
            error: false
        },
    },
    reducers: {
        getUserStart: (state) => {
            state.users.isFetching = true;
        },
        getUserSuccess: (state, action) => {
            state.users.isFetching = false;
            state.users.allUsers = action.payload;
        },
        getUsersFailed: (state) => {
            state.users.isFetching = false;
            state.users.error = true;
        },
        deleteUserStart: (state) => {
            state.users.isFetching = true;
        },
        deleteUserSuccess: (state, action) =>{
            state.users.isFetching = false;
            state.msg = action.payload;
        },
        deteleUserFailed: (state, action) =>{
            state.users.isFetching = false;
            state.users.error = true;
            state.msg = action.payload;
        },

        UpdateUserStart: (state) => {
            state.users.isFetching = true;
        },
        UpdateUserSuccess: (state, action) =>{
            state.users.isFetching = false;
            state.msg = action.payload;
        },
        UpdateUserFailed: (state, action) =>{
            state.users.isFetching = false;
            state.users.error = true;
            state.msg = action.payload;
        },
    }
})

export const {
    getUserStart,
    getUserSuccess, 
    getUsersFailed,
    deleteUserStart,
    deleteUserSuccess,
    deteleUserFailed,
    UpdateUserStart,
    UpdateUserSuccess,
    UpdateUserFailed
} = userSlice.actions;

export default userSlice.reducer;