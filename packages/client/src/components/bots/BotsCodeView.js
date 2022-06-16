import React, {Component} from "react";
import {connect} from "react-redux";
import {
    Checkbox,
    Grid,
    List,
    ListItem,
    Radio,
    RadioGroup
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

class BotsCodeView extends Component {

    async componentDidMount() {
        const bots = await getAllBots();

        store.dispatch(setBots(bots));
    }

    getBotItem(botName) {
        return this.props.match
            ? <Checkbox value={botName} onChange={this.props.chooseCallback} />
            : <Radio value={botName}/>;
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
        return this.props.match
            ? <List> {this.getBots()} </List>
            : <RadioGroup
                onChange={this.setCurrentBot.bind(this)}
            >
                {this.getBots()}
            </RadioGroup>
    }

    getBots() {
        const bots = this.props.matchStarted
            ? this.props.botsSelectedToMatch
            : this.props.bots.map(({botName}) => botName);

        return bots.map(
            (botName) => {
                const style = this.props.matchStarted
                    ? {
                        background: `#${this.props.botsMatchColors[botName]}`,
                        opacity: this.isBotDead(botName) ? 0.2 : 1,
                        borderStyle: this.isBotDead(botName) ? "dashed" : "solid",
                        borderColor: this.isBotDead(botName) ? "#ffffff" : "#000000"
                    }
                    : {};

                return <ListItem key={botName}
                                 style={{borderStyle: "solid", ...style}}>
                    {this.props.matchStarted ? "" : this.getBotItem(botName)} {botName}
                </ListItem>;
            }
        );
    }

    render() {
        return (
            <Grid item>
                {this.props.matchStarted ? "Bots fighting:" : "Choose your bot:"}
                {this.getBotsWrapper()}
            </Grid>
        );
    }
}

export default connect(mapStateToProps)(BotsCodeView);
