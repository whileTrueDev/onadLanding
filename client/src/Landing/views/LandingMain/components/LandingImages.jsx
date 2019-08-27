import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
// material-ui
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
// icons
import ReDo from '@material-ui/icons/Redo';
import Flag from '@material-ui/icons/Flag';
// own handler
import useBannerClick from '../../../lib/hook/useBannerClick';
// own component
import LandingDialog from './LandingDialog';
// own functions
import setNumberFormat from '../../../lib/setNumberFormat';

const useStyles = makeStyles(theme => ({
  root: {
    borderTop: '0.5px solid',
    marginTop: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(2),
    },
  },
  imageSection: {
    marginTop: theme.spacing(5)
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(5)
    }
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

export default function ImageGridList(props) {
  const { isDesktopWidth, bannerData } = props;
  const classes = useStyles();
  const { value, handleTabChange } = useTabValue();
  const { clickedList, handleClick, handleTransferClick } = useBannerClick(bannerData.data);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  function handleDialogOpen(targetIndex) {
    setDialogOpen(targetIndex);
  }
  function handleDialogClose() {
    setDialogOpen(false);
  }

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
      <Grid container justify="flex-start" alignItems="center" spacing={isDesktopWidth ? 0 : 0} className={classes.imageSection}>
        {clickedList.map((banner, index) => (
          <Grid item xs={4} key={shortid.generate()}>
            <div className={classes.imageContainer}>
              <ButtonBase
                onClick={() => {
                  handleClick(index, banner.contractionId);
                  // 0 인덱스가 false가 되어 첫번째 이미지는 open 되지않기때문에 + 1
                  handleDialogOpen(index + 1);
                }}
                className={classes.imageButton}
              >
                <img src={banner.bannerSrc} alt="" className={classes.image} />
                <div className={classes.imageBackdrop} />
                <div className={classes.imageDesc}>
                  <Flag className={classes.iconOnImage} />
                  <Typography
                    variant="h5"
                    color="inherit"
                    style={{ fontWeight: 'bold' }}
                  >
                    {setNumberFormat(banner.clickCount)}
                  </Typography>
                  <ReDo className={classes.iconOnImage} />
                  <Typography
                    variant="h5"
                    color="inherit"
                    style={{ fontWeight: 'bold' }}
                  >
                    {setNumberFormat(banner.transferCount)}
                  </Typography>
                </div>
              </ButtonBase>
            </div>
          </Grid>
        ))}
      </Grid>

      {dialogOpen ? (
        <LandingDialog
          open={Boolean(dialogOpen)}
          handleClose={handleDialogClose}
          handleTransferClick={handleTransferClick}
          // 0 인덱스가 false가 되어 첫번째 이미지는 open 되지않기때문에 + 1 했기 때문에 - 1
          data={clickedList[dialogOpen - 1]}
          indexOfThisData={dialogOpen - 1}
        />
      ) : (
        null
      )}

    </Grid>
  );
}

ImageGridList.propTypes = {
  isDesktopWidth: PropTypes.bool.isRequired,
  bannerData: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

ImageGridList.defaultProps = {
  bannerData: [{
    clicked: false,
    clickSuccess: false,
    clickError: '',
    contractionId: '',
    clickCount: 0,
    bannerSrc: '',
  }]
};
