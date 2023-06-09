import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
//  import {ProfileGuard} from "components/routing/routeProtectors/ProfileGuard";
import Login from "components/views/Login";
import Register from "components/views/Register";
import Profile from "components/views/Profile";
import ProfilePage from "components/views/Profile";
import EditProfile from "components/views/EditProfile";
import Room from "components/views/Room";
import Leaderboard from "components/views/Leaderboard";
import Lobby from "../../views/Lobby";
import RoomCreation from "../../views/RoomCreation";
import EditAvatar from "../../views/EditAvatar";
//import VoteResult from "../../views/VoteResult";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {PlayerGuard} from "../routeProtectors/PlayerGuard";
/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
  return (
      <BrowserRouter>
        <Switch>
          <Route path="/leaderboard">
            <GameGuard>
              <Leaderboard/>
            </GameGuard>
          </Route>

          <Route path="/user/:id" component={ProfilePage}>
            <GameGuard>
              <Profile/>
            </GameGuard>
          </Route>

          <Route path="/room=:id" component={Room}>
            <GameGuard>
              {/*<RoomGuard>*/}
                <Room/>
              {/*</RoomGuard>*/}
            </GameGuard>
          </Route>

          <Route exact path="/login">
            <LoginGuard>
              <Login/>
            </LoginGuard>
          </Route>

          <Route exact path="/register">
            <LoginGuard>
              <Register/>
            </LoginGuard>
          </Route>

          <Route exact path="/editprofile">
            <GameGuard>
              <EditProfile/>
            </GameGuard>
          </Route>

          <Route path="/room=:id/game">
            <GameGuard>
              <PlayerGuard>

              </PlayerGuard>
            </GameGuard>
          </Route>

          <Route exact path="/editavatar">
            <GameGuard>
              <EditAvatar/>
            </GameGuard>
          </Route>

          <Route exact path="/lobby">
            <GameGuard>
              <PlayerGuard>
                <Lobby/>
              </PlayerGuard>
            </GameGuard>
          </Route>

          <Route exact path="/profile">
            <GameGuard>
              <Profile/>
            </GameGuard>
          </Route>

          <Route exact path="/roomCreation">
            <GameGuard>
               <PlayerGuard> 
                <RoomCreation/>
               </PlayerGuard>
            </GameGuard>
          </Route>

          <Route exact path="/">
            <Redirect to="/login"/>
          </Route>


        </Switch>
      </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;