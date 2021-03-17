import React from 'react'
import './ReportTable.css'

export const ReportTable = ({ reportTable, totalCount, trackValue }) => {
    return (
        <>
            <h2>Your top artists </h2>
            <table className="reportTable">
                <thead>
                    <tr>
                        <th>Artist</th>
                        <th>Track Count</th>
                        <th>% of report</th>
                        <th>Estimated Real Revenue</th>
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
                                    {/* Hard-coded spotify */}
                                    <td>${(line.playcount *  0.00437).toFixed(2)}</td>
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