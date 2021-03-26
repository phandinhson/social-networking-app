import React from 'react';
import {
    makeStyles,
    IconButton,
    Badge
} from '@material-ui/core';
import { AddPhotoAlternate } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    inputFile: { display: 'none' },
    media: {
        height: 0,
        paddingTop: '56.25%'
    },
}));

const FileInput = ({ onValue }) => {
    const styles = useStyles();
    const [files, setFiles] = React.useState([]);
    const onChange = e => {
        setFiles(e.target.files);
        onValue(e.target.files);
    }
    return <div>
        <input type="file" accept="video/*,image/*"
            id="files" multiple name="files"
            onChange={onChange}
            className={styles.inputFile}
        />
        <label htmlFor="files">
            <IconButton color="primary" component="span">{
                files.length > 0
                    ? <Badge badgeContent={files.length}
                        color="primary"
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}>
                        <AddPhotoAlternate />
                    </Badge>
                    : <AddPhotoAlternate />
            }</IconButton>
        </label>
    </div>
}

export default FileInput;