import client from "./client";

const upload = (plot, onUploadProgress) => {
    const data = new FormData();
    data.append("location", plot.location);
    data.append("name", plot.name);
    data.append("street", plot.street);
    data.append("region", plot.region);
    data.append("video", {
        name: plot.fileName,
        type: "video/mp4",
        uri: plot.videoUri,
    })
    return client.post("/plots", data, {
      onUploadProgress: (progress) =>
        onUploadProgress(progress.loaded / progress.total),
    });
};

const getPlots = () => client.get("/plots");

export default { getPlots, upload };
