import React, { useState } from 'react';
import { usePost } from './hooks';
import { useHistory, useParams } from 'react-router-dom';
import Loader from '../utils/Loader';
import {
    Container, makeStyles,
    TextField, Paper, Typography,
    CardMedia,
    Grid,
    Card,
    CardActions,
    IconButton
} from '@material-ui/core';
import PageTemplate from '../page/PageTemplate';
import { Delete, Save } from '@material-ui/icons';
import LoadingButton from '../utils/LoadingButton';
import FileInput from '../utils/FileInput';
import ConfirmDialog from '../utils/ConfirmDialog';
import axios from 'axios';
import ChipInput from 'material-ui-chip-input';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(3),
    },
    form: {
        '& > *': { marginBottom: theme.spacing(1) }
    },
    media: {
        height: 0,
        paddingTop: '56.25%'
    },
    mediaActions: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    fileInput: {
        display: 'flex',
        alignItems: 'center'
    }
}));

const Media = ({ file }) => {
    const styles = useStyles();
    const { filename, mimetype } = file;
    return mimetype.includes('video') ?
        <CardMedia
            component="video"
            src={`/${filename}`}
            controls
        /> :
        <CardMedia
            image={`/${filename}`}
            className={styles.media}
        />;
};
const DeleteFileButton = ({ onDelete }) => {
    const [isOpen, setOpen] = React.useState(false);
    const open = () => setOpen(true);
    const close = () => setOpen(false);
    return <div>
        <IconButton onClick={open}>
            <Delete />
        </IconButton>
        <ConfirmDialog
            open={isOpen}
            onClose={close}
            onSubmit={onDelete}
            title="Confirm"
            content="Are you sure you want to delete?"
        />
    </div>
}
const Form = ({ post }) => {
    const [text, setText] = useState(post.text);
    const [oldFiles, setOldFiles] = useState(post.files);
    const [newFiles, setNewFiles] = useState([]);
    const [tags, setTags] = useState(post.tags || []);
    const [loading, setLoading] = useState(false);
    const styles = useStyles();
    const history = useHistory();
    const onSubmit = e => {
        e.preventDefault();
        const form = new FormData();
        form.append('text', text);
        form.append('oldFiles', JSON.stringify(oldFiles));
        form.append('tags', tags.join(' '));
        for (let file of newFiles) {
            form.append('newFiles', file);
        }
        axios.put(`/post/${post._id}`, form)
            .then(() => {
                setLoading(false);
                history.goBack();
            });
        setLoading(true);
    }
    const deleteFile = filename => {
        setOldFiles(files =>
            files.filter(f => f.filename !== filename)
        );
    }
    return <form onSubmit={onSubmit} className={styles.form}>
        <TextField
            label="Caption"
            value={text}
            onChange={e => setText(e.target.value)}
            multiline
            rows={5}
            rowsMax={10}
            fullWidth
        />
        <ChipInput defaultValue={tags} onChange={setTags} label='Tags'/>
        <Grid container>
            {oldFiles.map(file =>
                <Grid item xs={12} sm={6} md={4} key={file.filename}>
                    <Card>
                        <Media file={file} />
                        <CardActions className={styles.mediaActions}>
                            <DeleteFileButton
                                onDelete={() => deleteFile(file.filename)}
                            />
                        </CardActions>
                    </Card>
                </Grid>
            )}
        </Grid>
        <div className={styles.fileInput}>
            <FileInput onValue={setNewFiles} />
            <Typography variant="caption">
                {`${newFiles.length} files choosen.`}
            </Typography>
        </div>
        <LoadingButton
            type="submit"
            loading={loading}
            variant="contained"
            color="primary"
            startIcon={<Save />}
        >
            Save
        </LoadingButton>
    </form >
}

const EditPost = () => {
    const { _id } = useParams();
    const { data: post, isLoading } = usePost(_id);
    const styles = useStyles();
    return <PageTemplate>
        <Container maxWidth="md" className={styles.container}>
            <Paper className={styles.paper} elevation={10}>
                <Typography variant="h5" align="center">Edit Post</Typography>
                {!isLoading ? <Form post={post} /> : <Loader />}
            </Paper>
        </Container>
    </PageTemplate>
}

export default EditPost;