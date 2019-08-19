import { useState, useEffect } from 'react';
import axios from 'axios';
import apiHOST from '../../config';
// functions
import querify from './querify';

const useFetchData = (initialUrl, params = {}) => {
  /**
   * @author hwasurr
   * @function_description get 방식의 요청 query 형태로 만들어 주는 함수.
   * @param initialUrl api 요청하고자 하는 url 주소
   * @param params 요청시에 필요한 객체형태의 데이터
   * @return { payload:any, loading:bool, error:string } 전달받은 데이터, 로딩 bool, 에러 string
  */

  const [data, setData] = useState();
  const [url] = useState(`${apiHOST}${initialUrl}${querify(params)}`);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const result = await axios(url);

        if (!result.error) {
          setData(result.data.result);
        }
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [url]);

  return { data, isLoading, isError };
};


export default useFetchData;
