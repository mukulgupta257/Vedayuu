import axios from 'axios';
export default function setAuthorizationToken(token,user,key,type) {
    if (token || user || key || type) {
        axios.defaults.headers.common['Authorization'] = `${token}`;
        axios.defaults.headers.common['User-Code'] = `${user}`;
        axios.defaults.headers.common['Auth-Key'] = `${key}`;
        axios.defaults.headers.common['otp-type'] = `${type}`;
        console.log('headers',axios.defaults.headers)
    }
    else {
        delete axios.defaults.headers.common['Authorization'];
        delete axios.defaults.headers.common['User-Code'];
        delete axios.defaults.headers.common['Auth-Key'];
        delete axios.defaults.headers.common['otp-type'];
        delete axios.defaults.headers.common['content-type'];
        console.log('headers',axios.defaults.headers)
    }
}

