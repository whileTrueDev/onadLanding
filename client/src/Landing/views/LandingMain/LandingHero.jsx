import React from 'react';
import PropTypes from 'prop-types';
// material-ui
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
// icons
// import FavoriteIcon from '@material-ui/icons/Favorite';


const text = `🌙지으신 그대로 주님께_(selah_🌙
  •축가&스케줄 문의 메일👉🏻 lkh@aknobinc.com
  •Facebook👉🏻안지연
  •유튜브 구독👉🏻안지연 An Ji Yeon
  `;

const defaultText = '안지연 님의 광고 배너 랜딩 페이지입니다.';

const linkUrl = 'https://youtube.com/channel/UCUi9Axrsx21RvTEhUZCAIsA';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(10),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(8),
      fontSize: 10,
    },
  },
  bigAvatar: {
    boxShadow: '0 2px 10px 1px rgba(102, 102, 102, 0.5)',
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
      opacity: 0.75,
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
  const { data, isDesktopWidth } = props;
  const classes = useStyles();


  return (
    <Grid container className={classes.root}>
      {/* Avatar logo */}
      <Grid item sm={4} xs={12}>
        <Grid container justify="center">
          <Avatar alt="avatar" src="/pngs/logo/whileTrue_final.png" className={classes.bigAvatar} />
        </Grid>
      </Grid>

      {/* My description section */}
      <Grid item sm={6} xs={12}>
        <Typography variant="h4" gutterBottom className={classes.title}>{`${data}`}</Typography>
        <Grid container justify="flex-start" spacing={isDesktopWidth ? 2 : 1}>
          <Grid item>
            <Typography variant="h6" gutterBottom>
              {'진행한 광고 '}
              <span className={classes.bold}>14</span>
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="h6" gutterBottom>
              {'광고 클릭수 '}
              <span className={classes.bold}>276</span>
            </Typography>
          </Grid>
        </Grid>

        <br />
        <Typography variant="h6" className={classes.bold}>안 지연</Typography>

        {text.split('\n').map(row => (
          <Typography variant="body1" key={row}>{row}</Typography>
        ))}
        <a href={linkUrl} onClick={(e) => { e.preventDefault(); }}>
          <Typography variant="body1">
            {linkUrl}
          </Typography>
        </a>
      </Grid>
    </Grid>
  );
}

LandingHero.propTypes = {
  data: PropTypes.string,
};

LandingHero.defaultProps = {
  data: '',
};
