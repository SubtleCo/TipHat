import React from 'react'
import './ReportTable.css'

export const ReportTable = ({ reportTable, totalCount, service, suggestion }) => {
    return (
        <>
            <table className="reportTable">
                <thead>
                    <tr>
                        <th>Artist</th>
                        <th>Track Count</th>
                        <th>% of report</th>
                        <th>Estimated {service.name} Payout</th>
                        <th>Estimated Potential Payout (as a {suggestion.name})</th>
                        <th>Suggested Donation</th>
                    </tr>
                </thead>
                <tbody className="reportTable--body">
                    {
                        reportTable.map((line, i) => {
                            const payout = (line.playcount *  service.amount).toFixed(2)
                            const potential = (line.playcount * suggestion.amount).toFixed(2)
                            return (
                                <tr key={i}>
                                    <td>{line.name}</td>
                                    <td>{line.playcount}</td>
                                    <td>{(line.playcount / totalCount * 100).toFixed(0)}%</td>
                                    <td>${payout}</td>
                                    <td>${potential}</td>
                                    <td>${(potential - payout).toFixed(2)}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
    )
}