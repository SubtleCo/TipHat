import React from 'react'
import { Link } from 'react-router-dom'
import './NavBar.css'
import hat from '../../images/hat.png'

export const NavBar = () => {
    const userId = parseInt(sessionStorage.getItem('app_user_id'))

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
                    <Link to="/reports/create">Generate A Report</Link>
                    <Link to="/reports">Saved Reports</Link>
                    <Link to="/user/edit">(Account)</Link>
                    <Link to="/" onClick={logout}>(log out)</Link>

                </nav>
            </div>
        </div>
    )
}
