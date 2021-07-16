import React, { useState } from 'react';
import { TextField, Grid, FormControl, Select, MenuItem, InputLabel, Button, Icon } from "@material-ui/core";
import { useHistory } from 'react-router-dom';


export default function Form() {
    var time_format = "**:**:**";
    var time_mask = "__:__:__";
    var time_regexp = /[0-5]\d:[0-5]\d:[0-5]\d/;

    const [data, setData] = useState({
        lambda: time_mask,
        mu: time_mask,
        limit: "",
        queue: 0,
        servers: "",
        observation: time_mask
    });

    const [errors, setErrors] = useState({});
    const [lastTarget, setLastTarget] = useState(false);
    const history = useHistory();

    const setInput = (name, target) => {
        setLastTarget(target);
        setData({ ...data, [name]: format(target.value, time_format, time_mask, true) });
    }


    const format = (x, pattern, mask = "", first = false) => {
        let chars = x.replace(/[^0-9]/g, "").split('');
        let count = 0;

        let formatted = '';
        for (let i = 0; i < pattern.length; i++) {
            if (chars[count]) {
                formatted += (/\*/.test(pattern[i])) ? chars[count++] : pattern[i];
            } else if (mask && mask[i]) {
                formatted += mask[i];
            }
        }


        if (calcSeconds(formatted) > 24 * 60 * 60 && first) {
            formatted = "24:00:00";
        } else if (formatted <= 0 && first) {
            formatted = "00:00:01";
        } else if (formatted < 0 && first) {
            formatted = 0;
        }
        return formatted;
    }

    const calcSeconds = (seconds) => {
        return seconds.split(":").reverse().reduce((result, current, index) => result + current * Math.pow(60, index), 0);
    }

    React.useEffect(() => {
        if (lastTarget) {
            lastTarget.selectionStart = lastTarget.selectionEnd = format(lastTarget.value, time_format).length
        }
    }, [data.lambda, data.limit, data.mu, data.observation]);

    const submit = () => {
        let error = "El campo no puede estar vacio";

        let errors = ["lambda", "mu", "observation"].reduce((errors, index) => {
            if (!time_regexp.test(data[index])) {
                errors[index] = error;
            } else if (calcSeconds(data[index]) <= 0 || calcSeconds(data[index]) >= 24 * 60 * 60) {
                errors[index] = "Debe añadir una hora valida";
            }
            return errors;
        }, {});

        if(data.queue <= 0 && data.limit){
            errors['queue'] = "El campo no puede ser menor a 0";
        }

        if(data.servers <= 0){
            errors['servers'] = "Debe haber almenos 1 servidor";
        }

        setErrors(errors);

        let params = [
            ...["lambda", "mu", "observation"].map(e => calcSeconds(data[e])),
            ...["queue", "servers"].map(e => parseInt(data[e])),
            [data.limit]
        ];

        if (!Object.keys(errors).length) {
            history.push("/simulation/game/" + params.join("/"));
        }
    }



    return (
        <div>
            <h2>Simulación de cajeros</h2>
            <h5>Ingrese los datos</h5>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={3}>
                    <FormControl variant="outlined">
                        <InputLabel id="limit">Límite en la cola</InputLabel>
                        <Select
                            labelId="limit"
                            id="select-limit"
                            value={data.limit}
                            onChange={event => setData({ ...data, limit: event.target.value })}
                            label="Límite"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={false}>Sin límite</MenuItem>
                            <MenuItem value={true}>Con límite</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {data.limit &&
                    <Grid item xs={12} md={6} lg={3}>
                        <TextField
                            id="queue"
                            label="Límite en la cola"
                            type="number"
                            variant="outlined"
                            helperText={errors.queue}
                            value={data.queue}
                            onChange={event => setData({ ...data, queue: event.target.value })}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                }
                <Grid item xs={12} md={6} lg={3}>
                    <TextField
                        id="lambda"
                        label="Tiempo medio de llegada"
                        variant="outlined"
                        helperText={errors.lambda}
                        value={data.lambda}
                        onChange={value => setInput("lambda", value.target)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <TextField
                        id="mu"
                        label="Tiempo medio de servicio"
                        variant="outlined"
                        helperText={errors.mu}
                        value={data.mu}
                        onChange={value => setInput("mu", value.target)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <TextField
                        id="servers"
                        label="Cantidad de cajeros"
                        type="number"
                        variant="outlined"
                        helperText={errors.servers}
                        value={data.servers}
                        onChange={event => setData({ ...data, servers: event.target.value })}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <TextField
                        id="observation"
                        label="Tiempo de observación"
                        variant="outlined"
                        helperText={errors.observation}
                        value={data.observation}
                        onChange={value => setInput("observation", value.target)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
            </Grid>
            <Button
                variant="contained"
                color="primary"
                endIcon={<Icon>send</Icon>}
                onClick={() => submit()}
            >
                Comenzar Simulación
            </Button>
        </div>
    );
}