import client from "./client";

const send = (message, listingId) =>{
    return client.post("/messages",{
        message,
        listingId
    })
}

export default {
    send,
}