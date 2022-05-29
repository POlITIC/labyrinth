import React from 'react';
import {APP_CONTAINER_ID} from "../constants";
import PixiApp from "../pixi/PixiApp";
import {getLabyrinth} from "../ServerAPI";
import store from "../store/store";
import {
    clearBotsMatch,
    endMatchAction,
    showLabAction,
    startMatchAction
} from "../store/actionCreators/ActionCreator";
import {Button, Grid} from "@material-ui/core";
import BotsView from "./BotsView";

class MatchPlay extends React.Component {
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


    render() {
        return (
            <Grid container className="App">
                <BotsView match chooseCalslback={this.onBotCheck.bind(this)}/>

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
