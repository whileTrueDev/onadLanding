import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(3),
    borderTop: '0.5px solid',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(3),
      fontSize: 10,
    },
  },
  logo: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    width: '30px',
  },
}));

export default function LandingHero(props) {
  const classes = useStyles();

  return (
    <Grid container justify="center" direction="column" alignItems="center" className={classes.root}>
      <a href="/">
        <img src="/pngs/logo/onad_logo_vertical.png" alt="" className={classes.logo} />
      </a>
      <Typography variant="body2">Powered by OnAD</Typography>
      <Typography variant="body2">OnAD Corp. All Right Reserved</Typography>
    </Grid>
  );
}
