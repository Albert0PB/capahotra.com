import React from "react";

import "../../css/Pages/not-found.css";

export default function NotFound() {
    return (
        <div className="page-not-found">
            <div className="not-found-content">
                <div className="not-found-content-wrapper">
                    <h2 className="not-found-title">404 - Not Found</h2>
                    <div className="not-found-text">
                        <p>
                            Looks like you got lost... Try starting again from
                            Home!
                        </p>
                        <a href="/dashboard">Return</a>
                    </div>
                </div>
            </div>

            <img
                src="/images/cat-wow-nobg.png"
                alt="not found cat image"
                id="cat-wow-nobg"
            />
            <img
                src="/images/little-tiger-nobg.png"
                alt="little tiger image"
                id="little-tiger-nobg"
            />
        </div>
    );
}
