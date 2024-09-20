import client from "./client";

const endpoint = "/places";

const getPlaces = () => client.get(endpoint);

export default {
  getPlaces,
};
