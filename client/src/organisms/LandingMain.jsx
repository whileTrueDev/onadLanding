import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
// sub components
import LandingHero from './Landing/LandingHero';
import LandingImagesLoading from './Landing/LandingImagesLoading';
import LandingImages from './Landing/LandingImages';
import LandingNoAd from './Landing/LandingNoAd';
import LandingHeroLoading from './Landing/LandingHeroLoading';
// from my own hooks
import useFetchData from '../utils/lib/hook/useDataFetch';
import usePostData from '../utils/lib/hook/usePostData';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('lg')]: {
      // background: 'linear-gradient(115deg, #FE6B8B 30%, rgb(29.4%, 0%, 51%) 90%)',
      backgroundImage: 'url(\'/images/background-whale.jpg\')',
      // backgroundSize: 'auto',
    },
  },
  container: {
    backgroundColor: theme.palette.background.paper,
    margin: '0 auto 0px',
    padding: '40px 20px',
    minHeight: '80vh',
    [theme.breakpoints.up('lg')]: {
      marginBottom: theme.spacing(20),
      marginTop: theme.spacing(20),
    },
    [theme.breakpoints.down('md')]: {
      minHeight: '100vh',
      marginTop: theme.spacing(5),
      padding: theme.spacing(1),
    },
  },
}));

const LandingMain = (props) => {
  const classes = useStyles();
  const {
    match, isDesktopWidth, userData, searchText
  } = props;

  // title 설정
  document.title = `${userData.creatorName} - 온애드`;

  const userDescData = useFetchData('/api/description', { name: match.params.name });
  const bannerData = useFetchData('/api/banner', { name: match.params.name });
  const clickData = useFetchData('/api/clicks', { name: match.params.name });
  const levelData = useFetchData('/api/level', { name: match.params.name });
  usePostData('/api/visit', { name: match.params.name });

  return (
    <Grid
      container
      justify="center"
      style={
        userData.creatorBackgroundImage && userData.creatorBackgroundImage !== '/pngs/landing/background-whale.jpg'
          ? {
            backgroundImage: `url(${userData.creatorBackgroundImage})`,
            backgroundSize: 'contain'
          }
          : { backgroundImage: 'url(\'/pngs/landing/background-whale.jpg\')' }
      }
    >
      <Grid item xs={12} sm={12} md={12} lg={9} xl={6} className={classes.container}>
        {userDescData.loading && (<LandingHeroLoading isDesktopWidth={isDesktopWidth} />)}
        {!userDescData.loading && userDescData.data && (
          <LandingHero
            userTheme={userData.userTheme}
            user={userData.creatorName}
            userLogo={userData.creatorLogo}
            userDesc={userDescData.data.creatorDesc}
            userDescTitle={userDescData.data.creatorDescTitle}
            userDescLink={userDescData.data.creatorDescLlink}
            bannerCount={clickData.loading ? '-' : clickData.data.bannerCount}
            totalClickCount={clickData.loading ? '-' : clickData.data.totalClickCount}
            totalTransferCount={clickData.loading ? '-' : clickData.data.totalTransferCount}
            levelData={levelData}
            isDesktopWidth={isDesktopWidth}
          />
        )}
        {bannerData.loading && (<LandingImagesLoading isDesktopWidth={isDesktopWidth} />)}
        {!bannerData.loading && !bannerData.data && (<LandingNoAd />)}
        {!bannerData.loading && bannerData.data && (
          <LandingImages
            isDesktopWidth={isDesktopWidth}
            bannerData={bannerData}
            searchText={searchText}
          />
        )}

      </Grid>
    </Grid>
  );
};

export default LandingMain;

LandingMain.propTypes = {
  match: PropTypes.object.isRequired,
  isDesktopWidth: PropTypes.bool.isRequired,
  userData: PropTypes.object,
  searchText: PropTypes.string
};

LandingMain.defaultProps = {
  userData: {
    creatorName: '',
    creatorLogo: '/images/logo/onad_logo_vertical_small.png'
  },
  searchText: null
};
