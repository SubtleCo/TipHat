// Report Table contains the logic for calculating the table a user sees, changing the payment suggestion, and saving a plan.

import React, { useContext, useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router'
import { PlanContext } from '../plans/PlanProvider'
import { suggestions, getSuggestions } from '../suggestions/SuggestionsProvider'
import { apiArtists, getArtists, checkForArtist, addArtist } from '../artists/ArtistProvider'
import { addPlanArtist, getPlanArtists } from '../artists/PlanArtistProvider'
import './ReportTable.css'

export const ReportTable = ({ report }) => {
    const { addPlan, getPlans } = useContext(PlanContext)

    // This represents the live position of the track value suggestion, which the user may change
    const [suggestion, setSuggestion] = useState({})
    // This represents the actual array of artists represented in a live report
    const [reportTable, setReportTable] = useState([])
    // This helps ensure our API data is loaded before performing operations that require it
    const [isLoading, setIsLoading] = useState(true)


    const history = useHistory()

    // This set of variables provides the total number of tracks represented in a single report
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

    // This takes the raw report from Last.fm and transforms it into an array of artists to display to the user
    useEffect(() => {
        setReportTable(report.topartists?.artist)
    }, [report])


    // This sets the suggestion select to the user's default preference
    useEffect(() => {
        setSuggestion(suggestions.find(s => s.id === report.user.suggestionId))
    }, [isLoading])

    // This watches the suggestion select to change the state variable of suggestion if the user wants to recalculate the report with a different track value
    const handleLiveSuggestionChange = e => {
        setSuggestion(suggestions.find(s => s.id === parseInt(e.target.value)))
    }

    const handleSave = e => {
        // grab the updated artists from the ArtistProvider, which was populated on module load
        const artists = [...apiArtists]
        // period was passed through the API fetch call as an object
        const reportPeriod = report.period

        // Build a new plan object for the DB
        const newPlan = {}
        // user was passed through the API fetch call as an object
        newPlan.userId = report.user.id
        newPlan.timestamp = Date.now()
        newPlan.trackCount = totalCount
        newPlan.periodId = reportPeriod.id
        // As "reportTable" is an array of items derived from the API, and each line represents and artist, .length will provide a total count of artists
        newPlan.name = `Top ${reportTable.length} artists for ${reportPeriod.name}, ${new Date(newPlan.timestamp).getMonth()}/${new Date(newPlan.timestamp).getDate()}/${new Date(newPlan.timestamp).getFullYear()}`
        // There are two submit buttons - one with "paid" in the id and one without. These buttons will determine if a plan is paid or not.
        newPlan.paid = e.target.id.includes("paid")
        newPlan.suggestionId = suggestion.id


        // The logic for saving a new plan and the required artist and planArtist data. 
        addPlan(newPlan)
            // Using a promise to capture the id of the new plan, to be used in planArtist
            .then(plan => plan.json())
            .then(plan => {
                reportTable.forEach(artist => {
                    // Check to see if the artist is in the database. if not, add it
                    if (!checkForArtist(artist.name, artists)) {
                        addArtist(artist.name)
                        // Using a promise to capture the id of the new artist, to be used in planArtist
                            .then(dbArtist => {
                                addPlanArtist({
                                    artistId: dbArtist.id,
                                    planId: plan.id,
                                    // This comes directly from the last.fm API
                                    trackCount: parseInt(artist.playcount)
                                })
                            })
                    } else {
                        // If an artist is already in the database, find it and use its id for planArtist
                        const foundArtist = artists.find(a => a.name === artist.name)
                        addPlanArtist({
                            artistId: foundArtist.id,
                            planId: plan.id,
                            trackCount: parseInt(artist.playcount)
                        })
                    }
                })
                history.push('/reports')
            })
    }

    return (
        <section className="reportTable--container main__container">
            <h2>Your top {reportTable.length} artists for {report.period.name}</h2>
            <label htmlFor="suggestionSelect">Change the payout calculation to </label>
            <select id="suggestionSelect" value={suggestion?.id} onChange={handleLiveSuggestionChange} className="report__trackValueSelect">
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
                        <th>Estimated Potential Payout (as {suggestion?.name})</th>
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
        </section>
    )
}