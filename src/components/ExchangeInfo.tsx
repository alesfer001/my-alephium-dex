import { makeStyles, AppBar, Toolbar, Link, Hidden, Grid, Card, CardContent, Typography } from "@material-ui/core";
import logo from "../../images/alephium-logo.png";
import { useState, useEffect } from "react";
import axios from "axios";
import CountUp from "react-countup";

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
  const [alephiumPrice, setAlephiumPrice] = useState(null);
  const [previousPrice, setPreviousPrice] = useState(null);
  // Add real data for TVL here
  const totalValueLocked = "89.92M";

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=alephium&vs_currencies=usd"
        );
        const price = response.data.alephium.usd;
        setPreviousPrice(alephiumPrice);
        setAlephiumPrice(price);
      } catch (error) {
        console.error("Error fetching Alephium price:", error);
      }
    };

    fetchPrice();

    const intervalId = setInterval(fetchPrice, 15000);

    return () => {
      clearInterval(intervalId);
    };
  }, [alephiumPrice]);

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
                  <Typography variant="h6">
                    $
                    {alephiumPrice && previousPrice && (
                      <CountUp
                        start={previousPrice}
                        end={alephiumPrice}
                        duration={0.5}
                        decimals={6}
                      />
                    )}
                  </Typography>
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
