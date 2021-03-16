import React, { useState } from 'react'
import './LiveReportForm.css'

export const LiveReportForm = () => {
    const [apiString, setApiString] = useState("")

    
    return (
        <form className="report__api__form">
            <h2>Generate a listening report</h2>
            <div className="api__form__selects">
                <fieldset>
                    <label htmlFor="type">Report Type:</label>
                    <select id="type">
                        <option>Artist</option>
                        <option>Album</option>
                    </select>
                </fieldset>
            </div>

        </form>
    )
}