import axios from 'axios'
const debug = require('debug')('app:ConnectionLib')

const get = async (url, headers = {}) => {
  debug('GET', { url, headers })
  const response = await axios.get(url, { headers })
  debug('GET Response:', response)
  return response.data
}

const put = async (url, body, headers) => {
  debug('PUT', { url, body, headers })
  const response = await axios.put(url, body, { headers })
  debug('PUT Response:', response)
  return response.data
}
const post = async (url, body, headers = {}) => {
  debug('POST', { url, body, headers })
  const response = await axios.post(url, body, { headers })
  debug('POST Response:', response)
  return response.data
}

export default {
  get,
  put,
  post
}
