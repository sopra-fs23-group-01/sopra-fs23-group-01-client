import 'styles/views/Profile.scss';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {Spinner} from 'components/ui/Spinner';
//axios的第三方库来发起HTTP请求，并在响应中获取图像URL。axios是一个流行的JavaScript库，用于在浏览器和Node.js中发起HTTP请求



const ProfilePage=() =>{
  // 随机生成头像
  const {id} = useParams();
  const [imageUrl, setImageUrl] = useState(null);
  const [users, setUsers] = useState(null);


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
      } catch (error) {
        alert(`Something went wrong during the login: \n${handleError(error)}`);
        
      }
    }

    fetchData();
  }, []);



  const user = {
    
    username:users.id,
    birthday: '01/01/1990',
    avatarUrl: 'https://www.example.com/avatar.jpg',
  };





  let content = <Spinner/>;

  function Profilefield({functionuser}) {
    const statusStyle = {
      color: functionuser.status === "ONLINE" ? "green" : "red"
    };
  
    return (
    
      <div className="profile container">
        <div className="profile name">User ID:  {users.id}</div>
        <div className="profile username"> Username:  {users.username}</div>
        <div className="profile name">Creation date:  {users.registerDate}</div>
        <div className="profile name">Birth date:  {users.registerDate}</div>
        <div className="profile name">
            Online status:
          <span style={statusStyle}>   {users.status}</span>
        </div>
      </div>
    );
  }
  Profilefield.propTypes = {
    users: PropTypes.object
  };
 
  content =(
    <div className="profile container">

    <div className="profile avatar">
        {imageUrl && <img src={imageUrl} alt="profile img"  className="profile img"/>}
    </div>


    <div className="profile form">
    <Profilefield 
    user={users}
    />
                    
    </div>
    </div>)
  

  return (
    <BaseContainer>

        {content}

    </BaseContainer>
  );
};

export default ProfilePage;
