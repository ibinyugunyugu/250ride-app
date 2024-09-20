const settings = {
    dev:{
        apiUrl: 'http://10.5.6.45:8000/api',
        host: 'http://10.5.6.45:8000/',
    },
    staging:{
        apiUrl: 'https://250ride.optimawarehouse.rw/api',
        host: 'https://250ride.optimawarehouse.rw/',
    },
    prod:{
        apiUrl: 'https://250ride.rw/api',
        host: 'https://250ride.rw/',
    }
} 

const getCurrentSettings = () => {
    return settings.prod;
}

export default getCurrentSettings();