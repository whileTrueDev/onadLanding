import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Flag from '@material-ui/icons/Flag';

const useStyles = makeStyles(theme => ({
  root: {
    borderTop: '0.5px solid',
    marginTop: theme.spacing(10),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(2),
    },
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  imageButton: {
    cursor: 'pointer',
    marginTop: 27,
    marginLeft: 15,
    marginRight: 15,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      marginRight: 0,
    },
    '&:hover $imageDesc': {
      display: 'flex',
      zIndex: 1,
    },
    '&:hover $imageBackdrop': {
      display: 'block',
    },
  },
  imageDesc: {
    opacity: 1,
    display: 'none',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  },
  imageBackdrop: {
    opacity: 0.3,
    display: 'none',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
  },
  image: {
    maxHeight: 293,
    width: 293,
    [theme.breakpoints.down('sm')]: {
      width: 'calc( 100% - 5px )',
    },
    [theme.breakpoints.down('xs')]: {
      width: 'calc( 100% - 5px )',
    },
  },
  iconOnImage: {
    width: 60,
    fontSize: 30,
    fontWeight: 'bold'
  }
}));

const useTabValue = () => {
  const [value, setValue] = React.useState(0);

  function handleTabChange(e, newValue) {
    setValue(newValue);
  }

  return { value, handleTabChange };
};

const images = [
  { src: '/images/chanu01.jpeg', clickNum: 36 },
  { src: '/images/chanu01.jpeg', clickNum: 123 },
  { src: '/images/chanu01.jpeg', clickNum: 234 },
  { src: '/images/chanu01.jpeg', clickNum: 345 },
  { src: '/images/chanu01.jpeg', clickNum: 456 },
  { src: '/images/chanu01.jpeg', clickNum: 567 },
  { src: '/images/chanu01.jpeg', clickNum: 678 },
  { src: '/images/chanu01.jpeg', clickNum: 789 },
  { src: '/images/chanu01.jpeg', clickNum: 890 },
  { src: '/images/chanu01.jpeg', clickNum: 901 },
  { src: '/images/chanu01.jpeg', clickNum: 1231 },
  { src: '/images/chanu01.jpeg', clickNum: 1234 },
  { src: '/images/chanu01.jpeg', clickNum: 2345 },
];

export default function ImageGridList(props) {
  const { isDesktopWidth } = props;
  const classes = useStyles();
  const { value, handleTabChange } = useTabValue();
  const handleClick = (banner) => {
    console.log(`${banner}clicked!`);
  };

  return (
    <Grid container className={classes.root}>
      {/* Tabs */}
      <Grid item xs={12}>
        <Tabs
          centered
          value={value}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          aria-label="icon tabs example"
        >
          <Tab aria-label="favorite" label="배너목록" />
          {/* <Tab aria-label="plus" label="plus++" disabled /> */}
        </Tabs>
      </Grid>

      {/* Image section */}
      <Grid container justify="flex-start" alignItems="center" spacing={isDesktopWidth ? 0 : 0} className={classes.imageContainer}>
        {images.map(image => (
          <Grid item xs={4} key={shortid.generate()}>
            <div className={classes.imageContainer}>
              <ButtonBase onClick={handleClick} className={classes.imageButton}>
                <img src={image.src} alt="" className={classes.image} />
                <div className={classes.imageBackdrop} />
                <div className={classes.imageDesc}>
                  <Flag className={classes.iconOnImage} />
                  <Typography
                    variant="h5"
                    color="inherit"
                    style={{ fontWeight: 'bold' }}
                  >
                    {image.clickNum}
                  </Typography>
                </div>
              </ButtonBase>
            </div>
          </Grid>
        ))}
      </Grid>

    </Grid>
  );
}

ImageGridList.propTypes = {
  isDesktopWidth: PropTypes.bool.isRequired
};
