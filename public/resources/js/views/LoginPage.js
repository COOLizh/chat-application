import {database} from "../services/db.js"

let LoginPage = {
    render: async () => {
        let view = `<div class="page-content">
        <div class="left-side-page">
            <p><img src="resources/img/login-chatting-people.jpg" alt="chatting-people"></p>
        </div>
        <div class="right-side-page">
            <p id="chat-logo-image"><img src="resources/img/chat-logo.jpg" alt="CoolChat logo"></p>
            <p>Account login</p>
            <input type="text" name="email" placeholder="Email" id="email" required>
            <input type="password" name="password" placeholder="Password" id="password" required>
            <input type="submit" value="Sign in" id="sign-in-button">
        </div>
    </div>`
        return view
    },
    after_render: async () => {
        document.title = "CoolChat login"
        document.getElementById("css-tag").href = "resources/css/login.css";

        let button = document.getElementById("sign-in-button");
        button.addEventListener("click", (event) => {
            event.preventDefault()
            let email = document.getElementById("email").value;
            let password = document.getElementById("password").value;
            database.loginUser(email, password);
        })
    }
}

export default LoginPage