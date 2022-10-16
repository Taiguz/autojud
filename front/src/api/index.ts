import axios from 'axios'
import { getToken } from '../utils'

// TODO: tratar isso melhor
const token = getToken()

const api = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 5000,
    headers: {'Authorization': `Bearer ${token}`}
})

api.interceptors.response.use(response => response, error => {
  if (error.response.status === 401){
    alert('Sua sessão expirou. Por favor faça login novamente.')
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    window.location.href = '/'
  }
  else return Promise.reject(error)
});
  

export default api