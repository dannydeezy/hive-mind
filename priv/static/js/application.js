const host = 'hive-mind.xyz';
let mostRecentMessage = '';


function flashElement(id, attribute, color, originalColor) {
    const elem = document.getElementById(id)
    elem.style[attribute] = color
    setTimeout(() => {
        elem.style[attribute] = originalColor
    }, 100)
}
(() => {
    class myWebsocketHandler {
        vote(message) {
            mostRecentMessage = message;
            this.socket.send(
                JSON.stringify({
                    data: {message: message},
                })
            )
        }
        updateMessageDisplays() {
            const justMessages = sortedMessages(messages)
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
                if (m === mostRecentMessage) {
                    pTag.className += " messageSelected"
                }
                pTag.onclick = function() {
                    const input = document.getElementById("message")
                    input.value = m
                    websocketClass.vote(m)
                }
                main.append(pTag) 
            })
            for (let i=0; i < 10; i++) {
                main.append(document.createElement('br'))
            }
            /*
            var selected = document.getElementsByClassName( 'messageSelected' )
            if (selected.length > 0) {
                selected[0].documentOffsetTop() - ( main.innerHeight / 2 );
                main.scrollTo( 0, selected[0] );     
            }*/
        }
        handleMessage(message) {
            const legal = maybeSaveMessage(message)
            if (legal) {
                websocketClass.updateMessageDisplays()
                // localStorage.setItem('messages', JSON.stringify(messages))
            }
        }

        setupSocket() {
            this.socket = new WebSocket("wss://" + host +"/ws/chat")

            this.socket.addEventListener("message", (event) => {
                websocketClass.handleMessage(event.data)
            })

            this.socket.addEventListener("close", () => {
                websocketClass.setupSocket()
            })
        }

        submit(event) {
            event.preventDefault()
            const textEntryElem = document.getElementById("text-entry")
            flashElement("text-entry", "background-color", "rgba(255, 204, 0, 0.7)", 'rgba(70, 70, 70, 0.7)')
            const input = document.getElementById("message")
            const message = input.value
            if (isIllegal(message)) {
                if (message !== "") {
                    alert("Illegal Message! Special characters \\ / < > not allowed.")
                }
            }
            myCreations[message] = true
            this.vote(message)
            var main = document.getElementById("main")
            // main.scrollTop = main.scrollHeight
        }
    }
  
    const websocketClass = new myWebsocketHandler()
    websocketClass.setupSocket()
    const myCreations = {}
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
        } else if (event.keyCode === 27) {
            event.preventDefault();
            document.getElementById("message").value("")
            websocketClass.submit(event);
        }
    });
    document.getElementById("text-entry").onclick = function(event) {
        websocketClass.submit(event)
    }
    document.getElementById("message").onclick = function(event) {
        event.stopPropagation()
    }
    /*
    Element.prototype.documentOffsetTop = function () {
        return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop() : 0 );
    };*/
})()