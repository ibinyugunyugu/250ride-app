import { createSlice } from "@reduxjs/toolkit";
// Reducer
let lastId = 0;
const slice = createSlice({
    name: "myRides",
    initialState: [],
    reducers:{
        myRideAdded: (myRides, action) => {
        myRides.push({...action.payload});
        },
        myRideResolved:(myRides,action) => {
            const index = myRides.findIndex(myRide => myRide.id === action.payload.id)
            myRides[index].resolved = true;
        },
        myRideRemoved:(myRides,action) => {
            myRides.filter(myRide => myRide.id !== action.payload.id)
        }
    }
})

export const {myRideAdded, myRideResolved, myRideRemoved} = slice.actions;

export default slice.reducer;