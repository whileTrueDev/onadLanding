import React from 'react';
import axios from 'axios';
import apiHOST from '../../../.config/host';

const useBannerClick = (bannerList) => {
  /**
   * @author hwasurr
   * @function_description 배너 클릭 hook 으로, 중복클릭을 방지하기 위해 배너 컴포넌트 생성 당 클릭 한번으로 제한한다.
   * @return { clicked:bool, handleClick:function } 전달받은 데이터, 로딩 bool, 에러 string
   */

  // 배너 수만큼 false 값(클릭 했는지 안했는지의 상태)을 가지는 배열 생성

  const initialList = [];
  bannerList.forEach(() => { initialList.push(false); });

  const [clickedList, setClickedList] = React.useState(initialList);

  const handleClick = (targetIndex, contractionId) => {
    // 최초 클릭 시, DB에 클릭값을 넣는 요청 함수 정의
    function postRequest() {
      axios.post(`${apiHOST}/api/banner/click`, {
        contractionId
      });
    }

    // 이미 클릭 했는지 안했는지의 상태를 체크하고 저장
    const newClickedList = [...clickedList];
    newClickedList.forEach((data, index) => {
      if (index === targetIndex) {
        // 클릭한 배너가
        if (newClickedList[index] === false) {
          // 한번도 클릭되지 않은 경우
          newClickedList[index] = true;
          // 클릭 수 증가 요청
          postRequest();
          // 문제점 : 클릭 시 보여지는 숫자가 바로 바뀌지 않는다.
          // 소켓을 사용할 지, 생각.

          // 클릭 되었습니다 - 반응 및 클릭 이벤트
          // 클릭 이벤트 ( 다이얼로그 또는 새 창 띄우기 )
        } else {
          // // handle Clicked banner!!
          // console.log('두번째 이상 클릭, ', contractionId);
        }
      }
    });
    setClickedList(newClickedList);
  };

  return { handleClick };
};

export default useBannerClick;
