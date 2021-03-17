import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../auth/UserProvider'
import './LiveReportForm.css'

export const LiveReportForm = () => {
    const [apiQuery, setApiQuery] = useState({
        period: "",
        limit: ""
    })
    const { currentUser, getCurrentUser } = useContext(UserContext)

    useEffect(() => {
        getCurrentUser()
    }, [])
// API Key Format
// http://ws.audioscrobbler.com/2.0/?mthod=user.gettopartists&user={username}&api_key={key}&format=json

    const typeArray = [
        'Select Report Type',
        'artists',
        'albums',
        'tracks'
    ]

    const typeOptions = typeArray.map((type, i) => <option value={i}>{type}</option>)

    const periodArray = [
        {unselected: 'Select A Listening Period'},
        {'overall': 'all time'},
        {'7day': 'the last week'},
        {'1month': 'the last month'},
        {'3month': 'the last 3 months'},
        {'6month': 'the last 6 months'},
        {'12month': 'the last year'}
    ]

    const periodOptions = periodArray.map((period, i) => <option value={i}>{Object.values(period)[0]}</option>)

    return (
        <form className="report__api__form">
            <h2>Generate a listening report</h2>
            <h4>Using your last.fm username <strong>{currentUser.lastFmAccount}</strong></h4>
            <div className="api__form__selects">
                <fieldset>
                    <p className="api__form__p">I'd like to see my top</p>
                    <input type='number' min="5" max="50" default="25" placeholder="25"></input>
                </fieldset>
                <fieldset>
                    <select id="type">
                        {typeOptions}
                    </select>
                </fieldset>
                <fieldset>
                    <p className="api__form__p">for</p>
                    <select id="period">
                        {periodOptions}
                    </select>
                </fieldset>
            </div>
        </form>
    )
}