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
                <img src="resources/img/unknown_male.png" class="profile-photo" alt="user-photo" id="user-photo">
                <div class="input_file">
                    <label for="file" class="file_label">
                        <i class="fa fa-upload" aria-hidden="true"></i>
                        Select Your Photo
                    </label>
                    <input id="file" name="file" type="file">
                </div>
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
            <div class="text-area">
                <p id="user-is-typing-indicator"></p>
                <input type="text" name="message" id="message" placeholder="Enter message..." disabled>
                <img src="resources/img/smile.jpg" alt="Stickers" id="stickers-mobile" style="display: none">
            </div>
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
        <form class="create-chat-modal">
            <img src="resources/img/unknown_user.png" alt="default chat photo" id="create-chat-photo">
            <div class="input_file">
                <label for="file_chat" class="file_label">
                    <i class="fa fa-upload" aria-hidden="true"></i>
                    Select Chat Photo
                </label>
                <input id="file_chat" type="file" name="file">
            </div>
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
        </form>
        <div class="enter-password-modal" style="display:none;">
            <input type="text" placeholder="Enter password..." id="input-private-password">
            <input type="submit" value="OK" id="confirm-input-password">
        </div>
        <div class="stickers-mobile-modal" style="display: none;">
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
        </div>
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
        const currentChatId = { id: "" };

        //document.getElementById("stickers-mobile").style.display = "block"

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
                    correspondenceSection,
                    dociment.querySelector(".container")
                )
            })

            firebase.database().ref("/chats/" + snapshot.val() + "/typingUser").on("value", (username) => {
                console.log(username.val())
                console.log(currentUserInfo.username)
                console.log(username.ref.path.pieces_[1])
                console.log(currentChatId.id)
                if (username.ref.path.pieces_[1] == currentChatId.id && username.val() != currentUserInfo.username) {
                    if (username.val() != "") {
                        document.getElementById("user-is-typing-indicator").innerText = username.val() + " is typing..."
                    } else {
                        document.getElementById("user-is-typing-indicator").innerText = ""
                    }
                }
            }) 
        })

        const userPhoto = document.getElementById("user-photo")
        firebase.database().ref("/users/" + firebase.auth().currentUser.uid + "/photoLink").on("value", (snapshot) => {
            userPhoto.src = snapshot.val()
        })

        //when user press enter, message will be send
        const textArea = document.querySelector(".text-area")
        userMessageInput.addEventListener("keyup", async function (e) {
            if (e.key !== 'Enter')  {
                const text = e.target.value.trim()
                const chatId = currentChatId.id

                await firebase.database().ref("/chats/" + chatId + "/typingUser").set(currentUserInfo.username)

                let timer = setTimeout(async () => {
                    console.log()
                    if (e.target.value.trim() == text) {
                        await firebase.database().ref("/chats/" + chatId + "/typingUser").set("")
                    } else {
                        clearTimeout(timer)
                    }
                }, 1000)
            } else {
                let message = userMessageInput.value;
                message = message.trim();
                if(message == ""){
                    messageInput.value = "";
                    return;
                }
                database.setChatMessage(currentUserId, currentChatId.id, message, "text");
                userMessageInput.value = "";
            }
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

        //creating and previewing chat avatar
        const createChatForm = document.querySelector(".create-chat-modal")
        const imgPreview = document.getElementById("create-chat-photo")
        const selectChatAvatar = document.getElementById("file_chat")

        selectChatAvatar.addEventListener("change", (event) => {
            event.preventDefault()
            const files = event.target.files
            if (FileReader&& files && files.length) {
                const fr = new FileReader()
                fr.onload = function () {
                    imgPreview.src = fr.result
                }
                fr.readAsDataURL(files[0])
            } else {
                alert("Try again to download photo")
            }
        })

        createChatForm.addEventListener("submit", async function(e){
            e.preventDefault()
            let chatName = document.querySelector(".chat-name-input").value;
            let chatType = chatTypeSelector.value;
            const file = selectChatAvatar.files[0]
            let fileData
            if(file){
                const metadata = {
                    contentType: file.type
                }
                fileData = {file: file, metadata: metadata}
            } else {
                fileData = null
            }

            chatName.trim();
            if(chatName == "") {
                alert("Chat name must be filled")
            } else {
                if(chatTypeSelector.value == "private" && chatPasswordInput.value == ""){
                    alert("Password at private chats must be filled")
                } else {
                    await database.createChat([currentUserId], chatName, chatType, chatPasswordInput.value, fileData);
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

        const avatarInput = document.getElementById("file")
        avatarInput.addEventListener("change", async (event) => {
            event.preventDefault()
            const file = avatarInput.files[0]
            const userId = firebase.auth().currentUser.uid
            const metadata = {
                contentType: file.type
            }

            await database.setUserAvatar(userId, {file: file, metadata: metadata})
        })

        //clicking on sticker
        const stickers = document.getElementsByClassName("sticker")
        for(let sticker of stickers) {
            sticker.addEventListener("click", async function(e) {
                e.preventDefault()
                await database.setChatMessage(currentUserId, currentChatId.id, sticker.src, "sticker")
                mask.classList.remove("active");
            })
        }
        
        //changing usrname of user
        let isChangeUsername = false;
        const changeUsernameButton = document.querySelector(".edit-username")
        changeUsernameButton.addEventListener("click", async function(e){
            if(!isChangeUsername){
                changeUsernameButton.value = "OK"
                usernameField.disabled = false
                isChangeUsername = !isChangeUsername;
            } else {
                let val = usernameField.value.trim()
                if(val == currentUserInfo.username){
                    changeUsernameButton.value = "Edit"
                    usernameField.disabled = true
                    isChangeUsername = !isChangeUsername;
                    return
                }
                if(val == ""){
                    alert("username cannot be empty")
                } else if(await database.checkValidUsername(val)){
                    changeUsernameButton.value = "Edit"
                    usernameField.disabled = true
                    database.setUserUsername(currentUserId, val)
                    isChangeUsername = !isChangeUsername;
                } else {
                    alert("Already have user with such username")
                }
            }
        })
    }
}

export default ChatPage