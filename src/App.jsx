import React from 'react';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "./API/firebase.js";
import UserForm from "./pages/UserForm";
import GameApp from "./pages/GameApp";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Home from "./pages/Home";

const App = () => {
    const [user, loading, error] = useAuthState(auth)

    if(loading) {
        return 'Загрузка...'
    }
    if (error) {
        return 'There was an error'
    }
    if (!user) {
        return <UserForm />
    }

    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Home/>
                </Route>
                <Route path="/game/:id">
                    <GameApp/>
                </Route>
            </Switch>
        </Router>
    );
};

export default App;