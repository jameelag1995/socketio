const socket = io();

// Elements
const messageForm = document.querySelector("#message-form");
const messageInput = document.querySelector("#message-input");
const sendMessageBtn = document.querySelector("#send-message-btn");
const sendLocationBtn = document.querySelector("#send-location-btn");
const messages = document.querySelector("#messages");
const sidebar = document.querySelector("#sidebar");
// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const linkTemplate = document.querySelector("#link-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const autoscroll = () => {
    //  New message element
    let newMessageElem = messages.lastElementChild;

    // Height of  the new message
    const newMessageStyles = getComputedStyle(newMessageElem);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = newMessageElem.offsetHeight + newMessageMargin;

    // Visible Height
    const visibleHeight = messages.offsetHeight;

    // Height of messages container
    const containerHeight = messages.scrollHeight;
    // How far have we scrolled?
    const scrollOffset = messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        messages.scrollTop = containerHeight;
    }
    
};

socket.on("message", (message) => {
    // console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm  a"),
    });
    messages.insertAdjacentHTML("beforeend", html);
    autoscroll();
});

socket.on("locationMessage", (message) => {
    // console.log(message);
    const html = Mustache.render(linkTemplate, {
        username: message.username,
        location: message.url,
        createdAt: moment(message.createdAt).format("h:mm  a"),
    });
    messages.insertAdjacentHTML("beforeend", html);
    autoscroll();
});

socket.on("roomData", ({ room, users }) => {
    console.log(room);
    console.log(users);
    const html = Mustache.render(sidebarTemplate, { room, users });
    sidebar.innerHTML = html;
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

socket.emit("join", { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = "/";
    }
});
