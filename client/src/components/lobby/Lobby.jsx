import { useEffect, useState } from "react";
import styled from "styled-components";

import { useDispatch, useSelector } from "react-redux";
import { setAvatarSeed, setColour, setUser } from "../../redux/userSlice";

import PlayerCard from "./PlayerCard";

const Lobby = ({ socket }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const [username, setUsername] = useState(null);
  const [error, setError] = useState(null);

  const [joinedLobby, setJoinedLobby] = useState(false);

  useEffect(() => {
    socket.on("gameStarted", () => {
      console.log("Game started.");
    });

    return () => {
      socket.off("gameStarted");
    };
  });

  const handleUsernameChange = (username) => {
    const re = /^\S[a-zA-Z0-9]*$/;

    if (!re.test(username)) {
      setError("Username can only contains numbers and letters and no spaces!");
      return;
    } else {
      setError(null);
    }

    // Set username in local state.
    setUsername(username);
  };

  const joinLobby = () => {
    console.log(`Trying to join lobby with username ${username}`);
    socket.emit("joinLobby", username, (res) => {
      if (res.status === 0) {
        console.log("Joined lobby successfully.");
        setJoinedLobby(true);
        dispatch(
          setUser({
            username: res.user.username,
            colour: res.user.colour,
            avatarSeed: res.user.avatarSeed,
          })
        );
      } else {
        setError(res.status + ": " + res.message);
      }
    });
  };

  const requestNewAvatar = () => {
    console.log("Requesting new avatar...");
    socket.emit("requestNewAvatar", user.username, (res) => {
      if (res.status === 0) {
        dispatch(setColour(res.user.colour));
        dispatch(setAvatarSeed(res.user.avatarSeed));
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
          <button onClick={() => joinLobby()} disabled={!socket.connected}>
            Join Game
          </button>
        </JoinForm>
      </LobbyWrapper>
    );
  } else {
    return (
      <LobbyWrapper>
        <Centered>
          <PlayerCard
            size="big"
            player={user}
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
