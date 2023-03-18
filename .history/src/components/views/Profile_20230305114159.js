import 'styles/views/Profile.scss';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {api, handleError} from 'helpers/api';
import {Button} from "../ui/Button";
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {Spinner} from 'components/ui/Spinner';
//axios的第三方库来发起HTTP请求，并在响应中获取图像URL。axios是一个流行的JavaScript库，用于在浏览器和Node.js中发起HTTP请求


const ProfilePage=() =>{
  // 随机生成头像
  const history = useHistory();
  const {id} = useParams();
  const localid_str=localStorage.getItem('id');
  const localid = parseInt(localid_str, 10);
  const [imageUrl, setImageUrl] = useState(null);

  //不清楚为什么设置称true就可以但是null就不行
  const [users, setUsers] = useState(true);

  //渲染头像函数
  useEffect(() => {
    axios.get('https://source.unsplash.com/random')
      .then((response) => setImageUrl(response.request.responseURL))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const requestBody = { id: id };
        const response = await api.post('/users/profile', requestBody);
        console.log(response);
        setUsers(response.data);
        // alert({users});
      } catch (error) {
        alert(`Something went wrong during the login: \n${handleError(error)}`);
        
      }
    }

    fetchData();
  }, []);

  const user = {

  };

  let content = <Spinner/>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    ;

    return year.toString();
  }



  function Profilefield({functionuser}) {
    const [showEditButton, setShowEditButton] = useState(false);

    useEffect(() => {
        if (functionuser.id === localid) {
          setShowEditButton(true);
        }
      }, [functionuser.id, localid]);

    const statusStyle = {
      color: functionuser.status === "ONLINE" ? "green" : "red"
    };



  
    return (
      <div className="profile container">
        <div> {(formatDate(functionuser.registerDate))}</div>
        <div className="profile name">User ID:  {functionuser.id}</div>
        <div className="profile username"> Username:  {functionuser.username}</div>
        <div className="profile name">Creation date:  {functionuser.registerDate}</div>
        <div className="profile name">Birthday:  {functionuser.birthday}</div>
        <div className="profile name">
            Online status:
          <span style={statusStyle}>   {functionuser.status}</span>
        </div>

        <div className="login button-container">
            {showEditButton && (
            <Button
              width="100%"
              onClick={() => history.push('/editprofile')}>Edit
            </Button>)}
    </div>
      </div>


      
    );
  }


  Profilefield.propTypes = {
     functionuser: PropTypes.object
  };

  content =(

    <div className="profile container">

    <div className="profile avatar">
        {imageUrl && <img src={imageUrl} alt="profile img"  className="profile img"/>}
    </div>


    <div className="profile form">
    <Profilefield functionuser={users} localid={localid} />            
    </div>

    <div className="login button-container">
    <Button
              width="100%"
              onClick={() => history.push('/game')}>Goback
    </Button>
    </div>
    </div>)
  

  return (
    <BaseContainer>

        {content}

    </BaseContainer>
  );

};

export default ProfilePage;
