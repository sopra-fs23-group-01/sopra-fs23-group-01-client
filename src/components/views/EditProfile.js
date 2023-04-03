
import 'styles/views/Profile.scss';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from "../ui/Button";
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import 'react-datepicker/dist/react-datepicker.css';
import '@fortawesome/fontawesome-free/css/all.css';
const NameChangeField= props =>{
    return(
        <div className="profile name">
            <input
                className="profile input"
                type={props.type}
                placeholder="enter here"
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
                />
        </div>
    );
};

NameChangeField.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
};


const EditProfile= () =>{

  //get the local username and id
  const history = useHistory();
  const userid = localStorage.getItem('id');

  //set new const
  const [id,] = useState(userid);
  const [username, setusername] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [birthday, setBirthday] = useState(null);
  const [introduction, setIntroduction] = useState(null);
  const [gender, setGender] = useState(null);
  const [registerDate,] = useState(null);
  const [status,] = useState(null);
    const [users, setUsers] = useState(true);
    let icon = localStorage.getItem('icon');


    //add the icon
    useEffect(() => {
      axios.get('https://source.unsplash.com/random')
      .then((response) => setImageUrl(response.request.responseURL))
      .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get('/users/' + id);
                console.log(response);
                setUsers(response.data);

            } catch (error) {
                alert(`Something went wrong during the profile page: \n${handleError(error)}`);

            }
        }

        fetchData();
    }, [id]);


  const doEditProfile = async () => {
    try {
        const requestBody = JSON.stringify({  id: id,
        username: username,
        birthday: birthday,
        gender:gender,
        registerDate: registerDate,
        status: status,
        introduction: introduction
      });
        await api.put('/users/'+id, requestBody);
     
        history.push(`/user/${id}`);
    } catch (error) {
        alert(`Something went wrong during the profile edit: \n${handleError(error)}`);
    }
  };

    // function Profilefield({functionuser}) {
    //     const [showEditButton, setShowEditButton] = useState(false);
    //
    //     useEffect(() => {
    //         if (functionuser.id === userid) {
    //             setShowEditButton(true);
    //         }
    //     }, [functionuser.id]);
    //
    //     const statusStyle = {
    //         color: functionuser.status === "ONLINE" ? "green" : "red"
    //     };
    // }
    return(
        <BaseContainer>
        <div className="profile container">
            {/*<div className="return-button" onClick={() => history.push('/user/${id}')}></div>*/}
            <div className="profile head">Setting Profile</div>


            <div className="profile avatar">
              {imageUrl && <img src={imageUrl} alt="profile img"  className="profile img"/>}
            </div>

          <div className="profile username" style={{marginTop:'40px',marginBottom:'40px'}}> {users.username}</div>
            <div className="profile name">Username:</div>
            <NameChangeField
                value={username}
                onChange={un => setusername(un)}
            />
            <div className="profile name">Birthday:</div>
              <NameChangeField
                type="date"
                value={birthday}
                onChange={un => setBirthday(un)}
              />
              {/* <div className="profile username"> Current Username:  {userUsername}</div> */}

            <div className="profile name">
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                <label>
                    Gender:
                    <input
                        style={{width:'20px',marginLeft:'20px'}}
                        className="profile input"
                        type="radio"
                        value="male"
                        checked={gender === 'male'}
                        onChange={() => setGender('male')}
                    />
                    Male
                </label>
                <label>
                    <input
                        style={{width:'20px',marginLeft:'20px'}}
                        className="profile input"
                        type="radio"
                        value="female"
                        checked={gender === 'female'}
                        onChange={() => setGender('female')}
                    />
                    Female
                </label>
                </div>
            </div>

            <div className="profile name">Introduction:</div>
            <NameChangeField
                value={introduction}
                onChange={un => setIntroduction(un)}
            />



          <div className="login button-container">
                <Button
                    style={{ marginTop: '5px' }}
                  width="150px"
                  onClick={() =>doEditProfile()}>Confirm
                </Button>
          </div>

          <div className="login button-container">
              <Button className="return-button"

                        onClick={() => history.push(`/user/${id}`)}>
              </Button>

          </div>
        </div>

        </BaseContainer>
    );

};

export default EditProfile;

