// Data provider for PlanArtists in the local API

import { Settings } from '../../Settings'

export let apiPlanArtists = []

export const getPlanArtists = () => {
        return fetch(`${Settings.localApi}/planArtists`)
            .then(res => res.json())
            .then(pRes => apiPlanArtists = pRes)
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

