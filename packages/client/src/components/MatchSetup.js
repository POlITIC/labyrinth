import store from "../store/store";
import React from 'react';
import {Button, Grid} from "@material-ui/core";
import {
    userAvailableLabyrinth
} from "../ServerAPI";
import {
    addBotToMatch,
    removeBotFromMatch, saveUserAvailableLabs, setStage,
} from "../store/actionCreators/ActionCreator";
import {connect} from "react-redux";
import LabyrinthsTable from "./LabyrinthsTable";
import {stages} from "../store/enums";
import ChooseBots from "./bots/ChooseBots";

const mapStateToProps = ({botsSelectedToMatch}) => {
    return {botsSelectedToMatch: [...botsSelectedToMatch]};
};

class MatchSetup extends React.Component {

    async componentDidMount() {
        const {labs} = await userAvailableLabyrinth();

        store.dispatch(saveUserAvailableLabs(labs));
    }

    async startMatch() {
        store.dispatch(setStage(stages.MATCH));
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
                    <ChooseBots match
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
