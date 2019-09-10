import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
// sub components
import LandingHero from '../components/LandingHero';
import LandingImagesLoading from '../components/LandingImagesLoading';
import LandingImages from '../components/LandingImages';
import LandingNoAd from '../components/LandingNoAd';
import InProgress from '../components/InProgress';
// from my own hooks
import useFetchData from '../lib/hook/useDataFetch';

/**
 * @author hwasurr
 * @param {크리에이터 이름} Done creatorLanding - creatorInfo
 * @param {아바타 이미지} Done creatorInfo - creatorLogo
 * @param {개인 디스크립션} Done creatorLanding - creatorDesc
 * @param {개인 링크} Done creatorLanding - creatorDescLink
 * @param {뒷 배경} Done creatorLanding - creatorBackgroundImage
 * @param {테마} Done creatorLanding - creatorTheme
 * @param {진행한 광고 수} Done bannerMatched에서가져오기
 * @param {광고 클릭 전체 수 (해당 크리에이터의 모든 contraction의 클릭 수)} creatorLandingClick - LandingBannerClick 의 합
 * @param {배너 당 링크} BannerRegistered 의 배너링크(생성 요망) - 배너{ 링크가 없는 경우는?}
 * @param {각 배너당 (contractionId 당) 클릭 수} creatorLandingClick - LandingBannerClick
 * @param {각 배너 이미지} Done landingClick - contractionId 및 bannerRegistered
 * */

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('lg')]: {
      // background: 'linear-gradient(115deg, #FE6B8B 30%, rgb(29.4%, 0%, 51%) 90%)',
      backgroundImage: 'url(\'/images/landing_back_image.jpg\')',
      // backgroundSize: 'auto',
    },
  },
  container: {
    backgroundColor: '#fff',
    marginBottom: theme.spacing(20),
    margin: '0 auto 20px',
    padding: '40px 20px',
    minHeight: '75vh',
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
  const {
    match, isDesktopWidth, userData, searchText
  } = props;

  const userDescData = useFetchData('/api/description', { name: match.params.name });
  const bannerData = useFetchData('/api/banner', { name: match.params.name });
  const clickData = useFetchData('/api/clicks', { name: match.params.name });

  return (
    <Grid
      container
      justify="center"
      className={classes.root}
    >
      <Grid item xs={12} sm={12} md={12} lg={9} xl={6} className={classes.container}>
        {userDescData.loading && (<InProgress />)}
        {!userDescData.loading && userDescData.data && (
          <LandingHero
            user={userData.creatorName}
            userLogo={userData.creatorLogo}
            userDesc={userDescData.data.creatorDesc}
            userDescTitle={userDescData.data.creatorDescTitle}
            userDescLink={userDescData.data.creatorDescLlink}
            bannerCount={clickData.loading ? '-' : clickData.data.bannerCount}
            totalClickCount={clickData.loading ? '-' : clickData.data.totalClickCount}
            totalTransferCount={clickData.loading ? '-' : clickData.data.totalTransferCount}
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
