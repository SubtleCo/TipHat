// Home page - essay, charts, and a little about the app itself

import React, { useEffect } from 'react'
import { getCurrentUser } from '../auth/UserProvider'
import './Home.css'
import CDChart from '../../images/CDChart.png'
import { useHistory } from 'react-router'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles( theme => ({
    getStartedButton: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        fontWeight: 900,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark
        }
    }
}))

export const Home = ({ theme }) => {
    const history = useHistory()
    const classes = useStyles(theme)

    useEffect(() => {
        getCurrentUser()
    }, [])

    return (
        <>
            <section className="home__container main__container">
                <h2>Welcome to TipHat</h2>
                <p className="home__about">
                    Music has always found its vital support in the hands of its patrons, and until quite recently, access has been limited to those with the financial means to support artists, writers, and creators of all types.
                </p>
                <p className="home__about">
                    The recent shift to a streaming based industry has several benefits for listeners - the ability to discover new music at a glance, unlimited access to catalogs previously unheard, and even the ability to bump the new Taylor Swift track the very second it gets released.
                 </p>
                <p className="home__about">
                    Living the life of a professional creator of music, however, has become less and less tenable since the rise of the major music label. In 2006, the average CD sale looked something like this:
                </p>
                <Paper className="chartContainer" component="img" src={CDChart}>
                    {/* <img  id="CDChart" ></img> */}
                </Paper>
                <p className="home__about">
                    Most of us remember what happened next. The internet, Napster, Limewire, Bearshare, you name it. In the freedom of the internet, the public found a way to skirt the high prices of CDs by downloading mp3s to their local machine. Labels shuttered, contracts disintegrated, and we were bombarded with ads reminding us that we wouldn't steal a car, so don't steal music.
                </p>
                <p className="home__about">
                    The truth is, the state of the musical artist hasn't improved since then. You'll hear executives cry that it's never been an easier time to get your music out there, and that artists can develop a cult following just by being discovered on a popular playlist.
                </p>
                <p className="home__about">
                    There's one fundamental problem with this mentality, however. Remember that chart above showing the measly 6.6% of a record sale afforded to an artist? We have to squeeze our streaming service in there now. We also have to account for the fact that less than half of the accounts of the major industry player Spotify are paid - most rely on advertising revenue. On average, Spotify pays about $0.00437 per stream to an artist that wrote their own song. That means that an artists would need 1,000 plays to get paid $4.37. Artists have been left to rely on relentless and brutal touring schedules (Big Thief, a hugely popular indie rock band from Brooklyn, spends 11 months out of the year on the road just to make ends meet).
                </p>
                <p className="home__about">
                    Enter COVID-19, a virus with no sensitivity to the already struggling artist.
                </p>
                <p className="home__about">
                    As a culture, we've forgotten the value of music. Through this app, I hope to encourage people to realize the implications of their behavior - and realize just how much they're actively paying their favorite acts.
                </p>
                <p className="home__about">
                    This app can take a last.fm listener's play history and roughly estimate the revenue they've personally generated for their top artists. The user is also able to choose a few financial comparisons to calculate a suggested purchase or donation to the artist based on their listening habits.
                </p>
                <p className="home__about">
                    Please support your favorite artists and buy their music. Otherwise, the independent artist will go one of two ways - assimilating into a commercially viable mainstream, or being forced to walk away from the industry. The future of music has always been in the hands of the patrons. Advertisers have preferences for style. It's up to us to support what we want to hear.
                </p>

                <Button className={classes.getStartedButton} variant="contained" onClick={() => history.push("/reports/create")} id="getStarted">Get Started</Button>
            </section>
        </>
    )
}