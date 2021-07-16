import React, { useState } from 'react';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { useParams, useHistory } from 'react-router-dom';

import calcTime from './../../components/calcTime';

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

    React.useEffect(() => {
        setTime();
    }, [velocity]);

    const setTime = () => {
        clearInterval(timer.current);
        setPause(false);

        timer.current = setInterval(() => {
            console.log(secondsClient)
            if (seconds - 1 <= 0) {
                stopSimulation();
            }

            setSeconds(prev => prev - 1);

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
        if (params.limit === 'false') {
            console.log('si')
            queue.push(<div className="client"></div>);
        } else {
            if (queue.length < params.queue) {
                queue.push(<div className="client"></div>);
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

    const stopSimulation = () =>{
        clearInterval(timer.current);
        history.push(`/simulation/results/${params.lambda}/${params.mu}/${params.observation}/${params.queue}/${params.servers}/${params.limit}`);

    }

    return (
        <div className="simulation-container">
            <div className="servers">
                {servers.map((server, index) => <div key={index} className="server">{server.client}</div>)}
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
                        <StopIcon onClick={() => stopSimulation()}/>
                        <SkipNextIcon onClick={() => velocity < 32 && setVelocity(prev => prev * 2)} />
                    </div>
                    <p>x{velocity}</p>
                </div>
                <div className="blur"></div>
            </div>

        </div>
    );
}