import { io } from "socket.io-client";

const BACKEND_PORT = 5050;
export const BASE_URL = `http://localhost:${BACKEND_PORT}`

export const socket = io(BASE_URL);