import {Router} from "./resources/js/router.js"
import {routes} from "./resources/js/route.js"

document.addEventListener("DOMContentLoaded", () => {
    // console.log("gggg")
    Router.init(routes)
})