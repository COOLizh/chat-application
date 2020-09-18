export function displayUserMessage(userId, message, correspondenceSection, userInfo, messageType) {
    const userMessageSection = document.createElement("section");
    const userPhoto = document.createElement("img");
    userPhoto.src = userInfo.photoLink;
    userPhoto.classList.add("user-photo");
    let userMessage = document.createElement("span");
    if(messageType == "text"){
        userMessage.innerText = message;
        userMessage.classList.add("user-message")
    } else {
        userMessage = document.createElement("img")
        userMessage.src = message
    }
    if(userId == firebase.auth().currentUser.uid) {
        userMessageSection.classList.add("temp-login-user-message");
    } else {
        userMessageSection.classList.add("temp-other-users-message");
    }
    userMessageSection.appendChild(userPhoto);
    userMessageSection.appendChild(userMessage);
    correspondenceSection.appendChild(userMessageSection);
}

export function displaySearchResults(searchResults, usersSearchDiv, chatsSearchDiv) {
    usersSearchDiv.innerHTML = ''
    chatsSearchDiv.innerHTML = ''
    for(let usr of searchResults.users){
        const userBlock = document.createElement("div")
        userBlock.classList.add("user-search-block")
        const userImg = document.createElement("img")
        userImg.src = usr.photoLink;
        const userInfoDiv = document.createElement("div")
        userInfoDiv.classList.add("user-search-info")
        const username = document.createElement("p")
        username.innerText = "Username: " + usr.username
        const userNameAndSurname = document.createElement("p")
        userNameAndSurname.innerText = "Name: " + usr.name + " " + usr.surname
        userInfoDiv.appendChild(username)
        userInfoDiv.appendChild(userNameAndSurname)
        userBlock.appendChild(userImg)
        userBlock.appendChild(userInfoDiv)
        usersSearchDiv.appendChild(userBlock)
    }

    for(let chat of searchResults.chats){
        const chatBlock = document.createElement("div")
        chatBlock.classList.add("user-search-block")
        const chatImg = document.createElement("img")
        chatImg.src = chat.photoLink;
        const chatInfoDiv = document.createElement("div")
        chatInfoDiv.classList.add("user-search-info")
        const chatName = document.createElement("p")
        chatName.innerText = "Chat name: " + chat.chatName
        const chatType = document.createElement("p")
        chatType.innerText = "Type: " + chat.chatType
        const joinButton = document.createElement("p")
        joinButton.classList.add("join-button")
        joinButton.innerText = "Join"

        chatInfoDiv.appendChild(chatName)
        chatInfoDiv.appendChild(chatType)
        chatBlock.appendChild(chatImg)
        chatBlock.appendChild(chatInfoDiv)
        chatBlock.append(joinButton)

        let mask = document.querySelector(".mask");
        let modal = document.querySelector(".modal");
        joinButton.addEventListener("click", async function(e){
            mask.style.display = "block";
            modal.style.display = "block";
            mask.classList.add("active");
            document.querySelector(".create-chat-modal").style.display = "none"
            document.querySelector(".enter-password-modal").style.display = "block"
        })
        document.querySelector(".close").addEventListener("click", function(e){
            mask.classList.remove("active");
        })
        mask.addEventListener("click", function (e) {
            mask.classList.remove("active");
        })

        chatsSearchDiv.appendChild(chatBlock)
    }

}

/* 
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
*/