import axios from "axios";
import type { UserDTO } from "../types/UserTypes";

// Use the correct backend port (change to 8081 if your backend is on 8081)
const API = "http://localhost:8081/api/v1/user/";

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`
    }
});

export const userService = {
    getUsers: async (): Promise<UserDTO[]> => {
        const res = await axios.get(API + "get", authHeader());
        return res.data;
    },

    saveUser: async (user: UserDTO) => {
        const res = await axios.post(API + "save", user, authHeader());
        return res.data;
    },

    updateUser: async (user: UserDTO) => {
        const res = await axios.put(API + "update", user, authHeader());
        return res.data;
    },

    deleteUser: async (id: number) => {
        await axios.delete(API + "delete/" + id, authHeader());
    }
};