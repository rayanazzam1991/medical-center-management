import axios, {AxiosInstance} from 'axios'


import {useNotyf} from "/@src/composable/useNotyf";
import {useAuth} from "/@src/stores/Others/User/authStore";

let api: AxiosInstance
const notyf = useNotyf()

export function createApi() {
  // Here we set the base URL for all requests made to the api
  api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  })

  // We set an interceptor for each request to
  // include Bearer token to the request if user is logged in
  api.interceptors.request.use(
    (config) => {
      const userAuth = useAuth()

      if (userAuth.isLoggedIn) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${userAuth.token}`,
        }
      }

      return config
    },
    (err) => {
      if (err.message == 'Network Error')
        { // @ts-ignore
          notyf.error({
                    message: 'Connection error! Please try again later',
                    duration: 5000,
                  })
        }
      return Promise.reject(err)
    }
  )

  return api
}

export function useApi() {
  if (!api) {
    createApi()
  }
  return api
}
