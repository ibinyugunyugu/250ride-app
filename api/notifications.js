import client from "./client";

const endpoint = "/notifications";

const getNotifications = () => client.get(endpoint);
const clearNotifications = () => client.get(endpoint+'/clear');
const deleteNotification = (notyId) => client.delete(endpoint+'/'+notyId);

export default {
  getNotifications,
  deleteNotification,
  clearNotifications
};
