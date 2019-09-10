import { useState, useEffect } from 'react';
import axios from 'axios';
import apiHOST from '../../.config/host';
// functions
import querify from '../querify';

const useFetchData = (initialUrl = '', params = {}) => {
  /**
   * @author hwasurr
   * @function_description get 방식의 요청 query 형태로 만들어 주는 함수.
   * @param {string} initialUrl api 요청하고자 하는 url 주소
   * @param {object} params 요청시에 필요한 객체형태의 데이터
   * @return { payload:any, loading:bool, error:string } 전달받은 데이터, 로딩 bool, 에러 string
  */

  const [data, setData] = useState();
  const [url] = useState(`${apiHOST}${initialUrl}${querify(params)}`);
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setErrorState(false);
      setLoading(true);

      try {
        const response = await axios(url);

        if (!response.data.error) {
          // api 서버에서 올바른 결과를 받은 경우
          setData(response.data.result);
        } else {
          // 쿼리 결과가 있는 경우
          setErrorState(true);
        }
      } catch (error) {
        // api 요청 과정에서의 오류
        setErrorState(true);
      }

      setLoading(false);
    };

    fetchData();
  }, [url]);

  return { data, loading, errorState };
};

export default useFetchData;
