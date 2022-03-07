import React from 'react';
import './App.css';
import Login from "./components/Login";
import MainPage from "./components/MainPage";
import {connect} from "react-redux";

const mapStateToProps = ({loginData}) => {
	const {loggedIn} = loginData;

	return {loggedIn};
}

class App extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return this.props.loggedIn ? <MainPage/> : <Login/>;
	}
}

export default connect(mapStateToProps)(App);
