// This module represents a saved plan to the user with its title, whether or not the plan is paid, and buttons to affect the plan.
// Called directly by ReportList

import { Button, makeStyles, Typography } from '@material-ui/core'
import React, { useContext } from 'react'
import { useHistory } from 'react-router'
import { PlanContext } from '../plans/PlanProvider'

const useStyles = makeStyles(theme => ({
    delete: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.common.white,
        fontWeight: 900,
        margin: theme.spacing(1)
    },
    view: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        fontWeight: 900,
        margin: theme.spacing(1)
    },
    pay: {
        backgroundColor: theme.palette.success.light,
        color: theme.palette.common.white,
        fontWeight: 900,
        margin: theme.spacing(1)
    },
    unpay: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.common.white,
        fontWeight: 900,
        margin: theme.spacing(1)
    }
}))

export const ReportCard = ({ report, theme }) => {
    const { deletePlan, editPlan } = useContext(PlanContext)
    const history = useHistory()
    const paid = report.paid
    const classes = useStyles(theme)

    const handleDelete = e => {
        deletePlan(report.id)
    }

    const handleMarkUnpaid = e => {
        editPlan(report.id, {paid: false})
    }

    const handleMarkPaid = e => {
        editPlan(report.id, {paid: true})
    }

    const handleView = e => {
        history.push(`/reports/view/${report.id}`)
    }

    const handleEdit = e => {
        history.push(`/reports/edit/${report.id}`)
    }

    let buttons = (
        <div className="reportCard__buttons">
            <Button className={classes.pay} variant="contained" onClick={handleMarkPaid}>Mark As Paid</Button>
            <Button className={classes.view} variant="contained" onClick={handleEdit}>View/Edit</Button>
            <Button className={classes.delete} variant="contained" onClick={handleDelete}>Delete</Button>
        </div>
    )
    if (paid) buttons = (
        <div className="reportCard__buttons">
            <Button className={classes.unpay} variant="contained" onClick={handleMarkUnpaid}>Mark As Unpaid</Button>
            <Button className={classes.view} variant="contained" onClick={handleView}>View</Button>
        </div>
    )

    return (
        <article className="savedReport">
            <Typography component="h2" variant="h5" >{report.name}</Typography>
            {buttons}
        </article>
    )
}