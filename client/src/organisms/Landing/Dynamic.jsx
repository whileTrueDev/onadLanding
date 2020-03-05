import React, {useEffect,useState} from 'react';

const  Dynamic = (props) => {
	const { html } = props;  
	const [htmlText, setHtml] = useState(`<div/>`);

  const markup = (val) => {
		return { __html: val }
	}

  useEffect(()=>{
		if(html !== null){
			const newhtml =  html.replace(/<(\/meta|meta)([^>]*)>/gi,"");
			setHtml(newhtml)
		}
  },[html])
	
	return <div dangerouslySetInnerHTML={markup(htmlText)} />;
}

export default Dynamic;