import axios from "axios"

const api = axios.create({
    baseURL: 'https://api.escavador.com/api/v1/',
    headers: {
        'Authorization': `Bearer ${process.env.TOKEN}`,
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

export default api