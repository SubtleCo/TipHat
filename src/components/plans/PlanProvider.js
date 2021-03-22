import React, { createContext, useState } from 'react'
import { Settings } from '../../Settings'

export const PlanContext = createContext()

export const PlanProvider = props => {
    const [plans, setPlans] = useState([])

    const getPlans = () => {
        return fetch(`${Settings.localApi}/plans`)
            .then(res => res.json())
            .then(setPlans)
    }

    const addPlan = plan => {
        return fetch(`${Settings.localApi}/plans`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(plan)
        })
    }

    const deletePlan = planId => {
        return fetch(`${Settings.localApi}/plans/${planId}`, {
            method: "DELETE"
        })
            .then(getPlans)

    }

    const editPlan = (planId, change) => {
        return fetch(`${Settings.localApi}/plans/${planId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(change)
        })
            .then(getPlans)
    }

    return (
        <PlanContext.Provider value={{
            plans, getPlans, addPlan, deletePlan, editPlan
        }}>
            {props.children}
        </PlanContext.Provider>
    )
}