// Provides data for streaming services from the local api

import { Settings } from "../../Settings"

export let services = []

export const getServices = () => {
        return fetch(`${Settings.localApi}/services`)
            .then(res => res.json())
            .then(pRes => services = pRes)
    }