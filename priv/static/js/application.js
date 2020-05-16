const expireTime = 1000 * 60 * 5; // 5 minutes;
(() => {
    class myWebsocketHandler {

        vote(message) {
            console.log('voting')
            this.socket.send(
                JSON.stringify({
                    data: {message: message},
                })
            )
        }
        updateMessageDisplays() {
            // Clear outdated ones first
            for (const message of Object.keys(messages)) {
                if (Date.now() - messages[message].initTime > expireTime) {
                    delete messages[message]
                }
            }
            const justMessages = Object.keys(messages)
            justMessages.sort((a,b) => messages[b].votes - messages[a].votes)
            const main = document.getElementById("main")
            main.innerHTML = "<br><br><br>"
            justMessages.forEach((m, rank) => {
                const pTag = document.createElement("p")
                if (rank <= 4) {
                    pTag.id=`rank-${rank}`
                } else {
                    pTag.id=`rank-low`
                }
                pTag.innerHTML = `${m}<sup class=smalltext> (${messages[m].votes})</sup><br><br>`
                pTag.className = "entry"
                if (myCreations[m]) pTag.className += " mycreation"
                const self = this
                console.log('setting onclick')
                pTag.onclick = function() {
                    websocketClass.vote(m)
                }
                main.append(pTag) 
            })
            for (let i=0; i < 10; i++) {
                main.append(document.createElement('br'))
            }
        }
        isIllegal(message) {
            return message === "" || message.length > 200 || message.includes("\\") || message.includes(">")
            || message.includes("<") || message.includes("/")
        }
        handleMessage(message) {
            if (this.isIllegal(message)) return
            if (messages[message] && messages[message].votes) {
                messages[message].votes++
            } else {
                messages[message] = { votes: 1, initTime: Date.now() }
            }
            this.updateMessageDisplays()
            localStorage.setItem('messages', JSON.stringify(messages))
        }

        setupSocket() {
            this.socket = new WebSocket("ws://localhost:4000/ws/chat")

            this.socket.addEventListener("message", (event) => {
                this.handleMessage(event.data)
            })

            this.socket.addEventListener("close", () => {
                this.setupSocket()
            })
        }

        submit(event) {
            event.preventDefault()
            const input = document.getElementById("message")
            const message = input.value
            input.value = ""
            if (this.isIllegal(message)) {
                if (message !== "") {
                    alert("Illegal Message! Special characters \\ / < > not allowed.")
                }
            }
            myCreations[message] = true
            this.vote(message)
            var main = document.getElementById("main")
            console.dir(main.scrollHeight)
            main.scrollTop = main.scrollHeight
        }
    }
  
    const websocketClass = new myWebsocketHandler()
    websocketClass.setupSocket()
    const myCreations = {}
    const currentData = JSON.parse(localStorage.getItem('messages'))
    const messages = currentData || {}
    websocketClass.updateMessageDisplays()

    setInterval(function() {
        websocketClass.updateMessageDisplays()
    }, 5000)

    var input = document.getElementById("message");
    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        // Trigger the button element with a click
        websocketClass.submit(event);
    }
    });
  })()