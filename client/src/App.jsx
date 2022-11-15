import "./App.css";
import Lobby from "./components/lobby/Lobby";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { contrastColor } from "contrast-color";
import { receivedPong, setConnected } from "./redux/networkSlice";

const socket = io();

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const network = useSelector((state) => state.network);

  useEffect(() => {
    socket.on("connect", () => {
      dispatch(setConnected(true));
    });

    socket.on("disconnect", () => {
      dispatch(setConnected(false));
    });

    socket.on("pong", () => {
      console.log("Pong!");
      dispatch(receivedPong())
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);

  const sendPing = () => {
    console.log("Pinging...");
    socket.emit("ping", "hello");
  };

  return (
    <MainWindow className="App">
      <Header
        themeColour={user.colour}
        textColour={contrastColor({ bgColor: user.colour })}
      >
        <Title>LookOut VR</Title>
      </Header>
      {/* <p>Connected: {"" + isConnected}</p>
      <p>Last pong: {lastPong || "-"}</p>
      <button onClick={sendPing}>Send ping</button> */}
      <Content>
        <Lobby socket={socket} />
      </Content>
      <Footer
        themeColour={user.colour}
        textColour={contrastColor({ bgColor: user.colour })}
      >
        <span>v{process.env.REACT_APP_VERSION}</span>
        <span>
          Server Status: {network.isConnected ? "Connected" : "Disconnected"}
        </span>
      </Footer>
    </MainWindow>
  );
};

const MainWindow = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: wrap;

  height: 100vh;
  width: 100vw;
`;

const Header = styled.div`
  height: 8%;
  width: 100%;

  background-color: ${(props) => props.themeColour};
  color: ${(props) => props.textColour};
`;

const Title = styled.h1`
  margin: 0.25em;
`;

const Content = styled.div`
  height: 84%;
  width: 100%;
`;

const Footer = styled.div`
  height: 8%;
  width: 100%;

  background-color: ${(props) => props.themeColour};
  color: ${(props) => props.textColour};

  display: flex;
  flex-direction: column;

  span {
    width: 100%;
    font-style: italic;
  }
`;

export default App;
