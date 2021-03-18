import React from 'react'
import { Route } from 'react-router-dom'
import { Register } from './auth/Register'
import { UserProvider } from './auth/UserProvider'
import { Home } from './home/Home'
import { LastFmProvider } from './lastFm/LastFmProvider'
import { LiveReport } from './liveReports/LiveReport'
import { LiveReportForm } from './liveReports/LiveReportForm'
import { PeriodProvider } from './periods/PeriodProvider'

export const ApplicationViews = () => {
    return (
        <>
            <UserProvider>
                <Route exact path="/">
                    <Home />
                </Route>

                <Route exact path="/user/edit">
                    <Register />
                </Route>

                <LastFmProvider>
                    <PeriodProvider>
                        <Route exact path="/reports/create">
                            <LiveReportForm />
                            <LiveReport />
                        </Route>
                    </PeriodProvider>
                </LastFmProvider>

            </UserProvider>
        </>
    )
}