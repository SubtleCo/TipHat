import React from 'react'
import { Link } from 'react-router-dom'
import './NavBar.css'
import { makeStyles } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
}))

export const NavBar = () => {
    const classes = useStyles()
    const userId = parseInt(sessionStorage.getItem('app_user_id'))
    const logout = () => {
        sessionStorage.clear('app_user_id')
    }
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit">
                        Item
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    )
}

