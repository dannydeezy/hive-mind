const WebSocket = require('ws')
const fs = require('fs')
const jspath = '../priv/static/js'
const messagesFile = `${jspath}/messages.js`
let messages = JSON.parse(fs.readFileSync(messagesFile).toString().replace('const messages = ', ''))
const util = require(`${jspath}/message-util.js`)

function localMaybeSaveMessage(message) {
    if (util.isIllegal(message)) return false;
    if (messages[message] && messages[message].votes) {
        messages[message].votes++
        messages[message].initTime = Date.now()
    } else {
        messages[message] = { votes: 1, initTime: Date.now() }
    }
}

function begin() {
    const ws = new WebSocket('wss://localhost/ws/chat');
    ws.on('open', () => {
        console.log('Socket opened')
        ws.on('message', function incoming(data) {
            localMaybeSaveMessage(data)
        });
        
        ws.on('close', () => {
            console.log('socket closed')
            setTimeout(begin, 1)
        })

        ws.on('error', () => {
            console.log('socket error')
            setTimeout(begin, 1)
        })
        setInterval(() => {
            const data = `const messages = ${JSON.stringify(messages)}`
            fs.writeFileSync(`${jspath}/messages.js`, data)
            // messages = util.removeOldMessages(messages)
        }, 1000)
    })
}

begin()