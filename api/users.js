import client from "./client";

const resendSms = () => client.get("/auth/resendSms");
const verifySms = (code) => client.post("/auth/verifySms", code);
const saveLocation = (locationData) => client.post("/auth/location", locationData);
const switchAccount = () => client.post("/auth/switchAccount");
const deactivateAccount = () => client.post("/auth/deactivateAccount");
const updateProfile = ({...info}) => client.post("/auth/updateProfile",{...info});
const sendMessage = (code) => client.post("/auth/sendMessage", code);

export default { resendSms, verifySms, saveLocation, switchAccount, updateProfile, deactivateAccount,sendMessage };
