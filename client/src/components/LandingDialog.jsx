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
// own function
import setDateFormat from '../lib/setDateFormat';
import setNumberFormat from '../lib/setNumberFormat';

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
    padding: 15,
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
  const {
    open, handleClose, data, handleTransferClick, indexOfThisData
  } = props;
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
    >
      <DialogContent className={classes.content}>
        <ButtonBase
          className={classes.imageWrapper}
          onClick={() => { handleTransferClick(indexOfThisData); }}
        >
          <img src={data.bannerSrc} alt="banner" className={classes.image} />
        </ButtonBase>
        <div className={classes.description}>

          {data.companyDescription ? (
            <DialogContentText>
              {`- ${data.companyDescription}`}
            </DialogContentText>
          ) : (
            <div style={{ height: 20 }} />
          )}

          {data.bannerDescription ? (
            <DialogContentText>
              {`- ${data.bannerDescription}`}
            </DialogContentText>
          ) : (
            <div style={{ height: 20 }} />
          )}


          <DialogContentText className={classes.descriptionIcons}>
            <Flag className={classes.flagicon} />
            {`${setNumberFormat(data.clickCount)} 조회 `}
            <ReDo className={classes.redirecticon} />
            {`${setNumberFormat(data.transferCount)} 이동 `}
          </DialogContentText>

          <DialogContentText variant="body2">
            {`${setDateFormat(data.contractionDate)}`}
          </DialogContentText>
        </div>

        <div className={classes.actions}>

          <DialogActions>
            <Button
              onClick={() => { handleTransferClick(indexOfThisData); }}
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
  data: PropTypes.object.isRequired,
  handleTransferClick: PropTypes.func.isRequired,
  indexOfThisData: PropTypes.number.isRequired
};
