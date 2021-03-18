import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../auth/UserProvider'
import { LastFmContext } from '../lastFm/LastFmProvider'
import { PeriodContext } from '../periods/PeriodProvider'
import { ServiceContext } from '../services/ServiceProvider'
import { SuggestionContext } from '../suggestions/SuggestionsProvider'
import './LiveReport.css'
import { ReportTable } from './ReportTable'

export const LiveReport = () => {
    const { liveReport } = useContext(LastFmContext)
    const { currentUser } = useContext(UserContext)
    const { services, getServices } = useContext(ServiceContext)
    const { suggestions, getSuggestions } = useContext(SuggestionContext)
    const { periods, getPeriods } = useContext(PeriodContext)
    const [liveSuggestionId, setLiveSuggestionId] = useState(0)
    const [reportTable, setReportTable] = useState([])
    const [reportPeriod, setReportPeriod] = useState({})
    const [plan, setPlan] = useState({
        userId: 0,
        timestamp: 0,
        trackCount: 0,
        periodId: 0,
        name: "",
        paid: false,
        planTrackValue: 0
    })
    const [totalCount, setTotalCount] = useState(0)

    useEffect(() => {
        getPeriods()
        setLiveSuggestionId(currentUser.suggestionId)
    }, [])


    useEffect(() => {
        getServices()
        getSuggestions()
        if (Object.keys(liveReport).length) {
            setReportTable(liveReport.topartists.artist)
        }
        setReportPeriod(periods.find(p => p.id === liveReport.periodId))
    }, [liveReport])

    useEffect(() => {
        let trackCounts = reportTable.map(line => parseInt(line.playcount))
        setTotalCount(trackCounts.reduce((a, b) => a + b, 0))
    }, [reportTable])

    const handleLiveSuggestionChange = e => {
        setLiveSuggestionId(parseInt(e.target.value))
    }

    const handleSave = e => {
        const newPlan = {...plan}
        newPlan.userId = currentUser.Id
        newPlan.timestamp = Date.now()
        newPlan.trackCount = totalCount
        newPlan.periodId = reportPeriod.id
        newPlan.name = `Top ${reportTable.length} artists for ${reportPeriod.name}, ${new Date(newPlan.timestamp).getMonth()}/${new Date(newPlan.timestamp).getDate()}/${new Date(newPlan.timestamp).getFullYear()}`
        newPlan.paid = e.target.id.includes("paid")
        newPlan.planTrackValue = suggestions.find(s => s.id === liveSuggestionId).amount

        console.log(newPlan)
    }


    if (reportTable.length) {
        return (
            <>
                <h2>Your top {reportTable.length} artists for {reportPeriod.name}</h2>
                <label htmlFor="suggestionSelect">Change the payout calculation to a </label>
                <select id="suggestionSelect" value={liveSuggestionId} onChange={handleLiveSuggestionChange} className="liveReport__trackValueSelect">
                    {
                        suggestions.map(s => <option key={"suggestion " + s.id} value={s.id}>{s.name}</option>)
                    }
                </select>
                <ReportTable reportTable={reportTable}
                    totalCount={totalCount}
                    service={services.find(s => s.id === currentUser.serviceId)}
                    suggestion={suggestions.find(s => s.id === liveSuggestionId)} />
                <button id="savePlan" onClick={handleSave}>Save Plan For Later</button>
                <button id="savePlan--paid" onClick={handleSave}>Save Plan (paid)</button>
            </>
        )
    } else {
        return ("")
    }
}
