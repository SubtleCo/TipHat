import { Settings } from '../../Settings'

export let apiArtists = []

export const getArtists = () => {
        return fetch(`${Settings.localApi}/artists`)
            .then(res => res.json())
            .then(pRes => apiArtists = pRes)
    }

export const checkForArtist = (artistName, artists) => {
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