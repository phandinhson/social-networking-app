import { CircularProgress, makeStyles } from '@material-ui/core';
const useStyles = makeStyles(theme => ({
    loader: {
        display: 'flex',
        justifyContent: 'center',
        margin: theme.spacing(1)
    },
    hidden: { display: 'none' }
}));
const Loader = ({ loading = true }) => {
    const styles = useStyles();
    return <div className={styles.loader}>
        <CircularProgress {...(!loading ? { className: styles.hidden } : {})} />
    </div>
}
export default Loader;