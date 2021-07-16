import React from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@material-ui/core";
import calcTime from './../../components/calcTime';

function factorial(n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

function probabilityToPercentage(probability, precission) {
    return `${Math.round(probability * Math.pow(10, precission)) / Math.pow(10, precission)}%`;
}

function formatNumber(number, precission) {
    return Math.round(number * Math.pow(10, precission)) / Math.pow(10, precission);
}

export default function Results() {
    const params = useParams();
    var impossible = "Error al ejecutar los calculos";
    var limit = params.queue + params.servers;

    const r = () => {
        return params.lambda / params.mu;
    }

    const p0 = () => {
        if (usage() > 1 && params.limit === 'false') {
            return 0;
        }

        let inner;
        if (params.limit === 'false') {
            inner = (total, a, n) => total + Math.pow(r(), n) / factorial(n) + (Math.pow(r(), params.servers) / (factorial(params.servers) * (1 - usage())));
        } else if (usage() !== 1) {
            inner = (total, a, n) => total + Math.pow(r(), n) / factorial(n) + (Math.pow(r(), params.servers) * (1 - Math.pow(usage(), limit - params.servers + 1))) / (factorial(params.servers) * (1 - usage()));
        } else {
            inner = (total, a, n) => total + Math.pow(r(), n) / factorial(n) + (Math.pow(r(), params.servers) * (limit - params.servers + 1)) / factorial(params.servers);
        }

        return Math.pow(Array(params.servers).fill(0).reduce(inner, 0), -1);
    }

    const pn = (n) => {
        if (n === 0) {
            return p0();
        }

        if (n >= 1 && n < params.servers) {
            return (Math.pow(r(), n) * p0()) / factorial(n);
        }

        if (params.limit === 'false' || n <= limit) {
            return (Math.pow(r(), n) * p0()) / (Math.pow(params.servers, n - params.servers) * factorial(params.servers));
        }

        return 0;
    }

    const usage = () => {
        return params.lambda / (params.servers * params.mu);
    }

    const averageQueueSize = () => {
        if (!p0()) {
            return impossible;
        }

        let usagex = usage();
        if (usage() === 1 && params.limit === 'true') {
            usagex -= 0.0001;
        }

        let calc = (Math.pow(r(), params.servers) * usagex * p0()) / (factorial(params.servers) * Math.pow(1 - usagex, 2));

        if (params.limit === 'false') {
            return calc;
        }

        return (calc * (1 - Math.pow(usage(), limit - params.servers) - (1 - usage()) * (limit - params.servers) * Math.pow(usage(), limit - params.servers)));
    }

    const averageQueueTime = () => {
        if (!p0()) {
            return impossible;
        }

        if (params.limit === 'false') {
            return averageQueueSize() / params.lambda;
        }

        return averageSystemSize() / (params.lambda * (1 - pn(limit))) - (1 / params.mu);
    }

    const averageSystemTime = () => {
        if (!p0()) {
            return impossible;
        }

        return averageQueueTime() + (1 / params.mu);
    }

    const averageSystemSize = () => {
        if (!p0()) {
            return impossible;
        }

        if (params.limit === 'false') {
            return r() + averageQueueSize();
        }

        return averageQueueSize() + r() * (1 - pn(limit));
    }

    let x = 0, probabilities = [];
    let px = pn(x), pxi = pn(x);

    while (pxi >= 0 && (px === -1 || px >= 0.0001) && (params.limit === 'false' || x <= limit)) {
        probabilities.push({ n: x, pn: probabilityToPercentage(px * 100, 2), pnAcum: 0, nxpn: probabilityToPercentage(pxi * 100, 2) });


        x++;
        px = pn(x);
        pxi += px;
    }

    const queue_time = averageQueueTime();
    const system_time = averageSystemTime();

    return (
        <div>
            <p>Factor de utilización del sistema: {probabilityToPercentage(usage() * 100, 2)}</p>
            <p>Tiempo promedio en cola: {isNaN(queue_time) ? queue_time : `${formatNumber(queue_time, 3)} horas (${calcTime(queue_time * 3600)})`}</p>
            <p>Tiempo promedio en el sistema: {isNaN(system_time) ? system_time : `${formatNumber(system_time, 3)} horas (${calcTime(system_time * 3600)})`}</p>
            <p>Cantidad promedio de clientes en la cola: {Math.round(averageQueueSize())}</p>
            <p>Cantidad promedio de clientes en el sistema: {Math.round(averageSystemSize())}</p>




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
                        {probabilities.map((row, index) => (
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
    );
}