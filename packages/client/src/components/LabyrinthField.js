// TODO this component will be taking care of pixi and canvas.
import PixiApp from "../pixi/PixiApp";

import store from "../store/store";
import React from 'react';
import {Button, Grid} from "@material-ui/core";
import {getLabyrinth, startMatch, stopMatch} from "../ServerAPI";
import {
    addBotToMatch, removeBotFromMatch,
    showLabAction
} from "../store/actionCreators/ActionCreator";
import {connect} from "react-redux";
import BotChooser from "./BotChooser";

const APP_CONTAINER_ID = "pixiAppContainer";

const mapStateToProps = () => {
    return {};
};

class LabyrinthField extends React.Component {

    async componentDidMount() {
        const appContainer = document.getElementById(APP_CONTAINER_ID);

        if (appContainer) {
            appContainer.appendChild(PixiApp.view);
        }
    }

    async startMatch() {
        await getLabyrinth(0)
            .then(async (response) => {
                const config = response.labyrinth;
                if (config) {
                    PixiApp.showLabyrinth(config);
                    store.dispatch(showLabAction(config));
                    await startMatch();
                    PixiApp.startMatch();
                }
            });
    }

    async stopMatch() {
        await stopMatch();
    }

    onBotCheck(event) {
        if(event.target.checked){
            store.dispatch(addBotToMatch(event.target.value));
        }else {
            store.dispatch(removeBotFromMatch(event.target.value));
        }
    }

    render() {
        return (
            <Grid container className="App">
                <BotChooser match onCheck={this.onBotCheck.bind(this)}/>

                <Grid item>
                    <Button variant="contained" color="primary" label="getLab"
                            onClick={this.startMatch.bind(this)}>Start</Button>
                    <Button variant="contained" color="primary" label="getLab"
                            onClick={this.stopMatch.bind(this)}>Stop</Button>
                    <div id={APP_CONTAINER_ID}></div>
                </Grid>

            </Grid>
        );
    }
}

export default connect(mapStateToProps)(LabyrinthField);
