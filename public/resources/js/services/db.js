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
        const snapshot = await firebase.database().ref("/users/").once("value");
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

    async getAllChatsAndUsersWhichUserIsNotMember(userId){
        const userChats = await firebase.database().ref("/users/" + userId + "/chats").once("value");
        const allUsers = await this.getAllUsers()
        const allChats = await this.getAllChats()
        const users = [];
        const publicChats = [];
        const privateChats = [];
        for(const user of allUsers){
            if(user.id != userId){
                const tmpUsr = await this.getUserInfo(user.id);
                users.push(tmpUsr)
            }
        }
        for(const chat of allChats){
            let isUserHaveSuchChat = false;
            if(userChats.val() != null){
                for(let i = 0; i < userChats.val().length; i++){
                    if(userChats.val()[i] == chat.id){
                        isUserHaveSuchChat = true;
                        break;
                    }
                }
            }
            if(!isUserHaveSuchChat){
                const tmpChat = await this.getChatInfo(chat.id);
                if(tmpChat.chatType == "public"){
                    publicChats.push(tmpChat);
                } else {
                    privateChats.push(tmpChat);
                }
            }
        }

        let results = {
            users: users,
            publicChats: publicChats,
            privateChats: privateChats
        }

        return results
    }

    async getSearchResults(userId, searchString) {
        let users = []
        let privateChats = []
        let publicChats = []
        let usersAndChats = await this.getAllChatsAndUsersWhichUserIsNotMember(userId)
        for(let usr of usersAndChats.users){
            if(usr.username.indexOf(searchString) == 0){
                users.push(usr);
            }
        }
    
        for(let cht of usersAndChats.publicChats){
            if(cht.chatName.indexOf(searchString) == 0){
                publicChats.push(cht);
            }
        }
    
        for(let cht of usersAndChats.privateChats){
            if(cht.chatName.indexOf(searchString) == 0){
                privateChats.push(cht);
            }
        }
        

        console.log(users, publicChats, privateChats)
    }
}

export const database = new DB()
