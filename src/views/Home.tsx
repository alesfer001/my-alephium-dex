import { makeStyles, AppBar, Toolbar, Link, Hidden } from "@material-ui/core";
import { NavLink, Switch, Route, Redirect } from "react-router-dom";
import { COLORS } from "../muiTheme";
import Swap from "../components/Swap";
import UserLiquidity from "../components/UserLiquidity";
import Pool from "../components/Pools";
import { AlephiumConnectButton } from "@alephium/web3-react";
import { useDispatch } from "react-redux"
import { reset as resetSwapState } from "../state/swap/actions";
import { reset as resetMintState } from "../state/mint/actions";
import logo from "../../images/simplephium-logo.png";
import ExchangeInfo from "../components/ExchangeInfo";
import LandingPage from "../components/LandingPage";

const useStyles = makeStyles((theme) => ({
  spacer: {
    height: "1rem",
  },
  appBar: {
    background: COLORS.nearBlackWithMinorTransparency,
    "& > .MuiToolbar-root": {
      margin: ".5rem 0rem 0rem 1rem",
      width: "100%",
    },
  },
  link: {
    ...theme.typography.body1,
    color: theme.palette.text.primary,
    marginLeft: theme.spacing(6),
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(2.5),
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: theme.spacing(1),
    },
    "&.active": {
      color: theme.palette.primary.light,
    },
  },
  bg: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  logo: {
    cursor: "pointer",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
}));

function Home() {
  const classes = useStyles();
  const dispatch = useDispatch()

  return (
    <div className={classes.bg}>
      <AppBar
        position="static"
        color="inherit"
        className={classes.appBar}
        elevation={0}
      >
        <Toolbar>
          <div className={classes.spacer} />
          <Hidden implementation="css" xsDown>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className={classes.logo}>
                <Link component={NavLink} to="/">
                  <img src={logo} alt="Logo" width="50" height="50" />
                </Link>
              </div>
              <Link
                component={NavLink}
                to="/swap"
                color="inherit"
                className={classes.link}
                onClick={() => { dispatch(resetSwapState()) }}
              >
                Swap
              </Link>
              <Link
                component={NavLink}
                to="/liquidity"
                color="inherit"
                className={classes.link}
                onClick={() => { dispatch(resetMintState()) }}
              >
                Liquidity
              </Link>
              <Link
                component={NavLink}
                to="/pool"
                color="inherit"
                className={classes.link}
              >
                Pools
              </Link>
              <Link
                component="a"
                href="https://docs.shin.app"
                color="inherit"
                className={classes.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Docs
              </Link>
            </div>
          </Hidden>
          <div style={{ position: "absolute", top: "10px", right: "30px" }}>
            <AlephiumConnectButton label="Connect" />
          </div>
        </Toolbar>
      </AppBar>
      {/* <ExchangeInfo /> */}
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route exact path="/swap">
          <Swap />
        </Route>
        <Route exact path="/liquidity">
          <UserLiquidity />
        </Route>
        <Route exact path="/pool">
          <Pool />
        </Route>
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </div>
  );
}

export default Home;
