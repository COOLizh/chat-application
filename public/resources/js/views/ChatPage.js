import DB from "../services/db.js"

// SPA
let ChatPage = {
    render: async () => {
        let view = `<div class="page-content">
        <div class="settings-chats-section">
            <div class="user-chats">
                <div class="search-and-settings">
                    <button class="settings">☰</button>
                    <input type="text" name="search" placeholder="Search..." id="search">
                </div>  
                <div class="chats">
                    <p id="zero-chats-message">You are not a member of any chat, create your own chat or find an already created chat by the chat name</p>
                </div>
                <div class="search-results">
                    <p>Users</p>
                    <div class="users">
                    </div>
                    <p>Chats</p>
                    <div class="chats">
                    </div>
                </div>
            </div>
            <div class="user-settings">
                <img src="resources/img/blue-arrow.jpg" alt="Back to chats" id="back-to-chat-button">
                <p class="username"></p>
                <img src="resources/img/unknown_male.png" alt="user-photo" id="user-photo">
                <p id="change-photo-button">Change photo</p>
                <p class="create-chat-button">Create chat</p>
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
    </div>
    <div class="mask" role="dialog" style="display:none;"></div>
    <div class="modal" role="alert" style="display:none;">
        <img src="resources/img/unknown_user.png" alt="default chat photo">
        <p>Change chat photo</p>
        <div class="chat-info-fields">
            <div>
                <input type="text" placeholder="Chat name" class="chat-name-input" required/>
                <input type="password" placeholder="Password" class="chat-password-input" requiered/>
            </div>
            <select class="chat-type-select">
                <option value="private">private</option>
                <option value="public">public</option>
            </select>
        </div>
        <input type="submit" value="Create chat" class="confirm-create-chat-button">
        <button class="close" role="button">X</button>
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

        //creating database object to work with database
        const database = new DB();

        //get current user information
        let currentUserInfo = await database.getUserInfo(currentUserId);

        const chatInfoSection = document.getElementById("chat-info");
        const correspondenceSection = document.querySelector(".correspondence");
        const userMessageInput = document.getElementById("message");
        const chatsContainer = document.querySelector(".chats");
        const startMessagingP = document.getElementById("start-correspondence-text");
        let zeroChatsMessage = document.createElement("p");
        zeroChatsMessage.id = "start-correspondence-text"
        zeroChatsMessage.style.display = "none";
        zeroChatsMessage.innerText = "There is no messages in this chat";
        correspondenceSection.appendChild(zeroChatsMessage);

        //function for displaying user messages
        let displayUserMessage = async function(userId, message) {
            let userInfo = await database.getUserInfo(userId);
            let userMessageSection = document.createElement("section");
            let userPhoto = document.createElement("img");
            userPhoto.src = userInfo.photoLink;
            userPhoto.classList.add("user-photo");
            let userMessage = document.createElement("span");
            userMessage.innerText = message;
            userMessage.classList.add("user-message")
            if(userId == firebase.auth().currentUser.uid) {
                userMessageSection.classList.add("temp-login-user-message");
            } else {
                userMessageSection.classList.add("temp-other-users-message");
            }
            userMessageSection.appendChild(userPhoto);
            userMessageSection.appendChild(userMessage);
            correspondenceSection.appendChild(userMessageSection);
        }

        firebase.database().ref("/users/" + currentUserId + "/chats").on("child_added", async (snapshot) => {
            document.getElementById("zero-chats-message").style.display = "none";
            let newChatId = snapshot.val();
            let newChatInfo = await database.getChatInfo(snapshot.val());
            let messages = newChatInfo.messages;
            let section = document.createElement("section");
            section.classList.add("chat");
            section.setAttribute.disabled = true;
            if(messages === undefined){
                section.innerHTML = `
                <input type="hidden" name="chat-id" value="${newChatId}">
                <p class="temp-chat-name">${newChatInfo.chatName}</p>
                <p class="temp-last-message">*No messages*</p>
                <img src="resources/img/unknown_user.png" alt="chat-photo" class="chat-photo">`
            } else {
                let userInfo = await database.getUserInfo(messages[messages.length - 1].userId);
                section.innerHTML = `
                <input type="hidden" name="chat-id" value="${newChatId}">
                <p class="temp-chat-name">${newChatInfo.chatName}</p>
                <p class="temp-last-message">${userInfo.name + " " + userInfo.surname + ": " + messages[messages.length - 1].messageText}</p>
                <img src="resources/img/unknown_user.png" alt="chat-photo" class="chat-photo">`
            }
            section.addEventListener('click', async (event) => {
                //filling chat info section
                event.preventDefault();
                startMessagingP.style.display = "none";
                correspondenceSection.innerHTML = '';
                let chatInfo = await database.getChatInfo(newChatId);
                let chatNameP = document.createElement("p");
                chatNameP.id = "chat-name";
                chatNameP.innerText = newChatInfo.chatName;
                let chatImg = document.createElement("img");
                chatImg.src = newChatInfo.chatPhotoLink;
                chatImg.alt = "chat-photo";
                let kindOfChatP = document.createElement("p");
                kindOfChatP.id = "kind-of-chat";
                kindOfChatP.innerText = newChatInfo.chatType;
                let membersP = document.createElement("p");
                membersP.id = "users-count";
                membersP.innerText = chatInfo.membersCount + " members";
                chatInfoSection.innerHTML = '';
                chatInfoSection.append(chatNameP);
                chatInfoSection.append(chatImg);
                chatInfoSection.append(kindOfChatP);
                chatInfoSection.append(membersP);

                currentChatId = newChatId;

                //displaying messages of chat
                if(messages === undefined){
                    zeroChatsMessage.style.display = "block";
                } else {
                    zeroChatsMessage.style.display = "none";
                    for(let mes of messages){
                        await displayUserMessage(mes.userId, mes.messageText)
                    }
                }
                userMessageInput.disabled = false;
            })
            chatsContainer.append(section);
            // firebase.database().ref("/chats/" + newChatId + "/messages").on("child_added", async (snapshot) => {
            //     const newMessage = snapshot.val();
            //     console.log(newMessage);
            //     await displayUserMessages(newMessage.userId, newMessage.messageText);
            // })
        })

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
            messageArea.value = "";
        });

        //when user press ☰, it will open to user settings button
        const userChatsSection = document.querySelector(".user-chats");
        const userSettingsSection = document.querySelector(".user-settings");
        const backToChatButton = document.getElementById("back-to-chat-button");
        
        document.querySelector(".settings").addEventListener("click", function(e) {
            e.preventDefault();
            userChatsSection.style.display = "none";
            userSettingsSection.style.display = "block";
        });
        backToChatButton.addEventListener("click", function(e) {
            e.preventDefault();
            userChatsSection.style.display = "block";
            userSettingsSection.style.display = "none";
        });

        //if user open settings and push create chat button modal window will be displayed
        let mask = document.querySelector(".mask");
        let modal = document.querySelector(".modal");
        document.querySelector(".username").textContent = currentUserInfo.username;
        document.querySelector(".create-chat-button").addEventListener("click", function(e) {
            mask.style.display = "block";
            modal.style.display = "block";
            mask.classList.add("active");
        })
        document.querySelector(".close").addEventListener("click", function(e){
            mask.classList.remove("active");
        })
        mask.addEventListener("click", function (e) {
            mask.classList.remove("active");
        })

        //listeners for modal create chat view
        let chatTypeSelector = document.querySelector(".chat-type-select");
        let chatPasswordInput = document.querySelector(".chat-password-input");
        chatTypeSelector.addEventListener("change", function (e) {
            if(chatTypeSelector.value == "public") {
                chatPasswordInput.style.display = "none";
            } else {
                chatPasswordInput.style.display = "block";
            }
        })
        document.querySelector(".confirm-create-chat-button").addEventListener("click", async function(e){
            let chatName = document.querySelector(".chat-name-input").value;
            let chatType = chatTypeSelector.value;
            chatName.trim();
            if(chatName == "") {
                alert("Chat name must be filled")
            } else {
                if(chatTypeSelector.value == "private" && chatPasswordInput.value == ""){
                    alert("Password at private chats must be filled")
                } else {
                    await database.createChat(currentUserId, chatName, chatType, chatPasswordInput.value);
                    mask.classList.remove("active");
                } 
            }
        })

        //seach-result by deafult is dispblay none
        const searchDiv = document.querySelector(".search-results");
        searchDiv.style.display = "none";
        const searchInput = document.getElementById("search");
        searchInput.addEventListener('input', function(e) {
            let val = e.target.value.trim();
            if (val.length) {
                searchDiv.style.display = "block";
                chatsContainer.style.display = "none";
            } else {
                searchDiv.style.display = "none";
                chatsContainer.style.display = "block";
            }
        });
    }
}

export default ChatPage