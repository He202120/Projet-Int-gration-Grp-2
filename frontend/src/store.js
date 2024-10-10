import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice.js';
import adminAuthReducer from './slices/adminAuthSlice.js';
import { apiSlice } from "./slices/apiSlice.js";

// permet de gérer les states dans les différents composants avec redux comme state managers
const store = configureStore({

    reducer: {
        auth: authReducer,
        adminAuth: adminAuthReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true

});


export default store;