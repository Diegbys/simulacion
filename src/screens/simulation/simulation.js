import React, { useState } from 'react';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { useParams, useHistory } from 'react-router-dom';
import { IconButton } from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';



import calcTime from './../../components/calcTime';
import Client from './../../components/client';
import Cajero from './../../assets/cajero.png';

function getRandomExponential(rate) {
    return parseInt(-Math.log(Math.random()) * rate);
}

function getRandomPoisson(lambda) {
    let l = Math.exp(-lambda);
    let p = 1.0;
    let k = 0;

    do {
        k++;
        p *= Math.random();
    } while (p > l);

    return parseInt(k - 1);
}

export default function Simulation(props) {
    const params = useParams();

    const [seconds, setSeconds] = useState(params.observation);
    const [velocity, setVelocity] = useState(1)
    const [pause, setPause] = useState(false);
    const [toNewClient, setToNewClient] = useState(getRandomExponential(params.lambda));
    const [servers, setServers] = useState(Array(parseInt(params.servers)).fill({ client: "", timeClient: -1 }))
    const [queue, setQueue] = useState([]);
    const history = useHistory()

    let timer = React.useRef(0);

    let serversConst = servers;
    let secondsClient = toNewClient;
    let sec = seconds;

    React.useEffect(() => {
        setTime();
    }, [velocity]);

    const setTime = () => {
        clearInterval(timer.current);
        setPause(false);

        timer.current = setInterval(() => {
            console.log(secondsClient)
            console.log( sec + ' ' + (sec - 1 <= 0))

            if (sec - 1 <= 0) {
                stopSimulation();
            }

            setSeconds(prev => prev - 1);
            sec -= 1

            if (secondsClient - 1 <= 0) {
                addNewClient();
            } else {
                secondsClient -= 1
                setToNewClient(prev => prev - 1);
            }

            calcServers();

        }, (1000 / velocity))

        return () => clearInterval(timer.current);
    }

    const pause_or_start = () => {
        if (!pause) {
            clearInterval(timer.current);
            setPause((prev) => !prev);

        } else {
            setTime();
        }
    };

    const addNewClient = () => {
        let colors = ['#00a8ff', '#9c88ff', '#fbc531', '#4cd137', '#487eb0', '#e84118', '#f5f6fa', '#273c75', '#353b48'];
        let skins = ['#fdddca', '#a18d82', '#685c55', '#4e4540']
        let client = <Client
            shirt1={`rgb(${parseInt(Math.random() * 256)}, ${parseInt(Math.random() * 256)}, ${parseInt(Math.random() * 256)})`}
            shirt2={`rgb(${parseInt(Math.random() * 256)}, ${parseInt(Math.random() * 256)}, ${parseInt(Math.random() * 256)})`}
            shoes={colors[parseInt(Math.random() * colors.length)]}
            skin={skins[parseInt(Math.random() * skins.length)]}
            hair={colors[parseInt(Math.random() * colors.length)]}
            jeans={colors[parseInt(Math.random() * colors.length)]}
        />


        if (params.limit === 'false') {
            queue.push(<div className="client">{client}</div>);
        } else {
            if (queue.length < params.queue) {
                queue.push(<div className="client">{client}</div>);
            } else {
                console.log('pendiente');
            }
        }

        let newSecond = getRandomExponential(params.lambda)
        setToNewClient(newSecond);
        secondsClient = newSecond;

    }

    const calcServers = () => {
        let queueToUp = queue;

        let serversToUpdate = [];

        serversConst.forEach(element => {
            let server = {}
            server.timeClient = element.timeClient - 1;

            if (server.timeClient < 0) {
                server.client = '';
            } else {
                server.client = element.client;
            }

            if (server.timeClient < -1 && queue.length) {
                server.client = queueToUp.shift();
                server.timeClient = getRandomPoisson(params.mu);
            }

            serversToUpdate.push(server);
        });

        setServers(serversToUpdate)
        serversConst = serversToUpdate;

        console.log(serversToUpdate);
    }

    const stopSimulation = () => {
        clearInterval(timer.current);
        history.push(`/simulation/results/${params.lambda}/${params.mu}/${params.observation}/${params.queue}/${params.servers}/${params.limit}`);

    }

    return (
        <div className="simulation-container">
            <div className="servers">
                {servers.map((server, index) => {
                    return (
                        <div key={index} className="server">
                            <img className='cajero' src={Cajero} alt="logo" width="500" height="600" />
                            {server.client}
                        </div>
                    );
                })}
            </div>

            <div className="clients">
                {queue.map((client, index) => client)}
            </div>

            <div className="timer">
                <div>
                    <p>{calcTime(seconds)}</p>
                    <div className="time-buttons">
                        <SkipPreviousIcon onClick={() => velocity > 1 && setVelocity(prev => prev / 2)} />
                        {!pause ? <PauseIcon onClick={() => pause_or_start()} /> : <PlayArrowIcon onClick={() => pause_or_start()} />}
                        <StopIcon onClick={() => stopSimulation()} />
                        <SkipNextIcon onClick={() => velocity < 32 && setVelocity(prev => prev * 2)} />
                    </div>
                    <p>x{velocity}</p>
                </div>
                <div className="blur"></div>
            </div>

            <IconButton aria-label="Salir" className="ExitButton" onClick={() => history.push("/")}>
                <ExitToAppIcon />
            </IconButton>
        </div>
    );
}