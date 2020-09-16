import {database} from "./db.js"

export function displayUserMessage(userId, message, correspondenceSection, userInfo) {
    const userMessageSection = document.createElement("section");
    const userPhoto = document.createElement("img");
    userPhoto.src = userInfo.photoLink;
    userPhoto.classList.add("user-photo");
    const userMessage = document.createElement("span");
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
    console.log(correspondenceSection)
}