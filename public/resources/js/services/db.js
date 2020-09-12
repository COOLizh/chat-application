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
        console.log("herer")
        firebase.database().ref("/users/" + key).set({
            name: name,
            surname: surname,
            username: username,
            photoLink: "resources/img/unknown_user.png",
            chats: []
        });
    }

    async createChat(userId) {
        const newChatId = await firebase.database().ref("/chats").push({
            chatName: "temp chat",
            membersCount: 1,
        }).then(res => {
            console.log(res.key)
            console.log(res.getKey())
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
        let chats = await this.getUserChats(userId);
        if(chats == null) {
            chats = [];
        }
        chats.push(chatId);
        firebase.database().ref("/users/" + userId + "/chats").set(chats);
    }

    async getChatMessages(chatId) {
        const snapshot = await firebase.database().ref("/chats/" + chatId + "/messages").once("value")
        if (snapshot.exists()){
            return snapshot.val()
        } else {
            return null;
        }
    }

    // const snapshot = await firebase.database().ref().once("value")
    // firebase.database().ref().push(data)
    // firebase.database().ref().push(data).then(res => {
    //     //do smth
    // })

    async setChatMessage(userId, chatId, messageText) {
        let messages = await this.getChatMessages(chatId);
        if (messages == null) {
            messages = [];
        }
        messages.push([userId, messageText]);
    }


    /* firebase.database().ref("/chats/" + chatId + "/messages").on("child_added", (snapshot) => {
            
        }) */
}

export default DB
