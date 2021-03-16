import React from 'react'
import { Link } from 'react-router-dom'
import './NavBar.css'
import hat from '../../images/hat.png'

export const NavBar = () => {

    const logout = () => {
        sessionStorage.clear('app_user_id')
    }
    return (
        <div className="nav">
            <img id="logo" src={hat} height="100"></img>
            <div className="nav__right">
                <h1>Tip Hat</h1>
                <nav id="navbar">
                    <Link to="/">Why Tip?</Link>
                    <Link to="/" onClick={logout}>log out</Link>
                </nav>
            </div>
        </div>
    )
}