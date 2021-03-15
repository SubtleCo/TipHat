import React from 'react'
import { ApplicationViews } from './ApplicationViews'
import { NavBar } from './NavBar/NavBar'
import { Route, Redirect } from "react-router-dom"
import { Login } from "./auth/Login"
import { Register } from "./auth/Register"
import { userStorageKey } from "./auth/authSettings"

export const TipHat = props => {
    return (
        <>
            <Route render={() => {
                if (sessionStorage.getItem(userStorageKey)) {
                    return (
                        <>
                                      <NavBar />
                                      <ApplicationViews />
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