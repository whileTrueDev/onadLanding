import React from 'react';
import axios from 'axios';
import apiHOST from '../../../.config/host';

const useBannerClick = (bannerList) => {
  /**
   * @author hwasurr
   * @function_description 배너 클릭 hook 으로, 중복클릭을 방지하기 위해 배너 컴포넌트 생성 당 클릭 한번으로 제한한다.
   * @return { clickedList:Array, handleClick:function } 배너 정보를 담고 있는 배열, 클릭 핸들러 함수
   */

  // 배너 수만큼 false 값(클릭 했는지 안했는지의 상태)을 가지는 배열 생성
  const mockedBannerList = [...bannerList];
  mockedBannerList.forEach((bannerData, index) => {
    mockedBannerList[index].clicked = false;
    mockedBannerList[index].success = false;
    mockedBannerList[index].error = false;
    mockedBannerList[index].dialogOpen = false;
  });

  // 해당 배열을 state로 생성
  const [clickedList, setClickedList] = React.useState(mockedBannerList);

  // 배너 클릭 핸들러
  const handleClick = (targetIndex) => {
    // 최초 클릭 시, DB에 클릭값을 넣는 요청 함수 정의
    const postRequest = async function call() {
      try {
        const res = await axios.post(`${apiHOST}/api/banner/click`, {
          contractionId: clickedList[targetIndex].contractionId
        });
        if (!res.error) {
          clickedList[targetIndex].success = true;
        } else {
          const errorState = new Error('bannerClickhandlerError - in db things');
          clickedList[targetIndex].error = errorState;
          throw errorState;
        }
      } catch {
        const errorState = new Error('bannerClickhandlerError - in axios');
        clickedList[targetIndex].error = errorState;
        throw errorState;
      }
    };

    // 이미 클릭 했는지 안했는지의 상태를 체크하고 저장
    const newClickedList = [...clickedList];
    newClickedList.forEach((data, index) => {
      if (index === targetIndex) {
        // 클릭한 배너가
        if (newClickedList[index].clicked === false) {
          console.log('첫번째 클릭', data.contractionId);
          // 한번도 클릭되지 않은 경우

          /* ***************************
          * 클릭 수 증가 요청
          */
          postRequest();
          // ****************************

          /* ***************************
           * 클릭시 클릭 카운트 수정 및 클릭 여부 판단
           */
          newClickedList[index] = {
            ...data,
            clickCount: data.clickCount + 1,
            clicked: true,
            dialogOpen: true
          };
          // ****************************

          /* ***************************
           * 클릭 되었습니다 - 반응 및 클릭 이벤트
           * 클릭 이벤트 ( 다이얼로그 또는 새 창 띄우기 )
           */

          // 새 창 열기
          // window.open(data.linkUrl);

          // ****************************
        } else {
          // 이전에 클릭된 경우

          console.log('두번째 이상 클릭, ', data.contractionId);
          /* ***************************
           * Just clickEvent
           * 클릭 되었습니다 - 반응 및 클릭 이벤트
           * 클릭 이벤트 ( 다이얼로그 또는 새 창 띄우기 )
           */

          newClickedList[index] = {
            ...data,
            dialogOpen: true
          };

          console.log('some event handler for click');
          // ****************************
        }
      }
    });
    setClickedList(newClickedList);
  };

  return { clickedList, handleClick };
};

export default useBannerClick;
