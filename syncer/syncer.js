const WebSocket = require('ws')
const fs = require('fs')
const jspath = '../priv/static/js'
const messagesFile = `${jspath}/messages.js`
let messages = JSON.parse(fs.readFileSync(messagesFile).toString().replace('const messages = ', ''))
const util = require(`${jspath}/message-util.js`)
const ws = new WebSocket('wss://localhost/ws/chat');

function localMaybeSaveMessage(message) {
    if (util.isIllegal(message)) return false;
    if (messages[message] && messages[message].votes) {
        messages[message].votes++
        messages[message].initTime = Date.now()
    } else {
        messages[message] = { votes: 1, initTime: Date.now() }
    }
    true;
}

ws.on('message', function incoming(data) {
    localMaybeSaveMessage(data)
});


ws.on('open', () => {
    console.log('Socket opened')
    setInterval(() => {
        const data = `const messages = ${JSON.stringify(messages)}`
        fs.writeFileSync(`${jspath}/messages.js`, data)
    }, 1000)
})

