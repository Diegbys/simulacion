import React, { useState } from 'react';
import { TextField, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@material-ui/core";

export default function LineOneNoLimit() {
    const [data, setData] = useState({
        lampda: "",
        mu: "",
        beta: "",
    });
    const [ro, setRo] = useState(0);

    const [results, setResults] = useState({
        ls: 0,
        lq: 0,
        ws: 0,
        wq: 0
    });

    const [table, setTable] = useState([]);

    const calculate = () => {
        if (data.lampda !== "" && data.mu !== "" && data.beta !== "") {
            let ls = parseFloat(ro) / (1 - parseFloat(ro));
            let lq = ls - parseFloat(ro);
            let ws = ls / parseFloat(data.lampda);
            let wq = lq / parseFloat(data.lampda);
            setResults({
                ls: ls.toFixed(4),
                lq: lq.toFixed(4),
                ws: ws.toFixed(4),
                wq: wq.toFixed(4)
            });
            calculateLines();
        } else {
            alert("Debe llenar todos los campos")
        }
    }

    const calculateLines = () => {
        let lines = [];
        let continues = true;
        let pn0 = 1 - ro;
        let pnAcum = 0;
        for (let index = 0; continues; index++) {
            let pn = index === 0 ? pn0 : pn0 * ro ** index;
            pnAcum += pn;

            lines.push({
                n: index,
                pn: pn.toFixed(4),
                pnAcum: pnAcum.toFixed(4),
                nxpn: (pn * index).toFixed(4)
            });
            if (pn < 0.0001) {
                continues = false;
            }
        }
        setTable(lines)
    }

    const setInput = (field, value) => {
        setData({ ...data, [field]: value }, setRoInput());
    }

    const setRoInput = () => {
        if (data.lampda !== "" && data.mu !== "") {
            setRo((parseFloat(data.lampda) / parseFloat(data.mu)).toFixed(4));
        }
    }


    return (
        <div>
            <h2>LINEAS DE ESPERA DE UN SERVIDOR SIN LIMITE EN LA COLA</h2>
            <form >
                <h5>Ingrese los datos</h5>
                <Grid container spacing={2}>
                    <Grid container spacing={1} item xs={12} md={6}>
                        <Grid item xs={12} md={6} lg={3}>
                            <TextField
                                id="lampda"
                                label="λ"
                                variant="filled"
                                className="input"
                                onChange={value => setInput("lampda", value.target.value)}
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <TextField
                                id="mu"
                                label="μ"
                                variant="filled"
                                className="input"
                                onChange={value => setInput("mu", value.target.value)}
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{ min: 0, max: 10 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <TextField
                                id="beta"
                                label="β"
                                variant="filled"
                                className="input"
                                onChange={value => setInput("beta", value.target.value)}
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{ min: 0, max: 10 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <TextField
                                id="ro"
                                label="ρ"
                                variant="filled"
                                className="input"
                                value={ro}
                                disabled
                                type="number"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <br />
                            <Button variant="contained" className="button" onClick={() => calculate()}>Calcular</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <h5>Resultados</h5>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <h5>LS: {results.ls}</h5>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <h5>LQ: {results.lq}</h5>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <h5>WS: {results.ws}</h5>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <h5>WQ: {results.wq}</h5>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>N</TableCell>
                                        <TableCell align="right">Pn</TableCell>
                                        <TableCell align="right">PnAcum</TableCell>
                                        <TableCell align="right">N*P</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {table.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">{row.n}</TableCell>
                                            <TableCell align="right">{row.pn}</TableCell>
                                            <TableCell align="right">{row.pnAcum}</TableCell>
                                            <TableCell align="right">{row.nxpn}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}