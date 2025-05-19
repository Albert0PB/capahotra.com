import React from "react";
import { Link } from "@inertiajs/react";

import "../../css/Components/header.css";

export default function Header()
{
    return (
        <div className="header">
            <div className="logo-header">
                <img 
                    src="/images/white-logo-00.png"
                    alt="white capahotra logo"
                />
            </div>
            <div className="links">
                <div className="links-left">
                    <Link href={"/services"}>Services</Link>
                    <Link href={"/about-us"}>About Us</Link>
                    <Link href={"/docs"}>Docs</Link>
                </div>
                <div className="links-right">
                    <Link href={"/login"}>Log In</Link>
                    <Link href={"/register"}>Register</Link>
                </div>
            </div>
        </div>
    )
}