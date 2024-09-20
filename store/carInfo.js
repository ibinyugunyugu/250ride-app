import { createSelector, createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "carInfo",
    initialState: {},
    reducers:{
        setCarInfo: (carInfo, action) => {
          carInfo.id = action.payload.id
          carInfo.carModel = action.payload.carModel
          carInfo.carColor = action.payload.carColor
          carInfo.carSeats = action.payload.carSeats
          carInfo.plateNumber = action.payload.plateNumber
          carInfo.insuranceImage = action.payload.insuranceImage
          carInfo.insuranceExpire = action.payload.insuranceExpire
          carInfo.ticImage = action.payload.ticImage
          carInfo.ticExpire = action.payload.ticExpire
          carInfo.ruraImage = action.payload.ruraImage
          carInfo.ruraExpire = action.payload.ruraExpire
          carInfo.reason = action.payload.reason     
          carInfo.status = action.payload.status     
        },
        resetCarInfo: () =>{
          return {}
        }
    }
})

export const { setCarInfo , resetCarInfo } = slice.actions;

export default slice.reducer;

export const getCarInfo = () =>
  createSelector(
    state => state.entities.carInfo,
    carInfo => carInfo
  );
