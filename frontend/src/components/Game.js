// frontend/src/components/Game.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startGame,
  drawCard,
  saveGameState,
  loadGameState,
} from "../redux/gameSlice";
import axios from "axios";
import {
  Typography,
  Button,
  Grid,
  Card as MUICard,
  CardContent,
  Box,
  Alert,
  Snackbar,
  Fade,
} from "@mui/material";
import { EmojiEmotions, Warning, Shuffle, Block } from "@mui/icons-material";

const Game = () => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.user.username);
  const { deck, revealed, status, gameWon, gameLost, defuseAvailable } =
    useSelector((state) => state.game);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    dispatch(loadGameState(username));
  }, [dispatch, username]);

  useEffect(() => {
    const gameState = {
      deck,
      revealed,
      status,
      gameWon,
      gameLost,
      defuseAvailable,
    };
    dispatch(saveGameState({ username, gameState }));
  }, [
    deck,
    revealed,
    status,
    gameWon,
    gameLost,
    defuseAvailable,
    dispatch,
    username,
  ]);

  const handleStart = () => {
    dispatch(startGame());
  };

  const handleDraw = () => {
    dispatch(drawCard());
    if (status === "won") {
      setSnackbarMessage("🎉 You Won! Your score has been updated.");
      setSnackbarOpen(true);
      axios.post("/api/win", { username }).catch((error) => {
        console.error(error);
      });
    } else if (status === "lost") {
      setSnackbarMessage("💥 You Lost! Better luck next time.");
      setSnackbarOpen(true);
    }
  };

  const renderCardIcon = (card) => {
    switch (card) {
      case "😼":
        return <EmojiEmotions fontSize="large" color="primary" />;
      case "💣":
        return <Warning fontSize="large" color="error" />;
      case "🔀":
        return <Shuffle fontSize="large" color="secondary" />;
      case "🙅‍♂️":
        return <Block fontSize="large" color="action" />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box mb={2}>
        {status === "won" && (
          <Alert severity="success">🎉 Congratulations! You Won! 🎉</Alert>
        )}
        {status === "lost" && (
          <Alert severity="error">💥 Oh no! You Lost! 💥</Alert>
        )}
      </Box>
      <Box mb={2}>
        {status === "in progress" && (
          <Typography variant="h6">
            Defuse Cards Available: {defuseAvailable}
          </Typography>
        )}
        <Typography variant="h6">Cards Left: {deck.length}</Typography>
      </Box>
      <Box mb={2}>
        {status === "in progress" && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleDraw}
            fullWidth
            sx={{ mb: 2 }}
          >
            Draw Card
          </Button>
        )}
        {status === "not started" && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleStart}
            fullWidth
            sx={{ mb: 2 }}
          >
            Start Game
          </Button>
        )}
      </Box>
      <Typography variant="h5" gutterBottom>
        Revealed Cards:
      </Typography>
      <Grid container justifyContent="center">
        {revealed.map((card, index) => (
          <Fade in={true} timeout={500} key={index}>
            <MUICard sx={{ minWidth: 100, margin: 1, textAlign: "center" }}>
              <CardContent>
                {renderCardIcon(card)}
                <Typography variant="subtitle1" mt={1}>
                  {getCardName(card)}
                </Typography>
              </CardContent>
            </MUICard>
          </Fade>
        ))}
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

// Helper function to get card name based on emoji
const getCardName = (card) => {
  switch (card) {
    case "😼":
      return "Cat Card";
    case "💣":
      return "Exploding Kitten";
    case "🔀":
      return "Shuffle Card";
    case "🙅‍♂️":
      return "Defuse Card";
    default:
      return "Unknown Card";
  }
};

export default Game;
