# SSB Browser Choo

A fairly smaall boilerplate that creates a single-site application that connects to a locally running ssb-server. The secret file is loaded via an html `input` element. Uses the choo framework.

To build, run `npm run build`, then point an http-server to this directory. This only works while an ssb-server is running locally that exposes a websocket at port 8989.
