import { Settings } from '../../Settings'

export let planArtists = []

export const getPlanArtists = () => {
        return fetch(`${Settings.localApi}/planArtists`)
            .then(res => res.json())
            .then(pRes => planArtists = pRes)
    }

export const addPlanArtist = planArtist => {
        return fetch(`${Settings.localApi}/planArtists`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(planArtist)
        })
    }

