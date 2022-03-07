import React from 'react';
import {TextField, Button} from "@material-ui/core";
import {login} from "../ServerAPI";
import store from "../store/store";
import {loginAction} from "../store/actionCreators/ActionCreator";

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {nameValue: ''};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		this.setState({nameValue: event.target.value});
	}

	loginCall() {
		login(this.state.nameValue).then((response) => {
			store.dispatch(loginAction(this.state.nameValue));
		});
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<TextField color={"secondary"} value={this.state.nameValue} label="Name" id={"nameField"}
							   onChange={this.handleChange}/>
					<Button variant="contained" color="primary" label="Name"
							onClick={this.loginCall.bind(this)}>Login</Button>
				</header>
			</div>
		);
	}
}

export default Login;
