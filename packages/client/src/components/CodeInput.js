import React from 'react';
import {Button, Grid} from "@material-ui/core";
import CodeMirror from "react-codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/eclipse.css";
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import {deleteBot, getBotData, submitCode} from "../ServerAPI";
import {connect} from "react-redux";
import {setCurrentBot, updateCode} from "../store/actionCreators/ActionCreator";
import store from "../store/store";
import BotsCodeView from "./bots/BotsCodeView";


const mapStateToProps = ({code, currentBot}) => {
	return {
		code, currentBot
	};
};

const fileInputID = "fileInput";
const botNameInputID = "botNameInput";

class CodeInput extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			submitDisabled: false,
			mountCount: 0
		};

		this.updateCode = this.updateCode.bind(this);

		this.mirrorRef = React.createRef();
	}

	incMountCount () {
		this.setState(Object.assign({}, this.state, {
			mountCount: this.state.mountCount + 1
		}));
	}

	updateCode(newCode) {
		store.dispatch(updateCode(newCode));
	}

	updateBotName(event) {
		store.dispatch(setCurrentBot( event.target.value));
	}

	setSubmitDisabled(disabled) {
		this.setState(Object.assign({}, this.state, {
			submitDisabled: disabled
		}));
	}

	submitBot() {
		this.setSubmitDisabled(true);

		if(this.props.currentBot){
			submitCode(this.props.currentBot, this.props.code)
				.finally(() => {
					this.setSubmitDisabled(false);
					this.incMountCount();// TODO this is a fucking crutch
				});
		}else {
			console.error("Enter bot name, please!");
		}
	}

	async deleteBot(){
		const deleted = await deleteBot(this.props.currentBot);

		if(deleted){
			store.dispatch(setCurrentBot(""));
		}
		this.incMountCount();
	}

	readTextFile(file) {
		const reader = new FileReader();

		reader.onload = () => {
			const mirrInstance = this.mirrorRef.current.getCodeMirror();

			mirrInstance.doc.setValue(reader.result);

			this.updateCode(reader.result);
		};
		reader.readAsText(file);
	};

	initFileSelector() {
		const fileSelector = document.getElementById(fileInputID);

		fileSelector.onchange = (e) => {
			const file = fileSelector.files[0];


			if (file) {
				this.readTextFile(file);
			}
		}

	}

	componentDidMount() {
		this.initFileSelector();
		this.updateCode(this.props.code)
	}

	async botChosenCallback(botName) {
		const {code} = await getBotData(botName);
		const mirrInstance = this.mirrorRef.current.getCodeMirror();

		mirrInstance.doc.setValue(code);

		this.updateCode(code);
	}

	render() {
		return (
			<Grid container className="App">

				<BotsCodeView chooseCallback={this.botChosenCallback.bind(this)} key={this.state.mountCount}/>

				<Grid item style={{textAlign: "left"}}>
					Bot Name:
					<input
						accept="text/javascript"
						style={{
							margin: "10px"
						}}
						id={botNameInputID}
						type="text"
						onChange={this.updateBotName.bind(this)}
						value={this.props.currentBot}
					/>
					<CodeMirror
						value={this.props.code}
						onChange={this.updateCode.bind(this)}
						ref={this.mirrorRef}
						preserveScrollPosition={true}
						options={
							{
								theme: "eclipse",
								smartIndent: true,
								mode: "javascript"
							}
						}
					/>

					<input
						accept="text/javascript"
						style={{display: 'none'}}
						id={fileInputID}
						multiple
						type="file"
					/>
					<label htmlFor={fileInputID}>
						<Button variant="contained" component="span">
							Load File
						</Button>
					</label>

					<Button
						variant="contained"
						color="primary"
						label="Submit"
						disabled={this.state.submitDisabled}
						onClick={this.submitBot.bind(this)}
					>
						Submit
					</Button>

					<Button
						variant="contained"
						color="primary"
						label="Submit"
						disabled={!Boolean(this.props.currentBot)}
						onClick={this.deleteBot.bind(this)}
					>
						Delete
					</Button>
				</Grid>
			</Grid>

		);
	}


}


export default connect(mapStateToProps)(CodeInput);
