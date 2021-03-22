import React, { useContext } from 'react'
import { PlanContext } from '../plans/PlanProvider'

export const ReportCard = ({ report }) => {
    const { deletePlan, editPlan } = useContext(PlanContext)

    const paid = report.paid

    const handleDelete = e => {
        deletePlan(report.id)
    }

    const handleMarkUnpaid = e => {
        editPlan(report.id, {paid: false})
    }

    const handleMarkPaid = e => {
        editPlan(report.id, {paid: true})
    }

    let buttons = (
        <div className="reportCard__buttons">
            <button className="button btn-go" onClick={handleMarkPaid}>Mark As Paid</button>
            <button className="button btn-edit">View/Edit</button>
            <button className="button btn-delete" onClick={handleDelete}>Delete</button>
        </div>
    )
    if (paid) buttons = (
        <div className="reportCard__buttons">
            <button className="button btn-edit" onClick={handleMarkUnpaid}>Mark As Unpaid</button>
            <button className="button btn-view">View</button>
        </div>
    )

    return (
        <article className="savedReport">
            <h4>{report.name} {paid ? " (paid)" : ""}</h4>
            {buttons}
        </article>
    )
}