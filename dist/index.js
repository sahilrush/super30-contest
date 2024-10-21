"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const server = require('http').createServer(app);
app.use(express_1.default.json());
const users = new Map(); // Map to store users (sessionToken -> User)
const rooms = new Map(); // Map to store rooms
// Utility functions
function generateRoomId() {
    return Math.random().toString(36).substring(2);
}
function generateSessionToken(length = 32) {
    return (0, crypto_1.randomBytes)(length).toString("hex");
}
// Sign Up Endpoint
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const sessionToken = generateSessionToken();
    users.set(sessionToken, { username, password });
    res.json({ sessionToken });
});
// Create Room Endpoint
app.post('/rooms', (req, res) => {
    const { dimensions } = req.body;
    const [width, height] = dimensions.split('x').map(Number);
    const roomId = generateRoomId();
    rooms.set(roomId, { width, height, users: new Set() });
    res.json({ roomId });
});
// Get User by UserID
app.get("/users/:userId", (req, res) => {
    const { userId } = req.params;
    const user = [...users.values()].find((u) => u.username === userId);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    res.json({ user });
});
// Update User Avatar
app.put("/users/:userId/avatar", (req, res) => {
    const { userId } = req.params;
    const { avatarImage } = req.body;
    const user = [...users.values()].find((u) => u.username === userId);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    // Update the user in the Map
    users.set(userId, Object.assign(Object.assign({}, user), { avatar: avatarImage }));
    res.json({ message: "Avatar updated successfully", user });
});
// Start the server
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
