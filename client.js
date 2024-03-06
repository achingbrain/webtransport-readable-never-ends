import { WebTransport } from '@fails-components/webtransport'

export async function client ({ address, serverCertificateHashes }) {
  console.info('CLIENT create session')
  const transport = new WebTransport(address, {
    serverCertificateHashes
  })

  console.info('CLIENT wait for session ready')
  await transport.ready
  console.info('CLIENT session ready')

  console.info('CLIENT create bidi stream')
  const stream = await transport.createBidirectionalStream()
  const reader = stream.readable.getReader()

  while (true) {
    console.info('CLIENT read from stream')
    const res = await reader.read()

    console.info('CLIENT got from stream', res)

    if (res.done) {
      console.info('CLIENT read stream finished')
      break
    }

    console.info('CLIENT got value', res.value)
  }
}
