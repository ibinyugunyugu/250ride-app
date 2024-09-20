import client from "./client";

const endpoint = "/requests";

const availableRequests = () => client.get(endpoint+'/available');
const getRequests = () => client.get(endpoint);
const cancelRequest = (reqId) => client.delete(endpoint+'/'+reqId);
const getRequest = (reqId) => client.get(endpoint+'/'+reqId);
const createAlert = (request) => client.post(endpoint+'/alert', {...request});
const searchRequest = (request) => client.post(endpoint+'/search', {...request});
const approveRequest = (reqId) => client.put(endpoint+'/approve', {reqId});
const declineRequest = (reqId) => client.put(endpoint+'/decline', { reqId});
const payRide = (reqId,payOption,phoneNumber) => client.post(endpoint+'/payment', { reqId,payOption,...phoneNumber});
const rateDriver = (reqId,rating) => client.post(endpoint+'/rateDriver', { reqId,rating});

export default {
  availableRequests,
  getRequests,
  getRequest,
  cancelRequest,
  createAlert,
  searchRequest,
  approveRequest,
  declineRequest,
  payRide,
  rateDriver
};
