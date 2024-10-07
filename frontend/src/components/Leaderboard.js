// frontend/src/components/Leaderboard.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaderboard } from "../redux/userSlice";
import io from "socket.io-client";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";

let socket;

const Leaderboard = () => {
  const dispatch = useDispatch();
  const leaderboard = useSelector((state) => state.user.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboard());

    socket = io();

    socket.on("leaderboardUpdate", (data) => {
      dispatch({ type: "user/fetchLeaderboard/fulfilled", payload: data });
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>
        Leaderboard
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="leaderboard table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Rank</TableCell>
              <TableCell align="center">Username</TableCell>
              <TableCell align="center">Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.map((user, index) => (
              <TableRow key={user.username}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{user.username}</TableCell>
                <TableCell align="center">{user.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Leaderboard;
