import React from 'react';
import {
    makeStyles,
    useTheme,
    CssBaseline,
    Drawer,
    Hidden
} from '@material-ui/core';
import AppBar from "./AppBar";
import Nav from './Nav';
const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
    },
}));

function PageTemplate(props) {
    const { window, children, disablePaddingTop } = props;
    const styles = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={styles.root}>
            <CssBaseline />
            <AppBar handleDrawerToggle={handleDrawerToggle} />
            <nav className={styles.drawer}>
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{ paper: styles.drawerPaper }}
                        ModalProps={{ keepMounted: true, }}
                    >
                        <Nav />
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer classes={{ paper: styles.drawerPaper }}
                        variant="permanent"
                        open
                    >
                        <Nav />
                    </Drawer>
                </Hidden>
            </nav>
            <main className={styles.content}>
                {!disablePaddingTop && <div className={styles.toolbar} />}
                {children}
            </main>
        </div>
    );
}

export default PageTemplate;
