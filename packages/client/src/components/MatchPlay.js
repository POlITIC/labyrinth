import React from 'react';
import {APP_CONTAINER_ID} from "../constants";
import PixiApp from "../pixi/PixiApp";
import {getLabyrinth, startMatch, stopMatch} from "../ServerAPI";
import store from "../store/store";
import {
    clearBotsMatch,
    endMatchAction,
    showLabAction,
    startMatchAction
} from "../store/actionCreators/ActionCreator";
import {Button, Grid} from "@material-ui/core";
import {connect} from "react-redux";
import BotsMatchView from "./bots/BotsMatchView";

const mapStateToProps = ({matchStarted}) => {
    return {matchStarted};
};

class MatchPlay extends React.Component {
    async componentDidMount() {
        const appContainer = document.getElementById(APP_CONTAINER_ID);

        if (appContainer) {
            appContainer.appendChild(PixiApp.view);
        }

        await getLabyrinth(store.getState().selectedLabyrinth)
            .then(async (response) => {
                const config = response.labyrinth;

                if (config) {
                    PixiApp.showLabyrinth(config)
                }
            });
    }

    async startMatch() {
        await getLabyrinth(store.getState().selectedLabyrinth)
            .then(async (response) => {
                const config = response.labyrinth;
                if (config) {
                    const startResp = await startMatch();

                    PixiApp.startMatch(startResp.botConfigs);

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
                <BotsMatchView match/>

                <Grid item>
                    <Button variant="contained" color="primary" label="getLab" disabled={this.props.matchStarted}
                            onClick={this.startMatch.bind(this)}>Start</Button>
                    <Button variant="contained" color="primary" label="getLab" disabled={!this.props.matchStarted}
                            onClick={this.stopMatch.bind(this)}>Stop</Button>
                    <div id={APP_CONTAINER_ID}></div>
                </Grid>

            </Grid>
        );
    }
}

export default connect(mapStateToProps)(MatchPlay);
