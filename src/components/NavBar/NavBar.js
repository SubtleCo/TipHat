import React from 'react'
import { Link } from 'react-router-dom'
import './NavBar.css'
import { makeStyles } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import MenuIcon from '@material-ui/icons/Menu'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    navItem: {
        textDecoration: 'none',
        padding: theme.spacing(4)
    }
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
                    <Typography variant="h5" color="inherit" className={classes.navItem} to="/" component={Link}>
                        Why Tip?
                    </Typography>
                    <Typography variant="h5" color="inherit" className={classes.navItem} to="/reports/create" component={Link}>
                        Generate A Report
                    </Typography>
                    <Typography variant="h5" color="inherit" className={classes.navItem} to="/reports" component={Link}>
                        Saved Reports
                    </Typography>
                    <Typography variant="h5" color="inherit" className={classes.navItem} to="/user/edit" component={Link}>
                        Profile
                    </Typography>
                    <Button color="inherit">Test</Button>
                </Toolbar>
            </AppBar>
        </div>
    )
}

                    // <Link to="/reports">Saved Reports</Link>
                    // <Link to="/user/edit">(Account)</Link>
                    // <Link to="/" onClick={logout}>(log out)</Link>