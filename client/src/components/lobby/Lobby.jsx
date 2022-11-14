import { useEffect, useState } from "react";
import styled from "styled-components";

import PlayerCard from "./PlayerCard";

const Lobby = ({ socket, setPlayerThemeColour }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const [joinedLobby, setJoinedLobby] = useState(false);
  const [userData, setUserData] = useState(null);
  const [players, setPlayers] = useState([]);

  const handleUsernameChange = (username) => {
    const re = /^\S[a-zA-Z0-9]*$/;

    if (!re.test(username)) {
      setError("Username can only contains numbers and letters and no spaces!");
      return;
    } else {
      setError(null);
    }

    setUsername(username);
  };

  const joinLobby = () => {
    console.log(`Joining lobby with username ${username}`);
    socket.emit("joinLobby", username, (res) => {
      if (res.status === 0) {
        setJoinedLobby(true);
        setUserData(res.user);
        setPlayerThemeColour(res.user.colour);
        setPlayers(res.players);
      } else if (res.status === -1) {
        setError(res.message);
      }
    });
  };

  const requestNewAvatar = () => {
    console.log("Requesting new avatar...");
    socket.emit("requestNewAvatar", userData.username, (res) => {
      if (res.status === 0) {
        setUserData(res.user);
        setPlayerThemeColour(res.user.colour);
      } else {
        console.error(res.status, res.message);
      }
    });
  };

  if (!joinedLobby) {
    return (
      <LobbyWrapper>
        <JoinForm>
          <input
            maxLength={12}
            type="text"
            placeholder="username"
            onChange={(e) => handleUsernameChange(e.target.value)}
          />
          <ErrorText>{error}</ErrorText>
          <button onClick={() => joinLobby()}>Join Game</button>
        </JoinForm>
      </LobbyWrapper>
    );
  } else {
    return (
      <LobbyWrapper>
        <Centered>
          <PlayerCard
            size="big"
            player={userData}
            requestNewAvatar={requestNewAvatar}
          />
          {/* {players.map((player, i) => {
          if (player.username === userData.username) return;
          return <PlayerCard size="small" player={player} />;
        })} */}
          <i>Waiting for the VR Player to start the game...</i>
        </Centered>
      </LobbyWrapper>
    );
  }
};

const JoinForm = styled.div`
  position: relative;
  top: 50%;
  transform: translateY(-50%);

  input {
    border: 2px solid black;
    border-radius: 10px;
    padding: 10px;

    text-align: center;
  }
`;

const ErrorText = styled.p`
  color: red;
`;

const LobbyWrapper = styled.div`
  height: 100%;
`;

const Centered = styled.div`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
`;

export default Lobby;
