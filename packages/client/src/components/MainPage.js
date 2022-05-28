import React from 'react';
import Container from "@material-ui/core/Container";
import {Button, Paper} from "@material-ui/core";
import {connect} from "react-redux";
import CodeInput from "./CodeInput";
import LabyrinthField from "./LabyrinthField";
import {stages} from "../store/enums";
import store from "../store/store";
import {setStage} from "../store/actionCreators/ActionCreator";
import {initSocket} from "../socket/socket";
import PixiApp from "../pixi/PixiApp";

const mapStateToProps = ({loginData, stage}) => {
	return {
		userName: loginData.name,
		isAdmin: loginData.admin,
		stage: stage
	}
};

class MainPage extends React.Component {

	async componentDidMount() {
		await initSocket();
		PixiApp.subscribeSocket();
	}

	getStage() {
		const stageName = this.props.stage;

		switch (stageName) {
			case stages.CODE :
				return (<CodeInput/>);
			case stages.LABYRINTH :
				return (<LabyrinthField/>);
			default:
				return "What do you want?";
		}
	}

	setStage(stage) {
		store.dispatch(setStage(stage));
	}

	render() {
		return (

			<div>
				<Container maxWidth="sm">
					<Paper elevation={1}>
						Hello {this.props.userName}! {this.props.isAdmin && "You are an admin!"}

						<Button variant="contained" color="primary" label="Name"
								onClick={this.setStage.bind(this, stages.CODE)}>Bot design</Button>
						<Button variant="contained" color="primary" label="Name"
								onClick={this.setStage.bind(this, stages.LABYRINTH)}>Death match</Button>


					</Paper>

				</Container>

				<br/>
				{
					this.getStage()
				}

			</div>

		);
	}
}

export default connect(mapStateToProps)(MainPage);
