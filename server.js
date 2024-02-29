import { Http3Server } from '@fails-components/webtransport'
import { generateWebTransportCertificates } from './certificate.js'

export async function server () {
  const certificates = await generateWebTransportCertificates([{
    // can be max 14 days according to the spec
    days: 13
  }])

  const server = new Http3Server({
    port: 0,
    host: '0.0.0.0',
    secret: certificates[0].secret,
    cert: certificates[0].pem,
    privKey: certificates[0].privateKey
  })

  await server.startServer()
  await server.ready

  Promise.resolve().then(async () => {
    const sessionStream = server.sessionStream('/')
    const sessionReader = sessionStream.getReader()

    while (true) {
      const { done, value: session } = await sessionReader.read()

      if (done) {
        console.info('session reader finished')
        break
      }

      console.info('SERVER new incoming session')
      void Promise.resolve()
        .then(async () => {
          try {
            await session.ready
            console.info('SERVER session ready')

            const bidiStreamReader = session.incomingBidirectionalStreams.getReader()

            while (true) {
              const result = await bidiStreamReader.read()

              if (result.done) {
                break
              }

              console.info('SERVER new incoming bidi stream')

              const stream = result.value
              const writer = stream.writable.getWriter()

              console.info('SERVER await writable ready')
              await writer.ready

              // n.b the WebTransport spec recommends not awaiting the promise
              // returned from .write - https://www.w3.org/TR/webtransport/#example-sending-stream
              console.info('SERVER write to writable')
              writer.write(Uint8Array.from([0, 1, 2, 3])).catch(err => {
                console.info('error writing to stream', err)
              })

              console.info('SERVER close writeable')
              await writer.close()
              console.info('SERVER closed writeable')
            }
          } catch (err) {
            console.error('SERVER session error', err)
          }
        })
      }
  })

  return {
    address: `https://127.0.0.1:${server.address()?.port}`,
    serverCertificateHashes: certificates.map(cert => ({
      algorithm: 'sha-256',
      value: cert.hash.digest
    }))
  }
}
