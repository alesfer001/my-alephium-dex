import React from 'react';
import { makeStyles, Button, Typography, Container, Box } from "@material-ui/core";
import coinImage from '../../images/simplephium-logo.png'
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    backgroundColor: '#000', // Assuming a dark theme similar to the image
    // Add background styles as needed
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Ensure the content doesn't stretch too wide on larger screens
      /* maxWidth: 1200, */
    margin: '0 auto',
    padding: theme.spacing(6),
    paddingTop: 0
  },
  textSection: {
    maxWidth: '50%',
  },
  imageSection: {
    maxWidth: '50%',
    backgroundImage: `url(${coinImage})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: '700px', // Adjust based on the size of your image
    width: '700px'
  },
   headline: {
    fontWeight: 700,
    fontSize: '4rem',
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    fontSize: '1.5rem',
    marginBottom: theme.spacing(4),
  },
  enterButton: {
    // Add button styles as needed
  },
}));

const LandingPage = () => {
  const history = useHistory();

  const handleEnterAppClick = () => {
    history.push('/swap');
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.textSection}>
          <Typography variant="h1" component="h2" className={classes.headline}>
            Welcome to Shin: The Pioneering Blockchain Exchange
          </Typography>
          <Typography variant="subtitle1" className={classes.subtitle}>
            Discover the Future of Decentralized Finance with Shin
          </Typography>
          <Button variant="contained" className={classes.enterButton} onClick={handleEnterAppClick}>
            Enter App
          </Button>
        </div>
        <div className={classes.imageSection}>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
