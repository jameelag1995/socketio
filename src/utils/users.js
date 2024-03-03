const users = [];

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Validate the data
    if (!username || !room) return { error: "Username and room are required!" };

    // Check for existing user with same name
    const existingUser = users.find(
        (user) => user.room === room && user.username === username
    );

    // If there is an existing user
    if (existingUser) return { error: "Username already taken." };

    // Create the new user
    const user = { id, username, room };

    users.push(user);

    return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) return users.splice(index, 1)[0];

    return { error: "No such user with given id" };
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
};

// addUser({ id: 22, username: "Jameel", room: "Labs" });
// console.log(users);

// const removedUser = removeUser(22);
// console.log(removedUser);
// console.log(users);
// console.log(getUser(22));
// console.log(getUsersInRoom("Labs"));
