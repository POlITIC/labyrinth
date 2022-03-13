import React from 'react';
import {Button, Paper} from "@material-ui/core";
import CodeMirror from "react-codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css"
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import {submitCode} from "../ServerAPI";
import {connect} from "react-redux";
import {updateCode} from "../store/actionCreators/ActionCreator";
import store from "../store/store";


const mapStateToProps = ({code}) => {
	return {
		code
	};
};

const fileInputID = "fileInput";
const botNameInputID = "botNameInput";

class CodeInput extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			submitDisabled: false,
			botName: "bot"
		};

		this.updateCode = this.updateCode.bind(this);


		this.mirrorRef = React.createRef();
	}

	updateCode(newCode) {
		store.dispatch(updateCode(newCode));
	}

	updateBotName(event) {
		this.setState(Object.assign({}, this.state, {
			botName: event.target.value
		}));
	}

	setSubmitDisabled(disabled) {
		this.setState(Object.assign({}, this.state, {
			submitDisabled: disabled
		}));
	}

	submit() {
		this.setSubmitDisabled(true);

		submitCode(this.state.botName, this.props.code)
			.finally(() => {
				this.setSubmitDisabled(false);
			});
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

	render() {
		return (
			<div>
				Bot Name:
				<input
					accept="text/javascript"
					style={{
						margin: "10px"
					}}
					id={botNameInputID}
					type="text"
					onChange={this.updateBotName.bind(this)}
					value={this.state.botName}
				/>
				<CodeMirror
					value={this.props.code}
					onChange={this.updateCode.bind(this)}
					ref={this.mirrorRef}
					preserveScrollPosition={true}
					options={
						{
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

				<Button variant="contained" label="Run">Run</Button>
				<Button
					variant="contained"
					color="primary"
					label="Submit"
					disabled={this.state.submitDisabled}
					onClick={this.submit.bind(this)}
				>
					Submit
				</Button>
			</div>
		);
	}


}


export default connect(mapStateToProps)(CodeInput);
