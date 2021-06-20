import React, { useState } from 'react';
import { TextField, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@material-ui/core";
import fact from "../components/fact";

export default function LineVariousNoLimit() {
    const [data, setData] = useState({
        lampda: "",
        mu: "",
        c: ""
    });

    const [results, setResults] = useState({ p: 0, p_c: 0, po: 0, ls: 0, q: 0, ws: 0, wq: 0 });
    const [table, setTable] = useState([]);


    const calculate = () => {
        if (data.lampda === "" || data.mu === "" || data.c === "" || data.N === "") {
            alert("Debe llenar todos los campos");
            return;
        }

        let p = parseFloat(data.lampda) / parseFloat(data.mu);
        let p_c = p / parseFloat(data.c);
        let po = 1 / (calcSumatory(p) + (p ** parseFloat(data.c) / (fact(parseFloat(data.c)) * (1 - p_c))));
        let lq = p ** (parseFloat(data.c) + 1) / (fact(parseFloat(data.c) - 1) * (parseFloat(data.c) - p) ** 2) * po;
        let ls = lq + p;

        setResults({
            p: p.toFixed(4),
            p_c: p_c.toFixed(4),
            po: po.toFixed(4),
            lq: lq.toFixed(4),
            ls: ls.toFixed(4),
            ws: (ls / parseFloat(data.lampda)).toFixed(4),
            wq: (lq / parseFloat(data.lampda)).toFixed(4)
        }, calculateLines())
    }


    const calculateLines = () => {
        let lines = [];
        let continues = true;
        let pnAcum = 0;
        for (let index = 0; continues; index++) {
            let pn = 0;
            if (index === 0) {
                pn = results.po;
            } else {
                if (index < parseFloat(data.c)) {
                    pn = (results.p ** index / fact(index) * results.po).toFixed(4);
                } else {
                    pn = (results.p ** index / (fact(parseFloat(data.c)) * parseFloat(data.c) ** (index - parseFloat(data.c))) * results.po).toFixed(4);
                }
            }
            pnAcum =  parseFloat(pnAcum) + parseFloat(pn);

            lines.push({ n: index, pn: pn, pnAcum: pnAcum.toFixed(4) });
            if (pn < 0.0001) {
                continues = false;
            }
        }
        setTable(lines)
    }


    const setInput = (field, value) => {
        setData({ ...data, [field]: value });
    }


    const calcSumatory = (p) => {
        let sumatory = [];
        for (let i = 0; i <= 20; i++) {
            sumatory.push(i >= parseFloat(data.c) ? 0 : (p ** i) / (fact(i)));
        }
        let sum = 0
        sumatory.forEach(e => { sum += e })
        return sum;
    }


    return (
        <div>
            <h2>LINEAS DE ESPERA DE VARIOS SERVIDORES SIN LIMITE EN LA COLA</h2>
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
                                id="c"
                                label="C"
                                variant="filled"
                                className="input"
                                onChange={value => setInput("c", value.target.value)}
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
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
                            <h5>P: {results.p}</h5>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <h5>P/C: {results.p_c}</h5>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <h5>PO: {results.po}</h5>
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
                                        <TableCell>n</TableCell>
                                        <TableCell align="right">Pn</TableCell>
                                        <TableCell align="right">PnAcum</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {table.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">{row.n}</TableCell>
                                            <TableCell align="right">{row.pn}</TableCell>
                                            <TableCell align="right">{row.pnAcum}</TableCell>
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