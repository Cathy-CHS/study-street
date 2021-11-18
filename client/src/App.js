import React, { useRef, useEffect, useState } from "react";
import './App.css';
import Game from "./components/Game";
import Login from "./components/User/LogIn";
import Avatars from "./components/ui/Avatars";
import {ConfirmAlert, QuickMoveButton} from "./components/ui/QuickMove";
import HomeMain from "./components/ui/Home/HomeMain";
import MenuBar from "./components/ui/MenuBar";
import StudyMain from "./components/ui/Study/StudyMain";
import styled from "styled-components";
import Modal from 'react-overlays/Modal';
import LoginOverlay from "./components/ui/LoginOverlay";

/* Example of LoginUserContext value
  {
    "userID": "eunki",
    "userName": "은기",
    "status": "Developing user data system",
  }
  */
export const LoginUserContext = React.createContext(null);
export const GameContext = React.createContext(null);

const StyledModal = styled(Modal)`
    position: fixed;
    width: 500px;
    height: 300px;
    z-index: 1100;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 11px;
    outline: none;
    background-color: #FDFDFD;
    box-shadow: 0px 4px 10px rgba(71, 71, 71, 0.25);
`;

function App() {
  
  const [loginUser, setLoginUser] = useState(null);
  const [scene, setScene] = useState("Library");  
  const [showConfirmAlert, setshowConfirmAlert] = useState(false);  
  const game = useRef(null);
  const [open, setOpen] = useState(true);

  const [fadeProp, setFadeProp] = useState({
    fade: 'fade-in'
  });
  const [isHome, setIsHome] = useState(true);

  useEffect(() => {
    if (game.current !== null && game.current.game) {
      game.current.game.registry.set("loginUser", loginUser);
    }
  }, [game.current, loginUser]);

  useEffect(() => {
    let timeout = null;
    if (game.current !== null && game.current.game){
      game.current.game.events.on("changeScene", newScene => {
        setFadeProp({fade: 'fade-out'});
        // timeout = setTimeout(() => setFadeProp({fade: 'fade-in'}), 1000);
        timeout = setTimeout(() => setFadeProp({fade: 'open-in'}), 1000);
        setScene(newScene);
      })
    }
    return () => {
      clearInterval(timeout);
    }      
  }, [])

  const emitToGame = (data => {
    if (game.current !== null && game.current.game) {
      game.current.emit(data)
    }
    console.log('emitToGame', data)
  }) 

  const onWalkToLibrary = () => {
    setIsHome(false);
  }

  const callClose = () => {
    setOpen(false);
  }

  return (
    <LoginUserContext.Provider value={ {loginUser, setLoginUser} }>
      <GameContext.Provider value={ {
        scene, emitToGame, game
      } }>
      <div className={fadeProp.fade}>
        <div className="content">
          { isHome ? <HomeMain onWalkToLibrary={onWalkToLibrary}/> : null }
          { !isHome ? <MenuBar/> : null }
          { !isHome ? <Avatars/> : null }
          { scene === "Study" ? <StudyMain/> : null }
          { !isHome ? <QuickMoveButton emitToGame = {emitToGame}/> : null }
          <ConfirmAlert show = {showConfirmAlert} setShow = {setshowConfirmAlert}/>
        </div>
        <div className="game-container">
          <Game ref={game}/>
        </div>
      </div>
      <div>
        <StyledModal
          show = {open}
        ><LoginOverlay callClose={callClose}></LoginOverlay></StyledModal>
      </div>
      </GameContext.Provider>
    </LoginUserContext.Provider>
  );
}

export default App;
