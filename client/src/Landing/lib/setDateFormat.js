export default function setDateFormat(contractionDate) {
  /**
   * @author hwasurr
   * @param contractionDate 1908151212 와 같은 포맷을 갖는 날짜를 나타내는 문자열
   * @return {string} 2019년 08월 15일 과 같은 포맷을 갖는 날짜를 나타내는 문자열
   */
  const year = contractionDate.slice(0, 2);
  const month = contractionDate.slice(2, 4);
  const day = contractionDate.slice(4, 6);

  const result = `20${year}년 ${month}월 ${day}일`;

  return result;
}
