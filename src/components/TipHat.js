import React from 'react'
import { ApplicationViews } from './ApplicationViews'
import { NavBar } from './NavBar/NavBar'
import { Route, Redirect } from "react-router-dom"
import { Login } from "./auth/Login"
import { Register } from "./auth/Register"
import { userStorageKey } from "./auth/authSettings"
import { Footer } from './footer/Footer'
import './TipHat.css'
import { ThemeProvider } from '@material-ui/core/styles'



export const TipHat = ({ theme }) => {
    return (
        <>
            <Route render={() => {
                if (sessionStorage.getItem(userStorageKey)) {
                    return (
                        <>
                                <NavBar />
                                <ApplicationViews />
                                <Footer />
                        </>
                    )
                } else {
                    return <Redirect to="/login" />;
                }
            }} />

            <Route path="/login">
                <Login />
            </Route>

            <Route path="/register">
                <Register />
            </Route>

        </>
    )
}