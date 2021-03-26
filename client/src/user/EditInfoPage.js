import React from 'react';
import {
    Container, MenuItem, TextField,
    Paper, makeStyles, Grid, Typography
} from "@material-ui/core";
import axios from "axios";
import { useQuery } from "react-query";
import PageTemplate from '../page/PageTemplate';
import { useHistory } from 'react-router-dom';
import LoadingButton from '../utils/LoadingButton';
const useStyles = makeStyles(theme => ({
    container: { padding: theme.spacing(2) },
    paper: { padding: theme.spacing(2) },
    select: { minWidth: '100px' },
    buttons: { display: 'flex', justifyContent: 'flex-end' }
}))

export const EditInfoPage = () => {
    const { data: user, isLoading } = useQuery('me', () =>
        axios.get('/auth/me').then(res => res.data)
    );
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [bio, setBio] = React.useState('');
    const [avatarAction, setAvatarAction] = React.useState('none');
    const [avatarFile, setAvatarFile] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const history = useHistory();
    React.useEffect(() => {
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            user.bio && setBio(user.bio);
        }
    }, [user]);
    const styles = useStyles();
    if (isLoading) return null;
    const onSubmit = e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('avatarAction', avatarAction);
        (avatarAction === 'change') && formData.append('avatar', avatarFile);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('bio', bio);
        axios.put('/user', formData)
            .then(res => {
                setLoading(false);
                history.goBack();
            })
            .catch(() => setLoading(false))
        setLoading(true);
    }
    return <PageTemplate>
        <Container maxWidth="sm" className={styles.container}>
            <Paper className={styles.paper} elevation={10}>
                <Typography variant="h5" align="center">Edit Profile</Typography>
                <form onSubmit={onSubmit} className={styles.form}>
                    <Grid container spacing={3} alignItems="flex-end" justify="space-around">
                        <Grid item xs={12} sm={6}>
                            <TextField label="Edit avatar" select value={avatarAction}
                                onChange={e => setAvatarAction(e.target.value)} className={styles.select}
                            >
                                <MenuItem value="none">None</MenuItem>
                                <MenuItem value="delete" disabled={!user.avatar}>
                                    Delete
                            </MenuItem>
                                <MenuItem value="change">Change</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {avatarAction === 'change' &&
                                <input type="file" accept="image/*" required
                                    onChange={e => setAvatarFile(e.target.files[0])} />
                            }
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="First name" value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                fullWidth required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Last name" value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                fullWidth required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Introduction" value={bio}
                                onChange={e => setBio(e.target.value)}
                                fullWidth multiline rows={5}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <div className={styles.buttons}>
                                <LoadingButton type="submit" variant="contained" color="primary" loading={loading}>
                                    Save
                                </LoadingButton>
                            </div>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    </PageTemplate>
}