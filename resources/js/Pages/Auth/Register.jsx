import React from "react";
import { useForm, Link } from "@inertiajs/react";
import { Mail, Lock, User } from "lucide-react";
import "../../../css/Pages/register.css";

import Logo from "../../Components/Logo";

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/register", {
            onSuccess: () => {
                window.location.href = "/dashboard";
            },
        });
    };

    return (
        <div className="page-register">
            <form onSubmit={handleSubmit} className="register-form">
                <div className="register-form-wrapper">
                    <Logo />
                    <h2 className="register-title">Create an Account</h2>

                    {/* Campo Nombre */}
                    <div className="input-group">
                        <User className="input-icon" />
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Full Name"
                        />
                    </div>
                    {errors.name && (
                        <span className="error-message">{errors.name}</span>
                    )}

                    {/* Campo Email */}
                    <div className="input-group">
                        <Mail className="input-icon" />
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="Email"
                        />
                    </div>
                    {errors.email && (
                        <span className="error-message">{errors.email}</span>
                    )}

                    {/* Campo Contraseña */}
                    <div className="input-group password">
                        <Lock className="input-icon" />
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="Password"
                        />
                    </div>
                    {errors.password && (
                        <span className="error-message">{errors.password}</span>
                    )}

                    {/* Confirmar Contraseña */}
                    <div className="input-group password">
                        <Lock className="input-icon" />
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            placeholder="Confirm Password"
                        />
                    </div>
                    {errors.password_confirmation && (
                        <span className="error-message">
                            {errors.password_confirmation}
                        </span>
                    )}

                    <button disabled={processing}>Register</button>

                    <div className="register-links">
                        <Link href="/login">
                            Already have an account? <u>Login here</u>
                        </Link>
                    </div>
                </div>
            </form>
            <div className="register-image-container">
                <div className="image-gradient-overlay"></div>
                <img src="/images/cat-yawn.jpg" alt="cat yawning" />
            </div>
        </div>
    );
}
