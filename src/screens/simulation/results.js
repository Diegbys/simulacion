import React from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@material-ui/core";
import calcTime from './../../components/calcTime';
import fact from "../../components/fact";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useHistory } from 'react-router-dom';


function probabilityToPercentage(probability, precission) {
    return `${Math.round(probability * Math.pow(10, precission)) / Math.pow(10, precission)}%`;
}


export default function Results() {
    const params = useParams();
    const lambda = 3600 / params.lambda;
    const mu = 3600 / params.mu;
    const history = useHistory();

    const [table, setTable] = React.useState([]);
    const [result, setResults] = React.useState({
        ls: 0,
        lq: 0,
        ws: 0,
        wq: 0,
    });

    const usage = () => {
        return lambda / (parseInt(params.servers) * mu);
    }

    const calculate_line_one_limit = (tablex) => {
        let ro = (parseFloat(lambda) / parseFloat(mu)).toFixed(4);
        let pRo = ro;
        let pN = parseFloat(params.queue) + 1;
        let lsUp = pRo * (1 - (pN + 1) * pRo ** pN + pN * pRo ** (pN + 1));
        let lsDown = (1 - pRo) * (1 - pRo ** (pN + 1))

        let ls = lsUp / lsDown;
        let lampdaEfec = parseFloat(lambda) * (1 - parseFloat(tablex[tablex.length - 1].pn));
        let lq = ls - lampdaEfec / parseFloat(mu);
        let lampdaPer = parseFloat(lambda) - lampdaEfec;
        let wq = lq / lampdaEfec;
        let ws = wq + (1 / parseFloat(mu));


        setResults({
            ls: ls.toFixed(4),
            lq: lq.toFixed(4),
            ws: ws.toFixed(4),
            wq: wq.toFixed(4),
        });

    }

    const calculateLines_line_one_limit = () => {
        let ro = (parseFloat(lambda) / parseFloat(mu)).toFixed(4);
        let lines = [];
        let pn0 = (1 - ro) / (1 - ro ** ((parseFloat(params.queue) + 1) + 1))
        let pnAcum = 0;

        for (let index = 0; index <= parseFloat(params.queue) + 1; index++) {
            let pn = index === 0 ? pn0 : pn0 * ro ** index;
            pnAcum += pn;

            lines.push({
                n: index,
                pn: pn.toFixed(4),
                pnAcum: pnAcum.toFixed(4),
                nxpn: (pn * index).toFixed(4)
            });
        }
        setTable(lines, calculate_line_one_limit(lines))
        return
    }

    const calculate_line_one_no_limit = () => {
        let ro = (parseFloat(lambda) / parseFloat(mu)).toFixed(4);

        let ls = ro / (1 - ro);
        let lq = ls - ro;
        let ws = ls / parseFloat(lambda);
        let wq = lq / parseFloat(lambda);
        setResults({
            ls: ls.toFixed(4),
            lq: lq.toFixed(4),
            ws: ws.toFixed(4),
            wq: wq.toFixed(4)
        });
        calculateLines_one_no_limit();

    }

    const calculateLines_one_no_limit = () => {
        let ro = (parseFloat(lambda) / parseFloat(mu)).toFixed(4);

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


    const calculate_line_various_limit = () => {
        let c = parseFloat(params.servers);
        let n = parseFloat(params.queue) + parseFloat(params.servers);
        let p = parseFloat(lambda) / parseFloat(mu);
        let p_c = p / parseFloat(params.servers);
        let po = p_c === 1 ? po = 1 / calcSumatory(p) + (p ** c / fact(c)) * (n - c + 1) : 1 / (calcSumatory(p) + (p ** c * ((1 - p_c ** (n - c + 1)) / (fact(c) * (1 - p_c)))));
        let lq = 0;
        if (p_c === 1) {
            lq = po * ((p ** c * (c - n) * (n - c + 1)) / (fact(2 * c)));
        } else {
            lq = (po * ((p ** (c + 1)) / (fact(c - 1) * (c - p) ** 2))) * (1 - p_c ** (n - c) - ((n - c) * p_c ** (n - c) * (1 - p_c)));
        }
        let č = calculateLines_various_limit(po, p, c);
        let ls = lq + (c - č);

        setResults({
            lq: lq.toFixed(4),
            ls: ls.toFixed(4),
            ws: (ls / parseFloat(lambda)).toFixed(4),
            wq: (lq / parseFloat(lambda)).toFixed(4),
        })
    }

    const calcSumatory = (p) => {
        let sumatory = [];
        for (let i = 0; i <= 20; i++) {
            sumatory.push(i >= parseFloat(params.servers) ? 0 : (p ** i) / (fact(i)));
        }
        return sumatory.reduce((a, b) => a + b, 0);
    }


    const calculateLines_various_limit = (po, p, c) => {

        let lines = [];
        let continues = true;
        let pnAcum = 0;
        for (let index = 0; index <= (parseFloat(params.queue) + parseFloat(params.servers)); index++) {
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

    const calcC = (c, lines) => {
        let sum = [];
        for (let i = 0; i <= 20; i++) {
            sum.push(i >= c ? 0 : (c - i) * lines[i].pn);
        }
        return sum.reduce((a, b) => a + b, 0);
    }

    const calculate_line_various_no_limit = () => {

        let p = parseFloat(lambda) / parseFloat(mu);
        let p_c = p / parseFloat(params.servers);
        let po = 1 / (calcSumatory(p) + (p ** parseFloat(params.servers) / (fact(parseFloat(params.servers)) * (1 - p_c))));
        let lq = p ** (parseFloat(params.servers) + 1) / (fact(parseFloat(params.servers) - 1) * (parseFloat(params.servers) - p) ** 2) * po;
        let ls = lq + p;

        setResults({
            p: p.toFixed(4),
            p_c: p_c.toFixed(4),
            po: po.toFixed(4),
            lq: lq.toFixed(4),
            ls: ls.toFixed(4),
            ws: (ls / parseFloat(lambda)).toFixed(4),
            wq: (lq / parseFloat(lambda)).toFixed(4)
        }, calculateLines_various_no_limit(p, po))
    }


    const calculateLines_various_no_limit = (p, po) => {
        let lines = [];
        let continues = true;
        let pnAcum = 0;
        for (let index = 0; continues; index++) {
            let pn = 0;
            if (index === 0) {
                pn = po;
            } else {
                if (index < parseFloat(params.servers)) {
                    pn = (p ** index / fact(index) * po).toFixed(4);
                } else {
                    pn = (p ** index / (fact(parseFloat(params.servers)) * parseFloat(params.servers) ** (index - parseFloat(params.servers))) * po).toFixed(4);
                }
            }
            console.log('aras')
            pnAcum = parseFloat(pnAcum) + parseFloat(pn);

            lines.push({ n: index, pn: pn, pnAcum: pnAcum.toFixed(4) });
            if (pn < 0.0001) {
                continues = false;
            }
        }
        setTable(lines)
    }


    React.useEffect(() => {
        if (params.servers == 1 && params.queue != 0) {
            calculateLines_line_one_limit();
        }

        if (params.servers == 1 && params.queue == 0) {

            calculate_line_one_no_limit();
        }

        if (params.servers > 1 && params.queue != 0) {
            calculate_line_various_limit();
        }

        if (params.servers > 1 && params.queue == 0) {
            console.log("siosi");
            calculate_line_various_no_limit();
        }


    }, [])


    return (
        <div className="resultContainer">
            <div>
                <h1>Resultados</h1>
                <div className="resultsData">
                    <div>
                        <p>Factor de utilización del sistema: {probabilityToPercentage(usage() * 100, 2)}</p>
                        <p>Tiempo promedio en cola: {result.wq}</p>
                        <p>Tiempo promedio en el sistema: {result.ws}</p>
                        <p>Cantidad promedio de clientes en la cola: {result.lq}</p>
                        <p>Cantidad promedio de clientes en el sistema: {result.ls}</p>
                    </div>

                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>N</TableCell>
                                    <TableCell align="right">Pn</TableCell>
                                    <TableCell align="right">PnAcum</TableCell>
                                    <TableCell align="right">N*P</TableCell>.
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
                </div>
            </div>
            <IconButton aria-label="Salir" className="ExitButton" onClick={() => history.push("/")}>
                <ExitToAppIcon />
            </IconButton>
        </div>
    );
}