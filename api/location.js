import client from './client'

const update = (location) => client.post('/auth/location', location)

export default {
    update,
}