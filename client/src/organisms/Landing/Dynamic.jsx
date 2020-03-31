import React, {useEffect,useState} from 'react';
import $ from "jquery";
import apiHOST from '../../config/host';
import axios from 'axios';

const  Dynamic = (props) => {
	const { html, isSSP, name, click_tracking_api } = props;  
	const [htmlText, setHtml] = useState(`<div id="banner-block"/>`);

  const markup = (val) => {
		return { __html: val }
	}

	const handleClick = () =>{ 
    axios.post(`${apiHOST}/api/manplus/click`, {name, isSSP})
    if(isSSP){
			if (click_tracking_api !== null || click_tracking_api !== '' || click_tracking_api !== undefined ) {
				if(click_tracking_api.length !== 0){
					axios.get(click_tracking_api)
				}else {
					console.log("SSP-API-URL IS EMPTY")
				}
			}else {
				console.log("SSP-API-URL ERROR")
			}
    }
	}
	
  useEffect(()=>{
		if(html !== null){
			if(isSSP){
				$('#banner-block').append(html);
				$('#banner-block iframe').on('load',function(){
					$(this).contents().find("body").on('click', function() { 
						handleClick() 
					});
				});
			}else{
				const newhtml =  html.replace(/<(\/meta|meta)([^>]*)>/gi,"");
				setHtml(newhtml)
			}
		}
  },[html])
	
	return <div dangerouslySetInnerHTML={markup(htmlText)} style={{width: '95%', height: 'auto'}} id="dynamic-block"/>;
}

export default Dynamic;