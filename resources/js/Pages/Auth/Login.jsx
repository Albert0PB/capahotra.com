import React from "react";
import { useForm, Link } from "@inertiajs/react";
import { Mail, Lock } from "lucide-react";
import "../../../css/Pages/login.css";

import Logo from "../../Components/Logo";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/login", {
            onSuccess: () => {
                window.location.href = "/dashboard";
            },
        });
    };

    return (
        <div className="page-login">
            <form onSubmit={handleSubmit} className="login-form">
                <Logo />
                <div className="input-group">
                    <Mail className="input-icon" />
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="Email"
                    />
                </div>
                {errors.email && <span>{errors.email}</span>}

                <div className="input-group password">
                    <Lock className="input-icon" />
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="Password"
                    />
                </div>
                {errors.password && <span>{errors.password}</span>}

                <div className="remember-me">
                    <label>
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        Remember me
                    </label>
                </div>

                <button disabled={processing}>Login</button>

                <div className="login-links">
                    <Link href="/forgot-password">Forgot password?</Link>
                    <Link href="/register">
                        New to Capahotra? <u>Register now</u>
                    </Link>
                </div>
            </form>
        </div>
    );
}
