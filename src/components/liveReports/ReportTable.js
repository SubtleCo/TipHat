import React from 'react'
import './ReportTable.css'

export const ReportTable = ({ reportTable, totalCount, service, suggestion }) => {
    const { addPlan } = useContext(PlanContext)

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

    return (
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