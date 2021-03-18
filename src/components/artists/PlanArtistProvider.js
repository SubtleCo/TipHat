import React, { createContext, useState } from 'react'
import { Settings } from '../../Settings'

export const PlanArtistContext = createContext()

export const PlanArtistProvider = props => {
    const [planArtists, setPlanArtists] = useState([])

    const getPlanArtists = () => {
        return fetch(`${Settings.localApi}/planArtists`)
            .then(res => res.json())
            .then(setPlanArtists)
    }

    const addPlanArtist = planArtist => {
        return fetch(`${Settings.localApi}/planArtists`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(planArtist)
        })
    }

    return (
        <PlanArtistContext.Provider value={{
            planArtists, getPlanArtists, addPlanArtist
        }}>
            {props.children}
        </PlanArtistContext.Provider>
    )
}