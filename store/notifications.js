import { createSelector, createSlice } from "@reduxjs/toolkit";
// Reducer
let lastId = 0;
const slice = createSlice({
    name: "notifications",
    initialState: [],
    reducers:{
        notificationAdded: (notifications, action) => {
            notifications.push({
                id:action.payload.id,
                body:action.payload.body,
                title:action.payload.title,                
                delivered:action.payload.delivered,                
                matched:action.payload.matched,                
                mode:action.payload.mode,                
                screen:action.payload.screen,                
                ride_id:action.payload.ride_id,                
                ride_request_id:action.payload.ride_request_id,                
            });
        },
        notificationRemoved:(notifications,action) => {
            const index = notifications.findIndex(notification => notification.id === action.payload.id)
            notifications.filter(notification => notification.id !== action.payload.id)
        },
        setNotifications:(notifications,action) => {
            return action.payload.notifications;
        },
        clearNotifications:(notifications,action) => {
            return []
        }
    }
})

export const {notificationAdded, notificationRemoved, setNotifications, clearNotifications} = slice.actions;

export default slice.reducer;

export const getNotifications = () =>
  createSelector(
    state => state.entities.notifications,
    notifications => notifications
  );
