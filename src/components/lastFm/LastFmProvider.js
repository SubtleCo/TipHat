import React, { createContext, useState } from 'react'

export const LastFmContext = createContext()

export const LastFmProvider = props => {
    const [liveReport, setLiveReport] = useState({})

    const getLiveReport = (type, period, limit, userName, periodId) => {
        return fetch(`http://ws.audioscrobbler.com/2.0/?method=user.gettop${type}&user=${userName}&period=${period}&limit=${limit}&api_key=${process.env.REACT_APP_LAST_FM_KEY}&format=json`)
        .then(res => res.json())
        .then(report => {
            report.limit = limit
            report.period = period
            report.periodId = periodId
            return report
        })
        .then(setLiveReport)
    }

    return (
        <LastFmContext.Provider value={{
            liveReport, getLiveReport
        }}>
            {props.children}
        </LastFmContext.Provider>
    )
}

