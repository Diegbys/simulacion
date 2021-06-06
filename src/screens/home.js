import { Grid } from "@material-ui/core";
import image from './../assets/home.svg';

export default function Home() {
    return (
        <div className="homeContainer">
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <img className="homeImage" src={image} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <div className="homeRigth">
                        <h1>Bienvenido!</h1>
                        <p>Profesor Jhonny Granado</p>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}