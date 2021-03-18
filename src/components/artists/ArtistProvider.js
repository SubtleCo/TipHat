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

    const addArtist = artist => {
        return fetch(`${Settings.localApi}/artists`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(artist)
        })
            .then(getArtists)
    }

    return (
        <ArtistContext.Provider value={{
            artists, getArtists, addArtist
        }}>
            {props.children}
        </ArtistContext.Provider>
    )
}