// Provides an array of listening periods, used in a select in LiveReportForm

import { Settings } from "../../Settings"

export let periods = []

export const getPeriods = () => {
    return fetch(`${Settings.localApi}/periods`)
        .then(res => res.json())
        .then(pRes => periods = pRes)
}