import React from 'react';
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
  const params = { name: 'iamsupermazinga' };
  const userData = useFetchData('/api/user', { ...params });
  console.log(userData);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar />

      {!userData.loading && userData.errorState && (
      <Error />
      )}
      {!userData.loading && userData.data && (
      <LandingMain match={match} isDesktopWidth={isDesktopWidth} />
      )}

      <Footer />

    </ThemeProvider>
  );
}
