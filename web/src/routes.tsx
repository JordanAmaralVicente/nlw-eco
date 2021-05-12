import React from "react";
import { Route, BrowserRouter } from "react-router-dom";
import { HomePage, CreatePointPage, ListPointsPage } from "./pages";

const Routes = ()=>{
	return(
		<BrowserRouter>
			<Route component={HomePage} path="/" exact/>
			<Route component={CreatePointPage} path="/create-point" exact/>
			<Route component={ListPointsPage} path="/points" exact/>
		</BrowserRouter>
	);
};

export default Routes;