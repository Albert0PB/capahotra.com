import React from "react";
import { useForm, Link } from "@inertiajs/react";
import { Mail } from "lucide-react";
import "../../../css/Pages/forgot-password.css";

import Logo from "../../Components/Logo";

export default function ForgotPassword() {
    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm({
            email: "",
        });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/forgot-password");
    };

    return (
        <div className="page-forgot-password">
            <form onSubmit={handleSubmit} className="forgot-password-form">
                <div className="header-inline">
                    <Logo />
                    <h2 className="forgot-password-title">
                        Forgot your password?
                    </h2>
                </div>
                <p className="form-description">
                    Enter your email address and we’ll send you a link to reset
                    your password.
                </p>

                <div className="input-group">
                    <Mail className="input-icon" />
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="Email"
                        maxLength={100}
                    />
                </div>
                {errors.email && <span>{errors.email}</span>}

                {recentlySuccessful && (
                    <div className="success-message">
                        A password reset link has been sent to your email.
                    </div>
                )}

                <button disabled={processing}>Send reset link</button>

                <div className="forgot-password-links">
                    <Link href="/login">
                        Remembered your password? <u>Log in</u>
                    </Link>
                </div>
            </form>
        </div>
    );
}
