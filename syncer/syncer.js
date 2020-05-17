const WebSocket = require('ws')
const fs = require('fs')
const jspath = '../priv/static/js'
const messagesFile = `${jspath}/messages.js`
const messages = JSON.parse(fs.readFileSync(messagesFile).toString().replace('const messages = ', ''))
const util = require(`${jspath}/message-util.js`)
const ws = new WebSocket('ws://localhost:80/ws/chat', { perMessageDeflate: false });

ws.on('message', function incoming(data) {
    util.maybeSaveMessage(messages, data)
});

setInterval(() => {
    const data = `const messages = ${JSON.stringify(messages)}`
    fs.writeFileSync(`${jspath}/messages.js`, data)
}, 1000)