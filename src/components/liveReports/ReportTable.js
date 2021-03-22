import React, { useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { UserContext } from '../auth/UserProvider'
import { LastFmContext } from '../lastFm/LastFmProvider'
import { PlanContext } from '../plans/PlanProvider'
import { ServiceContext } from '../services/ServiceProvider'
import { SuggestionContext } from '../suggestions/SuggestionsProvider'
import { apiArtists, getArtists, checkForArtist, addArtist } from '../artists/ArtistProvider'
import { getPlanArtists, addPlanArtist } from '../artists/PlanArtistProvider'
import { periods, getPeriods } from '../periods/PeriodProvider'
import './ReportTable.css'

export const ReportTable = () => {
    const { addPlan } = useContext(PlanContext)
    const { liveReport } = useContext(LastFmContext)
    const { currentUser } = useContext(UserContext)

    const { services, getServices } = useContext(ServiceContext)
    const { suggestions, getSuggestions } = useContext(SuggestionContext)
    const [service, setService] = useState({})
    const [suggestion, setSuggestion] = useState({})
    
    const [liveSuggestionId, setLiveSuggestionId] = useState(0)
    const [reportTable, setReportTable] = useState([])
    const [reportPeriod, setReportPeriod] = useState({})
    const [totalCount, setTotalCount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const history = useHistory()

    const loadData = () => {
        const promises = [
            getArtists(),
            getPeriods(),
            getPlanArtists(),
            getServices(), 
            getSuggestions()
        ]
        Promise.all(promises)
            .then(() => {
                setIsLoading(false)
            })
    }

    useEffect(() => {
        loadData()
        setLiveSuggestionId(currentUser.suggestionId)
    }, [])

    useEffect(() =>{
        if (services.length) setService(services.find(s => s.id ===currentUser.serviceId))
        if (suggestions.length) setSuggestion(suggestions.find(s => s.id ===currentUser.suggestionId))
    }, [services, suggestions])

    useEffect(() => {
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
        const artists = [...apiArtists]

        const newPlan = {}
        newPlan.userId = currentUser.id
        newPlan.timestamp = Date.now()
        newPlan.trackCount = totalCount
        newPlan.periodId = reportPeriod.id
        newPlan.name = `Top ${reportTable.length} artists for ${reportPeriod.name}, ${new Date(newPlan.timestamp).getMonth()}/${new Date(newPlan.timestamp).getDate()}/${new Date(newPlan.timestamp).getFullYear()}`
        newPlan.paid = e.target.id.includes("paid")
        newPlan.suggestionId = liveSuggestionId



        addPlan(newPlan)
            .then(plan => plan.json())
            .then(plan => plan.id)
            .then(planId => {
                reportTable.forEach(artist => {
                    if (!checkForArtist(artist.name, artists)) {
                        addArtist(artist.name)
                            .then(dbArtist => {
                                addPlanArtist({
                                    artistId: dbArtist.id,
                                    planId: planId,
                                    trackCount: parseInt(artist.playcount)
                                })
                            })
                    } else {
                        const foundArtist = artists.find(a => a.name === artist.name)
                        addPlanArtist({
                            artistId: foundArtist.id,
                            planId: planId,
                            trackCount: parseInt(artist.playcount)
                        })
                    }
                })
                history.push('/')
            })
    }

    return (Boolean(reportTable.length) &&
        <>
            <h2>Your top {reportTable.length} artists for {reportPeriod.name}</h2>
            <label htmlFor="suggestionSelect">Change the payout calculation to </label>
            <select id="suggestionSelect" value={liveSuggestionId} onChange={handleLiveSuggestionChange} className="liveReport__trackValueSelect">
                {
                    suggestions.map(s => <option key={"suggestion " + s.id} value={s.id}>{s.name}</option>)
                }
            </select>
            <table className="reportTable">
                <thead>
                    <tr>
                        <th>Artist</th>
                        <th>Track Count</th>
                        <th>% of report</th>
                        <th>Estimated {service.name} Payout</th>
                        <th>Estimated Potential Payout (as a {suggestion.name})</th>
                        <th>Suggested Donation</th>
                    </tr>
                </thead>
                <tbody className="reportTable--body">
                    {
                        reportTable.map((line, i) => {
                            const payout = (line.playcount * service.amount).toFixed(2)
                            const potential = (line.playcount * suggestion.amount).toFixed(2)
                            return (
                                <tr key={i}>
                                    <td>{line.name}</td>
                                    <td>{line.playcount}</td>
                                    <td>{(line.playcount / totalCount * 100).toFixed(0)}%</td>
                                    <td>${payout}</td>
                                    <td>${potential}</td>
                                    <td>${(potential - payout).toFixed(2)}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <button id="savePlan" onClick={handleSave}>Save Plan For Later</button>
            <button id="savePlan--paid" onClick={handleSave}>Save Plan (paid)</button>
        </>
    )
}