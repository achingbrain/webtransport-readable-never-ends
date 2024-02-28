# WebTransport readable never ends

Uses the `@fails-components/webtransport` module to create a WebTransport server
that accepts incoming bidirectional streams.

Sends a chunk of data to the client, then closes the outgoing writable but the
incoming readable never closes.

## Usage

Clone this repo then:

* Run `npm i`
* Run `npm start`
* Let the example run, you should see something like:

```console
% npm start

> webtransport-readable-never-ends@1.0.0 start
> node index.js

CLIENT create session
SERVER new incoming session
SERVER session ready
CLIENT session ready
CLIENT create bidi stream
CLIENT read from stream
SERVER close writeable
CLIENT got from stream { value: Uint8Array(4) [ 0, 1, 2, 3 ], done: false }
CLIENT read from stream
```

The server writes a buffer, then closes the writable end of the stream.

At the client end the readable never ends. If it did, you would expect to see:

```console
% npm start

> webtransport-readable-never-ends@1.0.0 start
> node index.js

CLIENT create session
SERVER new incoming session
SERVER session ready
CLIENT session ready
CLIENT create bidi stream
CLIENT read from stream
SERVER close writeable
CLIENT got from stream { value: Uint8Array(4) [ 0, 1, 2, 3 ], done: false }
CLIENT read from stream
CLIENT got from stream { done: true }
CLIENT read stream finished
```

To see the code running successfully in a browser run `npm run browser`:

```console
% npm run browser

> webtransport-readable-never-ends@1.0.0 browser
> node browser.js


Paste the following code into https://codepen.io or simmilar:

(async function main ()  {
  console.info('CLIENT create session')

  //...JavaScript here
})()
```

Paste the emitted code into [https://codepen.io](https://codepen.io) or
otherwise run it in a browser and observe the output:

```
"CLIENT create session"
"CLIENT session ready"
"CLIENT create bidi stream"
"CLIENT read from stream"
"CLIENT got from stream" // [object Object]
{
  "done": false,
  "value": {
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3
  }
}
"CLIENT read from stream"
"CLIENT got from stream" // [object Object]
{
  "done": true,
  "value": undefined
}
"CLIENT read stream finished"
```
