// Footer module - persistant and fixed on all page views if user is logged in

import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import GitHubIcon from '@material-ui/icons/GitHub'
import AlbumIcon from '@material-ui/icons/Album'
import SchoolIcon from '@material-ui/icons/School'
import { Link } from '@material-ui/core'
import { blueGrey } from '@material-ui/core/colors'

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        position: 'fixed',
        bottom: 0
    },
    bottomLink: {
        padding: theme.spacing(4),
        underline: 'none',
        '&:hover': {
            background: blueGrey[100],
            color: blueGrey[900]
        }
    }
}))

export const Footer = (props) => {
    const classes = useStyles(props)

    return (
        <BottomNavigation
            showLabels
            className={classes.root}>
            <BottomNavigationAction underline="inherit" className={classes.bottomLink} label="Alex Martin" icon={<GitHubIcon />} component={Link} href="https://github.com/SubtleCo" />
            <BottomNavigationAction underline="inherit" className={classes.bottomLink} label="TipHat" icon={<GitHubIcon />} component={Link} href="https://github.com/SubtleCo/TipHat" />
            <BottomNavigationAction underline="inherit" className={classes.bottomLink} label="last.fm" icon={<AlbumIcon />} component={Link} href="https://last.fm" />
            <BottomNavigationAction underline="inherit" className={classes.bottomLink} label="Nashville Software School" icon={<SchoolIcon />} component={Link} href="https://nashvillesoftwareschool.com" />
        </BottomNavigation>
    )
}





//==================================Old Footer====================================//

// import './Footer.css'

// export const Footer = () => {

//     return (
//         <footer id="footer">
//             <p className="footer--item">Created by <a href="https://github.com/SubtleCo">Alex Martin</a></p>
//             <p className="footer--item"><a href="https://github.com/SubtleCo/TipHat">TipHat on Github</a></p>
//             <p className="footer--item">User data from <a href="https://last.fm">last.fm</a></p>
//             <p className="footer--item">Built at <a href="https://nashvillesoftwareschool.com">Nashville Software School</a></p>
//         </footer>
//     )
// }