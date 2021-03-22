import React, { useContext, useEffect, useState } from 'react'
import { currentUser, getCurrentUser } from '../auth/UserProvider'
import { LastFmContext, LastFmProvider } from '../lastFm/LastFmProvider'
import { services, getServices } from '../services/ServiceProvider'
import { periods, getPeriods } from '../periods/PeriodProvider'
import './LiveReportForm.css'
import { ReportTable } from './ReportTable'

export const LiveReportForm = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [apiParams, setApiParams] = useState({
        limit: "20",
        type: "",
        periodId: 0
    })
    const { liveReport, getLiveReport, setLiveReport } = useContext(LastFmContext)

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

    useEffect(() => {
        loadData()
        getCurrentUser()
        return(() => {
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

    const handleSubmit = e => {
        e.preventDefault()
        const typeString = 'artists'
        const period = periods.find(p => p.id === apiParams.periodId)
        const periodString = period.query
        const service = services.find(s => s.id === currentUser.serviceId)
        getLiveReport(typeString, periodString, apiParams.limit, currentUser, period, service)
    }


    return (
        <>
            <form className="report__api__form" onSubmit={handleSubmit}>
                <h2>Generate a listening report</h2>
                <p>Using your last.fm username <strong>{currentUser.lastFmAccount}</strong></p>
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