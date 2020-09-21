import {database} from "../services/db.js"

let RegistrationPage = {
    render: async () => {
        let view = `<section class="page-content">
                <p id="chat-logo-image"><img src="resources/img/chat-logo.jpg" alt="CoolChat logo"></p>
                <p>Registration</p>
                <input type="text" name="name" placeholder="Name" id="name" required>
                <input type="text" name="surname" placeholder="Surname" id="surname" required>
                <input type="text" name="username" placeholder="Username" id="username" required>
                <input type="text" name="email" placeholder="Email" id="email" required>
                <input type="password" name="password" placeholder="Password" id="password" required>
                <input type="password" name="password-confirmation" placeholder="Confirm password" id="confirm-password" required>
                <input type="submit" value="Register" id="registration-button">
            </section>`
        return view
    },
    after_render: async () => {
        document.getElementById("css-tag").href = "resources/css/registration.css"
        document.title = "CoolChat registration"

        let registrationButton = document.getElementById("registration-button")
        registrationButton.addEventListener("click", (event) => {
            event.preventDefault()
            let name = document.getElementById("name").value.trim()
            let surname = document.getElementById("surname").value.trim()
            let username = document.getElementById("username").value.trim()
            let email = document.getElementById("email").value.trim()
            let password = document.getElementById("password").value
            let confirmPassword = document.getElementById("confirm-password").value
            console.log(name, surname, username, email, password, confirmPassword)
            if (password != confirmPassword){
                alert("Passsword != confirm password");
            } else if(surname == "" || name == "" || username == "" || password == ""){
                alert("All inputs must be filled")
            } else {
                database.createUser(name, surname, username, email, password)
            }
        }) 
    }
}

export default RegistrationPage