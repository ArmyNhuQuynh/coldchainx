import { configureStore } from "@reduxjs/toolkit";
import userSlice from '@/redux/User/user-slice';
import modalSlice from '@/redux/modal/modal-slice';


const store = configureStore( {
    reducer: {
        user: userSlice,
        modal: modalSlice,
    },
} );
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
