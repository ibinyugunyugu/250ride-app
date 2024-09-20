import { createSelector, createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "driverInfo",
    initialState: {},
    reducers:{
      setDriverInfo: (driverInfo, action) => {
        driverInfo.id = action.payload.id
        driverInfo.balance = action.payload.balance
        driverInfo.cars = action.payload.cars
        driverInfo.idImage = action.payload.idImage
        driverInfo.idNumber = action.payload.idNumber
        driverInfo.idType = action.payload.idType
        driverInfo.licenseExpire = action.payload.licenseExpire
        driverInfo.licenseImage = action.payload.licenseImage
        driverInfo.licenseNumber = action.payload.licenseNumber
        driverInfo.nationalityCode = action.payload.nationalityCode     
        driverInfo.nationalityName = action.payload.nationalityName     
      },
      resetDriverInfo: () =>{}
    }
})

export const { setDriverInfo , resetDriverInfo } = slice.actions;

export default slice.reducer;

export const getDriverInfo = () =>
  createSelector(
    state => state.entities.driverInfo,
    driverInfo => driverInfo
  );
