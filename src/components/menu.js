import React from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from "react-router-dom";
import LinearScaleOutlinedIcon from '@material-ui/icons/LinearScaleOutlined';
import MultilineChartOutlinedIcon from '@material-ui/icons/MultilineChartOutlined';
import TimerRoundedIcon from '@material-ui/icons/TimerRounded';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';

export default function MenuAp() {
    const [sidebar, setSidebar] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setSidebar(open);
    };

    const list = () => (
        <div
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
            className="sidebar"
        >
            <List>

                <ListItem>Un servidor</ListItem>
                <Link to="/line_one_nolimit">
                    <ListItem button >
                        <ListItemIcon><LinearScaleOutlinedIcon /></ListItemIcon>
                        <ListItemText primary="Sin límite en la cola" />
                    </ListItem>
                </Link>
                <Link to="/line_one_limit">
                    <ListItem button >
                        <ListItemIcon><MultilineChartOutlinedIcon /></ListItemIcon>
                        <ListItemText primary="Con límite en la cola" />
                    </ListItem>
                </Link>

                <Divider />

                <ListItem>Varios servidores</ListItem>
                <Link to="/line_various_nolimit">
                    <ListItem button >
                        <ListItemIcon><LinearScaleOutlinedIcon /></ListItemIcon>
                        <ListItemText primary="Sin límite en la cola" />
                    </ListItem>
                </Link>
                <Link to="/line_various_limit">
                    <ListItem button >
                        <ListItemIcon><MultilineChartOutlinedIcon /></ListItemIcon>
                        <ListItemText primary="Con límite en la cola" />
                    </ListItem>
                </Link>
            </List>
        </div>
    );

    return (
        <div>
            <React.Fragment>
                <div className="navbar">
                    <Link to="/"><Button startIcon={<HomeRoundedIcon />}>Inicio</Button></Link>
                    <Button onClick={toggleDrawer(true)} startIcon={<TimerRoundedIcon />}>Líneas de espera</Button>
                    <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} startIcon={<PeopleAltRoundedIcon />}>Estudiantes</Button>
                    <IconButton aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </div>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>Diegbys Mudarra</MenuItem>
                    <MenuItem onClick={handleClose}>Diego laCiacera</MenuItem>
                </Menu>
                <SwipeableDrawer
                    className="sidebar"
                    anchor='left'
                    open={sidebar}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                >
                    {list()}
                </SwipeableDrawer>
            </React.Fragment>
        </div>
    );
}
