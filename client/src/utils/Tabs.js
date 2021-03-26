import { makeStyles, Tabs, Tab } from '@material-ui/core';
import React from 'react';
const useStyles = makeStyles(theme => ({
    hidden: {
        display: 'none'
    }
}))
const CustomTabs = (props) => {
    const { children, ...restProps } = props;
    const [index, setIndex] = React.useState(0);
    const styles = useStyles();
    return <div>
        <Tabs
            value={index}
            onChange={(e, value) => setIndex(value)}
            {...restProps}
        >
            {children.map(([tabProps]) =>
                <Tab {...tabProps} key={tabProps.label} />
            )}
        </Tabs>
        {children.map(([label, component], i) =>
            <div key={i}
                {...(i !== index ? { className: styles.hidden } : {})}
            >
                {component}
            </div>
        )}
    </div >
};
export default CustomTabs;