import Debug from 'debug'
import parameters from '@/parameters'

const debug = Debug('app:initialization')
if (
  process.env.NODE_ENV === 'development' ||
  parameters.debugOptions.logs === true
) {
  Debug.enable('app*')

  // eslint-disable-next-line
  console.log('%cMusic Game', 'font-size:20px;color:#00e789;font-weight:bold')
  debug('parameters', parameters)
} else {
  Debug.disable()
  localStorage.removeItem('debug')
}
