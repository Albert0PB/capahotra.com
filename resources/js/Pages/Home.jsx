import React from "react";

import Header from "../Components/Header";
import Footer from "../Components/Footer";

import "../../css/Pages/home.css";

export default function Home()
{
    return (
        <div className="page-home">
            <Header />
            <div className="main-home">
                <h1 className="home-title">Your finances: the <span className="text-[var(--color-secondary)]"><em>feline</em></span> way</h1>
            </div>
            <Footer />
        </div>
    )
}