import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import makeStyles from '@material-ui/core/styles/makeStyles';


const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '80vh',
  },
}));
const LandingMainError = (props) => {
  const classes = useStyles();
  const { match } = props;
  return (
    <Grid
      container
      justify="center"
      direction="column"
      alignItems="center"
      className={classes.root}
    >

      <Grid
        item
      >
        <Grid
          container
          justify="center"
          direction="column"
          alignItems="center"
        >
          <a href="https://onad.io">
            <img
              src="/images/logo/onad_logo_vertical.png"
              alt=""
              height="150"
            />
          </a>
        </Grid>
      </Grid>
      <div style={{ fontSize: '25px' }}>
        <p>해당 링크는 더 이상 광고 페이지로 이동되지 않습니다.</p>
        <p>
          트위치 패널의 링크 주소를
          {' '}

          <span style={{ color: 'blue' }}>
              https://t.onad.io/
            {match.params.name}
          </span>
          {' '}
          로 변경해주세요.
        </p>
        <p>
            자세한 사항은 온애드 홈페이지 공지사항을 확인해주시기 바랍니다.
        </p>
        <p>
          로고를 클릭하면 온애드 홈페이지로 이동하실 수 있습니다.
        </p>
      </div>
    </Grid>
  );
};

export default LandingMainError;
