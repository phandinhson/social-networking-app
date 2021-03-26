import React from 'react';
import { Button, Container, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import axios from 'axios';
import { GoogleLogIn } from './GoogleLogIn';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import LoadingButton from '../utils/LoadingButton';

const useStyles = makeStyles(theme => ({
    page: { display: 'grid', placeItems: 'center', height: '100vh' },
    form: {
        display: 'flex', flexDirection: 'column', alignItems: 'center', padding: theme.spacing(3),
        '& > *': { marginTop: theme.spacing(1) }
    },
    icon: { fontSize: theme.spacing(10) }
}));

export const LogIn = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState();
    const queryClient = useQueryClient();
    const onSubmit = e => {
        e.preventDefault();
        setLoading(true);
        axios.post('/auth/login', { username, password })
            .then(() => {
                queryClient.invalidateQueries('me');
                setLoading(false);
                setUsername('');
                setPassword('');
            })
            .catch(() => {
                setError('Invalid username or password.');
                setLoading(false);
                setUsername('');
                setPassword('');
            });
    }
    const styles = useStyles();
    return <div className={styles.page}>
        <Container maxWidth="xs">
            <Paper elevation={3}>
                <form onSubmit={onSubmit} className={styles.form}>
                    <AccountCircle className={styles.icon} />
                    {error &&
                        <Typography variant="body1" align="center" color="error">
                            {error}
                        </Typography>
                    }
                    <TextField
                        label="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        fullWidth
                    />
                    <LoadingButton
                        type="submit"
                        color="primary"
                        variant="contained"
                        fullWidth
                        loading={loading}
                    >
                        Log In
                    </LoadingButton>
                    <Button
                        component={Link}
                        to="/register"
                        fullWidth
                        variant="contained"
                    >
                        Register
                    </Button>
                    <GoogleLogIn />
                </form>
            </Paper>
        </Container>
    </div>
};