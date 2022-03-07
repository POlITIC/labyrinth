// TODO this component will be taking care of pixi and canvas.
import PixiApp from "../pixi/PixiApp";

import store from "../store/store";
import React from 'react';
import {Button} from "@material-ui/core";
import {getLabyrinth} from "../ServerAPI";
import {showLabAction} from "../store/actionCreators/ActionCreator";
import {setupGame} from "math";
import {connect} from "react-redux";
import {initSocket} from "../socket/socket";

const APP_CONTAINER_ID = "pixiAppContainer";

const mapStateToProps = ({code, loginData}) => {
	return {
		botCode: code,
		botId: loginData.name
	}
};

class LabyrinthField extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const appContainer = document.getElementById(APP_CONTAINER_ID);

		if (appContainer) {
			appContainer.appendChild(PixiApp.view);
		}
	}

	getLabyrinth() {
		getLabyrinth(0)
			.then((response) => {
				const config = response.labyrinth;
				if (config) {
					PixiApp.showLabyrinth(config);
					store.dispatch(showLabAction(config));
					setupGame(config, [{
						code: this.props.botCode,
						id: this.props.botId
					}]);
					initSocket();
				}
			});
	}

	render() {
		return (
			<div className="App">
				<Button variant="contained" color="primary" label="getLab"
						onClick={this.getLabyrinth.bind(this)}>Render</Button>
				<div id={APP_CONTAINER_ID}></div>
			</div>
		);
	}
}

export default connect(mapStateToProps)(LabyrinthField);
