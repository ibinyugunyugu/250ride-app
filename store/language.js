import { createSelector, createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "languages",
    initialState: {
        activeLanguage:0
    },
    reducers:{
        changeLanguage: (languages, action) => {
            languages.activeLanguage = action.payload.id
        }
    }
})

export const {changeLanguage} = slice.actions;

export default slice.reducer;

export const getLanguage = () =>
  createSelector(
    state => state.entities.languages,
    languages => languages.activeLanguage
  );
// store.dispatch(actions.bugAdded({description: "Bug 1"}))