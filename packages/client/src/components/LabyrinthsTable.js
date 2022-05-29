import React from "react";
import {connect} from "react-redux";
import store from "../store/store";
import {
    Grid,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper, RadioGroup, Radio
} from "@material-ui/core";
import {selectedLabyrinth} from "../store/actionCreators/ActionCreator";

const mapStateToProps = ({userAvailableLabs, selectedLabyrinth}) =>
    ({userAvailableLabs, selectedLabyrinth});

class LabyrinthsTable extends React.Component {

    constructor(...args) {
        super(...args);
    }

    getLabs() {
        return this.props.userAvailableLabs;
    }

    handleRadioSelect(event, value) {
       store.dispatch(selectedLabyrinth(value));
    }

    render() {
        const labs = this.getLabs();

        return (
            <Grid container>
                Choose labyrinth you want to play on:
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Select Labyrinth</TableCell>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Created</TableCell>
                                <TableCell align="center">By</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {labs.map((row) => (
                                <TableRow key={row.$loki}>
                                    <TableCell component="th" scope="row" align="center">
                                        <RadioGroup name="shipSpeed" key={row.$loki}
                                                          onChange={this.handleRadioSelect.bind(this)}
                                                          value={this.props.selectedLabyrinth}
                                        >
                                            <Radio value={row.labyrinthId}/>
                                        </RadioGroup>
                                    </TableCell>
                                    <TableCell
                                        align="center">{row.labyrinthId}</TableCell>
                                    <TableCell
                                        align="center">{new Date(row.meta.created).toLocaleString()}</TableCell>
                                    {
                                        // TODO get user name instead of id
                                    }
                                    <TableCell align="center">{row.userId}</TableCell>
                                </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        );
    }
}

export default connect(mapStateToProps)(LabyrinthsTable);
