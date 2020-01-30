import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
// components
import LandingMain from '../../organisms/LandingMain';
import AppBar from '../../organisms/AppBar/AppBar';
import Footer from '../../organisms/Footer/LandingFooter';
import Error from '../../organisms/Error/LandingError';
import CircularProgress from '../../atoms/CircularProgress/CircularProgress';
// theme
import { lightTheme, darkTheme } from './theme';
// config
import useFetchData from '../../utils/lib/hook/useDataFetch';
import useSearch from '../../utils/lib/hook/useSearch';

export default function Landing(props) {
  const { match } = props;
  const isDesktopWidth = useMediaQuery('(min-width:600px)');
  const userData = useFetchData('/api/user', { name: match.params.name });
  const { searchText, handleSearchChange } = useSearch();

  const [isDarkTheme, setDarkTheme] = React.useState('light');
  React.useEffect(() => {
    if (!userData.loading && userData.data) {
      setDarkTheme(userData.data.creatorTheme);
    }
  }, [userData.loading, userData.data]);

  return (
    <ThemeProvider theme={isDarkTheme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />


      <AppBar isDarkTheme={isDarkTheme} handleSearchChange={handleSearchChange} />

      {userData.loading && (
        <div style={{
          display: 'flex',
          minHeight: '80vh',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
        >
          <CircularProgress size={150} disableShrink />
          <h4>Loading... please wait a seconds..</h4>
        </div>
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
