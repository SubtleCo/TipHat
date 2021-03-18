import React, { createContext, useState } from 'react'
import { Settings } from '../../Settings'

export const PeriodContext = createContext()

export const PeriodProvider = props => {
    const [periods, setPeriods] = useState([])

    const getPeriods = () => {
        return fetch(`${Settings.localApi}/periods`)
            .then(res => res.json())
            .then(setPeriods)
    }

    return (
        <PeriodContext.Provider value={{
            periods, getPeriods
        }}>
            {props.children}
        </PeriodContext.Provider>
    )
}

