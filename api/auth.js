import client from './client'

const login = (data) => client.post('/auth/login', {...data})
const signupRider = (data) => client.post('/auth/signupRider', data)
const signupDriver = (data) => client.post('/auth/signupDriver', data)

export default {
    login,
    signupRider,
    signupDriver
}