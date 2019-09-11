import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
// components
import LandingMain from '../../system/LandingMain';
import AppBar from '../../system/AppBar/AppBar';
import Footer from '../../system/Footer/LandingFooter';
import Error from '../../system/Error/LandingError';
import InProgress from '../../components/InProgress';
// theme
import theme from './theme';
// config
import useFetchData from '../../lib/hook/useDataFetch';
import useSearch from '../../lib/hook/useSearch';

export default function Landing(props) {
  const { match } = props;
  const isDesktopWidth = useMediaQuery('(min-width:600px)');
  const userData = useFetchData('/api/user', { name: match.params.name });
  const { searchText, handleSearchChange } = useSearch();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar handleSearchChange={handleSearchChange} />

      {userData.loading && (
        <InProgress large />
      )}

      {!userData.loading && userData.errorState && (
        <Error />
      )}

      {!userData.loading && userData.data && (
        <LandingMain
          match={match}
          isDesktopWidth={isDesktopWidth}
          userData={userData.data}
          searchText={searchText}
        />
      )}

      <Footer />

    </ThemeProvider>
  );
}

Landing.propTypes = {
  match: PropTypes.object.isRequired,
};
