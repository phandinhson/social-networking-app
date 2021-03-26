import React from 'react';
import { Button, Container, makeStyles, Paper, TextField } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import Axios from 'axios';
import { useQueryClient } from 'react-query';
import { GoogleLogIn } from './GoogleLogIn';
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
export const Register = () => {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const queryClient = useQueryClient();
    const onSubmit = e => {
        e.preventDefault();
        Axios.post('/auth/register', { firstName, lastName, username, password })
            .then(() => {
                queryClient.invalidateQueries('me');
                setLoading(false);
            });
        setLoading(true);
    }
    const styles = useStyles();
    return <div className={styles.page}>
        <Container maxWidth="xs">
            <Paper elevation={3}>
                <form className={styles.form} onSubmit={onSubmit}>
                    <AccountCircle className={styles.icon} />
                    <TextField label="First name" value={firstName} onChange={e => setFirstName(e.target.value)} fullWidth required />
                    <TextField label="Last name" value={lastName} onChange={e => setLastName(e.target.value)} fullWidth required />
                    <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} fullWidth required />
                    <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth required />
                    <LoadingButton type="submit" loading={loading} color="primary" variant="contained" fullWidth>Register</LoadingButton>
                    <Button component={Link} to="/login" variant="contained" fullWidth>Log In</Button>
                    <GoogleLogIn />
                </form>
            </Paper>
        </Container>
    </div>
};