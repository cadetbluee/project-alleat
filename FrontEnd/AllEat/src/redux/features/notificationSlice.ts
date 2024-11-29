import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Notification {
    text: string|null;
    subText: string|null;
    app: string|null;
    bigText: string|null;
    title: string|null;
    titleBig: string|null;
}

const initialState: Notification = {
    text: "",
    subText: "",
    app: "",
    bigText: "",
    title: "",
    titleBig: "",
};

const notificationSlice = createSlice({
    name : 'notification',
    initialState,
    reducers:{
        setNotification: (state, action: PayloadAction<Notification>)=>{
            state.text = action.payload.text;
            state.subText = action.payload.subText;
            state.app = action.payload.app;
            state.bigText = action.payload.bigText;
            state.title = action.payload.title;
            state.titleBig = action.payload.titleBig;
        },
        clearNotification: (state) => {
            state.text = "";
            state.subText = "";
            state.app = "";
            state.bigText = "";
            state.title = "";
            state.titleBig = "";
        },
        
    }
});

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

