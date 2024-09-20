import client from './client';

const register = (pushToken) => client.post('/auth/expoPushToken', {token:pushToken});


export default {
    register,
}