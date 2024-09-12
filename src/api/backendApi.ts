import axios from 'axios'

export const backendApi = axios.create({
  baseURL: 'https://api.rdias66.codes',
  maxBodyLength: 2.5 * 1024 * 1024 * 1024,
  timeout: 20 * 60 * 1000,
})
export interface ApiError {
  errorMessage: string
  status: number
}
