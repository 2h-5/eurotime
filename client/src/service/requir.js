import axios from 'axios'

export function request(config) {
  const instance = axios.create({
    baseURL:  "http://localhost:3000",
    timeout: 10000
  })

  instance.interceptors.request.use(config => {
      config.headers.Authorization=window.sessionStorage.getItem('token')
    return config
  }, err => {
    console.log(err);
  })

  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err);
  })

  console.log(config);
  return instance(config)
}
