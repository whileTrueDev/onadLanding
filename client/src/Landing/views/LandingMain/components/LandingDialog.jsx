import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Flag from '@material-ui/icons/Flag';
import ReDo from '@material-ui/icons/Redo';

const useStyles = makeStyles(theme => ({
  content: {
    padding: 0,
  },
  imageWrapper: {
    marginBottom: theme.spacing(2),
  },
  image: {
    maxWidth: theme.breakpoints.width('sm'),
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%'
    },
    '&:hover': {
      opacity: 0.8
    }
  },
  description: {
    maxWidth: theme.breakpoints.width('sm'),
    padding: 15
  },
  descriptionIcons: {
    fontWeight: 'bold'
  },
  flagicon: {
    color: theme.palette.primary.light
  },
  redirecticon: {
    color: theme.palette.warning.main
  },
  button: {
    color: theme.palette.common.white
  }
}));

export default function LandingDialog(props) {
  const { open, handleClose, data } = props;
  const classes = useStyles();

  function handleImageButtonClick() {
    console.log('image클릭!');
  }

  console.log('LandingDialog, ', data);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
    >
      <DialogContent className={classes.content}>
        <ButtonBase className={classes.imageWrapper} onClick={handleImageButtonClick}>
          <img src={data.bannerSrc} alt="banner" className={classes.image} />
        </ButtonBase>
        <div className={classes.description}>
          <DialogContentText>
            이 게시물 ( 배너에 대한 소개 ) 이벤트 정보 등등~~
            이 게시물 ( 배너에 대한 소개 ) 이벤트 정보 등등~~
            이 게시물 ( 배너에 대한 소개 ) 이벤트 정보 등등~~
            이 게시물 ( 배너에 대한 소개 ) 이벤트 정보 등등~~
          </DialogContentText>

          <DialogContentText className={classes.descriptionIcons}>
            <Flag className={classes.flagicon} />
            {`${data.clickCount} 조회 `}
            <ReDo className={classes.redirecticon} />
            {`${data.transferCount} 이동 `}
          </DialogContentText>
        </div>

        <div className={classes.actions}>

          <DialogActions>
            <Button
              onClick={handleClose}
              color="primary"
              variant="contained"
              className={classes.button}
            >
                이동
            </Button>
            <Button
              onClick={handleClose}
              color="default"
              variant="contained"
              className={classes.button}
            >
                취소
            </Button>
          </DialogActions>
        </div>
      </DialogContent>

    </Dialog>
  );
}

LandingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};
