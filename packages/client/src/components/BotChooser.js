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
import {getAllBots} from "../ServerAPI";
import {setBots, setCurrentBot} from "../store/actionCreators/ActionCreator";
import store from "../store/store";

const mapStateToProps = ({bots, currentBot}) => ({bots, currentBot});

class BotChooser extends Component {

    async componentDidMount() {
        const bots = await getAllBots();
        // TODO bots should be saved to store
        store.dispatch(setBots(bots));
    }

    getBotItem(botName) {
        return this.props.match
            ? <Checkbox value={botName}/>
            : <Radio value={botName}/>;
    }

    setCurrentBot(event) {
        store.dispatch(setCurrentBot(event.target.value));
    }

    getBotsWrapper() {
        return this.props.match
            ? <List> { this.getBots() } </List>
            : <RadioGroup
                onChange={this.setCurrentBot}
            >
                { this.getBots() }
            </RadioGroup>
    }

    getBots() {
        return this.props.bots.map(
            ({botName}) => (
                <ListItem key={botName}>
                    {this.getBotItem(botName)} {botName}
                </ListItem>
            )
        );
    }

    render() {
        return (
            <Grid item>
                Choose your bot:
                { this.getBotsWrapper() }
            </Grid>
        );
    }
}

export default connect(mapStateToProps)(BotChooser);
