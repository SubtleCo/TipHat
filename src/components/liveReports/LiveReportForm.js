// Live Report Form is responsible for building the query to the lastFm API, which it does on line 53.

import React, { useContext, useEffect, useState } from 'react'
import { currentUser, getCurrentUser } from '../auth/UserProvider'
import { LastFmContext, LastFmProvider } from '../lastFm/LastFmProvider'
import { services, getServices } from '../services/ServiceProvider'
import { periods, getPeriods } from '../periods/PeriodProvider'
import './LiveReportForm.css'
import { ReportTable } from './ReportTable'
import { Typography } from '@material-ui/core'

export const LiveReportForm = () => {
    const [isLoading, setIsLoading] = useState(true)
    // Keep track of the query parameters a user will send to the API
    const [apiParams, setApiParams] = useState({
        limit: "20",
        type: "",
        periodId: 0
    })
    const { liveReport, getLiveReport, setLiveReport } = useContext(LastFmContext)

    // Pull in necessary data to populate selects - these come in as promises
    const loadData = () => {
        const promises = [
            getPeriods(),
            getServices()
        ]
        Promise.all(promises)
            .then(() => {
                setIsLoading(false)
            })
    }

    // clean up liveReport on dismount to eliminate cross-talk and keep the "create" page fresh every time
    useEffect(() => {
        loadData()
        getCurrentUser()
        return (() => {
            setLiveReport({})
        })
    }, [])

    const handleInputChange = e => {
        const newParams = { ...apiParams }
        let selectedValue = e.target.value
        if (e.target.id.includes("Id")) selectedValue = parseInt(selectedValue)
        newParams[e.target.id] = selectedValue
        setApiParams(newParams)
    }

    // Build the query with the properly formatted strings before calling last.fm for the live report
    const handleSubmit = e => {
        e.preventDefault()
        if (apiParams.periodId > 0) {
            const typeString = 'artists'
            const period = periods.find(p => p.id === apiParams.periodId)
            const periodString = period.query
            const service = services.find(s => s.id === currentUser.serviceId)
            getLiveReport(typeString, periodString, apiParams.limit, currentUser, period, service)
        } else {
            window.alert("Please select a listening period")
        }
    }


    return (
        <>
            <form className="report__api__form main__container" onSubmit={handleSubmit}>
                <Typography variant="h3" component="h2" >Generate A Listening Report</Typography>
                <Typography variant="body1" component="p">
                    Using your last.fm username <strong>{currentUser.lastFmAccount}</strong>
                </Typography>
                <div className="api__form__selects">
                    <p className="api__form__p">I'd like to see my top</p>
                    <fieldset>
                        <input id="limit" type='number' min="5" max="50" value={apiParams.limit} onChange={handleInputChange}></input>
                    </fieldset>
                    <p className="api__form__p">artists for</p>
                    <fieldset>
                        <select id="periodId" onChange={handleInputChange}>
                            <option value="0">Select a period</option>
                            {
                                periods.map(period => <option key={"period " + period.id} value={period.id} onChange={handleInputChange}>{period.name}</option>)
                            }
                        </select>
                    </fieldset>
                    <input type="submit" className="button btn--go" id="apiSubmit" value="Please!"></input>
                </div>
            </form>
            {Object.keys(liveReport).length > 0 &&
                <ReportTable report={liveReport}

                />
            }
        </>
    )
}