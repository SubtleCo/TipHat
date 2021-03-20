import { Settings } from '../../Settings'

export const getArtists = () => {
        return fetch(`${Settings.localApi}/artists`)
            .then(res => res.json())
    }

export const checkForArtist = artistName => {
        const foundArtist = artists.find(a => a.name === artistName)
        if (foundArtist) return true
        return false
    }

export const addArtist = artistName => {
        return fetch(`${Settings.localApi}/artists`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: artistName })
        })
            .then(res => res.json())
    }