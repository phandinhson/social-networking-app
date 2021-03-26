import React from 'react';
import {
    Container, makeStyles,
    TextField, Paper, Typography
} from '@material-ui/core';
import axios from 'axios';
import PageTemplate from '../page/PageTemplate';
import { useHistory } from 'react-router-dom';
import LoadingButton from '../utils/LoadingButton';
import { useQueryClient } from 'react-query';
import FileInput from '../utils/FileInput';
import ChipInput from 'material-ui-chip-input';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(3),
    },
    form: {
        '& > *': { marginBottom: theme.spacing(1) }
    },
    inputFile: { display: 'none' }
}));
export const AddPost = () => {
    const [text, setText] = React.useState('');
    const [files, setFiles] = React.useState([]);
    const [tags, setTags] = React.useState([]);
    const queryClient = useQueryClient();
    const history = useHistory();
    const [loading, setLoading] = React.useState(false);
    const styles = useStyles();
    const onSubmit = e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('text', text);
        formData.append('tags', tags.join(' '));
        for (let file of files) {
            formData.append('files', file);
        }
        axios
            .post('/post', formData,
                { headers: { 'content-type': 'multipart/form-data' } }
            )
            .then(() => {
                queryClient.invalidateQueries('post');
                history.goBack();
            });
        setLoading(true);
    };
    return <PageTemplate>
        <Container maxWidth="md" className={styles.container}>
            <Paper className={styles.paper}>
                <Typography variant="h5" align="center">Add Post</Typography>
                <form onSubmit={onSubmit} className={styles.form}>
                    <TextField
                        label="New Post"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        multiline
                        rows={5}
                        rowsMax={10}
                        fullWidth
                    />
                    <div>
                        <FileInput onValue={setFiles} />
                    </div>
                    <div>
                        <ChipInput defaultValue={[]} label={'tags'} onChange={setTags} />
                    </div>
                    <LoadingButton
                        type="submit"
                        loading={loading}
                        variant="contained"
                        color="primary"
                    >
                        Add
                     </LoadingButton>
                </form>
            </Paper>
        </Container>
    </PageTemplate>
}
