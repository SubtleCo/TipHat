import React from 'react'
import { Route } from 'react-router-dom'
import { Register } from './auth/Register'
import { Home } from './home/Home'
import { LastFmProvider } from './lastFm/LastFmProvider'
import { LiveReportForm } from './liveReports/LiveReportForm'
import { PlanProvider } from './plans/PlanProvider'

export const ApplicationViews = () => {
    return (
        <>
                <Route exact path="/">
                    <Home />
                </Route>


                <Route exact path="/user/edit">
                    <Register />
                </Route>


                <LastFmProvider>
                    <PlanProvider>
                        <Route exact path="/reports/create">
                            <LiveReportForm />
                        </Route>
                    </PlanProvider>
                </LastFmProvider>
        </>
    )
}