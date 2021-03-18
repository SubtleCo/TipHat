import React from 'react'
import './ReportTable.css'

export const ReportTable = ({ reportTable, totalCount, trackValue, service }) => {
    return (
        <>
            <h2>Your top artists </h2>
            <table className="reportTable">
                <thead>
                    <tr>
                        <th>Artist</th>
                        <th>Track Count</th>
                        <th>% of report</th>
                        <th>Estimated {service.name} Payout</th>
                        <th>Suggested Donation</th>
                    </tr>
                </thead>
                <tbody className="reportTable--body">
                    {
                        reportTable.map((line, i) => {
                            return (
                                <tr key={i}>
                                    <td>{line.name}</td>
                                    <td>{line.playcount}</td>
                                    <td>{(line.playcount / totalCount * 100).toFixed(0)}%</td>
                                    <td>${(line.playcount *  service.amount).toFixed(2)}</td>
                                    <td>${(line.playcount * trackValue).toFixed(2) }</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
    )
}