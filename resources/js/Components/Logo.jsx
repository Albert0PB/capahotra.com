import React from "react";
import { Link } from "@inertiajs/react";

import "../../css/Components/logo.css";

export default function Logo() {
    return (
        <div className="bright-logo-dark-bg">
            <div className="logo-container">
                <Link href="/">
                    <img
                        src="/images/white-logo-00.png"
                        alt="white capahotra logo"
                        className="logo-img"
                    />
                </Link>
            </div>
        </div>
    );
}
