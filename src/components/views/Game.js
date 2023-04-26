import '@fortawesome/fontawesome-free/css/all.css';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Room.scss";
import ReminderIcon from "../../styles/image/Icons/ReminderIcon.png";
import ConfirmIcon from "../../styles/image/Icons/ConfirmIcon.png";
import BackIcon from "../../styles/image/Icons/BackIcon.png";
import NavigationBar from "./NavigationBar";
import avatar1 from "./avatar1.png";
import NameIcon from "../../styles/image/Icons/NameIcon.png";
import User from "../../models/User";
import {Spinner} from "../ui/Spinner";
import React, { useEffect, useState, useRef } from 'react'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient = null;
const Game = () => {

    const history = useHistory();
    const [assignedWord, setAssignedWord] = useState('');
    const [role, setRole] = useState('');
    const [users, setUsers] = useState(null);
    const path = window.location.pathname.substring(1); // remove leading /
    const roomId = path.split('=')[1];
    const id = localStorage.getItem('id');

    //const roomTheme = localStorage.getItem('roomTheme');

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get('/users');

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned users and update the state.
                setUsers(response.data);

                // This is just some data for you to see what is available.
                // Feel free to remove it.
                console.log('request to:', response.request.responseURL);
                console.log('status code:', response.status);
                console.log('status text:', response.statusText);
                console.log('requested data:', response.data);

                // See here to get more data.
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
                localStorage.removeItem('token');
                history.push('/login')
            }

        }

        fetchData();
    }, [history]);

    let content = <Spinner/>;

    if (users) {

        function Player({ user }) {
            const statusStyle = {
                color: user.readyStatus === "READY" ? "green" : "red"
            };

            return (
                <div className="room playercontainer">
                    <img src={user.avatarUrl} alt="profile img" className="room avatarimg"/>
                    <div className="room playername "><span style={statusStyle}>{user.username}</span> </div>
                </div>
            );
        }


        Player.propTypes = {
            user: PropTypes.object
        };

        content = (
            <div>
                <ul className="room user-list">
                    {users.map(user => (
                        <Player user={user} key={user.id}/>
                    ))}
                </ul>
            </div>
        );
    }

    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState("CHATROOM");



    // // 从localStorage获取username并将其设置为userData的初始值。
    // const storedUsername = localStorage.getItem('username');
    const [userData, setUserData] = useState({
        // username: storedUsername || '',
        username: '',
        receivername: '',
        connected: false,
        message: ''
    });
    // //自动连接
    // useEffect(() => {
    //     if (userData.username) {
    //         connect();
    //     }
    // }, [userData.username]);




    useEffect(() => {
        console.log(userData);
    }, [userData]);



    const onPrivateMessageReceived = (payload) => {
        const message = JSON.parse(payload.body);
      
        if (message.status === 'ASSIGNED_WORD') {
          setAssignedWord(message.message);
          setRole(message.role);
        }
      };

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                if (!privateChats.get(payloadData.senderName)) {
                    privateChats.set(payloadData.senderName, []);
                    setPrivateChats(new Map(privateChats));
                }
                const joinMessage = {
                    senderName: "system",
                    message: `${payloadData.senderName} entered the room.`,
                    status: "MESSAGE"
                };
                publicChats.push(joinMessage);
                setPublicChats([...publicChats]);
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                scrollToBottom();
                break;

                
        }
    }

    const onPrivateMessage = (payload) => {
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if (privateChats.get(payloadData.senderName)) {
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } else {
            let list = [];
            list.push(payloadData);
            privateChats.set(payloadData.senderName, list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);

    }

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "message": value });
    }
    const sendValue = () => {
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status: "MESSAGE"
            };
            console.log(chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
        }
    }
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // const sendPrivateValue = () => {
    //     if (stompClient) {
    //         var chatMessage = {
    //             senderName: userData.username,
    //             receiverName: tab,
    //             message: userData.message,
    //             status: "MESSAGE"
    //         };

    //         if (userData.username !== tab) {
    //             privateChats.get(tab).push(chatMessage);
    //             setPrivateChats(new Map(privateChats));
    //         }
    //         stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
    //         setUserData({ ...userData, "message": "" });
    //     }
    // }

    const handleUsername = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "username": value });
    }


    return (
        <div>
            {/*<img className="room backicon" src={BackIcon} alt="Back" onClick={() => goBack()} />*/}
            <div className="room roomid">Room:{roomId}</div>
            <div className="room reminder">
                <img className="room remindericon" src={ReminderIcon} alt="Reminder" />
                <div className="room remindertext">Welcome to Who Is Undercover! Get ready to start!</div>

            </div>
            <div className="room assignedword">
                        <strong>Your assigned word is:  {assignedWord} </strong>
            </div>
            <div>

                <div className="chat container">
                {userData.connected ?
                
                    <div className="chat chat-box">
                        {/* <div className="chat member-list">
                            <ul>
                                <li onClick={() => { setTab("CHATROOM") }} className={`chat member ${tab === "CHATROOM" && "active"}`}>Chatroom</li>
                                {[...privateChats.keys()].map((name, index) => (
                                    <li onClick={() => { setTab(name) }} className={`chat member ${tab === name && "active"}`} key={index}>{name}</li>
                                ))}
                            </ul>
                        </div> */}
                        <div className="room theme" >{role}
                        </div>

                        {tab === "CHATROOM" && <div className="chat chat-content">
                            <ul className="chat chat-messages">
                                {publicChats.map((chat, index) => (
                                    <li className={`chat message ${chat.senderName === userData.username && "self"} ${chat.senderName === "system" && "system"}`} key={index}>
                                    {chat.senderName !== userData.username && chat.senderName !== "system" && <div className="chat avatar">{chat.senderName}</div>}
                                    <div className="chat message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && <div className="chat avatar self">{chat.senderName}</div>}
                                    </li>
                                ))}
                            </ul>
                            <div ref={messagesEndRef} />

                        </div>}
                        {tab !== "CHATROOM" && <div className="chat chat-content">
                            <ul className="chat chat-messages">
                                {[...privateChats.get(tab)].map((chat, index) => (
                                    <li className={`chat message ${chat.senderName === userData.username && "self"}`} key={index}>
                                        {chat.senderName !== userData.username && <div className="chat avatar">{chat.senderName}</div>}
                                        <div className="chat message-data">{chat.message}</div>
                                        {chat.senderName === userData.username && <div className="chat avatar self">{chat.senderName}</div>}
                                    </li>
                                ))}
                            </ul>
                            <div ref={messagesEndRef} />

                        </div>}

                    </div>
                    :
                    // null
                    <div className="chat register">
                        <input
                            id="user-name"
                            placeholder="(测试用)"
                            name="userName"
                            value={userData.username}
                            onChange={handleUsername}
                            margin="normal"
                        />
                    </div>
                    }
                </div>


            </div>
            {content}
            <div className="chat send-messagebox">
                <input type="text" className="chat input-message" placeholder="Enter your message here..." value={userData.message} onChange={handleMessage} />
                {/*<Button type="button" onClick={sendValue}>send</Button>*/}
                <img className="room confirmicon" src={ConfirmIcon} onClick={sendValue} alt="Confirm" />
            </div>

        </div>
    );
}

export default Game;