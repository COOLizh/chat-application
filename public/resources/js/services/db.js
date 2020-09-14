import Router from "../router.js"

export class DB {

    async loginUser(email, password){
        await firebase.auth().signInWithEmailAndPassword(email, password)
            .then((res) => {
                Router._instance.navigate("/chat");
            })
            .catch(err => {
                alert(err);
            })
    }

    async createUser(name, surname, username, email, password) {    
        const key = await firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function () {
                return firebase.auth().currentUser.uid
            })
            .catch(function (error) {
                console.log(error)
            });
        firebase.database().ref("/users/" + key).set({
            name: name,
            surname: surname,
            username: username,
            photoLink: "resources/img/unknown_user.png",
            chats: []
        });
    }

    async createChat(userId, chatName, chatType, chatPassword) {
        const newChatId = await firebase.database().ref("/chats").push({
            chatName: chatName,
            chatType: chatType,
            chatPhotoLink: "resources/img/person.png",
            membersCount: 1,
            password: chatPassword
        }).then(res => {
            return res.key
        });
        await this.addUserToChat(userId, newChatId);
    }

    async getUserChats(userId) {
        const snapshot = await firebase.database().ref("/users/" + userId + "/chats").once("value");
        if (snapshot.exists()) {
            let chats = [];
            for(const elem of snapshot.val()){
                const snap = await firebase.database().ref("/chats/" + elem).once("value");
                let tmpChatInfo = {
                    chatId: elem,
                    chatName: snap.val().chatName,
                    membersCount: snap.val().membersCount
                }
                chats.push(tmpChatInfo)
            }
            return chats;
        } else {
            return null;
        }
    }

    async addUserToChat(userId, chatId) {
        let snapshot = await firebase.database().ref("/users/" + userId + "/chats").once("value");
        let chats = [];
        if(snapshot.exists()){
            chats = snapshot.val();
        }
        chats.push(chatId);
        firebase.database().ref("/users/" + userId+ "/chats/").set(chats);
    }

    async getChatMessages(chatId) {
        const snapshot = await firebase.database().ref("/chats/" + chatId + "/messages").once("value")
        if (snapshot.exists()){
            return snapshot.val()
        } else {
            return null;
        }
    }

    async setChatMessage(userId, chatId, messageText) {
        let messages = await this.getChatMessages(chatId);
        if (messages == null) {
            messages = [];
        }
        messages.push({
            userId: userId, 
            messageText: messageText
        });
        firebase.database().ref("/chats/" + chatId + "/messages").set(messages)
    }

    async getChatInfo(chatId){
        const snapshot = await firebase.database().ref("/chats/" + chatId + "/").once("value");
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return null;
        }
    }

    async newMessageReceived(chatId) {
        await firebase.database().ref("/chats/" + chatId + "/messages").on('child_changed', function(snapshot) {
            // all records after the last continue to invoke this function
            console.log(snapshot.name(), snapshot.val()); 
         });
    }

    async getUserInfo(userId) {
        const snapshot = await firebase.database().ref("/users/" + userId).once("value");
        if(snapshot.exists()) {
            return snapshot.val();
        } else {
            return null;
        }
    }

    addListenerToUserChats(userId, container, refreshChatsFunction) {
        firebase.database().ref("/users/" + userId + "/chats").on("child_added", async (snapshot) => {
            if(container.firstChild.nodeName == "#text") {
                container.innerHTML = '';
            };
            let newChatId = snapshot.val();
            let newChatInfo = await this.getChatInfo(snapshot.val());
            let section = document.createElement("section");
            section.classList.add("chat");
            section.setAttribute.disabled = true;
            section.innerHTML = `
            <input type="hidden" name="chat-id" value="${newChatId}">
            <p class="temp-chat-name">${newChatInfo.chatName}</p>
            <p class="temp-last-message">*There is no messages yet*</p>
            <img src="resources/img/unknown_user.png" alt="chat-photo" class="chat-photo">`
            container.append(section);
            refreshChatsFunction();
        })
    } 
}

export default DB
