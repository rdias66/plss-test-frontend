import axios from 'axios'

const baseURL = '/'

export const apiFrontend = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})
