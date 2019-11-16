import parameters from '@/parameters'
import querystring from 'querystring'
import ConnectionLib from './ConnectionLib'
const debug = require('debug')('app:SpotifyLib')

const _generateSignUpUrl = () => {
  const clientId = parameters.spotify.clientId
  const scopes = [
    'user-read-playback-state',
    'user-read-currently-playing',
    'user-modify-playback-state'
  ]
  const spotifyAuthorize = 'https://accounts.spotify.com/authorize'
  const redirectUri = parameters.spotify.callbackUrl
  const queryParams = {
    response_type: 'token',
    client_id: clientId,
    scope: scopes.join(' '),
    redirect_uri: redirectUri
  }
  const url = `${spotifyAuthorize}?${querystring.stringify(queryParams)}`
  return url
}
const signUp = () => {
  debug('signUp')
  const url = _generateSignUpUrl()
  debug('RedirectTo:', url)
  window.location = url
}

const pause = (token) => {
  debug('Pause', { token })
  const url = 'https://api.spotify.com/v1/me/player/pause'
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return ConnectionLib.put(url, null, headers)
}

const resume = (token) => {
  debug('Resume', { token })
  const url = 'https://api.spotify.com/v1/me/player/play'
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return ConnectionLib.put(url, null, headers)
}
const songInfo = (token) => {
  debug('songInfo', { token })
  const url = 'https://api.spotify.com/v1/me/player'
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return ConnectionLib.get(url, headers)
}
const nextSong = (token) => {
  debug('nextSong', { token })
  const url = 'https://api.spotify.com/v1/me/player/next'
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return ConnectionLib.post(url, null, headers)
}

export default {
  signUp,
  pause,
  resume,
  songInfo,
  nextSong
}
