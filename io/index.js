import http from 'http'
import socketIO from 'socket.io'
import setupMultiplayer from '../server/multiplayerConfig'
import setupSingleplayer from '../server/singleplayerConfig'
export default function () {
  this.nuxt.hook('render:before', (renderer) => {
    const server = http.createServer(this.nuxt.renderer.app)
    const io = socketIO(server)
    setupSingleplayer(io)
    setupMultiplayer(io)

    // overwrite nuxt.server.listen()
    this.nuxt.server.listen = (port, host) => new Promise(resolve => server.listen(port || process.env.PORT || 3000, process.env.HOST || 'localhost', resolve))
    // close this server on 'close' event
    this.nuxt.hook('close', () => new Promise(server.close))
  })
}
