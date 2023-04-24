import { makeStyles, AppBar, Toolbar, Link, Hidden, Grid, Card, CardContent, Typography } from "@material-ui/core";
import logo from "../../images/alephium-logo.png";

const useStyles = makeStyles((theme) => ({
    exchange: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: theme.spacing(2),
        marginLeft: theme.spacing(4),
        marginRight: theme.spacing(4),
    },
    card: {
        minWidth: 150,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    cardContent: {
        padding: theme.spacing(1),
        '& .MuiTypography-h6': {
            fontSize: '0.9rem',
        },
        '&:last-child': {
            paddingBottom: theme.spacing(1),
        },
    },
}));

function ExchangeInfo() {
  const classes = useStyles();
  // Add real data for Alephium price and TVL here
  const alephiumPrice = "0.2604";
  const totalValueLocked = "89.92M";

  return (
    <Grid container>
      <Grid item xs={12}>
        <div className={classes.exchange}>
          <Typography variant="h4">Exchange</Typography>
          <div style={{ display: 'flex' }}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={logo} alt="Alephium" style={{ marginRight: 8, width: 24, height: 24 }} />
                  <Typography variant="h6">${alephiumPrice}</Typography>
                </div>
              </CardContent>
            </Card>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography variant="h6">${totalValueLocked} TVL</Typography>
              </CardContent>
            </Card>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export default ExchangeInfo;
