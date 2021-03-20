import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { apiArtists, getArtists, checkForArtist, addArtist } from '../artists/ArtistProvider'
import { planArtists, addPlanArtist, getPlanArtists } from '../artists/PlanArtistProvider'
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
    const { currentUser } = useContext(UserContext)
    const [liveSuggestionId, setLiveSuggestionId] = useState(0)
    const [reportTable, setReportTable] = useState([])
    const [reportPeriod, setReportPeriod] = useState({})
    const [totalCount, setTotalCount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const history = useHistory()

    const loadData = () => {
        const promises = [
            getArtists(),
            getPlanArtists()
        ]
        Promise.all(promises)
            .then(() => {
                setIsLoading(false)
            })
    }

    useEffect(() => {
        loadData()
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

        return (
            (reportTable.length &&
                <>
                    <ReportTable reportTable={reportTable}
                        totalCount={totalCount}
                        service={services.find(s => s.id === currentUser.serviceId)}
                        suggestion={suggestions.find(s => s.id === liveSuggestionId)} />
                </>
            )
        )
}



