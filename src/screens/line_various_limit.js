import React, { useState } from 'react';
import { TextField, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@material-ui/core";
import fact from "../components/fact";

export default function LineVariousLimit() {
    const [data, setData] = useState({
        lampda: "",
        mu: "",
        c: "",
        n: ""
    });

    const [results, setResults] = useState({ p: 0, p_c: 0, po: 0, ls: 0, q: 0, ws: 0, wq: 0, č: 0 });
    const [table, setTable] = useState([]);


    const calculate = () => {
        if (data.lampda === "" || data.mu === "" || data.c === "" || data.N === "" || data.č === "") {
            alert("Debe llenar todos los campos");
            return;
        }
        
        let c = parseFloat(data.c);
        let n = parseFloat(data.n);
        let p = parseFloat(data.lampda) / parseFloat(data.mu);
        let p_c = p / parseFloat(data.c);
        let po = p_c === 1 ? po = 1 / calcSumatory(p) + (p ** c / fact(c)) * (n - c + 1) : 1 / (calcSumatory(p) + (p ** c * ((1 - p_c ** (n - c + 1)) / (fact(c) * (1 - p_c)))));
        let lq = 0;
        if (p_c === 1) {
            lq = po * ((p ** c * (c - n) * (n - c + 1)) / (fact(2 * c)));
        } else {
            lq = (po * ((p ** (c + 1)) / (fact(c - 1) * (c - p) ** 2))) * (1 - p_c ** (n - c) - ((n - c) * p_c ** (n - c) * (1 - p_c)));
        }
        let č = calculateLines(po, p, c);
        let ls = lq + (c - č);

        setResults({
            p: p.toFixed(4),
            p_c: p_c.toFixed(4),
            po: po.toFixed(4),
            lq: lq.toFixed(4),
            ls: ls.toFixed(4),
            ws: (ls / parseFloat(data.lampda)).toFixed(4),
            wq: (lq / parseFloat(data.lampda)).toFixed(4),
            č: č.toFixed(4)
        })
    }


    const calculateLines = (po, p, c) => {
        let lines = [];
        let continues = true;
        let pnAcum = 0;
        for (let index = 0; index <= parseFloat(data.n); index++) {
            let pn = 0;
            if (index === 0) {
                pn = po.toFixed(4);
            } else {
                pn = (index < c ? p ** index / fact(index) * po : p ** index / (fact(c) * c ** (index - c)) * po).toFixed(4);
            }
            pnAcum = parseFloat(pnAcum) + parseFloat(pn);

            lines.push({ n: index, pn: pn, pnAcum: pnAcum.toFixed(4) });
            if (pn < 0.0001) {
                continues = false;
            }
        }
        setTable(lines);
        return calcC(c, lines);
    }


    const setInput = (field, value) => {
        setData({ ...data, [field]: value });
    }


    const calcSumatory = (p) => {
        let sumatory = [];
        for (let i = 0; i <= 20; i++) {
            sumatory.push(i >= parseFloat(data.c) ? 0 : (p ** i) / (fact(i)));
        }
        return sumatory.reduce((a, b) => a + b, 0);
    }

    const calcC = (c, lines) => {
        let sum = [];
        for (let i = 0; i <= 20; i++) {
            sum.push(i >= c ? 0 : (c - i) * lines[i].pn);
        }
        return sum.reduce((a, b) => a + b, 0);
    }


    return (
        <div>
            <h2>LINEAS DE ESPERA DE VARIOS SERVIDORES CON LIMITE EN LA COLA</h2>
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
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <TextField
                                id="n"
                                label="N"
                                variant="filled"
                                className="input"
                                onChange={value => setInput("n", value.target.value)}
                                type="number"
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
                        <Grid item xs={12} md={6}>
                            <h5>č: {results.č}</h5>
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