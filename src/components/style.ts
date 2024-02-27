import { makeStyles } from "@material-ui/core";
import { COLORS } from "../muiTheme";

export const commonStyles = makeStyles((theme) => ({
  numberField: {
    flexGrow: 1,
    "& > * > .MuiInputBase-input": {
      textAlign: "left",
      height: "100%",
      flexGrow: "1",
      fontSize: "1.6rem",
      fontFamily: "Roboto Mono, monospace",
      caretShape: "block",
      width: "0",
      padding: theme.spacing(1),
      // textAlign: "right",
      // height: "100%",
      // flexGrow: "1",
      // fontSize: "1.5rem",
      // fontFamily: "Roboto Mono, monospace",
      // caretShape: "block",
      // width: "0",
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
  inputRemoveLiquidity: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    border: '1px solid rgba(255, 255, 255, 0.1)', // subtle border
    borderRadius: '20px',
    backgroundColor: '#1F2128', // a darker background color for the container
    padding: theme.spacing(0.5),
    marginTop: theme.spacing(3)
  },
  maxButton: {
    color: COLORS.blue, // White text color
    borderRadius: '12px', // Rounded corners
    padding: theme.spacing(0.5, 1), // Vertical and horizontal padding
    fontSize: '0.75rem', // Smaller font size
    fontWeight: 'bold', // Bold font weight
    textTransform: 'none', // Prevent uppercase transformation
    minWidth: 'auto', // Adjust width to content
    '&:hover': {
      color: COLORS.blueWithTransparency,
      backgroundColor: 'transparent', // Slightly darker purple on hover
      '& > span > svg': {
        fill: COLORS.blueWithTransparency
      }
    },
  },
  walletDisplay: {
    color: COLORS.white, // White text color
    borderRadius: '12px', // Rounded corners
    padding: theme.spacing(0.5, 1), // Vertical and horizontal padding
    fontSize: '0.75rem', // Smaller font size
    fontWeight: 'bold', // Bold font weight
    textTransform: 'none', // Prevent uppercase transformation
    minWidth: 'auto', // Adjust width to content
    '&:hover': {
      cursor: "default",
      backgroundColor: "transparent"
    },
  },
  hiddenButton: {
    marginLeft: theme.spacing(1),
    backgroundColor: "transparent !important"
  },
  tokenContainerWithBalance: {
    backgroundColor: '#1F2128', // a darker background color for the container
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)', // subtle border
    padding: theme.spacing(2),
    position: 'relative', // for absolute positioning of the balance
  },
  // tokenContainerWithBalance: {
  //   padding: ".2rem .8rem",
  //   width: "initial",
  // },
  balance: {
    display: 'flex',
    padding: "0.1rem",
    justifyContent: 'flex-end',
    fontSize: '.7rem',
    // paddingTop: "1rem",
    alignItems: "center"
  // tokenContainerWithBalance: {
  //   minHeight: "44px",
  //   padding: ".2rem .8rem",
  //   border: "3px solid #333333",
  //   borderRadius: "10px",
  //   width: "initial",
  //   height: "80px",
  // },
  // balance: {
  //   display: 'flex',
  //   padding: "0.1rem"
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
  centeredButton: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  swapTitle: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: theme.spacing(4),
  },
  addLiquidityButton: {
    position: 'absolute',
    right: 0,
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  centerTitle: {
    textAlign: "center",
  },
  spacer: {
    height: "1rem",
  },
  mainPaper: {
    padding: "1.5rem",
    backgroundColor: COLORS.nearBlackWithMinorTransparency,
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    position: 'relative', // This is needed to position the `&:before` pseudo-element
    // overflow: 'hidden', // This can be added to prevent the blur effect from bleeding outside the borderRadius
    "&:before": {
      content: '""',
      display: "block",
      top: 0, // Stretch to the full height of the parent
      left: 0,
      right: 0, // Stretch to the full width of the parent
      bottom: 0, // Stretch to the full height of the parent
      // height: "400px",
      // width: "500px",
      position: "absolute",
      transform: "scale(1.1)",
      filter: "blur(50px)",
      backgroundColor: "rgba(131, 185, 252, 0.175)",
      zIndex: "-2"
    },
    // padding: "2rem",
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
    justifyContent: 'space-between',
    marginTop: theme.spacing(2)
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
  connectWalletButton: {
    "& > div": {
      width: "100%",
      display: "flex",
      borderRadius: "5px",
      marginTop: "1rem"

    },
    "& > div > button": {
      width: "100%",
      borderRadius: "5px",
      padding: "0", // Reset padding if necessary
      border: "none", // Reset border if necessary
      margin: "0",
      overflow: 'hidden', // To match the "Swap" button's overflow property
      boxShadow: "0 0 20px #222", // Match the shadow as well
    },
    "& > div > button > div": {
      backgroundImage: `linear-gradient(45deg, ${COLORS.blue} 0%, ${COLORS.nearBlack}20 50%,  ${COLORS.blue}30 62%, ${COLORS.nearBlack}50  120%)`,
      transition: "0.75s",
      backgroundSize: "200% auto",
      // boxShadow: "0 0 20px #222",
      // "&:hover": {
      //   backgroundPosition: "right center",
      // },
      display: "flex", // To center content, if necessary
      alignItems: "center", // To center content, if necessary
      justifyContent: "center", // To center content, if necessary
      borderRadius: "5px",
      height: "3rem",
      width: "100% !important", // Important! Make sure this doesn't conflict with inline styles
      "&:hover": {
        backgroundPosition: "right center",
        borderRadius: "5px !important",
        backgroundColor: "rgba(17, 81, 161, 0.8) !important"
      },
      backgroundColor: "rgba(25, 117, 230, 0.8)"
    },
    // Since you're setting width to 100% important on the child div,
    // make sure that the nested div where the text is also has width set to 100% to not overflow
    "& > div > button > div > div": {
      flexGrow: "1",
      textAlign: "center",
      width: "100% !important" // Assuming this is the div that contains the text
    }
  },
}));
