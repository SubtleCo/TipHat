import React, { useContext } from 'react'
import { useHistory } from 'react-router'
import { PlanContext } from '../plans/PlanProvider'

export const ReportCard = ({ report }) => {
    const { deletePlan, editPlan } = useContext(PlanContext)
    const history = useHistory()
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

    const handleView = e => {
        history.push(`/reports/view/${report.id}`)
    }

    const handleEdit = e => {
        history.push(`/reports/edit/${report.id}`)
    }

    let buttons = (
        <div className="reportCard__buttons">
            <button className="button btn-go" onClick={handleMarkPaid}>Mark As Paid</button>
            <button className="button btn-edit" onClick={handleEdit}>View/Edit</button>
            <button className="button btn-delete" onClick={handleDelete}>Delete</button>
        </div>
    )
    if (paid) buttons = (
        <div className="reportCard__buttons">
            <button className="button btn-edit" onClick={handleMarkUnpaid}>Mark As Unpaid</button>
            <button className="button btn-view" onClick={handleView}>View</button>
        </div>
    )

    return (
        <article className="savedReport">
            <h4>{report.name}</h4>
            {buttons}
        </article>
    )
}