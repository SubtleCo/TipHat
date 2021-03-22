import React from 'react'
import { Route } from 'react-router-dom'
import { Register } from './auth/Register'
import { UserProvider } from './auth/UserProvider'
import { Home } from './home/Home'
import { LastFmProvider } from './lastFm/LastFmProvider'
// import { LiveReport } from './liveReports/LiveReport'
import { LiveReportForm } from './liveReports/LiveReportForm'
import { ReportTable } from './liveReports/ReportTable'
import { PeriodProvider } from './periods/PeriodProvider'
import { PlanProvider } from './plans/PlanProvider'
import { ServiceProvider } from './services/ServiceProvider'
import { SuggestionProvider } from './suggestions/SuggestionsProvider'

export const ApplicationViews = () => {
    return (
        <>
            <UserProvider>

                <Route exact path="/">
                    <Home />
                </Route>

                <SuggestionProvider>
                    <ServiceProvider>
                        <Route exact path="/user/edit">
                            <Register />
                        </Route>
                    </ServiceProvider>
                </SuggestionProvider>

                <LastFmProvider>
                    <ServiceProvider>
                        <SuggestionProvider>
                            <PlanProvider>
                                <PeriodProvider>
                                    <Route exact path="/reports/create">
                                        <LiveReportForm />
                                        <ReportTable />
                                    </Route>
                                </PeriodProvider>
                            </PlanProvider>
                        </SuggestionProvider>
                    </ServiceProvider>
                </LastFmProvider>

            </UserProvider>
        </>
    )
}