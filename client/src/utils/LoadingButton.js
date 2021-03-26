import React from 'react';
import {
    makeStyles,
    CircularProgress,
    Button
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative'
    },
    progress: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        margin: -12,
    }
}));

const LoadingButton = props => {
    const { loading, children } = props;
    props = { ...props, loading: undefined };
    const styles = useStyles();
    return <Button
        {...props}
        disabled={loading}
        className={styles.root}>
        {children}
        {loading &&
            <CircularProgress
                size={24}
                className={styles.progress}
            />
        }
    </Button>

};

export default LoadingButton;