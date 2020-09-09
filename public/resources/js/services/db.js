import Router from "../router.js"

export class DB {

    constructor(){
        this.db = firebase.database();
        this.auth = firebase.auth();
    }

    async registrateUser(name, surname, username, email, password) {
        this.db.ref("/users").push({
            name: name,
            surname: surname,
            username: username,
            chats: [],
        });
        this.auth.createUserWithEmailAndPassword(email, password)
    }

    async loginUser(email, password){
        this.auth.signInWithEmailAndPassword(email, password)
            .then((res) => {
                Router._instance.navigate("/chat");
            })
            .catch(err => {
                alert(err);
            })
    }
}

export default DB
