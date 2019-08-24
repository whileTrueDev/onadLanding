import React from 'react';
import axios from 'axios';
import apiHOST from '../../../.config/host';

const useBannerClick = (bannerList) => {
  /**
   * @author hwasurr
   * @function_description 배너 클릭 hook 으로, 중복클릭을 방지하기 위해 배너 컴포넌트 생성 당 클릭 한번으로 제한한다.
   * @return { clickedList:Array, handleClick:function } 배너 정보를 담고 있는 배열, 클릭 핸들러 함수
   */

  // 배너 수만큼 false 값(클릭 했는지 안했는지, 이동 했는지 안했는지의 상태)을 가지는 배열 생성
  const mockedBannerList = [...bannerList];
  mockedBannerList.forEach((bannerData, index) => {
    mockedBannerList[index].clicked = false;
    mockedBannerList[index].clickSuccess = false;
    mockedBannerList[index].clickError = false;
    mockedBannerList[index].dialogOpen = false;
    mockedBannerList[index].isTransfered = false;
    mockedBannerList[index].transferSuccess = false;
    mockedBannerList[index].transferError = false;
  });

  // 해당 배열을 state로 생성
  const [clickedList, setClickedList] = React.useState(mockedBannerList);

  // 배너 클릭 핸들러
  const handleClick = (targetIndex) => {
    // clickedCheck variable
    let clickedChecked = false;
    // **최초 클릭 시**, DB에 클릭값을 넣는 요청 함수 정의
    const postRequest = async function call() {
      try {
        const res = await axios.post(`${apiHOST}/api/banner/click`, {
          contractionId: clickedList[targetIndex].contractionId
        });
        const { data } = res;

        if (!data.error) {
          if (data.result !== 'fail') {
            clickedList[targetIndex].clickSuccess = true;
            console.log(`정상적으로 입력됨 - click,${clickedList[targetIndex].contractionId}`);
            clickedChecked = true;
          } else {
            // ip 존재하여 클릭 체크 안함.
            console.log('이미 1시간 이내에 <조회>한 IP 이므로 체크 안됨.');
          }
        } else {
          const errorState = new Error('bannerClickhandlerError - in db things');
          clickedList[targetIndex].clickError = errorState;
          throw errorState;
        }
      } catch {
        const errorState = new Error('bannerClickhandlerError - in axios');
        clickedList[targetIndex].clickError = errorState;
        throw errorState;
      }
    };

    // 이미 클릭 했는지 안했는지의 상태를 체크하고 저장
    const newClickedList = [...clickedList];
    newClickedList.forEach((data, index) => {
      if (index === targetIndex) {
        // 클릭한 배너가
        if (newClickedList[index].clicked === false) {
          console.log('첫번째 <조회>클릭', data.contractionId);
          // 한번도 클릭되지 않은 경우

          // 클릭 수 증가 요청
          postRequest();

          // 유효한 click이냐 아니냐에 따른 state 변경
          if (clickedChecked) { // 유효한 클릭 (동일 ip 1시간이내 클릭 내역 없음)
            newClickedList[index] = {
              ...data,
              clicked: true,
              clickCount: data.clickCount + 1,
              dialogOpen: true
            };
          }
          newClickedList[index] = { // 유효하지않은 클릭 (동일 ip 1시간이내 클릭 내역 있음)
            ...data,
            clicked: true,
            dialogOpen: true
          };
        } else {
          // 이전에 클릭된 경우
          console.log('두번째 이상 <조회>클릭, ', data.contractionId);
          newClickedList[index] = {
            ...data,
            dialogOpen: true
          };
          // ****************************
        }
      }
    });
    // 새로운 데이터 넣기
    setClickedList(newClickedList);
  };

  // 배너 <이동> 클릭 핸들러
  const handleTransferClick = (targetIndex) => {
    /**
     * 해당 IP가 1시간 이내에 최초 클릭인지 판단하는 및
     * 해당 IP가 1시간 이내에 최초 클릭 시**, DB에 transfer 값 넣는 요청 함수 정의
     * ip check는 api 서버에서.
     * */
    let transferChecked = false;
    const transferPostRequest = async function call() {
      try {
        const res = await axios.post(`${apiHOST}/api/banner/transfer`, {
          contractionId: clickedList[targetIndex].contractionId
        });
        const { data } = res;
        if (!data.error) {
          if (data.result !== 'fail') {
            clickedList[targetIndex].transferSuccess = true;
            console.log(`정상적으로 입력됨 - transfer,${clickedList[targetIndex].contractionId}`);
            transferChecked = true;
          } else {
            // ip 존재하여 클릭 체크 안함.
            console.log('이미 1시간 이내에 <이동>한 IP 이므로 체크 안됨.');
          }
        } else {
          const errorState = new Error('bannerTransferClickhandlerError - in db things');
          clickedList[targetIndex].transferError = errorState;
          throw errorState;
        }
      } catch {
        const errorState = new Error('bannerTransferClickhandlerError - in axios');
        clickedList[targetIndex].transferError = errorState;
        throw errorState;
      }
    };
    // ********************************

    const newClickedList = [...clickedList];
    newClickedList.forEach((data, index) => {
      if (index === targetIndex) {
        if (newClickedList[index].isTransfered === false) {
          // componenet 생성 이후 첫번째 클릭
          console.log('첫번째 <이동> 클릭');

          // 클릭 적재 요청 + ip check 요청
          transferPostRequest();

          if (transferChecked) {
            newClickedList[index] = {
              ...data,
              transferCount: data.transferCount + 1,
            };
          }

          // checked 확인
          newClickedList[index] = {
            ...data,
            isTransfered: true
          };

          // 버튼 이동 이벤트
          window.open(data.landingUrl);
        } else {
          console.log('두번째 이상 <이동> 클릭');
          // 버튼 이동 이벤트
          window.open(data.landingUrl);
        }
      }
    });
    // 새로운 데이터 넣기
    setClickedList(newClickedList);
  };
  return { clickedList, handleClick, handleTransferClick };
};

export default useBannerClick;
