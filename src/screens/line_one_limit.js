import React, { useState } from 'react';
import { TextField, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@material-ui/core";

export default function LineOneLimit() {
    const [data, setData] = useState({
        lampda: "",
        mu: "",
        beta: "",
        N: ""
    });
    const [ro, setRo] = useState(0);

    const [results, setResults] = useState({
        ls: 0,
        lq: 0,
        ws: 0,
        wq: 0,
        lampdaEfec: 0,
        lampdaPer: 0,
        p_porcentual: 0,
    });

    const [table, setTable] = useState([]);

    const calculate = (tablex) => {
        let pRo = parseFloat(ro);
        let pN = parseFloat(data.N);
        let lsUp = pRo*(1-(pN+1)*pRo**pN+pN*pRo**(pN+1));
        let lsDown = (1-pRo)*(1-pRo**(pN + 1))

        let ls = lsUp/lsDown;
        let lampdaEfec = parseFloat(data.lampda)*(1-parseFloat(tablex[tablex.length - 1].pn));
        let lq = ls-lampdaEfec/parseFloat(data.mu);
        let lampdaPer = parseFloat(data.lampda) - lampdaEfec;
        let wq = lq / lampdaEfec;
        let ws = wq + (1/parseFloat(data.mu));


        setResults({
            ls: ls.toFixed(4),
            lq: lq.toFixed(4),
            ws: ws.toFixed(4),
            wq: wq.toFixed(4),
            lampdaEfec: lampdaEfec.toFixed(4),
            lampdaPer: lampdaPer.toFixed(4),
            p_porcentual: (lampdaPer/parseFloat(data.lampda)).toFixed(4)
        });

    }

    const calculateLines = () => {
        if (data.lampda !== "" && data.mu !== "" && data.beta !== "" && data.N !== "") {
            let lines = [];
            let pn0 = (1 - ro)/(1 - ro ** (parseFloat(data.N) + 1))
            let pnAcum = 0;

            for (let index = 0; index <= 5; index++) {
                let pn = index === 0 ? pn0 : pn0 * ro ** index;
                pnAcum += pn;

                lines.push({
                    n: index,
                    pn: pn.toFixed(4),
                    pnAcum: pnAcum.toFixed(4),
                    nxpn: (pn * index).toFixed(4)
                });
            }
            setTable(lines, calculate(lines))
            return
        } else {
            alert("Debe llenar todos los campos");
        }
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
            <h2>LINEAS DE ESPERA DE UN SERVIDOR CON LIMITE EN LA COLA</h2>
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
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <TextField
                                id="N"
                                label="N"
                                variant="filled"
                                className="input"
                                onChange={value => setInput("N", value.target.value)}
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
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
                            <Button variant="contained" className="button" onClick={() => calculateLines()}>Calcular</Button>
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
                        <Grid item xs={12} md={6}>
                            <h5>λef: {results.lampdaEfec}</h5>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <h5>λper: {results.lampdaPer}</h5>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <h5>P%: {results.p_porcentual * 100}%</h5>
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