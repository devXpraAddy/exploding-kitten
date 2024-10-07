// frontend/src/App.js
import React from "react";
import { useSelector } from "react-redux";
import Login from "./components/Login";
import Game from "./components/Game";
import Leaderboard from "./components/Leaderboard";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";

function App() {
  const username = useSelector((state) => state.user.username);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Exploding Kittens Game
          </Typography>
          {username && (
            <Typography variant="subtitle1">Player: {username}</Typography>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ marginTop: 4 }}>
        {!username ? (
          <Login />
        ) : (
          <>
            <Game />
            <Leaderboard />
          </>
        )}
      </Container>
    </>
  );
}

export default App;
