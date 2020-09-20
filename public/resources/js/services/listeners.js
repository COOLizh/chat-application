import * as elementHelpers from "./elementHelpers.js"
import {database, DB} from "./db.js"
import Utils from "./Utils.js";

export async function handleNewChat(snapshot, chatInfoSection, correspondenceSection, 
    userMessageInput, chatsContainer, startMessagingP, currentChatId) {
    document.getElementById("zero-chats-message").style.display = "none";
    let newChatId = snapshot.val();
    const newChatInfo = await database.getChatInfo(snapshot.val());
    
    let newChatInfoKey = newChatInfo.key
    let newChatInfoVal = newChatInfo.val()

    let chatName = ""
    let chatPhoto = ""
    if(newChatInfoVal.chatType == "dialogue"){
        Utils.removeElemFromArray(newChatInfoVal.users, firebase.auth().currentUser.uid)
        const user = await database.getUserById(newChatInfoVal.users[0])
        chatName = user.username
        chatPhoto = user.photoLink
    } else {
        chatName = newChatInfoVal.chatName
        chatPhoto = newChatInfoVal.chatPhotoLink
    }

    let section = document.createElement("section");
    section.classList.add("chat");
    section.setAttribute.disabled = true;

    section.innerHTML = `
    <input type="hidden" name="chat-id" value="${newChatInfoKey}">
    <p class="temp-chat-name">${chatName}</p>
    <p class="temp-last-message">${newChatInfoVal.chatType + " chat"}</p>
    <img src="${chatPhoto}" alt="chat-photo" class="chat-photo">`
    
    section.addEventListener('click', async (event) => {
        //filling chat info section
        event.preventDefault();

        startMessagingP.style.display = "none";
        correspondenceSection.innerHTML = '';

        //for mobiles creating 2 buttons
        if(screen.width <= 767) {
            const corresp = document.querySelector(".correspondence-section")
            const backToChatMobile = document.createElement("img")
            backToChatMobile.src = "resources/img/blue-arrow.jpg"
            backToChatMobile.alt = "back to chat"
            backToChatMobile.id = "back-to-chat-button-mobile"
            document.querySelector(".settings-chats-section").style.display = "none"
            corresp.style.display = "block"
            corresp.appendChild(backToChatMobile)

            const stickersMobileButton = document.getElementById("stickers-mobile")
            stickersMobileButton.style.display = "block"
            const stickersModal = document.querySelector(".stickers-mobile-modal")
            let mask = document.querySelector(".mask");
            let modal = document.querySelector(".modal");
            stickersMobileButton.addEventListener("click", function(e){
                mask.style.display = "block";
                modal.style.display = "block";
                mask.classList.add("active");
                document.querySelector(".create-chat-modal").style.display = "none"
                stickersModal.style.display = "block"
            })
            document.querySelector(".close").addEventListener("click", function(e){
                document.querySelector(".create-chat-modal").style.display = "block"
                stickersModal.style.display = "none"
                mask.classList.remove("active");
            })
            mask.addEventListener("click", function (e) {
                mask.classList.remove("active");
                document.querySelector(".create-chat-modal").style.display = "block"
                stickersModal.style.display = "none"
            })

            backToChatMobile.addEventListener("click", function(e){
                document.querySelector(".settings-chats-section").style.display = "block"
                document.querySelector(".correspondence-section").style.display = "none"
            })
        }

        let chatInfo = await database.getChatInfo(newChatId);
        let chatNameP = document.createElement("p");
        chatNameP.id = "chat-name";
        chatNameP.innerText = chatName;
        let chatImg = document.createElement("img");
        chatImg.src = chatPhoto;
        chatImg.alt = "chat-photo";
        let kindOfChatP = document.createElement("p");
        kindOfChatP.id = "kind-of-chat";
        kindOfChatP.innerText = newChatInfoVal.chatType;
        let membersP = document.createElement("p");
        membersP.id = "users-count";
        if(newChatInfoVal.chatType != "dialogue"){
            membersP.innerText = chatInfo.membersCount + " members";
        } else {
            membersP.innerText = "2 members"
        }
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
                    userInfo,
                    messages[i].messageType,
                    document.querySelector(".container")
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
            userInfo,
            snapshot.val().messageType,
            document.querySelector(".container")
        )
    }
}