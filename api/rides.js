import client from "./client";

const endpoint = "/rides";

const availableRides = () => client.get(endpoint+'/available');
const getRides = () => client.get(endpoint);

const addRide = (ride) => client.post(endpoint, {...ride});
const bookRide = (rideId,seats) => client.post(endpoint+'/book', {rideId,seats});
const viewRide = (rideId) => client.post(endpoint+'/view', {rideId});
const deleteRide = (rideId) => client.delete(endpoint+'/'+rideId);
const driverLocation = (rideId) => client.get(endpoint+'/'+rideId);
const startStopRide = (rideId) => client.post(endpoint+'/startStopRide', {rideId});
const searchRide = (ride) => client.post(endpoint+'/search', {...ride});
const updateRide = (rideId,ride) => client.put(endpoint+'/'+rideId, {...ride});
const nearByPickup = () => client.get(endpoint+'/nearByPickup');

export default {
  addRide,
  bookRide,
  getRides,
  availableRides,
  deleteRide,
  searchRide,
  updateRide,
  viewRide,
  driverLocation,
  nearByPickup,
  startStopRide
};
