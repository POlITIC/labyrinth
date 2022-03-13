// TODO this component will be taking care of pixi and canvas.
import PixiApp from "../pixi/PixiApp";

import store from "../store/store";
import React from 'react';
import {Button, Checkbox, Grid, List, ListItem} from "@material-ui/core";
import {getAllBots, getLabyrinth} from "../ServerAPI";
import {showLabAction} from "../store/actionCreators/ActionCreator";
import {connect} from "react-redux";
import {initSocket} from "../socket/socket";
import BotChooser from "./BotChooser";

const APP_CONTAINER_ID = "pixiAppContainer";

const mapStateToProps = () => {
    return {};
};


class LabyrinthField extends React.Component {

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        const appContainer = document.getElementById(APP_CONTAINER_ID);

        if (appContainer) {
            appContainer.appendChild(PixiApp.view);
        }
    }

    async getLabyrinth() {
        await getLabyrinth(0)
            .then((response) => {
                const config = response.labyrinth;
                if (config) {
                    PixiApp.showLabyrinth(config);
                    store.dispatch(showLabAction(config));
                    initSocket();
                }
            });
    }

    render() {
        return (
            <Grid container className="App">

                <BotChooser match/>

                <Grid item>
                    <Button variant="contained" color="primary" label="getLab"
                            onClick={this.getLabyrinth.bind(this)}>Start</Button>
                    <div id={APP_CONTAINER_ID}></div>
                </Grid>

            </Grid>
        );
    }
}

export default connect(mapStateToProps)(LabyrinthField);
