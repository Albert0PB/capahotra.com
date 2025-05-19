import React from "react";
import { Link, useForm } from "@inertiajs/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    const { post } = useForm();

    const handleLogout = (e) => {
        e.preventDefault();
        post("/logout");
    };

    return (
        <form onSubmit={handleLogout} className="sidebar-logout-form">
            <button type="submit" className="sidebar-link logout">
                <LogOut className="sidebar-icon" />
                <span>Logout</span>
            </button>
        </form>
    );
}
