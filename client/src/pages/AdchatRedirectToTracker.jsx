import React, { useEffect } from 'react';


export default function AdchatRedirectToTracker(props) {
  const { match } = props;

  useEffect(() => {
    window.location.href = `https://l.onad.io/${match.params.name}`;
  });
  return (
    <div />
  );
}
