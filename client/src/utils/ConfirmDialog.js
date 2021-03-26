import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@material-ui/core';

const ConfirmDialog = ({ title, content, open, onSubmit, onClose }) => {
    return <Dialog
        open={open}
        onClose={onClose}
    >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                {content}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>
                Cancel
                </Button>
            <Button onClick={onSubmit} autoFocus>
                Ok
                </Button>
        </DialogActions>
    </Dialog>
};

export default ConfirmDialog;