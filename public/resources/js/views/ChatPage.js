import DB from "../services/db.js"

// SPA
let ChatPage = {
    render: async () => {
        let view = `<div class="page-content">
        <div class="settings-chats-section">
            <div class="search-and-settings">
                <button class="settings">☰</button>
                <input type="text" name="search" placeholder="Search...">
            </div>  
            <div class="chats">
                <p id="zero-chats-message">You are not a member of any chat, create your own chat or find an already created chat by the chat name</p>
            </div>
        </div>
        <div class="correspondence-section">
            <section id="chat-info">
                  <h2>CoolChat</h2>
                  <img src="resources/img/chat-logo.jpg" alt="CoolChat logo" id="chat-logo">
            </section>
            <div class="container">
                <div class="correspondence">
                    <p id="start-correspondence-text">Select chat to start messaging...</p>
                </div>
            </div>
            <section class="text-area">
                <input type="text" name="message" id="message" placeholder="Enter message..." disabled>
            </section>
        </div>
        <div class="stickers-section">
            <p>Stickers</p>
            <section class="stickers">
                <img src="resources/img/sticker1.png" alt="sticker1">
                <img src="resources/img/sticker2.png" alt="sticker2">
                <img src="resources/img/sticker3.png" alt="sticker3">
                <img src="resources/img/sticker4.png" alt="sticker4">
                <img src="resources/img/sticker5.png" alt="sticker5">
                <img src="resources/img/sticker6.png" alt="sticker6">
                <img src="resources/img/sticker7.png" alt="sticker7">
                <img src="resources/img/sticker8.png" alt="sticker8">
                <img src="resources/img/sticker9.png" alt="sticker9">
                <img src="resources/img/sticker10.png" alt="sticker10">
                <img src="resources/img/sticker11.png" alt="sticker11" id="last-sticker">
            </section>
        </div>
    </div>`
        return view
    },
    after_render: async () => {

        //changing title and css
        document.getElementById("css-tag").href = "resources/css/chat.css";
        document.title = "CoolChat messaging";

        //get current user id for loading data and etc.
        const currentUserId = firebase.auth().currentUser.uid;

        //cariable for current chat id
        let currentChatId = "";

        //check user chats and display information at chat page
        const database = new DB();
        const userChats = await database.getUserChats(currentUserId);
        const container = document.querySelector(".chats");
        if(userChats != null){
            //clearing list chats section
            container.innerHTML = '';

            //adding chats to chat list at left side of page
            for(const elem of userChats){
                const section = document.createElement("section");
                section.classList.add("chat");
                section.setAttribute.disabled = true
                section.innerHTML = `
                <input type="hidden" name="chat-id" value="${elem.chatId}">
                <p class="temp-chat-name">${elem.chatName}</p>
                <p class="temp-last-message">LastUser: message</p>
                <img src="resources/img/unknown_user.png" alt="chat-photo" class="chat-photo">`
                container.appendChild(section);
            }
        }

        //creating function to display user messages
        let displayUserMessages = function(userId, message, block) {
            const section = document.createElement("section");
            if(userId == currentUserId) {
                section.classList.add("temp-login-user-message");
                section.innerHTML = `
                    <img src="resources/img/unknown_male.png" alt="user-photo" class="user-photo">
                    <span class="user-message">${message}</span>
                    <p class="message-status">✓✓</p>
                `;
            } else {
                section.classList.add("temp-other-users-message");
                section.innerHTML = `
                    <img src="resources/img/unknown_male.png" alt="user-photo" class="user-photo">
                    <span class="user-message">${message}</span>
                    <p class="message-status">✓✓</p>
                `;
            }
            block.appendChild(section);
        }


        //adding event listeners to chat list
        var chatList = document.querySelectorAll(".chat");
        for(let i = 0; i < chatList.length; i++){
            chatList[i].addEventListener('click', async (event) => {
                event.preventDefault();
                //changing current chat id
                currentChatId = chatList[i].childNodes[1].value;

                //making text message is abled
                document.getElementById("message").disabled = false;

                //changing information about chat
                let chatInfo = await database.getChatInfo(currentChatId);
                const sectionParent = document.getElementById("chat-info");
                let chatNameP = document.createElement("p");
                chatNameP.id = "chat-name";
                chatNameP.innerText = chatInfo.chatName;
                let chatImg = document.createElement("img");
                chatImg.src = "resources/img/unknown_user.png";
                chatImg.alt = "chat-photo";
                let kindOfChatP = document.createElement("p");
                kindOfChatP.id = "kind-of-chat";
                kindOfChatP.innerText = "public";
                let membersP = document.createElement("p");
                membersP.id = "users-count";
                membersP.innerText = chatInfo.membersCount + " members";
                sectionParent.innerHTML = '';
                sectionParent.append(chatNameP);
                sectionParent.append(chatImg);
                sectionParent.append(kindOfChatP);
                sectionParent.append(membersP);

                //clearing chat section
                const sectionCorrespondence = document.querySelector(".correspondence");
                sectionCorrespondence.innerHTML = '';

                //set messages to chat section
                let chatMessages = await database.getChatMessages(currentChatId);
                const block = document.querySelector(".correspondence")
                const container = document.querySelector(".container");
                for(let elem of chatMessages) {
                    displayUserMessages(elem.userId, elem.messageText, block);
                }
                container.scrollTop = container.scrollHeight;
            });
        }

        //when user press enter, message will be send
        window.addEventListener ("keypress", function (e) {
            if (e.keyCode !== 13) return;
            const [block, messageArea] = [...document.querySelectorAll(".correspondence, #message")];
            let message = messageArea.value;
            message = message.trim();
            if(message == ""){
                messageArea.value = "";
                return;
            }
            database.setChatMessage(currentUserId, currentChatId, message);
            displayUserMessages(currentUserId, message, block);
            messageArea.value = "";
        });

    }
}

export default ChatPage