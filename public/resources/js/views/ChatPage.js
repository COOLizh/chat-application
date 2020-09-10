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
            <div class="container">
                <div class="correspondence">

                </div>
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
            const [container, block, messageArea] = [...document.querySelectorAll(".container, .correspondence, #message")];
            let message = messageArea.value;
            message = message.trim();
            if(message == "") return;
            const section = document.createElement("section");
            section.classList.add("temp-login-user-message");
            section.innerHTML = `
                <img src="resources/img/unknown_male.png" alt="user-photo" class="user-photo">
                <span class="user-message">${message}</span>
                <p class="message-status">✓✓</p>
            `;
            block.appendChild(section);
            [...block.children].reverse().forEach((child, index) => child.style.bottom = (index * 150) + "px");
            block.style.height = (block.children.length * 150) + "px";
            container.scrollTop += 150;
            messageArea.value = "";
            
        });

    }
}

export default ChatPage