import { Settings } from '../../Settings'

export let suggestions = []


export const getSuggestions = () => {
    return fetch(`${Settings.localApi}/suggestions`)
        .then(res => res.json())
        .then(pRes => suggestions = pRes)
}