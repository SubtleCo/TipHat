import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './NavBar.css'
import { makeStyles } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import { currentUser, getCurrentUser } from '../auth/UserProvider'


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    navItem: {
        textDecoration: 'none',
        padding: theme.spacing(1),
        flexGrow: 1
    },
    userButton: {

    }
}))

export const NavBar = ({ theme }) => {
    const [user, setUser] = useState({})
    const classes = useStyles(theme)
    const logout = () => {
        sessionStorage.clear('app_user_id')
    }
    
    useEffect(() => {
        getCurrentUser()
            .then(setUser)
    }, [])
    
    return (
        <div className={classes.root}>
            <AppBar position="static" color="primary" className={classes.appbar}>
                <Toolbar variant="dense">
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" to="/" component={Link}>
                        <LibraryMusicIcon />
                    </IconButton>
                    <Typography variant="h5" color="inherit" className={classes.navItem} to="/" component={Link}>
                        TIPHAT
                    </Typography>
                    <Typography variant="h5" color="inherit" className={classes.navItem} to="/reports/create" component={Link}>
                        GENERATE A REPORT
                    </Typography>
                    <Typography variant="h5" color="inherit" className={classes.navItem} to="/reports" component={Link}>
                        SAVED REPORTS
                    </Typography>
                    {/* <Typography variant="h5" color="inherit" className={classes.navItem} to="/user/edit" component={Link}>
                        Profile
                    </Typography> */}
                    <Button variant="contained" component={Link} to="/user/edit">{user.firstName}</Button>
                </Toolbar>
            </AppBar>
        </div>
    )
}