import React, { useContext, useEffect, useState } from 'react'
import { ArtistContext } from '../artists/ArtistProvider'
import { PlanArtistContext } from '../artists/PlanArtistProvider'
import { UserContext } from '../auth/UserProvider'
import { LastFmContext } from '../lastFm/LastFmProvider'
import { PeriodContext } from '../periods/PeriodProvider'
import { PlanContext } from '../plans/PlanProvider'
import { ServiceContext } from '../services/ServiceProvider'
import { SuggestionContext } from '../suggestions/SuggestionsProvider'
import './LiveReport.css'
import { ReportTable } from './ReportTable'

export const LiveReport = () => {
    const { liveReport } = useContext(LastFmContext)
    const { currentUser, getCurrentUser } = useContext(UserContext)
    const { services, getServices } = useContext(ServiceContext)
    const { suggestions, getSuggestions } = useContext(SuggestionContext)
    const { addPlan } = useContext(PlanContext)
    const { periods, getPeriods } = useContext(PeriodContext)
    const { artists, getArtists, checkForArtist, addArtist } = useContext(ArtistContext)
    const { addPlanArtist } = useContext(PlanArtistContext)

    const [liveSuggestionId, setLiveSuggestionId] = useState(0)
    const [reportTable, setReportTable] = useState([])
    const [reportPeriod, setReportPeriod] = useState({})
    const [totalCount, setTotalCount] = useState(0)


    useEffect(() => {
        getPeriods()
        getArtists()
        getCurrentUser()
        getServices()
        getSuggestions()
    }, [])

    useEffect(() => {
        setLiveSuggestionId(currentUser.suggestionId)
    }, [currentUser])


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
                const artistNameArray = reportTable.map(artist => artist.name)
                const artistsToAdd = []
                artistNameArray.forEach(artist => {
                    if (!checkForArtist(artist)) {
                        artistsToAdd.push(artist)
                    }
                })
                const artistPromises = []
                artistsToAdd.forEach(artist => {
                    artistPromises.push(addArtist(artist))
                })
                // console.log(`this report contains ${artistNameArray.length} artists, ${artistsToAdd.length} of which SHOULD be added.`)
                Promise.all(artistPromises)
                    .then(getArtists)
                    .then(() => {
                        reportTable.forEach(line => {
                            debugger
                            ///==================================HOW TO FIX THIS====================================//
                            // handle the planArtist add inside of the artistAdd loop by capturing the id of the object it returns!
                            const thisArtist = artists.find(a => a.name === line.name)
                            const planArtist = {
                                planId: planId,
                                artistId: thisArtist.id,
                                trackCount: parseInt(line.playcount)
                            }
                            addPlanArtist(planArtist)
                            console.log('Added PlanArtist')
                        })
                    })

            })
    }
    if (reportTable.length) {
        return (
            <>
                <h2>Your top {reportTable.length} artists for {reportPeriod.name}</h2>
                <label htmlFor="suggestionSelect">Change the payout calculation to </label>
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



