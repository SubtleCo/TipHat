import React, { createContext, useState } from 'react'
import { Settings } from '../../Settings'

export const ArtistContext = createContext()

export const ArtistProvider = props => {
    const [artists, setArtists] = useState([])

    const getArtists = () => {
        return fetch(`${Settings.localApi}/artists`)
            .then(res => res.json())
            .then(setArtists)
    }

    const checkForArtist = artistName => {
        const foundArtist = artists.find(a => a.name === artistName)
        if (foundArtist) return true
        return false
    }

    const addArtist = artistName => {
        return fetch(`${Settings.localApi}/artists`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: artistName})
        })
    }

    return (
        <ArtistContext.Provider value={{
            artists, getArtists, addArtist, checkForArtist
        }}>
            {props.children}
        </ArtistContext.Provider>
    )
}