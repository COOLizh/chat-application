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

    async createChat(usersId, chatName, chatType, chatPassword, chatImgFile) {
        let imgUrl = "resources/img/person.png"
        if (chatImgFile) {
            const fileId = chatImgFile.file.name + "-id"
            imgUrl = await firebase.storage().ref("/chats").child(fileId).put(chatImgFile.file, chatImgFile.metadata)
                .then(snapshot => {
                    return snapshot.ref.getDownloadURL()
                        .then(url => {
                            return url
                        })
                .catch(err => {
                    alert(err)
                    return null
                })
            })
        }

        const newChatId = await firebase.database().ref("/chats").push({
            chatName: chatName,
            chatType: chatType,
            chatPhotoLink: imgUrl,
            membersCount: 1,
            password: chatPassword,
            users: usersId,
            typingUser: ""
        }).then(res => {
            return res.key
        });
        for(let usrId of usersId){
            await this.setUserChats(usrId, newChatId)
        }
        return newChatId
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

    async getUserChatsUsers(userId) {
        const snapshot = await firebase.database().ref("/users/" + userId + "/chats").once("value")

        const ids = []
        if (snapshot.exists()) {
            for (const id of snapshot.val()) {
                const chat = await firebase.database().ref("/chats/" + id).once("value")
                if (chat.val() != null && chat.val().users && chat.val().chatType == "dialogue" 
                        && chat.val().users.includes(firebase.auth().currentUser.uid)) {
                    const myIdIndex = chat.val().users.indexOf(firebase.auth().currentUser.uid)
                    chat.val().users.splice(myIdIndex, 1)
                    ids.push(chat.val().users[0])
                }
            }
        }

        return ids
    } 

    async setUserChats(userId, chatId) {
        let snapshot = await firebase.database().ref("/users/" + userId + "/chats").once("value");
        let chats = [];
        if(snapshot.exists()){
            chats = snapshot.val();
        }
        chats.push(chatId);
        firebase.database().ref("/users/" + userId+ "/chats/").set(chats);
    }

    async addUserToChat(userId, chatId) {
        await this.setUserChats(userId, chatId)
        let chatUsers = await this.getChatUsers(chatId)
        if (chatUsers != null) {
            chatUsers.push(userId)
        } else {
            chatUsers = [userId]
        }
        this.setChatUsers(chatId, chatUsers)
    }

    setChatUsers(chatId, newUsers) {
        firebase.database().ref("/chats/" + chatId + "/users").set(newUsers)
    }

    async getChatUsers(chatId) {
        const snapshot = await firebase.database().ref("/chats/" + chatId + "/users").once("value")
        if (snapshot.exists()) {
            return snapshot.val()
        }
        return null
    }

    async getChatMessages(chatId) {
        const snapshot = await firebase.database().ref("/chats/" + chatId + "/messages").once("value")
        if (snapshot.exists()){
            return snapshot.val()
        } else {
            return null;
        }
    }

    async setChatMessage(userId, chatId, messageText, messageType) {
        let messages = await this.getChatMessages(chatId);
        if (messages == null) {
            messages = [];
        }
        messages.push({
            userId: userId, 
            messageText: messageText,
            messageType: messageType
        });
        firebase.database().ref("/chats/" + chatId + "/messages").set(messages)
    }

    async getChatInfo(chatId){
        const snapshot = await firebase.database().ref("/chats/" + chatId).once("value");
        if (snapshot.exists()) {
            return snapshot;
        }
        return null
    }

    newMessageReceived(chatId) {
        firebase.database().ref("/chats/" + chatId + "/messages").on('child_changed', function(snapshot) {

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

    async getAllUsers() {
        const snapshot = await firebase.database().ref("/users").once("value");
        if (snapshot.exists()) {
            return [...Object.keys(snapshot.val()).map(key => ({
                id: key,
                ...snapshot.val()
            }))]
        } else {
            return null
        }
    }

    async getAllChats() {
        const snapshot = await firebase.database().ref("/chats").once("value");
        if (snapshot.exists()) {
            return [...Object.keys(snapshot.val()).map(key => ({
                id: key,
                ...snapshot.val()
            }))]
        } else {
            return null
        }
    }

    async getAllUsersIds() {
        const snapshot = await firebase.database().ref("/users").once("value")
        if (snapshot.exists()) {
            return [...Object.keys(snapshot.val())]
        }
        return null
    }
    
    async getUserById(userId) {
        const snapshot = await firebase.database().ref("/users/" + userId).once("value")
        if (snapshot.exists) {
            return snapshot.val()
        }
        return null
    }

    async getAllChatsAndUsersWhichUserIsNotMember(userId){
        // const userChats = await firebase.database().ref("/users/" + userId + "/chats").once("value");
        const allUsersIds = await this.getAllUsersIds()
        const allUsers = await this.getAllUsers()
        const allChats = await this.getAllChats()
        const userChatsUsers = await this.getUserChatsUsers(firebase.auth().currentUser.uid)
        const users = [];
        const chats = []
        
        if (allChats != null) {
            for (const chat of allChats) {
                console.log(firebase.auth().currentUser.uid)
                if(chat[chat.id].users !== undefined){
                    if (!chat[chat.id].users.includes(firebase.auth().currentUser.uid) && chat[chat.id].chatType != "dialogue") {
                        chats.push({
                            chat: chat[chat.id],
                            id: chat.id
                        })
                    }
                }
            }
        }

        console.log(allUsersIds)
        console.log(allUsers)
        for (const id of allUsersIds) {
            if (!userChatsUsers.includes(id) && id != firebase.auth().currentUser.uid) {
                console.log(id)
                users.push({
                    user: await this.getUserById(id),
                    id: id
                })
                console.log(users)
            }
        }

        let results = {
            users: users,
            chats: chats,
        }

        return results
    }

    async getSearchResults(userId, searchString) {
        let users = []
        let chats = []
        let usersAndChats = await this.getAllChatsAndUsersWhichUserIsNotMember(userId)
        for(let usr of usersAndChats.users){
            if(usr.user.username.indexOf(searchString) == 0){
                users.push(usr);
            }
        }
    
        for(let cht of usersAndChats.chats){
            if(cht.chat.chatName.indexOf(searchString) == 0){
                chats.push(cht);
            }
        }

        let result = {
            users: users,
            chats: chats,
        }
        return result
    }

    async setUserAvatar(userId, fileData) {
        const imgUrl = await firebase.storage().ref("/avatars").child(userId).put(fileData.file, fileData.metadata)
            .then(snapshot => {
                return snapshot.ref.getDownloadURL()
                    .then(url => {
                        return url
                    })
            .catch(err => {
                alert(err)
                return null
            })
        })

        if (imgUrl != null) {
            firebase.database().ref("/users/" + userId + "/photoLink").set(imgUrl)
        }
    }
}

export const database = new DB()
