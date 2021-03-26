import React from 'react';
import { Backdrop, CircularProgress, CssBaseline, ThemeProvider } from '@material-ui/core'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import Axios from 'axios';
import { Register } from './auth/Register';
import { LogIn } from './auth/LogIn';
import FeedPage from './post/FeedPage';
import { UserPage } from './user/UserPage';
import { EditInfoPage } from './user/EditInfoPage';
import PostPage from './post/PostPage'
import { AddPost } from './post/AddPost';
import { WebSocketProvider } from './websocket/WebSocketContext';
import { Inbox } from './message/Inbox';
import EditPost from './post/EditPost';
import SearchPage from './search/SearchPage';
import SubscriptionPage from './post/SubscriptionPage';
import ContactPage from './follow/ContactPage';
import theme from './theme';
import ReportedPostsPage from './admin/ReportedPostsPage';
const Routes = () => {
    const { data: user, isLoading } = useQuery('me', () =>
        Axios.get('/auth/me').then(res => res.data)
    );
    if (isLoading)
        return <Backdrop open={true}>
            <CircularProgress />
        </Backdrop>;
    
    return user ?
        <Switch>
            <Route path="/user/:_id" component={UserPage} />
            <Route exact path="/post/create" component={AddPost} />
            <Route exact path="/post/:_id" component={PostPage} />
            <Route exact path="/post/:_id/edit" component={EditPost} />
            <Route exact path="/subscription" component={SubscriptionPage} />
            <Route exact path="/" component={FeedPage} />
            <Route exact path="/edit" component={EditInfoPage} />
            <Route exact path="/message/:_id" component={Inbox} />
            <Route exact path="/search" component={SearchPage} />
            <Route exact path="/contact" component={ContactPage} />
            {user.roles?.includes('admin') && <Route path="/admin/report" component={ReportedPostsPage} />}
            <Redirect to="" />
        </Switch>
        : <Switch>
            <Route path="/login" component={LogIn} />
            <Route path="/register" component={Register} />
            <Redirect to="/login" />
        </Switch>
};
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});
const App = () => {
    return <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <WebSocketProvider>
                    <Routes />
                </WebSocketProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </ThemeProvider>
}
export default App;