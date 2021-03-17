import React, { useContext, useEffect, useState } from 'react'
import { LastFmContext } from '../lastFm/LastFmProvider'
import './LiveReport.css'

export const LiveReport = () => {
    const { liveReport } = useContext(LastFmContext)
    const [report, setReport] = useState({})
    const [reportTable, setReportTable] = useState("")

    useEffect(() => {
        setReport(liveReport)
    }, [liveReport])

    useEffect(() => {
        setReportTable(
            <table>
                <thread>
                    <tr>
                        <th>Artist</th>
                        <th>Track Count</th>
                        <th>% of listening time</th>
                        <th>Estimated Real Revenue</th>
                        <th>Suggested Donation</th>
                    </tr>
                </thread>
            </table>
        )
    }, [report])

    if (report) {
        report.type = Object.keys(liveReport)[0]
        report.count = liveReport[report.type]['@attr'].perPage
        return (
            <>
                <h2>Your top {report.count} {report.type.slice(3)} </h2>
                {reportTable}
            </>
        )
    } else return ("")
}