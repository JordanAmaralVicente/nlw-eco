import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import { HomePage, CreatePointPage } from './pages';

const Routes = ()=>{
    return(
        <BrowserRouter>
            <Route component={HomePage} path="/" exact/>
            <Route component={CreatePointPage} path="/create-point" exact/>
        </BrowserRouter>
    );
}

export default Routes;