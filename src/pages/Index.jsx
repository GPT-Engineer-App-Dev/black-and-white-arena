import React, { useState } from "react";
import { Box, Button, Grid, Heading, Text } from "@chakra-ui/react";

const BOARD_SIZE = 8;

const Index = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [currentPlayer, setCurrentPlayer] = useState("black");

  function initializeBoard() {
    const board = Array(BOARD_SIZE)
      .fill()
      .map(() => Array(BOARD_SIZE).fill(null));
    board[3][3] = board[4][4] = "white";
    board[3][4] = board[4][3] = "black";
    return board;
  }

  function isValidMove(row, col) {
    if (board[row][col]) return false;

    const opponent = currentPlayer === "black" ? "white" : "black";
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (let [dx, dy] of directions) {
      let x = row + dx,
        y = col + dy;
      let hasOpponent = false;

      while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
        if (!board[x][y]) break;
        if (board[x][y] === currentPlayer) {
          if (hasOpponent) return true;
          break;
        }
        hasOpponent = true;
        x += dx;
        y += dy;
      }
    }

    return false;
  }

  function placePiece(row, col) {
    if (!isValidMove(row, col)) return;

    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = currentPlayer;

    const opponent = currentPlayer === "black" ? "white" : "black";
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (let [dx, dy] of directions) {
      let x = row + dx,
        y = col + dy;
      const flipped = [];

      while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
        if (!board[x][y]) break;
        if (board[x][y] === currentPlayer) {
          flipped.forEach(([fx, fy]) => {
            newBoard[fx][fy] = currentPlayer;
          });
          break;
        }
        flipped.push([x, y]);
        x += dx;
        y += dy;
      }
    }

    setBoard(newBoard);
    setCurrentPlayer(opponent);
  }

  function hasValidMoves() {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (isValidMove(row, col)) return true;
      }
    }
    return false;
  }

  function passTurn() {
    setCurrentPlayer(currentPlayer === "black" ? "white" : "black");
  }

  return (
    <Box p={4}>
      <Heading mb={4}>Othello</Heading>
      <Text mb={4}>Current Player: {currentPlayer}</Text>
      <Grid templateColumns={`repeat(${BOARD_SIZE}, 1fr)`} gap={1} mb={4}>
        {board.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <Box key={`${rowIdx}-${colIdx}`} w="50px" h="50px" bg="green.500" borderRadius="md" display="flex" justifyContent="center" alignItems="center" onClick={() => placePiece(rowIdx, colIdx)} cursor="pointer">
              {cell && <Box w="80%" h="80%" borderRadius="50%" bg={cell === "black" ? "black" : "white"} />}
            </Box>
          )),
        )}
      </Grid>
      {!hasValidMoves() && (
        <Button onClick={passTurn} colorScheme="blue">
          Pass
        </Button>
      )}
    </Box>
  );
};

export default Index;
