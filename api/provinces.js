import client from "./client";

const endpoint = "/provinces";

const getProvinces = () => client.get(endpoint);

export default {
  getProvinces,
};
