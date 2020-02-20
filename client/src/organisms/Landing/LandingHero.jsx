import React from 'react';
import PropTypes from 'prop-types';
import shortId from 'shortid';
// material-ui
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';

import Typography from '@material-ui/core/Typography';
// own function
import setNumberFormat from '../../utils/lib/setNumberFormat';
// own component
import LevelBar from '../../atoms/LevelBar/LevelBar';
import Tooltip from '../../atoms/Tooltip/Tooltip';
import apiHOST from '../../config/host';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(10),
    [theme.breakpoints.down('sm')]: {
      // marginTop: theme.spacing(8),
      marginTop: theme.spacing(5),
      fontSize: 10,
    },
  },
  bigAvatar: {
    cursor: 'pointer',
    backgroundColor: theme.palette.background.default,
    boxShadow: `0 2px 10px 1px ${theme.palette.grey}`,
    margin: 25,
    width: 200,
    height: 200,
    [theme.breakpoints.down('sm')]: {
      width: 150,
      height: 150,
    },
    [theme.breakpoints.down('xs')]: {
      width: 100,
      height: 100,
    },
    '&:hover': {
      opacity: 0.85,
    },
  },
  title: {
    textTransform: 'none',
  },
  bold: {
    fontWeight: 'bold',
  },
  belt:{
    display: 'flex',
    justifyContent: 'center',
    margin: 0,
    padding: 0,
    width : '100%',
    height: 'auto',
    alignItems: 'center',
    flexDirection: 'column',
  }
}));

export default function LandingHero(props) {
  const {
    user, userLogo, userDesc, levelData,
    isDesktopWidth, bannerCount, totalClickCount, totalTransferCount, mezzoData, name
  } = props;
  const classes = useStyles();

  // const handleClick = () =>{ 
  //   // axios.post(`${apiHOST}/api/manplus/click`, { 
  //   //   click_api : mezzoData.data.click_api,
  //   //   click_tracking_api: mezzoData.data.click_tracking_api 
  //   // })
  //   console.log('클릭')
  // }

  return (
    <Grid container className={classes.root}>
      {name === 'iamsupermazinga' && (
      <Hidden smUp>
        <Grid item sm={4} xs={12}>
          <Grid item>
            {!mezzoData.loading && !mezzoData.errorState && ( 
              // <ButtonBase
              //   onClick={handleClick}
              //   className={classes.belt}
              // >
              //  <img 
              // //  className={classes.belt}
              // width="100%"
              // height='auto'
              //  src={mezzoData.data.img_path}
              //  >
              // </img>
              // </ButtonBase>
              <a href={mezzoData.data.click_api} >
                <img 
                className={classes.belt}
                width="100%"
                height='auto'
                src={mezzoData.data.img_path}
                // onClick={handleClick}
                >
                </img>
              </a>
            )
            }
          </Grid>
        </Grid>
      </Hidden>
      )}
      {/* Avatar logo */}
      <Grid item sm={4} xs={12}>
        <Grid container justify="center">
          <Avatar
            src={userLogo}
            alt=""
            className={classes.bigAvatar}
            onClick={() => {
              window.open(`https://www.twitch.tv${window.location.pathname}`);
            }}
          />
        </Grid>
      </Grid>

      {/* My description section */}
      <Grid item sm={6} xs={12}>
        {isDesktopWidth ? (
          <Typography variant="h4" gutterBottom className={classes.title}>{`${user}`}</Typography>
        ) : (
          <Grid container>
            <Grid item xs={9}>
              <Typography variant="h4" gutterBottom className={classes.title}>{`${user}`}</Typography>
            </Grid>

            {!levelData.loading && !levelData.errorState && levelData.data && (
            <Grid item xs={3}>
              <LevelBar
                level={levelData.data.level}
                exp={Math.ceil(levelData.data.exp / 5)}
              />
            </Grid>
            )}
          </Grid>
        )}
        <Grid container justify="flex-start" spacing={isDesktopWidth ? 2 : 1}>
          <Grid item>
            <Typography variant="h6" gutterBottom>
              {'진행 광고 '}
              { bannerCount === null ? (
                <span className={classes.bold}>0</span>
              ) : (
                <span className={classes.bold}>{setNumberFormat(bannerCount)}</span>
              )}
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="h6" gutterBottom>
              {'광고 조회 '}
              { totalClickCount === null ? (
                <span className={classes.bold}>0</span>
              ) : (
                <span className={classes.bold}>{setNumberFormat(totalClickCount)}</span>
              )}
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="h6" gutterBottom>
              {'광고 이동 '}
              { totalTransferCount === null ? (
                <span className={classes.bold}>0</span>
              ) : (
                <span className={classes.bold}>{setNumberFormat(totalTransferCount)}</span>
              )}
            </Typography>
          </Grid>
        </Grid>

        <br />
        {userDesc && userDesc.split('\n').map(row => (
          <Typography variant="body1" key={shortId.generate()}>{row}</Typography>
        ))}
      </Grid>

      {/* loyalty level visualization */}
      {isDesktopWidth && !levelData.loading && !levelData.errorState && levelData.data ? (
        <Grid item sm={1} xs={3}>
          <Tooltip textArray={[`${user}님의 광고 레벨입니다.`, '광고페이지에서의 상호작용에 따라', ' 레벨이 변화합니다.']}>
            <div>
              <LevelBar
                level={levelData.data.level}
                exp={Math.ceil(levelData.data.exp / 5)}
              />
            </div>
          </Tooltip>
        </Grid>
      ) : (
        null
      )}

    </Grid>
  );
}

LandingHero.propTypes = {
  user: PropTypes.string,
  userLogo: PropTypes.string.isRequired,
  isDesktopWidth: PropTypes.bool.isRequired,
  userDesc: PropTypes.string,
  bannerCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  totalClickCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  totalTransferCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  levelData: PropTypes.object
};

LandingHero.defaultProps = {
  user: '',
  userDesc: '',
  bannerCount: 0,
  totalClickCount: 0,
  totalTransferCount: 0,
  levelData: { exp: 0, level: 1 }
};
