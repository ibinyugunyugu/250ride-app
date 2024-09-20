import client from "./client";

const endpoint = "/cars";

const getApprovedCars = () => client.get(endpoint+'/approved');
const getAllCars = () => client.get(endpoint);
const addCar = (carInfo) => client.post(endpoint, carInfo);
const updateCar = (carInfo) => client.put(endpoint, carInfo);
const deleteCar = (carId) => client.delete(endpoint+'/'+carId);
 
export default {
  getAllCars,
  getApprovedCars,
  addCar,
  updateCar,
  deleteCar
};
