// frontend/src/redux/gameSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to save game state
export const saveGameState = createAsyncThunk(
  "game/saveGameState",
  async ({ username, gameState }, thunkAPI) => {
    try {
      const response = await axios.post("/api/save-game", {
        username,
        gameState,
      });
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk to load game state
export const loadGameState = createAsyncThunk(
  "game/loadGameState",
  async (username, thunkAPI) => {
    try {
      const response = await axios.get(`/api/load-game/${username}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const initialDeck = ["😼", "🙅‍♂️", "🔀", "💣", "😼"]; // Initial cards, can be randomized

const gameSlice = createSlice({
  name: "game",
  initialState: {
    deck: [],
    revealed: [],
    defuseAvailable: 0,
    status: "not started",
    error: null,
    gameWon: false,
    gameLost: false,
  },
  reducers: {
    startGame: (state) => {
      state.deck = shuffle([...initialDeck]);
      state.revealed = [];
      state.defuseAvailable = 0;
      state.status = "in progress";
      state.gameWon = false;
      state.gameLost = false;
    },
    drawCard: (state) => {
      if (state.deck.length === 0) {
        state.status = "won";
        state.gameWon = true;
        return;
      }
      const card = state.deck.pop();
      state.revealed.push(card);
      if (card === "😼") {
        // Cat card, removed from deck
      } else if (card === "💣") {
        if (state.defuseAvailable > 0) {
          state.defuseAvailable -= 1;
        } else {
          state.status = "lost";
          state.gameLost = true;
        }
      } else if (card === "🙅‍♂️") {
        // Defuse card
        state.defuseAvailable += 1;
      } else if (card === "🔀") {
        state.status = "not started";
        state.deck = shuffle([...initialDeck]);
        state.revealed = [];
        state.defuseAvailable = 0;
        state.gameWon = false;
        state.gameLost = false;
      }

      if (state.deck.length === 0 && state.status !== "lost") {
        state.status = "won";
        state.gameWon = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveGameState.fulfilled, (state, action) => {})
      .addCase(saveGameState.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(loadGameState.fulfilled, (state, action) => {
        if (action.payload) {
          state.deck = action.payload.deck;
          state.revealed = action.payload.revealed;
          state.defuseAvailable = action.payload.defuseAvailable;
          state.status = action.payload.status;
          state.gameWon = action.payload.gameWon;
          state.gameLost = action.payload.gameLost;
        }
      })
      .addCase(loadGameState.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Helper function to shuffle an array
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export const { startGame, drawCard } = gameSlice.actions;
export default gameSlice.reducer;
