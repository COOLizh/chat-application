import * as elementHelpers from "./elementHelpers.js"
import {database} from "./db.js"

export async function handleNewChat(snapshot, chatInfoSection, correspondenceSection, 
    userMessageInput, chatsContainer, startMessagingP, currentChatId) {
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

        currentChatId.id = newChatId;

        const messages = await database.getChatMessages(currentChatId.id)

        if (messages != null) {
            for (let i = 0; i < messages.length; i++) {
                const userInfo = await database.getUserInfo(messages[i].userId);
                elementHelpers.displayUserMessage(
                    messages[i].userId, 
                    messages[i].messageText, 
                    correspondenceSection,
                    userInfo
                )
            }
        }

        userMessageInput.disabled = false;
    })
    chatsContainer.append(section);
}

export async function handleNewMessage(snapshot, currentChatId, correspondenceSection) {
    const key = snapshot.ref.path.pieces_[1]

    if (currentChatId.id == key) {
        const userInfo = await database.getUserInfo(snapshot.val().userId);
        elementHelpers.displayUserMessage(
            snapshot.val().userId,
            snapshot.val().messageText,
            correspondenceSection,
            userInfo
        )
    }
}