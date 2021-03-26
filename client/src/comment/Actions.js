import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    IconButton,
    TextField,
    Menu,
    MenuItem,
    DialogActions,
    DialogTitle,
    Button,
    Container,
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import ConfirmDialog from '../utils/ConfirmDialog';
import { useUserMe } from '../user/hooks';
import LoadingButton from '../utils/LoadingButton';
import axios from 'axios';

const EditComment = ({ comment, onClose }) => {
    const [text, setText] = React.useState(comment.text);
    const [loading, setLoading] = React.useState(false);
    const onClick = () => {
        setLoading(true);
        axios.put(`/comment/${comment._id}`, { text })
            .then(() => {
                setText('');
                setLoading(false);
                onClose();
            });
    }
    return <Dialog open={true}
        onClose={onClose}>
        <DialogTitle>Edit Comment</DialogTitle>
        <DialogContent>
            <Container maxWidth="sm">
                    <TextField
                        label="Comment"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        multiline
                        rowsMax={4}
                        fullWidth
                        style={{ width: '500px' }}
                    />
            </Container>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>
                Cancel
                </Button>
            <LoadingButton
                onClick={onClick}
                variant="contained"
                color="primary"
                loading={loading}
            >
                Save
                </LoadingButton>
        </DialogActions>
    </Dialog>
}
const DeleteComment = ({ comment_id, onClose }) => {
    const onSubmit = () => {
        axios.delete(`/comment/${comment_id}`);
        onClose();
    }
    return <ConfirmDialog
        open={true}
        title="Confirm"
        content="Are you sure you want to delete this comment?"
        onSubmit={onSubmit}
        onClose={onClose}
    />
};

const Actions = ({ comment }) => {
    const { data: me, isLoading } = useUserMe();
    const [menuAnchor, setAnchor] = useState();
    const [editing, setEditing] = useState();
    const [deleting, setDeleting] = useState();
    if (isLoading || me._id !== comment.user_id) return null;
    const closeMenu = () => setAnchor(null);
    return <div>
        <IconButton onClick={e => setAnchor(e.currentTarget)}>
            <MoreVert />
        </IconButton>
        <Menu
            anchorEl={menuAnchor}
            keepMounted
            open={Boolean(menuAnchor)}
            onClose={closeMenu}
        >
            <MenuItem onClick={() => { setEditing(true); closeMenu(); }}>Edit</MenuItem>
            <MenuItem onClick={() => { setDeleting(true); closeMenu(); }}>Delete</MenuItem>
            {editing &&
                <EditComment comment={comment}
                    onClose={() => setEditing(false)}
                />
            }
            {deleting &&
                <DeleteComment comment_id={comment._id}
                    onClose={() => setDeleting(false)}
                />
            }
        </Menu>
    </div>
}
export default Actions;