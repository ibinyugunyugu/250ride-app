import { createSlice } from "@reduxjs/toolkit";
// Reducer
let lastId = 0;
const slice = createSlice({
    name: "cars",
    initialState: [],
    reducers:{
        carAdded: (cars, action) => {
        cars.push({
            id:action.payload.id,
            carImage:action.payload.carImage,
            carModel:action.payload.carModel,
            carColor:action.payload.carColor,
            carSeats:action.payload.carSeats,
            insuranceImage:action.payload.insuranceImage,
            insuranceExpire:action.payload.insuranceExpire,
            ticImage:action.payload.ticImage,
            ticExpire:action.payload.ticExpire,
            ruraImage:action.payload.ruraImage,
            ruraExpire:action.payload.ruraExpire,
            status:action.payload.status,
            plateNumber:action.payload.plateNumber,
            
        });
        },
        carUpdated:(cars,action) => {
            const index = cars.findIndex(car => car.id === action.payload.id)
            cars[index].resolved = true;
        },
        carRemoved:(cars,action) => {
            const index = cars.findIndex(car => car.id === action.payload.id)
            cars.filter(car => car.id !== action.payload.id)
        }
    }
})

export const {carAdded, carUpdated, carRemoved} = slice.actions;

export default slice.reducer;