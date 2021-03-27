// Report Table contains the logic for calculating the table a user sees, changing the payment suggestion, and saving a plan.

import React, { useContext, useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router'
import { PlanContext } from '../plans/PlanProvider'
import { suggestions, getSuggestions } from '../suggestions/SuggestionsProvider'
import { apiArtists, getArtists, checkForArtist, addArtist } from '../artists/ArtistProvider'
import { addPlanArtist, getPlanArtists } from '../artists/PlanArtistProvider'
import './ReportTable.css'

import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { Button, LinearProgress } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        maxWidth: '90%',
        margin: 'auto',
        borderRadius: '10px'
    },
    table: {
        minWidth: 650,
    },
    head: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        fontWeight: 900,
        fontSize: 18
    },
    body: {
        fontSize: 14
    },
    tableRow: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover
        }
    },
    tableButtons: {
        marginBottom: 64,
        display: 'flex',
        justifyContent: 'flex-end',
        maxWidth: '90%',
        margin: 'auto',
        padding: 10
    },
    tableButtonUnpaid: {
        backgroundColor: theme.palette.success.light,
        margin: theme.spacing(1),
        '&:hover': {
            backgroundColor: theme.palette.success.dark
        }
    },
    tableButtonPaid: {
        backgroundColor: theme.palette.success.main,
        margin: theme.spacing(1),
        '&:hover': {
            backgroundColor: theme.palette.success.dark
        }
    }
}))


export const ReportTable = (props) => {
    const report = props.report
    const { addPlan, getPlans } = useContext(PlanContext)

    // This represents the live position of the track value suggestion, which the user may change
    const [suggestion, setSuggestion] = useState({})
    // This represents the actual array of artists represented in a live report
    const [reportTable, setReportTable] = useState([])
    // This helps ensure our API data is loaded before performing operations that require it
    const [isLoading, setIsLoading] = useState(true)

    const history = useHistory()

    // This set of variables provides the total number of tracks represented in a single report
    const trackCounts = reportTable.map(line => parseInt(line.playcount))
    const totalCount = trackCounts.reduce((a, b) => a + b, 0)

    const classes = useStyles(props.theme)

    const loadData = () => {
        const promises = [
            getArtists(),
            getSuggestions()
        ]
        Promise.all(promises)
            .then(() => {
                setIsLoading(false)
            })
    }

    useEffect(() => {
        setIsLoading(true)
        getPlans()
        loadData()
    }, [])

    // This takes the raw report from Last.fm and transforms it into an array of artists to display to the user
    useEffect(() => {
        setReportTable(report.topartists?.artist)
    }, [report])


    // This sets the suggestion select to the user's default preference
    useEffect(() => {
        setSuggestion(suggestions.find(s => s.id === report.user.suggestionId))
    }, [isLoading])

    // This watches the suggestion select to change the state variable of suggestion if the user wants to recalculate the report with a different track value
    const handleLiveSuggestionChange = e => {
        setSuggestion(suggestions.find(s => s.id === parseInt(e.target.value)))
    }

    const handleSave = e => {
        // grab the updated artists from the ArtistProvider, which was populated on module load
        const artists = [...apiArtists]
        // period was passed through the API fetch call as an object
        const reportPeriod = report.period

        // Build a new plan object for the DB
        const newPlan = {}
        // user was passed through the API fetch call as an object
        newPlan.userId = report.user.id
        newPlan.timestamp = Date.now()
        newPlan.trackCount = totalCount
        newPlan.periodId = reportPeriod.id
        // As "reportTable" is an array of items derived from the API, and each line represents and artist, .length will provide a total count of artists
        newPlan.name = `Top ${reportTable.length} artists for ${reportPeriod.name}, ${new Date(newPlan.timestamp).getMonth()}/${new Date(newPlan.timestamp).getDate()}/${new Date(newPlan.timestamp).getFullYear()}`
        // There are two submit buttons - one with "paid" in the id and one without. These buttons will determine if a plan is paid or not.
        newPlan.paid = e.currentTarget.id.includes("paid")
        newPlan.suggestionId = suggestion.id


        // The logic for saving a new plan and the required artist and planArtist data. 
        addPlan(newPlan)
            // Using a promise to capture the id of the new plan, to be used in planArtist
            .then(plan => plan.json())
            .then(plan => {
                reportTable.forEach(artist => {
                    // Check to see if the artist is in the database. if not, add it
                    if (!checkForArtist(artist.name, artists)) {
                        addArtist(artist.name)
                            // Using a promise to capture the id of the new artist, to be used in planArtist
                            .then(dbArtist => {
                                addPlanArtist({
                                    artistId: dbArtist.id,
                                    planId: plan.id,
                                    // This comes directly from the last.fm API
                                    trackCount: parseInt(artist.playcount)
                                })
                            })
                    } else {
                        // If an artist is already in the database, find it and use its id for planArtist
                        const foundArtist = artists.find(a => a.name === artist.name)
                        addPlanArtist({
                            artistId: foundArtist.id,
                            planId: plan.id,
                            trackCount: parseInt(artist.playcount)
                        })
                    }
                })
                history.push('/reports')
            })
    }

    const totalRevenue = reportTable.map(row => parseFloat(row.playcount * report.service.amount)).reduce((a, b) => a + b, 0).toFixed(2)
    const totalPotential = reportTable.map(row => parseFloat(row.playcount * suggestion?.amount)).reduce((a, b) => a + b, 0).toFixed(2)

    return (
        <>
            <select id="suggestionSelect" value={displayPlan.suggestion?.id} onChange={handleLiveSuggestionChange} className="report__trackValueSelect">
                {
                    suggestions.map(s => <option key={"suggestion " + s.id} value={s.id}>{s.name}</option>)
                }
            </select>
            <TableContainer className={classes.tableContainer} component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.head}>Artist</TableCell>
                            <TableCell className={classes.head} align="center">Play Share</TableCell>
                            <TableCell className={classes.head} align="center">Track Count</TableCell>
                            <TableCell className={classes.head} align="center">Estimated {report.service.name} Revenue</TableCell>
                            <TableCell className={classes.head} align="center">Potential Revenue (as {suggestion?.name})</TableCell>
                            <TableCell className={classes.head} align="center">Suggestion</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reportTable.map((row, i) => {
                            const payout = (row.playcount * report.service.amount).toFixed(2)
                            const potential = (row.playcount * suggestion?.amount).toFixed(2)
                            const percent = parseInt((row.playcount / totalCount * 100).toFixed(0))
                            return (
                                < TableRow key={i} className={classes.tableRow}>
                                    <TableCell component="th" scope="row">{row.name}</TableCell>
                                    <TableCell align="center">{percent}%
                                <LinearProgress variant="determinate" value={percent}></LinearProgress></TableCell>
                                    <TableCell align="center">{row.playcount}</TableCell>
                                    <TableCell align="center">${payout}</TableCell>
                                    <TableCell align="center">${potential}</TableCell>
                                    <TableCell align="center">${(potential - payout).toFixed(2)}</TableCell>
                                </TableRow>
                            )
                        })}
                        <TableRow>
                            <TableCell className={classes.head}>Total Tracks:</TableCell>
                            <TableCell className={classes.head} align="center">{totalCount}</TableCell>
                            <TableCell className={classes.head} align="center"></TableCell>
                            <TableCell className={classes.head} align="center">${totalRevenue}</TableCell>
                            <TableCell className={classes.head} align="center">${totalPotential}</TableCell>
                            <TableCell className={classes.head} align="center">${(totalPotential - totalRevenue).toFixed(2)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer >
            <div className={classes.tableButtons}>
                <Button id="savePlan" className={classes.tableButtonUnpaid} variant="contained" onClick={handleSave}>Save Plan For Later</Button>
                <Button id="savePlan--paid" className={classes.tableButtonPaid} variant="contained" onClick={handleSave}>Save Plan As Paid</Button>
            </div>
        </>
    )
}

{/* <button id="savePlan" onClick={handleSave}>Save Plan For Later</button> */ }
{/* <button id="savePlan--paid" onClick={handleSave}>Save Plan (paid)</button> */ }