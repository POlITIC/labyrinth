import store from "../store/store";
import React from 'react';
import {Button, Grid} from "@material-ui/core";
import {
    getLabyrinth,
    userAvailableLabyrinth
} from "../ServerAPI";
import {
    addBotToMatch,
    removeBotFromMatch, saveUserAvailableLabs,
    showLabAction,
} from "../store/actionCreators/ActionCreator";
import {connect} from "react-redux";
import BotsView from "./BotsView";
import LabyrinthsTable from "./LabyrinthsTable";

const mapStateToProps = ({botsSelectedToMatch}) => {
    return {botsSelectedToMatch};
};

class MatchSetup extends React.Component {

    async componentDidMount() {
        const {labs} = await userAvailableLabyrinth();

        store.dispatch(saveUserAvailableLabs(labs));
    }

    async startMatch() {
        await getLabyrinth(0)
            .then(async (response) => {
                const config = response.labyrinth;
                if (config) {
                    // const startResp = await startMatch();

                    // PixiApp.startMatch(config, startResp.botConfigs);

                    store.dispatch(showLabAction(config));
                    // store.dispatch(startMatchAction());
                }
            });
    }

    onBotCheck(event) {
        if (event.target.checked) {
            store.dispatch(addBotToMatch(event.target.value));
        } else {
            store.dispatch(removeBotFromMatch(event.target.value));
        }
    }

    startDisabled() {
        return this.props.botsSelectedToMatch.length < 2;
    }

    render() {
        return (
            <Grid container className="App">
                <Grid item xs={3}>
                    <BotsView match
                              chooseCallback={this.onBotCheck.bind(this)}/>
                </Grid>

                <Grid item xs={9}>
                    <LabyrinthsTable/>
                </Grid>

                <Grid item>
                    <Button variant="contained" color="primary" label="getLab"
                            disabled={this.startDisabled()}
                            onClick={this.startMatch.bind(this)}>Start</Button>
                </Grid>

            </Grid>
        );
    }
}

export default connect(mapStateToProps)(MatchSetup);
