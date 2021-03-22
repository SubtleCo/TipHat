import React, { useContext, useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router'
import { PlanContext } from '../plans/PlanProvider'
import { suggestions, getSuggestions } from '../suggestions/SuggestionsProvider'
import { apiArtists, getArtists, checkForArtist, addArtist } from '../artists/ArtistProvider'
import { addPlanArtist, getPlanArtists } from '../artists/PlanArtistProvider'
import './ReportTable.css'

export const ReportTable = ({ report }) => {
    const { addPlan, getPlans, plans } = useContext(PlanContext)

    const [suggestion, setSuggestion] = useState({})
    const [reportTable, setReportTable] = useState([])
    const [isLoading, setIsLoading] = useState(true)


    const history = useHistory()
    const { planId } = useParams()

    const trackCounts = reportTable.map(line => parseInt(line.playcount))
    const totalCount = trackCounts.reduce((a, b) => a + b, 0)

    const loadData = () => {
        const promises = [
            getArtists(),
            getSuggestions()
        ]
        Promise.all(promises)
            .then(() => {
                setIsLoading(false)
            })
    }

    useEffect(() => {
        setIsLoading(true)
        getPlans()
        loadData()
    }, [])

    useEffect(() => {
        setReportTable(report.topartists?.artist)
    }, [report])

    useEffect(() => {
        if (planId) {
            setSuggestion(suggestions.find(s => s.id === 4))
        } else {
            setSuggestion(suggestions.find(s => s.id === report.user.suggestionId))
        }
    }, [isLoading])

    const handleLiveSuggestionChange = e => {
        setSuggestion(suggestions.find(s => s.id === parseInt(e.target.value)))
    }

    const handleSave = e => {
        const artists = [...apiArtists]
        const reportPeriod = report.period

        const newPlan = {}
        newPlan.userId = report.user.id
        newPlan.timestamp = Date.now()
        newPlan.trackCount = totalCount
        newPlan.periodId = reportPeriod.id
        newPlan.name = `Top ${reportTable.length} artists for ${reportPeriod.name}, ${new Date(newPlan.timestamp).getMonth()}/${new Date(newPlan.timestamp).getDate()}/${new Date(newPlan.timestamp).getFullYear()}`
        newPlan.paid = e.target.id.includes("paid")
        newPlan.suggestionId = suggestion.id



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

    return (
        <>
            <h2>Your top {reportTable.length} artists for {report.period.name}</h2>
            <label htmlFor="suggestionSelect">Change the payout calculation to </label>
            <select id="suggestionSelect" value={suggestion.id} onChange={handleLiveSuggestionChange} className="report__trackValueSelect">
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
                        <th>Estimated {report.service.name} Payout</th>
                        <th>Estimated Potential Payout (as {suggestion.name})</th>
                        <th>Suggested Donation</th>
                    </tr>
                </thead>
                <tbody className="reportTable--body">
                    {
                        reportTable.map((line, i) => {
                            const payout = (line.playcount * report.service.amount).toFixed(2)
                            const potential = (line.playcount * suggestion?.amount).toFixed(2)
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