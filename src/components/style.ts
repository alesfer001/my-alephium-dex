import { makeStyles } from "@material-ui/core";
import { COLORS } from "../muiTheme";

export const commonStyles = makeStyles((theme) => ({
  numberField: {
    flexGrow: 1,
    backgroundColor: "rgba(29, 31, 32, 0.5)",
    "& > * > .MuiInputBase-input": {
      textAlign: "left",
      height: "100%",
      flexGrow: "1",
      fontSize: ".8rem",
      fontFamily: "Roboto Mono, monospace",
      caretShape: "block",
      width: "0",
      padding: theme.spacing(1),
      "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
        "-webkit-appearance": "none",
        "-moz-appearance": "none",
        margin: 0,
      }
    },
    "& > * > input::-webkit-inner-spin-button": {
      webkitAppearance: "none",
      margin: "0",
    },
  },
  inputWithMaxButton: {
    display: "flex",
    alignItems: "center",
    width: "100%"
  },
  maxButton: {
    marginLeft: theme.spacing(1),
  },
  hiddenButton: {
    marginLeft: theme.spacing(1),
    backgroundColor: "transparent !important"
  },
  tokenContainerWithBalance: {
    padding: ".2rem .8rem",
    width: "initial",
  },
  balance: {
    display: 'flex',
    padding: "0.1rem",
    justifyContent: 'flex-end',
    fontSize: '.6rem'
  },
  inputRow: {
    display: "flex",
    flexFlow: "row nowrap",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tokenContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "3px solid #333333",
    padding: ".6rem",
    borderRadius: "10px",
    "& > *": {
      margin: ".1rem",
    },
    margin: ".5rem 0rem .5rem 0rem",
    height: "60px"
  },
  centeredContainer: {
    textAlign: "center",
    width: "100%",
  },
  swapTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& h5": {
      textAlign: "center",
      flexGrow: 1
    }
  },
  spacer: {
    height: "1rem",
  },
  mainPaper: {
    padding: "1.5rem",
    backgroundColor: COLORS.nearBlackWithMinorTransparency,
  },
  titleBar: {
    marginTop: "10rem",
    "& > *": {
      margin: ".5rem",
      alignSelf: "flex-end",
    },
  },
  gradientButton: {
    backgroundImage: `linear-gradient(45deg, ${COLORS.blue} 0%, ${COLORS.nearBlack}20 50%,  ${COLORS.blue}30 62%, ${COLORS.nearBlack}50  120%)`,
    transition: "0.75s",
    backgroundSize: "200% auto",
    boxShadow: "0 0 20px #222",
    "&:hover": {
      backgroundPosition:
        "right center" /* change the direction of the change here */,
    },
    width: "100%",
    height: "3rem",
    marginTop: "1rem",
  },
  disabled: {
    background: COLORS.gray,
  },
  loaderHolder: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  successIcon: {
    color: COLORS.green,
    fontSize: "200px",
  },
  error: {
    marginTop: theme.spacing(1),
    textAlign: "center",
  },
  notification: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  leftAlign: {
    textAlign: "left",
    fontSize: "15px",
    fontFamily: "monospace"
  },
  rightAlign: {
    textAlign: "right",
    fontSize: "15px",
    fontFamily: "monospace"
  },
  tokenPairContainer: {
    display: "flex",
    justifyContent: "space-between",
    margin: ".5rem 0rem .5rem 0rem",
    height: "30px"
  },
}));
