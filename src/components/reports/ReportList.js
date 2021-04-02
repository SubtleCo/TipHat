// This module gets all plans from the DB, filters them to the current user, sorts them in order of timestamp, and divides them into paid / unpaid plans.
// Each plan is then afforded a "ReportCard"

import { makeStyles, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import { currentUser, getCurrentUser } from '../auth/UserProvider'
import { PlanContext } from '../plans/PlanProvider'
import { ReportCard } from './ReportCard'
import './ReportList.css'

const useStyles = makeStyles(theme => ({
    section: {
        margin: theme.spacing(4),
        padding: theme.spacing(2),
        border: "1px solid black",
        borderRadius: 5,
        backgroundColor: theme.palette.primary.contrastText
    },
    title: {
        textAlign: "center",
        marginBottom: theme.spacing(4)
    }
}))

export const ReportList = props => {
    const { plans, getPlans } = useContext(PlanContext)
    const [displayPaidPlans, setDisplayPaidPlans] = useState([])
    const [displayUnpaidPlans, setDisplayUnpaidPlans] = useState([])
    const classes = useStyles(props.theme)

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
            <Typography component="h2" variant="h2" align='center'>Your Saved Reports</Typography>

            <section className={classes.section}>
                <Typography variant="h4" className={classes.title}>Unpaid Reports</Typography>
                {
                    displayUnpaidPlans.map(dP => <ReportCard key={dP.id} report={dP} />)
                }
            </section>

            <section className={classes.section}>
                <Typography variant="h4" className={classes.title}>Paid Reports</Typography>
                {
                    displayPaidPlans.map(dP => <ReportCard key={dP.id} report={dP} />)
                }
            </section>

        </section>
    )
}