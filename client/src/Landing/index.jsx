import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
// components
import LandingMain from './views/LandingMain/LandingMain';
import AppBar from './views/AppBar/AppBar';
import Footer from './views/Footer/LandingFooter';
import Error from './views/Error/LandingError';
// theme
import theme from './theme';
// config
import useFetchData from './lib/useDataFetch';

export default function Landing(props) {
  const { match } = props;
  const isDesktopWidth = useMediaQuery('(min-width:600px)');
  const userData = useFetchData('/api/user', { name: match.params.name });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar />

      {userData.Loading && (
        <span>loading...</span>
      )}

      {!userData.loading && userData.errorState && (
      <Error />
      )}

      {!userData.loading && userData.data && (
      <LandingMain
        match={match}
        isDesktopWidth={isDesktopWidth}
        user={userData.data.creatorName}
      />
      )}

      <Footer />

    </ThemeProvider>
  );
}

Landing.propTypes = {
  match: PropTypes.object.isRequired,
};
