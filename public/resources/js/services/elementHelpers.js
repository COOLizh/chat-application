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

    for(let usr of searchResults.chats){
        const userBlock = document.createElement("div")
        userBlock.classList.add("user-search-block")
        const userImg = document.createElement("img")
        userImg.src = usr.photoLink;
        const userInfoDiv = document.createElement("div")
        userInfoDiv.classList.add("user-search-info")
        const username = document.createElement("p")
        username.innerText = "Chat name: " + usr.chatName
        const userNameAndSurname = document.createElement("p")
        userNameAndSurname.innerText = "Type: " + usr.chatType

        userInfoDiv.appendChild(username)
        userInfoDiv.appendChild(userNameAndSurname)
        userBlock.appendChild(userImg)
        userBlock.appendChild(userInfoDiv)

        chatsSearchDiv.appendChild(userBlock)
    }

}