import axios from "axios";

// Backend response wrapper
export interface ResponseDTO<T> {
    code: number;
    message: string;
    data: T;
}

// Auth data returned by backend
export interface AuthResponse {
    email: string;
    token: string;
    role: string;
}

/**
 * Authenticate user with email/password
 */
export const authenticateUser = async (
    email: string,
    password: string
): Promise<AuthResponse> => {
    try {
        const response = await axios.post<ResponseDTO<AuthResponse>>(
            "http://localhost:8081/api/v1/auth/authenticate",
            { email, password }
        );

        const authData = response.data?.data;

        if (!authData || !authData.token) {
            throw new Error("Token missing in response");
        }

        return authData;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unexpected error occurred");
    }
};