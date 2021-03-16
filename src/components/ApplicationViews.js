import React from 'react'
import { Route } from 'react-router-dom'

export const ApplicationViews = () => {
    return (
        <Route exact path="/">
            <h1>This is home</h1>
            <p>For now, home is boring.</p>
        </Route>
    )
}