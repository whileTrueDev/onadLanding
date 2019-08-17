import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import theme from './theme';
// components
import LandingMain from './views/LandingMain/LandingMain';
import AppBar from './views/AppBar/AppBar';

export default function Landing(props) {
  const { match } = props;
  const isDesktopWidth = useMediaQuery('(min-width:600px)');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar />

      <LandingMain match={match} isDesktopWidth={isDesktopWidth} />

    </ThemeProvider>
  );
}
