const socket = io();

// Elements
const messageForm = document.querySelector("#message-form");
const messageInput = document.querySelector("#message-input");
const sendMessageBtn = document.querySelector("#send-message-btn");
const sendLocationBtn = document.querySelector("#send-location-btn");
const messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const linkTemplate = document.querySelector("#link-template").innerHTML;

socket.on("message", (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, { message });
    messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (location) => {
    console.log(location);
    const html = Mustache.render(linkTemplate, { location });
    messages.insertAdjacentHTML("beforeend", html);
});

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessageBtn.setAttribute("disabled", "disabled");
    const message = e.target.elements.message.value;

    socket.emit("sendMessage", message, () => {
        sendMessageBtn.removeAttribute("disabled");
        messageInput.value = "";
        messageInput.focus();
        console.log("The message was delivered");
    });
});

sendLocationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser.");
    }
    sendLocationBtn.setAttribute("disabled", "disabled");
    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position);

        socket.emit(
            "sendLocation",
            {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            },
            (msg) => {
                console.log(msg);
                sendLocationBtn.removeAttribute("disabled");
            }
        );
    });
});
