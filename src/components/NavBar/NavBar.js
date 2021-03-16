import React from 'react'
import { Link } from 'react-router-dom'
import './NavBar.css'
import hat from '../../images/hat.png'

export const NavBar = () => {
    return (
        <div className="nav">
            <img id="logo" src={hat} height="100"></img>
            <div className="nav__right">
                <h1>Tip Hat</h1>
                <nav id="navbar">
                    <Link to="/">Why Tip?</Link>
                </nav>
            </div>
        </div>
    )
}
