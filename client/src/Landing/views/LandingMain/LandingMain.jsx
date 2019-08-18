import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
// sub components
import LandingHero from './components/LandingHero';
import LandingImages from './components/LandingImages';
// import LandingError from './LandingError';
// config files

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('lg')]: {
      // background: 'linear-gradient(115deg, rgb(29.4%, 0%, 51%) 30%, #FE6B8B 90%)',
      backgroundImage: 'url(\'/images/landing_back_image.jpg\')',
      // backgroundSize: 'auto',
    },
  },
  container: {
    backgroundColor: '#fff',
    margin: '0 auto 30px',
    padding: 20,
    [theme.breakpoints.up('lg')]: {
      marginTop: 200,
    },
    [theme.breakpoints.down('xs')]: {
      padding: 8,
    },
  },
}));


const LandingMain = (props) => {
  const classes = useStyles();
  const { match, isDesktopWidth } = props;

  return (
    <Grid
      container
      justify="center"
      className={classes.root}
    >
      <Grid item xs={12} sm={12} md={12} lg={9} xl={6} className={classes.container}>
        <div>
          <LandingHero data="onad" isDesktopWidth={isDesktopWidth} />
          <LandingImages isDesktopWidth={isDesktopWidth} />
        </div>


      </Grid>
    </Grid>
  );
};

export default LandingMain;

LandingMain.propTypes = {
  match: PropTypes.object.isRequired,
  isDesktopWidth: PropTypes.bool.isRequired,
};
