import React, { useState } from 'react';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

export default function Simulation(props) {
    const [seconds, setSeconds] = useState(0);
    const [velocity, setVelocity] = useState(1)
    const [pause, setPause] = useState(false);
    let timer = React.useRef(0);

    React.useEffect(() => {
        console.log(props)
        setTime();
    }, [velocity]);

    const setTime = () => {
        clearInterval(timer.current);
        setPause(false);
        timer.current = setInterval(() => {
            setSeconds(prev => prev + 1);
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


    return (
        <div className="simulation">
            <p>prueba</p>


            <div className="timer">
                <div>
                    <p>{seconds}</p>
                    <div className="time-buttons">
                        <SkipPreviousIcon onClick={() => velocity > 1 && setVelocity(prev => prev / 2)} />
                        {!pause ? <PauseIcon onClick={() => pause_or_start()} /> : <PlayArrowIcon onClick={() => pause_or_start()} />}
                        <StopIcon />
                        <SkipNextIcon onClick={() => velocity < 32 && setVelocity(prev => prev * 2)} />
                    </div>
                    <p>x{velocity}</p>
                </div>
                <div className="blur"></div>
            </div>

        </div>
    );
}