import DB from "../services/db.js"

// SPA
let ChatPage = {
    render: async () => {
        let view = `<div class="page-content">
        <div class="settings-chats-section">
            <div class="user-chats">
                <div class="search-and-settings">
                    <button class="settings">☰</button>
                    <input type="text" name="search" placeholder="Search...">
                </div>  
                <div class="chats">
                    <p id="zero-chats-message">You are not a member of any chat, create your own chat or find an already created chat by the chat name</p>
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

        //check user chats and display them if exists
        const userChats = await database.getUserChats(currentUserId);
        const container = document.querySelector(".chats");
        if(userChats != null){
            //clearing list chats section
            container.innerHTML = '';

            //adding chats to chat list at left side of page
            for(const elem of userChats){
                const section = document.createElement("section");
                section.classList.add("chat");
                section.setAttribute.disabled = true;
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
                `;
            }
            block.appendChild(section);
        }

        //creating function to refresh chat list
        let refreshChatsList = function(){
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
                    if(chatMessages != null){
                        for(let elem of chatMessages) {
                            displayUserMessages(elem.userId, elem.messageText, block);
                        }
                    }
                    container.scrollTop = container.scrollHeight;
                });
            }
        }
        //refreshing chat list
        refreshChatsList();

        //setting listener to new user chats
        database.addListenerToUserChats(currentUserId, container, refreshChatsList);

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
    }
}

export default ChatPage