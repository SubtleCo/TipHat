// This module gets all plans from the DB, filters them to the current user, sorts them in order of timestamp, and divides them into paid / unpaid plans.
// Each plan is then afforded a "ReportCard"

import React, { useContext, useEffect, useState } from 'react'
import { currentUser, getCurrentUser } from '../auth/UserProvider'
import { PlanContext } from '../plans/PlanProvider'
import { ReportCard } from './ReportCard'
import './ReportList.css'

export const ReportList = props => {
    const { plans, getPlans } = useContext(PlanContext)
    const [displayPaidPlans, setDisplayPaidPlans] = useState([])
    const [displayUnpaidPlans, setDisplayUnpaidPlans] = useState([])

    useEffect(() => {
        getPlans()
        getCurrentUser()
    }, [])

    useEffect(() => {
        const userPlans = plans.filter(plan => plan.userId === currentUser.id)
        const sortedPlans = userPlans.sort((a,b) => b.timestamp - a.timestamp)
        const paidPlans = sortedPlans.filter(plan => plan.paid === true)
        const unpaidPlans = sortedPlans.filter(plan => plan.paid === false)
        setDisplayPaidPlans(paidPlans)
        setDisplayUnpaidPlans(unpaidPlans)
    }, [plans])

    return (
        
        <section className="savedReports--container main__container">
            <h2>Your Saved Reports</h2>

            <section id="savedReports__unpaid">
                <h3 className="savedReports__section--title">Unpaid Reports</h3>
                {
                    displayUnpaidPlans.map(dP => <ReportCard key={dP.id} report={dP} />)
                }
            </section>

            <section id="savedReports__paid">
                <h3 className="savedReports__section--title">Paid Reports</h3>
                {
                    displayPaidPlans.map(dP => <ReportCard key={dP.id} report={dP} />)
                }
            </section>

        </section>
    )
}