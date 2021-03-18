import React from 'react'
import { Route } from 'react-router-dom'
import { Register } from './auth/Register'
import { UserProvider } from './auth/UserProvider'
import { Home } from './home/Home'
import { LastFmProvider } from './lastFm/LastFmProvider'
import { LiveReport } from './liveReports/LiveReport'
import { LiveReportForm } from './liveReports/LiveReportForm'
import { PeriodProvider } from './periods/PeriodProvider'
import { ServiceProvider } from './services/ServiceProvider'
import { SuggestionProvider } from './suggesions/SuggestionsProvider'

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
                    <PeriodProvider>
                        <ServiceProvider>
                            <SuggestionProvider>
                                <Route exact path="/reports/create">
                                    <LiveReportForm />
                                    <LiveReport />
                                </Route>
                            </SuggestionProvider>
                        </ServiceProvider>
                    </PeriodProvider>
                </LastFmProvider>

            </UserProvider>
        </>
    )
}