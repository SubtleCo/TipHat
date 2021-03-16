import React from 'react'
import { Route } from 'react-router-dom'
import { Register } from './auth/Register'
import { Home } from './home/Home'
import { LiveReport } from './liveReports/LiveReport'
import { LiveReportForm } from './liveReports/LiveReportForm'

export const ApplicationViews = () => {
    return (
        <>
            <Route exact path="/">
                <Home />
            </Route>

            <Route exact path="/user/edit">
                <Register />
            </Route>

            <Route exact path="/reports/create">
                <LiveReportForm />
            </Route>


        </>
    )
}