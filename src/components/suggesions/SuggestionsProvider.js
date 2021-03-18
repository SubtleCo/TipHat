import React, { createContext, useState } from 'react'
import { Settings } from '../../Settings'

export const SuggestionContext = createContext()

export const SuggestionProvider = props => {
    const [suggestions, setSuggestions] = useState([])

    const getSuggestions = () => {
        return fetch(`${Settings.localApi}/suggestions`)
            .then(res => res.json())
            .then(setSuggestions)
    }

    return (
        <SuggestionContext.Provider value={{
            suggestions, getSuggestions
        }}>
            {props.children}
        </SuggestionContext.Provider>
    )
}