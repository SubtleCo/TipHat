// This module is responsible for displaying and editing saved reports. 
// 'thisPlan' is set by finding the plan from the DB using the corresponing ID, found in the URL with useParams()
// 'displayPlan' is a modified 'thisPlan' build specifically to feed the return statement, which displays the report to the DOM

import React, { useContext, useEffect, useState } from 'react'
import { apiArtists, getArtists } from '../artists/ArtistProvider'
import { getPlanArtists, apiPlanArtists } from '../artists/PlanArtistProvider'
import { PlanContext } from '../plans/PlanProvider'
import { periods, getPeriods } from '../periods/PeriodProvider'
import { getSuggestions, suggestions } from '../suggestions/SuggestionsProvider'
import { currentUser, getCurrentUser } from '../auth/UserProvider'
import { getServices, services } from '../services/ServiceProvider'
import { useHistory, useParams } from 'react-router'

export const ViewReport = () => {
    const { plans, getPlans, editPlan } = useContext(PlanContext)
    const [thisPlan, setThisPlan] = useState({})
    const [displayPlan, setDisplayPlan] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    const { planId } = useParams()
    const history = useHistory()


    const loadData = () => {
        const promises = [
            getArtists(),
            getPlanArtists(),
            getPeriods(),
            getSuggestions(),
            getCurrentUser(),
            getServices()

        ]
        Promise.all(promises)
            .then(() => {
                setIsLoading(false)
            })
    }

    useEffect(() => {
        loadData()
        getPlans()
    }, [])

    useEffect(() => {
        setThisPlan(plans.find(p => p.id === parseInt(planId)))
    }, [plans])

    useEffect(() => {
        // Grab the planartists from the API, which was called in loadData()
        const allPlanArtists = [...apiPlanArtists]
        // same with artists
        const artists = [...apiArtists]
        // filter plan artist for this plan
        const planArtists = allPlanArtists.filter(pA => pA.planId === thisPlan?.id)
        // sort in heirarchy of trackCount
        const sortedPlanArtists = planArtists.sort((a, b) => b.trackCount - a.trackCount)
        
        // These are all conditionals, as thisPlan isn't in place on first render - can this be refactored?
        setDisplayPlan({
            artistCount: planArtists.length,
            paid: thisPlan?.paid,
            trackCount: thisPlan?.trackCount,
            period: periods.find(p => p.id === thisPlan?.periodId),
            suggestion: suggestions.find(s => s.id === thisPlan?.suggestionId),
            service: services.find(s => s.id === currentUser.serviceId),
            reportTable: sortedPlanArtists.map(pA => {
                const artist = artists.find(a => a.id === pA.artistId)
                return ({
                    name: artist.name,
                    playcount: pA.trackCount
                })
            })
        })

    }, [thisPlan, isLoading])

    // if plan is not paid, allows user to edit suggestion / track value
    const handleLiveSuggestionChange = e => {
        const newPlan = { ...displayPlan }
        newPlan.suggestion = suggestions.find(s => s.id === parseInt(e.target.value))
        setDisplayPlan(newPlan)
    }

    const handleEdit = e => {
        editPlan(thisPlan.id, {
            suggestionId: displayPlan.suggestion.id
        })
        history.push("/reports")
    }

    return ((!isLoading) &&
        <section className="Report__View main__container">
            <h2>Your top {displayPlan?.artistCount} artists for {displayPlan.period?.name}</h2>

            {/* if this plan is unpaid, allow user to edit suggestion / track value. */}
            {displayPlan?.paid ? <p>This Plan is Paid!</p> :
                <>
                    <label htmlFor="suggestionSelect">Change the payout calculation to </label>
                    <select id="suggestionSelect" value={displayPlan.suggestion?.id} onChange={handleLiveSuggestionChange} className="report__trackValueSelect">
                        {
                            suggestions.map(s => <option key={"suggestion " + s.id} value={s.id}>{s.name}</option>)
                        }
                    </select>
                </>
            }

            <table className="reportTable">

                <thead>
                    <tr>
                        <th>Artist</th>
                        <th>Track Count</th>
                        <th>% of report</th>
                        <th>Estimated {displayPlan.service?.name} Payout</th>
                        <th>Estimated Potential Payout (as {displayPlan.suggestion?.name})</th>
                        <th>Suggested Donation</th>
                    </tr>
                </thead>
                
                <tbody className="reportTable--body">
                    {
                        displayPlan.reportTable.map((line, i) => {
                            const payout = (line.playcount * displayPlan.service?.amount).toFixed(2)
                            const potential = (line.playcount * displayPlan.suggestion.amount).toFixed(2)
                            return (
                                <tr key={i}>
                                    <td>{line.name}</td>
                                    <td>{line.playcount}</td>
                                    <td>{(line.playcount / displayPlan.trackCount * 100).toFixed(0)}%</td>
                                    <td>${payout}</td>
                                    <td>${potential}</td>
                                    <td>${(potential - payout).toFixed(2)}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

            {/* if this plan is unpaid, allow the user to save the edited version to the local api. otherwise, this button simply reroutes to the reports page */}
            {displayPlan?.paid ? <button onClick={() => history.push("/reports")}>Back To Reports</button> : <button onClick={handleEdit}>Save Changes</button>}
        </section>
    )
}