import React from 'react'
import { ApplicationViews } from './ApplicationViews'
import { NavBar } from './NavBar/NavBar'
import { Route, Redirect } from "react-router-dom"
import { Login } from "./auth/Login"
import { Register } from "./auth/Register"
import { userStorageKey } from "./auth/authSettings"
import { ServiceProvider } from './services/ServiceProvider'
import { SuggestionProvider } from './suggestions/SuggestionsProvider'
import { UserProvider } from './auth/UserProvider'

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

            <ServiceProvider>
                <SuggestionProvider>
                    <UserProvider>
                        <Route path="/register">
                            <Register />
                        </Route>
                    </UserProvider>
                </SuggestionProvider>
            </ServiceProvider>
        </>
    )
}