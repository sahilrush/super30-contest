import { randomBytes } from 'crypto';
import express, { Request, Response } from 'express';

const app = express();
const server = require('http').createServer(app);
app.use(express.json());

interface User {
    username: string;
    password: string;
    avatar?: string; // Optional avatar property
}

const users = new Map<string, User>(); // Map to store users (sessionToken -> User)
const rooms = new Map<string, { width: number; height: number; users: Set<string> }>(); // Map to store rooms

// Utility functions
function generateRoomId(): string {
    return Math.random().toString(36).substring(2);
}

function generateSessionToken(length: number = 32): string {
    return randomBytes(length).toString("hex");
}

// Sign Up Endpoint
app.post('/signup', (req: Request, res: Response) => {
    const { username, password } = req.body;
    const sessionToken = generateSessionToken();
    users.set(sessionToken, { username, password });
    res.json({ sessionToken });
});

// Create Room Endpoint
app.post('/rooms', (req: Request, res: Response) => {
    const { dimensions } = req.body;
    const [width, height] = dimensions.split('x').map(Number);
    const roomId = generateRoomId();
    rooms.set(roomId, { width, height, users: new Set() });
    res.json({ roomId });
});

// Get User by UserID
app.get("/users/:userId", (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = [...users.values()].find((u: User) => u.username === userId);

    if (!user) {
         res.status(404).json({ error: "User not found" });
         return
    }

    res.json({ user });
});

// Update User Avatar
app.put("/users/:userId/avatar", (req: Request, res: Response) => {
    const { userId } = req.params;
    const { avatarImage } = req.body;
    const user = [...users.values()].find((u: User) => u.username === userId);

    if (!user) {
         res.status(404).json({ error: "User not found" });
         return
    }

    // Update the user in the Map
    users.set(userId, { ...user, avatar: avatarImage }); 
    res.json({ message: "Avatar updated successfully", user });
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});




//websocket implimentaion