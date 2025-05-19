import React from "react";
import { useForm } from "@inertiajs/react";
import Logo from "../../Components/Logo";

import "../../../css/Pages/reset-password.css";

export default function ResetPassword({ token, email: defaultEmail }) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        email: defaultEmail || "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/reset-password");
    };

    return (
        <div className="page-reset-password">
            <form onSubmit={handleSubmit} className="reset-password-form">
                <Logo />
                <h2 className="reset-password-title">Reset your password</h2>

                <div className="input-group">
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="Email"
                    />
                </div>

                <div className="input-group">
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="New password"
                    />
                </div>

                <div className="input-group">
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        placeholder="Confirm password"
                    />
                </div>

                {errors.email && <span>{errors.email}</span>}
                <button disabled={processing}>Submit new password</button>
                {errors.password && <span>{errors.password}</span>}
                {errors.password_confirmation && (
                    <span>{errors.password_confirmation}</span>
                )}
            </form>
        </div>
    );
}
