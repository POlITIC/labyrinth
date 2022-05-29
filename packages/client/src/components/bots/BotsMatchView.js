import React, {Component} from "react";
import {connect} from "react-redux";
import {
    Checkbox,
    Grid,
    List,
    ListItem,
    Radio,
} from "@material-ui/core";
import {getAllBots} from "../../ServerAPI";
import {
    setBots,
    setCurrentBot
} from "../../store/actionCreators/ActionCreator";
import store from "../../store/store";

const mapStateToProps = ({
                             bots,
                             currentBot,
                             botsSelectedToMatch,
                             botsMatchColors,
                             matchStarted,
                             deadBots
                         }) =>
    ({bots, currentBot, botsSelectedToMatch, botsMatchColors, matchStarted, deadBots});

class BotsMatchView extends Component {

    async componentDidMount() {
        const bots = await getAllBots();

        store.dispatch(setBots(bots));
    }

    getBotItem(botName) {
        return <Checkbox value={botName} onChange={this.props.chooseCallback} />;
    }

    isBotDead(botName){
        return this.props.deadBots.includes(botName);
    }

    setCurrentBot(event) {
        const botName = event.target.value;

        store.dispatch(setCurrentBot(botName));
        this.props.chooseCallback(botName);
    }

    getBotsWrapper() {
        return  <List> {this.getBots()} </List>
    }

    getBots() {
        const bots = this.props.botsSelectedToMatch;

        return bots.map(
            (botName) => {
                const style = {
                    background: `#${this.props.botsMatchColors[botName]}`,
                    opacity: this.isBotDead(botName) ? 0.2 : 1,
                    borderStyle: this.isBotDead(botName) ? "dashed" : "solid",
                    borderColor: this.isBotDead(botName) ? "#ffffff" : "#000000"
                };

                return <ListItem key={botName} style={style}>
                    {botName}
                </ListItem>;
            }
        );
    }

    render() {
        return (
            <Grid item>
                Bots fighting:
                {this.getBotsWrapper()}
            </Grid>
        );
    }
}

export default connect(mapStateToProps)(BotsMatchView);
