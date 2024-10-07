// frontend/src/components/Login.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/userSlice";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  Box,
} from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.error);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      dispatch(loginUser(username));
    }
  };

  return (
    <Box display="flex" justifyContent="center">
      <Paper elevation={3} sx={{ padding: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to Exploding Kittens
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{ mt: 2 }}
          >
            Start Game
          </Button>
        </form>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default Login;
