import { WebHost, log } from '@microsoft/mixed-reality-extension-sdk'

import { resolve as resolvePath } from 'path'

import App from './app'

process.on('uncaughtException', err => console.log('uncaughtException', err))
process.on('unhandledRejection', reason => console.log('unhandledRejection', reason))

log.enable('app')

// Start listening for connections, and serve static files
const server = new WebHost({
    baseDir: resolvePath(__dirname, '../public')
});

server.adapter.onConnection(context => new App(context, server.baseUrl))

export default server