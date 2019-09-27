import React from 'react';
import PropTypes from 'prop-types';
// material-ui
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
// own function
import setNumberFormat from '../lib/setNumberFormat';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(10),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(8),
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
}));

export default function LandingHero(props) {
  const {
    user, userLogo, userDesc,
    isDesktopWidth, bannerCount, totalClickCount, totalTransferCount
  } = props;
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      {/* Avatar logo */}
      <Grid item sm={4} xs={12}>
        <Grid container justify="center">
          <Avatar
            alt="avatar"
            src={userLogo}
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

            <Grid item xs={3}>
              <Typography variant="h6">Lv. 04</Typography>
              <LinearProgress
                value={30}
                valueBuffer={100}
                variant="buffer"
              />
            </Grid>
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
                <span className={classes.bold}>110만</span>
              ) : (
                <span className={classes.bold}>{setNumberFormat(totalClickCount)}</span>
              )}
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="h6" gutterBottom>
              {'광고 이동 '}
              { totalTransferCount === null ? (
                <span className={classes.bold}>110만</span>
              ) : (
                <span className={classes.bold}>{setNumberFormat(totalTransferCount)}</span>
              )}
            </Typography>
          </Grid>
        </Grid>

        <br />
        {userDesc && userDesc.split('\\n').map(row => (
          <Typography variant="body1" key={row}>{row}</Typography>
        ))}

      </Grid>

      {/* loyalty level visualization */}
      {isDesktopWidth ? (
        <Grid item sm={1} xs={3}>
          <Typography variant="h6">Lv. 04</Typography>
          <LinearProgress
            value={30} // 경험치 100 분위수
            valueBuffer={100} // 최대 경험치
            variant="buffer"
          />
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
  totalTransferCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

LandingHero.defaultProps = {
  user: '',
  userDesc: '',
  bannerCount: 0,
  totalClickCount: 0,
  totalTransferCount: 0
};
