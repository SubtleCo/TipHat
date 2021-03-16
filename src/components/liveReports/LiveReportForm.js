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


    return (
        <form className="report__api__form">
            <h2>Generate a listening report</h2>
            <h4>Using your last.fm username <strong>{currentUser.lastFmAccount}</strong></h4>
            <div className="api__form__selects">
                <fieldset>
                    <label htmlFor="period">Report Type:</label>
                    <select id="period">
                        <option>Artist</option>
                        <option>Album</option>
                    </select>
                </fieldset>
            </div>

        </form>
    )
}