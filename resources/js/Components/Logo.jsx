import React from "react";
import { Link } from "@inertiajs/react";

export default function Logo() {
    return (
        <div className="flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[90px] lg:h-[90px] bg-[var(--color-neutral-dark-2)] rounded-full flex items-center justify-center hover:bg-[var(--color-neutral-dark-3)] transition-colors duration-200">
                <Link href="/" className="flex items-center justify-center">
                    <img
                        src="/images/white-logo-00.png"
                        alt="white capahotra logo"
                        className="w-8 h-8 sm:w-10 sm:h-10 lg:w-[55px] lg:h-[55px] flex-shrink-0"
                    />
                </Link>
            </div>
        </div>
    );
}