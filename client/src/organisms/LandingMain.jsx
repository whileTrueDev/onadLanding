import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
// import AdSense from 'react-adsense';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  isBrowser, isTablet, isSmartTV, isMobile,
  osName, osVersion, mobileModel, mobileVendor
} from 'mobile-device-detect';
import Grid from '@material-ui/core/Grid';
// sub components
// import { Hidden } from '@material-ui/core';
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
  belt: {
    // marginTop: theme.spacing(5),
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: 'auto',
    alignItems: 'center',
    flexDirection: 'column',
    color: 'white',
    fontColor: '#fff'
  }
}));

const LandingMain = (props) => {
  const classes = useStyles();
  const {
    match, isDesktopWidth, userData, searchText
  } = props;

  // title 설정
  document.title = `${userData.creatorName} - 온애드`;

  const getScreen = () => {
    if (isTablet || isMobile) {
      return '1';
    }
    if (isBrowser) {
      return '3';
    }
    if (isSmartTV) {
      return '4';
    }
    return '5';
  };

  const getOsIndex = () => (osName === 'iOS' ? '2' : '3');

  const userDescData = useFetchData('/api/description', { name: match.params.name });
  const bannerData = useFetchData('/api/banner', { name: match.params.name });
  const clickData = useFetchData('/api/clicks', { name: match.params.name });
  const levelData = useFetchData('/api/level', { name: match.params.name });

  // const mezzoData = usePostData('/api/manplus', { name: match.params.name,
  //   dscreen : getScreen(),
  //   dosindex: getOsIndex(),
  //   dosv: osVersion,
  //   dmaker: mobileVendor,
  //   dmodel: mobileModel,
  //   dos: osName
  // });

  const params = {
    e_version: '2',
    a_publisher: '1543',
    a_media: '32014',
    a_section: '804388',
    i_response_format: 'json',
    i_rich_flag: '1',
    d_used_type: 'api',
    d_screen: getScreen(),
    d_os_index: getOsIndex(),
    d_osv: osVersion,
    d_maker: mobileVendor,
    d_model: mobileModel,
    d_os: osName
  };

  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (getScreen() === '1' && match.params.name === 'iamsupermazinga') {
      axios.get('https://mtag.mman.kr/get_ad.mezzo/', { params })
        .then((row) => {
          if (row.data === null) {
            setErrorState(true);
            setLoading(false);
            setData({});
            return;
          }
          const { adsinfo } = row.data;
          const { error_code, use_ssp } = adsinfo;
          if (error_code === '0' && use_ssp === '1') {
            console.log('하우스 이므로 SSP 요청합니다.');
            axios.get('https://ssp.meba.kr/ssp.mezzo/', { params: { ...params, i_banner_w: '320', i_banner_h: '50' } })
              .then((inrow) => {
                const ssp_error_code = inrow.data.error_code;
                // 반드시 error_code 존재, 광고가 없음 => 하우스 광고 진행
                // 광고성공, SSP요청을 진행하였으나 광고가없으므로 하우스로진행
                if (ssp_error_code === '5') {
                  console.log('SSP광고가 없으므로 하우스광고를 진행합니다.');
                  const {
                    impression_api, click_api, click_tracking_api, img_path, logo_img_path, logo_landing_url
                  } = adsinfo.ad[0];
                  axios.get(impression_api)
                    .then(() => {
                      console.log('노출 API를 통해 체크를 진행합니다.');
                      setLoading(false);
                      setErrorState(false);
                      setData({
                        img_path, impression_api, click_api, click_tracking_api, logo_img_path, logo_landing_url
                      });
                    })
                    .catch(() => {
                      setLoading(false);
                      setErrorState(false);
                      setData({
                        img_path, impression_api, click_api, click_tracking_api, logo_img_path, logo_landing_url
                      });
                    });
                } else if (ssp_error_code === '0') {
                  const {
                    img_path, landing_url, ssp_imp, ssp_click
                  } = row.result[0];

                  // 노출 API가 null일경우 회피하기위한 에러핸들링
                  if (ssp_imp === null || ssp_imp === 'null' || ssp_imp === '') {
                    axios.get(ssp_imp)
                      .then(() => {
                        console.log('노출 API를 통해 체크를 진행합니다.');
                        setLoading(false);
                        setErrorState(false);
                        setData({
                          img_path, impression_api: ssp_imp, click_api: landing_url, click_tracking_api: ssp_click
                        });
                      })
                      .catch(() => {
                        setLoading(false);
                        setErrorState(false);
                        setData({
                          img_path, impression_api: ssp_imp, click_api: landing_url, click_tracking_api: ssp_click
                        });
                      });
                  } else {
                    setLoading(false);
                    setErrorState(false);
                    setData({
                      img_path, impression_api: ssp_imp, click_api: landing_url, click_tracking_api: ssp_click
                    });
                  }
                } else {
                  setLoading(false);
                  setErrorState(true);
                  setData({});
                }
              });
          } else if (error_code !== '0') {
            // 광고 성공이 아닐때,
            setLoading(true);
            setErrorState(true);
            setData({});
          } else {
            const {
              impression_api, click_api, click_tracking_api, img_path, logo_img_path
            } = adsinfo.ad[0];
            axios.get(impression_api)
              .then(() => {
                console.log('노출 API를 통해 체크를 진행합니다.');
                setLoading(true);
                setErrorState(false);
                setData({
                  img_path, impression_api, click_api, click_tracking_api, logo_img_path
                });
              })
              .catch(() => {
                setLoading(false);
                setErrorState(false);
                setData({
                  img_path, impression_api, click_api, click_tracking_api, logo_img_path
                });
              });
          }
        });
    }
  }, [match.params.name, params]);


  usePostData('/api/visit', { name: match.params.name });

  // useEffect(() => {
  //   (window.adsbygoogle = window.adsbygoogle || []).push({});
  // }, []);

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
      {/* <Hidden mdDown>
        <Grid item xl={3} lg={2}>
          {match.params.name === 'iamsupermazinga' && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              minWidth: 160,
              maxWidth: 320,
              height: '100%',
              alignItems: 'center',
              flexDirection: 'column'
            }}
            >
              <ins
                className="adsbygoogle"
                style={{ display: 'inline-block', width: '160px', height: '600px' }}
                data-ad-client="ca-pub-4320356355619389"
                data-ad-slot="6393653150"
              />
            </div>
          )}
        </Grid>

      </Hidden> */}
      <Grid item xs={12} sm={12} md={12} lg={8} xl={6} className={classes.container}>
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
            // mezzoData={mezzoData}
            mezzoData={{ data, loading, errorState }}
            name={match.params.name}
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
      {/* manplus 하단 띠광고 테스트 */}
      {/* <Hidden smUp>
        <Grid item sm={4} xs={12}>
          <Grid item>
            {!mezzoData.loading && !mezzoData.errorState && mezzoData.data && (
               <img
               className={classes.belt}
               src={mezzoData.data.img_path}
               >
              </img>
            )
            }
          </Grid>
        </Grid>
      </Hidden> */}

      {/* <Hidden mdDown>
        <Grid item xl={3} lg={2}>
          {match.params.name === 'iamsupermazinga' && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            minWidth: 160,
            maxWidth: 320,
            height: '100%',
            alignItems: 'center',
            flexDirection: 'column'
          }}
          >
            <h1>구글애드센스 테스트</h1>
            <AdSense.Google
              client="ca-pub-4320356355619389"
              slot="6393653150"
              style={{ display: 'block' }}
              format="auto"
              responsive="true"

            />
          </div>
          )}
        </Grid>
      </Hidden> */}
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
