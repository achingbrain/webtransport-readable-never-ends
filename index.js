import { server } from './server.js'
import { client } from './client.js'

const connectionDetails = await server()

await client(connectionDetails)
