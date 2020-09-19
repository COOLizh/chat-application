import {database} from "../services/db.js"
import { displaySearchResults } from "../services/elementHelpers.js"
import * as listeners from "../services/listeners.js"

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
                    <div class="users-results">
                    </div>
                    <div class="chats-results">
                    </div>
                    <p id="nothing-found-text">Nothing found...</p>
                </div>
            </div>
            <div class="user-settings">
                <img src="resources/img/blue-arrow.jpg" alt="Back to chats" id="back-to-chat-button">
                <p class="name-and-surname"></p>
                <img src="resources/img/unknown_male.png" alt="user-photo" id="user-photo">
                <p id="change-photo-button">Change photo</p>
                <div class="change-username">
                    <p>Username: </p>
                    <input type="text" size="40" class="username">
                    <input type="submit" value="Edit" class="edit-username">
                </div>
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
                <img src="resources/img/sticker1.png" alt="sticker1" class="sticker">
                <img src="resources/img/sticker2.png" alt="sticker2" class="sticker">
                <img src="resources/img/sticker3.png" alt="sticker3" class="sticker">
                <img src="resources/img/sticker4.png" alt="sticker4" class="sticker">
                <img src="resources/img/sticker5.png" alt="sticker5" class="sticker">
                <img src="resources/img/sticker6.png" alt="sticker6" class="sticker">
                <img src="resources/img/sticker7.png" alt="sticker7" class="sticker">
                <img src="resources/img/sticker8.png" alt="sticker8" class="sticker">
                <img src="resources/img/sticker9.png" alt="sticker9" class="sticker">
                <img src="resources/img/sticker10.png" alt="sticker10" class="sticker">
                <img src="resources/img/sticker11.png" alt="sticker11" class="sticker">
                <img src="resources/img/sticker12.jpeg" alt="sticker11" class="sticker">
            </section>
        </div>
    </div>
    <div class="mask" role="dialog" style="display:none;"></div>
    <div class="modal" role="alert" style="display:none;">
        <div class="create-chat-modal">
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
        </div>
        <div class="enter-password-modal" style="display:none;">
            <input type="text" placeholder="Enter password..." id="input-private-password">
            <input type="submit" value="OK" id="confirm-input-password">
        </div>
        <button class="close" role="button">X</button>
    </div>`
        return view
    },
    after_render: async () => {

        console.log(await database.getAllUsersIds())

        //changing title and css
        document.getElementById("css-tag").href = "resources/css/chat.css";
        document.title = "CoolChat messaging";

        //get current user id for loading data and etc.
        const currentUserId = firebase.auth().currentUser.uid;

        //cariable for current chat id
        const currentChatId = { id: "" };

        //creating database object to work with database
        // const database = new DB();

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

        firebase.database().ref("/users/" + currentUserId + "/chats").on("child_added", async (snapshot) => {
            await listeners.handleNewChat(
                snapshot, 
                chatInfoSection,
                correspondenceSection,
                userMessageInput,
                chatsContainer,
                startMessagingP,
                currentChatId
            )

            firebase.database().ref("/chats/" + snapshot.val() + "/messages").on("child_added", async (snapshot) => {
                await listeners.handleNewMessage(
                    snapshot, 
                    currentChatId, 
                    correspondenceSection
                )
            })
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
            database.setChatMessage(currentUserId, currentChatId.id, message, "text");
            messageArea.value = "";
        });

        //when user press ☰, it will open to user settings button
        const userChatsSection = document.querySelector(".user-chats");
        const userSettingsSection = document.querySelector(".user-settings");
        const backToChatButton = document.getElementById("back-to-chat-button");
        const nameAndSurname = document.querySelector(".name-and-surname")
        nameAndSurname.innerText = currentUserInfo.name + " " + currentUserInfo.surname
        const usernameField = document.querySelector(".username")
        usernameField.value = currentUserInfo.username
        usernameField.disabled = true
        const editUsername = document.querySelector(".edit-username")
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
                    await database.createChat([currentUserId], chatName, chatType, chatPasswordInput.value);
                    mask.classList.remove("active");
                } 
            }
        })

        //seach-result by deafult is dispblay none
        const searchDiv = document.querySelector(".search-results");
        searchDiv.style.display = "none";
        const searchInput = document.getElementById("search");
        const usersSearchDiv = document.querySelector(".users-results")
        const chatsSearchDiv = document.querySelector(".chats-results")
        const createChatModal = document.querySelector(".create-chat-modal")
        const enterPasswordModal = document.querySelector(".enter-password-modal")
        searchInput.addEventListener('input', async function(e) {
            const notFoundText = document.getElementById("nothing-found-text")
            notFoundText.style.display = "none"
            usersSearchDiv.innerHTML = ''
            chatsSearchDiv.innerHTML = ''
            let val = e.target.value.trim();
            if (val.length) {
                searchDiv.style.display = "block";
                chatsContainer.style.display = "none";
            } else {
                searchDiv.style.display = "none";
                chatsContainer.style.display = "block";
            }
            let searchResults = await database.getSearchResults(currentUserId ,val)
            console.log(searchResults)
            if(searchResults.users.length == 0 && searchResults.chats.length == 0){
                notFoundText.style.display = "block"
            } else {
                displaySearchResults(searchResults, usersSearchDiv, chatsSearchDiv, searchDiv,
                    chatsContainer, createChatModal, enterPasswordModal, mask, modal)
            } 
        });

        //clicking on sticker
        const stickers = document.getElementsByClassName("sticker")
        for(let sticker of stickers) {
            sticker.addEventListener("click", async function(e) {
                e.preventDefault()
                await database.setChatMessage(currentUserId, currentChatId.id, sticker.src, "sticker")
            })
        }
    }
}

export default ChatPage