//import DB from "../services/db.js"

// SPA
let ChatPage = {
    render: async () => {
        let view = `<div class="page-content">
        <div class="settings-chats-section">
            <div class="search-and-settings">
                <button class="settings">☰</button>
                <input type="text" name="search" placeholder="Search...">
            </div>  
            <div class="chats">
                <section class="chat">
                    <p class="temp-chat-name">ChatName</p>
                    <p class="temp-last-message">LastUser: message</p>
                    <img src="resources/img/unknown_user.png" alt="chat-photo" class="chat-photo">
                </section>
                <section id="temp-selected-chat">
                    <p id="temp-chat-name">ChatName</p>
                    <p id="temp-last-message">LastUser: message</p>
                    <img src="resources/img/unknown_user.png" alt="chat-photo" id="chat-photo">
                </section>
                <section class="chat">
                    <p class="temp-chat-name">ChatName</p>
                    <p class="temp-last-message">LastUser: message</p>
                    <img src="resources/img/unknown_user.png" alt="chat-photo" class="chat-photo">
                </section>
                <section class="chat">
                    <p class="temp-chat-name">ChatName</p>
                    <p class="temp-last-message">LastUser: message</p>
                    <img src="resources/img/unknown_user.png" alt="chat-photo" class="chat-photo">
                </section>
                <section class="chat">
                    <p class="temp-chat-name">ChatName</p>
                    <p class="temp-last-message">LastUser: message</p>
                    <img src="resources/img/unknown_user.png" alt="chat-photo" class="chat-photo">
                </section>
                <section class="chat">
                    <p class="temp-chat-name">ChatName</p>
                    <p class="temp-last-message">LastUser: message</p>
                    <img src="resources/img/unknown_user.png" alt="chat-photo" class="chat-photo">
                </section>
                <section class="chat">
                    <p class="temp-chat-name">ChatName</p>
                    <p class="temp-last-message">LastUser: message</p>
                    <img src="resources/img/unknown_user.png" alt="chat-photo" class="chat-photo">
                </section>
                <section class="chat">
                    <p class="temp-chat-name">ChatName</p>
                    <p class="temp-last-message">LastUser: message</p>
                    <img src="resources/img/unknown_user.png" alt="chat-photo" class="chat-photo">
                </section>
                <section class="chat">
                    <p class="temp-chat-name">ChatName</p>
                    <p class="temp-last-message">LastUser: message</p>
                    <img src="resources/img/unknown_user.png" alt="chat-photo" class="chat-photo">
                </section>
                <section class="chat">
                    <p class="temp-chat-name">ChatName</p>
                    <p class="temp-last-message">LastUser: message</p>
                    <img src="resources/img/unknown_user.png" alt="chat-photo" class="chat-photo">
                </section>
                <section class="chat">
                    <p class="temp-chat-name">ChatName</p>
                    <p class="temp-last-message">LastUser: message</p>
                    <img src="resources/img/unknown_user.png" alt="chat-photo" class="chat-photo">
                </section>
                <section class="chat">
                    <p class="temp-chat-name">ChatName</p>
                    <p class="temp-last-message">LastUser: message</p>
                    <img src="resources/img/unknown_user.png" alt="chat-photo" class="chat-photo">
                </section>
            </div>
        </div>
        <div class="correspondence-section">
            <section class="chat-info">
                <p id="chat-name">ChatName</p>
                <img src="resources/img/unknown_user.png" alt="chat-photo">
                <p id="kind-of-chat">public</p>
                <p id="users-count">204 567 members</p>   
            </section>
            <div class="correspondence">
                <section id="temp-login-user-message" class="temp-login-user-message">
                    <img src="resources/img/unknown_male.png" alt="user-photo" id="user-photo">
                    <p id="user-message">Some text</p>
                    <p id="message-status">✓✓</p>
                </section>
                <section class="temp-other-users-message">
                    <img src="resources/img/unknown_female.png" alt="user-photo" id="user-photo">
                    <p id="my-message">Agree! =)</p>
                </section>
                <p id="user-typing-indicator">LastUser is typing....</p>
            </div>
            <section class="text-area">
                <input type="text" name="message" id="message" placeholder="Enter message...">
            </section>
        </div>
        <div class="stickers-section">
            <p>Stickers</p>
            <section class="stickers">
                <img src="resources/img/sticker1.png" alt="sticker1">
                <img src="resources/img/sticker2.png" alt="sticker2">
                <img src="resources/img/sticker3.png" alt="sticker3">
                <img src="resources/img/sticker4.png" alt="sticker4">
                <img src="resources/img/sticker5.png" alt="sticker5">
                <img src="resources/img/sticker6.png" alt="sticker6">
                <img src="resources/img/sticker7.png" alt="sticker7">
                <img src="resources/img/sticker8.png" alt="sticker8">
                <img src="resources/img/sticker9.png" alt="sticker9">
                <img src="resources/img/sticker10.png" alt="sticker10">
                <img src="resources/img/sticker11.png" alt="sticker11" id="last-sticker">
            </section>
        </div>
    </div>`
        return view
    },
    after_render: async () => {
        //cahnging title and css
        document.getElementById("css-tag").href = "resources/css/chat.css";
        document.title = "CoolChat messaging";

        //when user press enter, message will be send
        window.addEventListener ("keypress", function (e) {
            if (e.keyCode !== 13) return;
            let message = document.getElementById("message").value;
            let correspondence = document.querySelector('.correspondence');
            let userMessages = document.getElementsByClassName("temp-login-user-message");
            console.log(userMessages);
            for (const elem of userMessages) {
                var stringValOfBottom = getComputedStyle(elem).bottom;
                console.log(stringValOfBottom);
                var intValOfBottom = parseInt(stringValOfBottom, 10);
                intValOfBottom += 120;
                elem.style.bottom = intValOfBottom.toString() + "px";
            }
            correspondence.innerHTML += `<section class="temp-login-user-message" id="login-user-last-message" style="display: absolute; bottom: 0;">
            <img src="resources/img/unknown_male.png" alt="user-photo" id="user-photo">
            <p id="user-message">${message}</p>
            <p id="message-status">✓✓</p>
        </section>`
        });

    }
}

export default ChatPage