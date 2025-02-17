import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            error: false
        },
        register: {
            isFetching: false,
            error:false,
            success: false
        },
        changePassword: {
            isFetching: false,
            error:false,
            success: false
        }
    },

    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },

        registerStart: (state) => {
            state.register.isFetching = true;
        },
        registerSuccess: (state, action) => {
            state.register.isFetching = false;
            state.register.error = false;
            state.register.success = true;
        },
        registerFailed: (state) => {
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false;
        },
        logOutStart: (state) => {
            state.login.isFetching = true;
        },
        logOutSuccess: (state) => {
            state.login.isFetching = false;
            state.login.currentUser = null;
            state.login.error = false;
        },
        logOutFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        changePasswordStart: (state) => {
            state.changePassword.isFetching = true;
        },
        changePasswordSuccess: (state) => {
            state.changePassword.isFetching = false;
            state.changePassword.success = true;
            state.changePassword.error = false;
        },
        changePasswordFailed: (state) => {
            state.changePassword.isFetching = false;
            state.changePassword.error = true;
        },
    }
});

export const {
    loginStart,
    loginFailed,
    loginSuccess,
    registerStart,
    registerSuccess,
    registerFailed,
    logOutStart,
    logOutSuccess,
    logOutFailed,
    changePasswordStart,
    changePasswordSuccess,
    changePasswordFailed,
} = authSlice.actions;

export default authSlice.reducer;