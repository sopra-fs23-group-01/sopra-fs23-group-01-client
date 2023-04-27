import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";
import NavigationBar from "./NavigationBar";


const Lobby = () => {

    // use react-router-dom's hook to access the history
    const history = useHistory();

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    //const [users, setUsers] = useState(null);
    const [rooms, setRooms] = useState(null);

    const quickStart = async () => {

        window.location.href = `/chat`;
    };

    async function enterRoom(roomId, id) {
        try {
            const requestBody = JSON.stringify({id});
            await api.put('/room/'+roomId+'/players', requestBody);
            alert('Entered room successfully: '+roomId+'userId: '+id);
            //history.push(`/leaderboard`);
        } catch (error) {
            console.error(`Something went wrong during the enterRoom: \n${handleError(error)}`);
            alert(`Something went wrong during the enterRoom: \n${handleError(error)}`);
        }
    }

    const createRoom = async () => {
        window.location.href = `/roomCreation`;
    };


    // the effect hook can be used to react to change in your component.
    // in this case, the effect hook is only run once, the first time the component is mounted
    // this can be achieved by leaving the second argument an empty array.
    // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html


    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
                //get rooms the url is set in Specification
                const response = await api.get('/games');

                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned  and update the state.
                setRooms(response.data);
        }
        fetchData();
    }, [history]);

    let content = null;


    if (rooms) {

        function Room({ room }) {
            const propertyStyle = {
                color: room.roomProperty === "PUBLIC" ? "green" : "red"
            };

            const tryStyle = {
                color: room.roomPlayers.length !== 0 ? "green" : "yellow"
            };

            return (
                <a href={`/room=${room.roomId}`} style={{ textDecoration: 'none' }} onClick={() => enterRoom(room.roomId, localStorage.getItem('id'))}>
                    <div className="lobby player container" style={{ backgroundColor: 'yellowgreen' }}>
                        <div className="lobby player room">Room {room.roomId}</div>
                        <div className="lobby player theme"><span style={tryStyle}> {room.theme}</span></div>
                        <span style={propertyStyle}>{room.roomProperty}</span>
                    </div>
                </a>
            );
        }


        Room.propTypes = {
            room: PropTypes.object
        };


        content = (
            <div className="lobby">
                <ul className="lobby list">
                    {rooms.map(room => (
                        <Room room={room} key={room.roomId}/>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <BaseContainer>
            <div className="lobby lobbyText">Game Lobby</div>
            <div className="lobby availableText">Available Room</div>
            <div className="lobby content">{content}</div>
            <Button className="lobby quickStartButton" onClick={() => quickStart()}>Quick Start</Button>
            <Button className="lobby createButton" onClick={() => createRoom()}>Create New Room</Button>
            <NavigationBar/>
        </BaseContainer>
    );
}

export default Lobby;
