// External API provider to get a user's listening history

import React, { createContext, useState } from 'react'

export const LastFmContext = createContext()

export const LastFmProvider = props => {
    const [liveReport, setLiveReport] = useState({})
    // Passing in period and service object just to be used on return. Unrelated to API call.
    //              key:   str     str    int    str    obj         obj
    const getLiveReport = (type, period, limit, user, periodObj, serviceObj) => {
        return fetch(`http://ws.audioscrobbler.com/2.0/?method=user.gettop${type}&user=${user.lastFmAccount}&period=${period}&limit=${limit}&api_key=${process.env.REACT_APP_LAST_FM_KEY}&format=json`)
        .then(res => res.json())
        .then(report => {
            report.limit = limit
            report.user = user
            report.period = periodObj
            report.service = serviceObj
            return report
        })
        .then(setLiveReport)
    }

    return (
        <LastFmContext.Provider value={{
            liveReport, getLiveReport, setLiveReport
        }}>
            {props.children}
        </LastFmContext.Provider>
    )
}

