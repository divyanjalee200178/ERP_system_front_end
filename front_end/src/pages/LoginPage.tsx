import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { authenticateUser } from "../services/authService";
import '../styles/LoginPage.css';


interface JwtPayload {
    role?: string;
}

interface AuthResponse {
    email: string;
    token: string;
    role: string;
}

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email || !password) return alert("Please fill all fields");

        try {
            setLoading(true);
            const data: AuthResponse = await authenticateUser(email, password);

            localStorage.setItem("jwtToken", data.token);

            // ✅ Decode JWT using named import
            const decoded: JwtPayload = jwtDecode<JwtPayload>(data.token);
            const role = decoded.role || data.role;

            switch (role.toUpperCase()) {
                case "ROLE_ADMIN":
                case "ADMIN":
                    navigate("/accounts");
                    break;
                case "ROLE_TEACHER":
                case "TEACHER":
                    navigate("/teacherDash");
                    break;
                case "ROLE_AUDITOR":
                case "AUDITOR":
                    navigate("/register");
                    break;
                default:
                    alert("Invalid role: " + role);
            }
        } catch (error: unknown) {
            alert(error instanceof Error ? error.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: "100%", padding: 10, backgroundColor: "#007bff", color: "white" }}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;