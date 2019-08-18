import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
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
import apiHOST from '../confing';

// data Fetch hooks
function useFetchData(url) {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // get data function
  const callUrl = useCallback(async () => {
    try {
      const res = await axios.get(url);
      if (res.data.length !== 0) {
        setPayload(res.data);
      } else {
        throw new Error('데이터가 존재하지 않습니다');
      }
    } catch {
      setError(`데이터가 없습니다.${url}`);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    callUrl();
  }, [callUrl]);

  return { payload, loading, error };
}

export default function Landing(props) {
  const { match } = props;
  const isDesktopWidth = useMediaQuery('(min-width:600px)');
  const userData = useFetchData(`${apiHOST}/api/user`,);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar />

      {!userData.loading && userData.error && (
      <Error />
      )}

      <LandingMain match={match} isDesktopWidth={isDesktopWidth} />

      <Footer />

    </ThemeProvider>
  );
}
