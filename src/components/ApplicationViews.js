import React from 'react'
import { Route } from 'react-router-dom'
import { Register } from './auth/Register'
import { Home } from './home/Home'

export const ApplicationViews = () => {
    return (
        <>
            <Route exact path="/">
                <Home />
            </Route>

            <Route exact path="/user/edit">
                <Register />
            </Route>
        </>
    )
}