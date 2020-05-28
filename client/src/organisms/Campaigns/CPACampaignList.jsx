import React, { useState } from 'react';
import shortid from 'shortid';
import {
  Typography, Divider, Collapse
} from '@material-ui/core';
import useTheme from '@material-ui/core/styles/useTheme';
import TransparentButton from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownOutlined';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

// atoms
import GridContainer from '../../atoms/Grid/GridContainer';
import GridItem from '../../atoms/Grid/GridItem';
import Card from '../../atoms/Card/Card';
import Button from '../../atoms/CustomButtons/Button';

// types
// hooks

const  AdpickCampaignTypeEnum = {
  INSTALL : '1', 
  SIGNUP : '3', 
  EVENT : '4',
  RESERVATION : '16'
} 


export default function CPACampaigns({ campaigns, isDesktopWidth }) {
  const theme = useTheme();

  // 상세보기 open state
  const [openIndex, setOpenIdx] = useState(null);
  function handleOpen(num) {
    if (num === openIndex) {
      setOpenIdx(null);
    } else {
      setOpenIdx(num);
    }
  }

  // Rendering Campaign types
  function renderType(typeNum) {
    switch (typeNum) {
      case AdpickCampaignTypeEnum.INSTALL: return '앱설치';
      case AdpickCampaignTypeEnum.SIGNUP: return '회원가입';
      case AdpickCampaignTypeEnum.EVENT: return '이벤트';
      case AdpickCampaignTypeEnum.RESERVATION: return '사전예약';
      default: return typeNum;
    }
  }
  return (
    <GridContainer justify={isDesktopWidth ? "flex-start" : "center"} >
      {campaigns
        .filter((cam) => !(cam.apType === AdpickCampaignTypeEnum.INSTALL))
        .map((item, idx) => (
          <GridItem key={item.apOffer} xs={10} md={4} lg={3} xl={3}>
            <Card style={{backgroundColor : theme.palette.card}}>
              {/* <div style={{
                position: 'absolute',
                left: 0,
                padding: 8,
                backgroundColor: theme.palette.success.xLight,
                borderRadius: '0px 0px 5px 0px'
              }}
              >
                <Typography variant="body2" style={{ color: 'black' }}>
                  진행중
                </Typography>
              </div> */}
              <div style={{
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              >
                <img src={ item && item.apImages && item.apImages.icon} alt="" height="140" width="140" style={{ borderRadius: 10 }} />

                <Typography style={{
                  fontWeight: 800,
                  display: 'block',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  lineHeight: 2
                }}
                >
                  {item.apAppTitle}
                </Typography>
                {/* 캠페인 타입 */}
              </div>

              <div style={{ paddingLeft: 16, display: 'flex', alignItems: 'center' }}>
                <TransparentButton size="small" onClick={() => { handleOpen(idx); }}>
                  {openIndex === idx ? (<ArrowDropDownIcon />) : (<ArrowRightIcon />)}
                  <Typography variant="caption">
                    광고 설명 보기
                    {!(item.apHeadline || item.apKPI || item.apAppPromoText) && ' 없음'}
                  </Typography>
                </TransparentButton>
              </div>

              {(item.apHeadline || item.apKPI || item.apAppPromoText) && (
                <Collapse in={openIndex === idx}>
                  <div style={{ padding: 16 }}>
                    {item.apHeadline && (
                      <>
                        {item.apHeadline.split('\n').map((v) => (
                          <Typography variant="body2" key={shortid.generate()}>
                            {v}
                          </Typography>
                        ))}
                      </>
                    )}
                  </div>
                </Collapse>
              )}
              <Divider />
              <div style={{
                padding: '0px 16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              >
                <Button
                  color="primary"
                  onClick={() => {
                    // 우리 클릭 트래킹 추가.
                    window.location.href = item.apTrackingLink;
                  }}
                  style={{
                    backgroundColor : theme.palette.success.success,
                    color: 'white'
                  }}
                >
                  {renderType(item.apType)} 하러가기
                </Button>
              </div>
            </Card>
          </GridItem>
        ))}
    </GridContainer>

  );
}
