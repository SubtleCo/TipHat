import React from 'react'
import { Route } from 'react-router-dom'
import { Register } from './auth/Register'
import { Home } from './home/Home'
import { LastFmProvider } from './lastFm/LastFmProvider'
import { LiveReportForm } from './liveReports/LiveReportForm'
import { PlanProvider } from './plans/PlanProvider'
import { ReportList } from './reports/ReportList'
import { ViewReport } from './reports/ViewReport'

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

                    <Route path="/reports/create">
                        <LiveReportForm />
                    </Route>

                    <Route exact path="/reports">
                        <ReportList />
                    </Route>

                    <Route exact path="/reports/view/:planId(\d+)">
                        <ViewReport />
                    </Route>
                    
                    <Route exact path="/reports/edit/:planId(\d+)">
                        <ViewReport />
                    </Route>

                </PlanProvider>
            </LastFmProvider>

        </>
    )
}