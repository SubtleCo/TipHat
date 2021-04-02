// This module is responsible for displaying and editing saved reports. 
// 'thisPlan' is set by finding the plan from the DB using the corresponing ID, found in the URL with useParams()
// 'displayPlan' is a modified 'thisPlan' build specifically to feed the return statement, which displays the report to the DOM

import React, { useContext, useEffect, useState } from 'react'
import { apiArtists, getArtists } from '../artists/ArtistProvider'
import { getPlanArtists, apiPlanArtists } from '../artists/PlanArtistProvider'
import { PlanContext } from '../plans/PlanProvider'
import { periods, getPeriods } from '../periods/PeriodProvider'
import { getSuggestions, suggestions } from '../suggestions/SuggestionsProvider'
import { currentUser, getCurrentUser } from '../auth/UserProvider'
import { getServices, services } from '../services/ServiceProvider'
import { useHistory, useParams } from 'react-router'

import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { Button, LinearProgress, Select, MenuItem } from '@material-ui/core'

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
    tableButton: {
        backgroundColor: theme.palette.primary.light,
        margin: theme.spacing(1),
        '&:hover': {
            backgroundColor: theme.palette.primary.dark
        }
    },
    valueSelect: {
        backgroundColor: theme.palette.common.white,
        margin: "0px 5px",
        paddingLeft: 5,
        borderRadius: 5,
        width: "190px"
    }
}))

export const ViewReport = () => {
    const { plans, getPlans, editPlan } = useContext(PlanContext)
    const [thisPlan, setThisPlan] = useState({})
    const [displayPlan, setDisplayPlan] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [suggestionSelect, setSuggestionSelect] = useState("")

    const { planId } = useParams()
    const history = useHistory()

    const classes = useStyles()


    const loadData = () => {
        const promises = [
            getArtists(),
            getPlanArtists(),
            getPeriods(),
            getSuggestions(),
            getCurrentUser(),
            getServices()

        ]
        Promise.all(promises)
            .then(() => {
                setIsLoading(false)
            })
    }

    useEffect(() => {
        loadData()
        getPlans()
    }, [])

    useEffect(() => {
        setThisPlan(plans.find(p => p.id === parseInt(planId)))
    }, [plans])

    useEffect(() => {
        // Grab the planartists from the API, which was called in loadData()
        const allPlanArtists = [...apiPlanArtists]
        // same with artists
        const artists = [...apiArtists]
        // filter plan artist for this plan
        const planArtists = allPlanArtists.filter(pA => pA.planId === thisPlan?.id)
        // sort in heirarchy of trackCount
        const sortedPlanArtists = planArtists.sort((a, b) => b.trackCount - a.trackCount)

        // These are all conditionals, as thisPlan isn't in place on first render - can this be refactored?
        setDisplayPlan({
            artistCount: planArtists.length,
            paid: thisPlan?.paid,
            trackCount: thisPlan?.trackCount,
            period: periods.find(p => p.id === thisPlan?.periodId),
            suggestion: suggestions.find(s => s.id === thisPlan?.suggestionId),
            service: services.find(s => s.id === currentUser.serviceId),
            reportTable: sortedPlanArtists.map(pA => {
                const artist = artists.find(a => a.id === pA.artistId)
                return ({
                    name: artist.name,
                    playcount: pA.trackCount
                })
            })
        })

    }, [thisPlan, isLoading])

    useEffect(() => {
        if (displayPlan.paid === true) {
            setSuggestionSelect(displayPlan.suggestion?.id && displayPlan.suggestion.name)
        } else {
            setSuggestionSelect(displayPlan.suggestion?.id &&
                <Select className={classes.valueSelect} id="suggestionSelect" value={displayPlan.suggestion.id} onChange={handleLiveSuggestionChange}>
                    {
                        suggestions.map(s => <MenuItem key={"suggestion " + s.id} value={s.id}>{s.name}</MenuItem>)
                    }
                </Select>)
        }
    }, [displayPlan])

    // if plan is not paid, allows user to edit suggestion / track value
    const handleLiveSuggestionChange = e => {
        const newPlan = { ...displayPlan }
        newPlan.suggestion = suggestions.find(s => s.id === parseInt(e.target.value))
        setDisplayPlan(newPlan)
    }

    const handleEdit = e => {
        editPlan(thisPlan.id, {
            suggestionId: displayPlan.suggestion.id
        })
        history.push("/reports")
    }

    const totalRevenue = displayPlan.reportTable?.map(row => parseFloat(row.playcount * displayPlan.service.amount)).reduce((a, b) => a + b, 0).toFixed(2)
    const totalPotential = displayPlan.reportTable?.map(row => parseFloat(row.playcount * displayPlan.suggestion?.amount)).reduce((a, b) => a + b, 0).toFixed(2)

    return ((!isLoading) &&
        <section className="Report__View main__container">
            <h2>Your top {displayPlan?.artistCount} artists for {displayPlan.period?.name}</h2>

            {/* if this plan is unpaid, allow user to edit suggestion / track value. */}
            {displayPlan?.paid ? <p>This Plan is Paid!</p> : ""}

            <TableContainer className={classes.tableContainer} component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.head}>Artist</TableCell>
                            <TableCell className={classes.head} align="center">Play Share</TableCell>
                            <TableCell className={classes.head} align="center">Track Count</TableCell>
                            <TableCell className={classes.head} align="center">Estimated {displayPlan.service?.name} Revenue</TableCell>
                            <TableCell className={classes.head} align="center">Potential Revenue (as {suggestionSelect})</TableCell>
                            <TableCell className={classes.head} align="center">Suggestion</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayPlan.reportTable.map((row, i) => {
                            const payout = (row.playcount * displayPlan.service.amount).toFixed(2)
                            const potential = (row.playcount * displayPlan.suggestion.amount).toFixed(2)
                            const percent = parseInt((row.playcount / displayPlan.trackCount * 100).toFixed(0))
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
                            <TableCell className={classes.head} align="center">{displayPlan.trackCount}</TableCell>
                            <TableCell className={classes.head} align="center"></TableCell>
                            <TableCell className={classes.head} align="center">${totalRevenue}</TableCell>
                            <TableCell className={classes.head} align="center">${totalPotential}</TableCell>
                            <TableCell className={classes.head} align="center">${(totalPotential - totalRevenue).toFixed(2)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer >

            {/* if this plan is unpaid, allow the user to save the edited version to the local api. otherwise, this button simply reroutes to the reports page */}
            <div className={classes.tableButtons}>
                {displayPlan?.paid ? <Button className={classes.tableButton} onClick={() => history.push("/reports")}>Back To Reports</Button> : <Button className={classes.tableButton} onClick={handleEdit}>Save Changes</Button>}
            </div>
        </section>
    )
}