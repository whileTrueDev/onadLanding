import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    borderTop: '0.5px solid'
  },
  h2: {
    marginTop: theme.spacing(8)
  }
}));

export default function LandingNoAd() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <h2 className={classes.h2}>이 크리에이터는 아직 광고를 진행하지 않았어요!</h2>
    </div>
  );
}
