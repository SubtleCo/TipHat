import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../auth/UserProvider'
import { LastFmContext } from '../lastFm/LastFmProvider'
import { ServiceContext } from '../services/ServiceProvider'
import { SuggestionContext } from '../suggesions/SuggestionsProvider'
import './LiveReport.css'
import { ReportTable } from './ReportTable'

export const LiveReport = () => {
    const { liveReport } = useContext(LastFmContext)
    const { currentUser, getCurrentUser } = useContext(UserContext)
    const { services, getServices } = useContext(ServiceContext)
    const { suggestions, getSuggestions } = useContext(SuggestionContext)
    const [reportTable, setReportTable] = useState([])
    const [plan, setPlan] = useState({
        userId: 0,
        timestamp: 0,
        trackCount: 0,
        limit: 0,
        // this will change to periodId
        period: 0,
        name: "",
        paid: false,
        planTrackValue: 0
    })
    const [totalCount, setTotalCount] = useState(0)

    useEffect(() => {
        getServices()
        getSuggestions()
        if (Object.keys(liveReport).length) {
            setReportTable(liveReport.topartists.artist)
        }
    }, [liveReport])

    useEffect(() => {
        let trackCounts = reportTable.map(line => parseInt(line.playcount))
        setTotalCount(trackCounts.reduce((a, b) => a + b, 0))
    }, [reportTable])

    if (reportTable.length) {
        return (
            <ReportTable reportTable={reportTable}
                totalCount={totalCount}
                service={services.find(s => s.id === currentUser.serviceId)}
                suggestion={suggestions.find(s => s.id === currentUser.suggestionId)} />
        )
    } else {
        return ("")
    }
}
