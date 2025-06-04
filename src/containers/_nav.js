import  { useState,useEffect } from 'react';
import menus from './menus'

//const _nav = userid => {
  function  _nav(userid){
    const [usersList, setData] = useState([]);

    useEffect(() => {
      setData(eval(menus));
    }, [, ])
    return (usersList) 
};

export default _nav