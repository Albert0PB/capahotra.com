import React from "react";
import { useForm, Link } from "@inertiajs/react";
import { Mail, Lock } from "lucide-react";

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
        <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex justify-center items-center p-4">
            <form 
                onSubmit={handleSubmit} 
                className="flex flex-col items-center justify-center bg-[var(--color-neutral-bright)] rounded-lg shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8"
            >
                <Logo />
                
                {/* Email Input */}
                <div className="w-full">
                    <div className="flex items-center border-b-2 border-[var(--color-neutral-dark-2)] pb-2 mb-4 w-full">
                        <Mail className="mr-3 text-[var(--color-neutral-dark-2)] flex-shrink-0" size={20} />
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="Email"
                            className="flex-1 bg-transparent border-0 outline-none text-[var(--color-neutral-dark)] placeholder:text-[var(--color-neutral-dark)]/60 text-sm sm:text-base"
                            required
                        />
                    </div>
                    {errors.email && (
                        <span className="text-[var(--color-error)] text-xs sm:text-sm block">{errors.email}</span>
                    )}
                </div>

                {/* Password Input */}
                <div className="w-full">
                    <div className="flex items-center border-b-2 border-[var(--color-neutral-dark-2)] pb-2 mb-4 w-full">
                        <Lock className="mr-3 text-[var(--color-neutral-dark-2)] flex-shrink-0" size={20} />
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            placeholder="Password"
                            className="flex-1 bg-transparent border-0 outline-none text-[var(--color-neutral-dark)] placeholder:text-[var(--color-neutral-dark)]/60 text-sm sm:text-base"
                            required
                        />
                    </div>
                    {errors.password && (
                        <span className="text-[var(--color-error)] text-xs sm:text-sm block">{errors.password}</span>
                    )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-start w-full">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData("remember", e.target.checked)}
                            className="mr-2 w-4 h-4 border-2 border-[var(--color-neutral-dark)] rounded focus:ring-2 focus:ring-[var(--color-primary)] accent-[var(--color-primary)]"
                        />
                        <span className="text-[var(--color-neutral-dark)] text-sm sm:text-base">
                            Remember me
                        </span>
                    </label>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit"
                    disabled={processing}
                    className="w-full bg-[var(--color-neutral-dark-2)] text-[var(--color-neutral-bright)] py-3 px-6 rounded-full font-medium text-sm sm:text-base lg:text-[1.5rem] hover:bg-[var(--color-neutral-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {processing ? "Logging in..." : "Login"}
                </button>

                {/* Links */}
                <div className="flex flex-col gap-3 items-center text-center w-full">
                    <Link 
                        href="/forgot-password"
                        className="text-[var(--color-neutral-dark-2)]/70 hover:text-[var(--color-neutral-dark-2)] text-sm sm:text-base transition-colors duration-200"
                    >
                        Forgot password?
                    </Link>
                    <Link 
                        href="/register"
                        className="text-[var(--color-neutral-dark-2)]/70 hover:text-[var(--color-neutral-dark-2)] text-sm sm:text-base transition-colors duration-200"
                    >
                        New to Capahotra? <span className="underline">Register now</span>
                    </Link>
                </div>
            </form>
        </div>
    );
}