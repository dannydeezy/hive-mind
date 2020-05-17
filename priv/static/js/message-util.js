const expireTime = 1000 * 60 * 5;

function removeOldMessages() {
    // Clear outdated ones first
    for (const message of Object.keys(messages)) {
        if (Date.now() - messages[message].initTime > expireTime) {
            delete messages[message]
        }
    }
}

function sortedMessages() {
    const justMessages = Object.keys(messages)
    return justMessages.sort((a,b) => messages[b].votes - messages[a].votes)
}

function isIllegal(message) {
    return message === "" || message.length > 200 || message.includes("\\") || message.includes(">")
    || message.includes("<") || message.includes("/")
}

function maybeSaveMessage(message) {
    if (isIllegal(message)) return false;
    if (messages[message] && messages[message].votes) {
        messages[message].votes++
    } else {
        messages[message] = { votes: 1, initTime: Date.now() }
    }
    return true;
}