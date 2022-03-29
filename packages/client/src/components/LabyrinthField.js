import PixiApp from "../pixi/PixiApp";

import store from "../store/store";
import React from 'react';
import {Button, Grid} from "@material-ui/core";
import {getLabyrinth, startMatch, stopMatch} from "../ServerAPI";
import {
    addBotToMatch, clearBotsMatch, endMatchAction, removeBotFromMatch,
    showLabAction, startMatchAction
} from "../store/actionCreators/ActionCreator";
import {connect} from "react-redux";
import BotsView from "./BotsView";

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
                    const startResp = await startMatch();

                    PixiApp.startMatch(config, startResp.botConfigs);

                    store.dispatch(showLabAction(config));
                    store.dispatch(startMatchAction());
                }
            });
    }

    async stopMatch() {
        await stopMatch();
        PixiApp.stopMatch();
        store.dispatch(endMatchAction());
        store.dispatch(clearBotsMatch());
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
                <BotsView match onCheck={this.onBotCheck.bind(this)}/>

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
