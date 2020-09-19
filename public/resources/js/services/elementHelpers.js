import {database} from "../services/db.js"

export function displayUserMessage(userId, message, correspondenceSection, userInfo, messageType) {
    const userMessageSection = document.createElement("section");
    const userPhoto = document.createElement("img");
    userPhoto.src = userInfo.photoLink;
    userPhoto.classList.add("user-photo");
    let userMessage = document.createElement("p");
    if(messageType == "text"){
        userMessage.innerText = message;
    } else {
        userMessage = document.createElement("img")
        userMessage.classList.add("sended-sticker")
        userMessage.src = message
    }
    userMessageSection.appendChild(userPhoto);
    userMessageSection.classList.add("user-message")
    if(userId == firebase.auth().currentUser.uid) {
        userMessageSection.classList.add("current");
        const messageStatus = document.createElement("span")
        messageStatus.classList.add("message-status")
        messageStatus.innerText = "✔"
        userMessageSection.appendChild(userMessage);
        userMessageSection.appendChild(messageStatus);
    } else {
        userMessageSection.appendChild(userMessage);
    }
    correspondenceSection.appendChild(userMessageSection);
}

export function displaySearchResults(searchResults, usersSearchDiv, chatsSearchDiv,
    searchDiv, chatsContainer, createChatModal, enterPasswordModal, mask, modal) {
    usersSearchDiv.innerHTML = ''
    chatsSearchDiv.innerHTML = ''
    for(let usr of searchResults.users){
        const userBlock = document.createElement("div")
        userBlock.classList.add("user-search-block")
        const userImg = document.createElement("img")
        userImg.src = usr.user.photoLink;
        const userInfoDiv = document.createElement("div")
        userInfoDiv.classList.add("user-search-info")
        const username = document.createElement("p")
        username.innerText = "Username: " + usr.user.username
        const userNameAndSurname = document.createElement("p")
        userNameAndSurname.innerText = "Name: " + usr.user.name + " " + usr.user.surname
        
        //creating join button
        const joinButton = document.createElement("p")
        joinButton.classList.add("join-button")
        joinButton.innerText = "Join"

        userInfoDiv.appendChild(username)
        userInfoDiv.appendChild(userNameAndSurname)
        userBlock.appendChild(userImg)
        userBlock.appendChild(userInfoDiv)
        userBlock.appendChild(joinButton)

        joinButton.addEventListener("click", async function(e){
            const newDialogueId = await database.createChat([firebase.auth().currentUser.uid, usr.id], "", "dialogue", "", null)
            alert("succesfully created dialogue")
            searchDiv.style.display = "none";
            chatsContainer.style.display = "block";
        })

        usersSearchDiv.appendChild(userBlock)
    }

    for(let cht of searchResults.chats){
        const chatBlock = document.createElement("div")
        chatBlock.classList.add("user-search-block")
        const chatImg = document.createElement("img")
        chatImg.src = cht.chat.chatPhotoLink;
        const chatInfoDiv = document.createElement("div")
        chatInfoDiv.classList.add("user-search-info")
        const chatName = document.createElement("p")
        chatName.innerText = "Chat name: " + cht.chat.chatName
        const chatType = document.createElement("p")
        chatType.innerText = "Type: " + cht.chat.chatType
        const joinButton = document.createElement("p")
        joinButton.classList.add("join-button")
        joinButton.innerText = "Join"

        chatInfoDiv.appendChild(chatName)
        chatInfoDiv.appendChild(chatType)
        chatBlock.appendChild(chatImg)
        chatBlock.appendChild(chatInfoDiv)
        chatBlock.append(joinButton)

        joinButton.addEventListener("click", async function(e){
            if(cht.chat.chatType == "private"){
                mask.style.display = "block";
                modal.style.display = "block";
                mask.classList.add("active");
                createChatModal.style.display = "none"
                enterPasswordModal.style.display = "block"

                document.getElementById("confirm-input-password").addEventListener("click", async function(e){
                    const passwordInputValue = document.getElementById("input-private-password").value
                    if(passwordInputValue != cht.chat.password){
                        alert("Wrong password!")
                    } else {
                        await database.addUserToChat(firebase.auth().currentUser.uid, cht.id)
                        alert("succesfully added")

                        searchDiv.style.display = "none";
                        chatsContainer.style.display = "block";

                        //очистить инпут

                        mask.classList.remove("active");
                        createChatModal.style.display = "block"
                        enterPasswordModal.style.display = "none"
                    }
                })
            } else if(cht.chat.chatType == "public") {
                alert("succesfully added")
                searchDiv.style.display = "none";
                chatsContainer.style.display = "block";
                await database.addUserToChat(firebase.auth().currentUser.uid, cht.id)
                //очистить инпут
            }
        })
        document.querySelector(".close").addEventListener("click", function(e){
            mask.classList.remove("active");
            createChatModal.style.display = "block"
            enterPasswordModal.style.display = "none"
        })
        mask.addEventListener("click", function (e) {
            mask.classList.remove("active");
            createChatModal.style.display = "block"
            enterPasswordModal.style.display = "none"
        })

        chatsSearchDiv.appendChild(chatBlock)
    }

}