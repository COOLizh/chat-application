import Router from "../router.js"

let MainPage = {
    render: async () => {
        let view = `<header class="menu">
        <section class="chat-symbols">
            <img src="resources/img/chat-logo.jpg" alt="CoolChat logo">
            <h1>CoolChat</h1>
        </section>
        <ul class="info-buttons">
            <li><a href="#about">About</a></li>
            <li><a href="#opportunities">Opportunities</a></li>
        </ul>
        <ul class="login-buttons">
            <li><a id="login-link" href="/login">Log in</a></li>
            <li><a id="registration-link" href="/registration">Register</a></li>
        </ul>
    </header>
    <section class="about" id="about">
        <img src="resources/img/creator.jpg" alt="dolbaeb">
        <p id="quote">"Guys, screen this message, I will easily close ITIROD over the summer!"</p>
        <p>© Vladislav Kulizhenko — website creator who was expelled from the university</p>
    </section>
    <hr>
    <p id="start-messaging-text">Start messaging now!</p>
    <section class="opportunities" id="opportunities">
        <div>
            <img src="resources/img/friends.png">
            <p>Chat with your friends</p>
        </div>
        <div>
            <img src="resources/img/privacy.png">
            <p>Private chats can guarantee that your<br>messages will not be read by others</p>
        </div>
        <div>
            <img src="resources/img/dark-mode.png">
            <p>Choose a theme you like</p>
        </div>
        <div>
            <img src="resources/img/sticker.png">
            <p>Send cool stickers</p>
        </div>
    </section>
    <footer>
        <p>© 2020 by COOLizh</p>
        <a href="https://github.com/COOLizh" target="_blank"><img src="resources/img/github-icon.png" alt="github photo"></a>
        <a href="https://t.me/COOLizh" target="_blank"><img src="resources/img/telegram-icon.png" alt="telegram photo"></a>
        <a href="mailto:kulizhenko.v@gmail.com" target="_blank"><img src="resources/img/google-icon.png" alt="google photo"></a>
    </footer>`
        return view
    },
    after_render: async () => {
        document.getElementById("css-tag").href = "resources/css/index.css"
        document.title = "CoolChat"

        let registrationLink = document.getElementById("registration-link")
        registrationLink.addEventListener("click", (event) => {
            event.preventDefault()
            Router._instance.navigate("/registration")
        })

        let loginLink = document.getElementById("login-link")
        loginLink.addEventListener("click", (event) => {
            event.preventDefault()
            Router._instance.navigate("/login")
        })
    }
}

export default MainPage