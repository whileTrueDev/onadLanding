import React, {useEffect,useState} from 'react';
import $ from "jquery";


const  Dynamic = (props) => {
	const { html, isSSP } = props;  
	const [htmlText, setHtml] = useState(`<div id="edit-me"/>`);

  const markup = (val) => {
		return { __html: val }
	}

  useEffect(()=>{
		if(html !== null){
			if(isSSP){
				$('#edit-me').html(html);
			}else{
				const newhtml =  html.replace(/<(\/meta|meta)([^>]*)>/gi,"");
				setHtml(newhtml)
			}
		}
  },[html])
	
	return <div dangerouslySetInnerHTML={markup(htmlText)} style={{width: '95%', height: 'auto'}}/>;
}

export default Dynamic;