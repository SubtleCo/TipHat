import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { UserContext } from '../auth/UserProvider'
import { LastFmContext, LastFmProvider } from '../lastFm/LastFmProvider'
import './LiveReportForm.css'

export const LiveReportForm = () => {
    const [apiQuery, setApiQuery] = useState("")
    const [apiParams, setApiParams] = useState({
        limit: "20",
        type: "",
        period: ""
    })
    const { currentUser, getCurrentUser } = useContext(UserContext)
    const { liveReport, getLiveReport } = useContext(LastFmContext)

    useEffect(() => {
        getCurrentUser()
    }, [])
    
//========================================================================================================//
// Here lies logic for chosing top albums or tracks instead of just artists. This could be a future feature.

    // const typeArray = [
    //     'Select Report Type',
    //     'artists',
    //     'albums',
    //     'tracks'
    // ]

    // const typeOptions = typeArray.map((type, i) => <option key={"type" + i} value={i}>{type}</option>
//========================================================================================================//

    const periodArray = [
        { unselected: 'Select A Listening Period' },
        { 'overall': 'all time' },
        { '7day': 'the last week' },
        { '1month': 'the last month' },
        { '3month': 'the last 3 months' },
        { '6month': 'the last 6 months' },
        { '12month': 'the last year' }
    ]

    const periodOptions = periodArray.map((period, i) => <option key={"period" + i} value={i}>{Object.values(period)[0]}</option>)

    const handleInputChange = e => {
        const newParams = {...apiParams}
        let selectedValue = e.target.value
        newParams[e.target.id] = selectedValue
        setApiParams(newParams)
    }

    const handleSubmit = e => {
        e.preventDefault()
        // const typeString = typeArray[parseInt(apiParams.type)]
        const typeString = 'artists'
        const periodString = Object.keys(periodArray[parseInt(apiParams.period)])[0]
        getLiveReport(typeString, periodString, apiParams.limit, currentUser.lastFmAccount)
    }


    return (
        <form className="report__api__form" onSubmit={handleSubmit}>
            <h2>Generate a listening report</h2>
            <p>Using your last.fm username <strong>{currentUser.lastFmAccount}</strong></p>
            <div className="api__form__selects">
                <p className="api__form__p">I'd like to see my top</p>
                <fieldset>
                    <input id="limit" type='number' min="5" max="50" value={apiParams.limit} onChange={handleInputChange}></input>
                </fieldset>
                <p className="api__form__p">artists for</p>
                {/* <fieldset>
                    <select id="type" onChange={handleInputChange}>
                        {typeOptions}
                    </select>
                </fieldset> */}
                <fieldset>
                    <select id="period" onChange={handleInputChange}>
                        {periodOptions}
                    </select>
                </fieldset>
                <input type="submit" className="button btn--go" id="apiSubmit" value="Please!"></input>
            </div>
        </form>
    )
}