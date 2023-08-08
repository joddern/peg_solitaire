import React, { useEffect, useRef, useState } from "react";
import { getRandomInt } from "../utils/gameboard";

const maxSize = 7;
const pegRadius = 20;
const spacing = 10;

type Coord = {
  x: number;
  y: number;
};

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPeg, setSelectedPeg] = useState<Coord | null>(null);
  // Define the game board (1 for peg, 0 for empty, 2 for restricted field)
  const [board, setBoard] = useState([
    [2, 2, 1, 1, 1, 2, 2],
    [2, 2, 1, 1, 1, 2, 2],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [2, 2, 1, 1, 1, 2, 2],
    [2, 2, 1, 1, 1, 2, 2],
  ]);
  const [changeBoardMode, setChangeBoardMode] = useState<boolean>(false);
  const [changePegsMode, setChangePegsMode] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas?.width ?? 0, canvas?.height ?? 0);

      // Draw the pegs
      for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
          if (board[row][col] === 0 || board[row][col] === 1) {
            const x = col * (pegRadius * 2 + spacing) + pegRadius + spacing;
            const y = row * (pegRadius * 2 + spacing) + pegRadius + spacing;
            ctx.beginPath();
            ctx.arc(x, y, pegRadius, 0, Math.PI * 2, false);
            ctx.fillStyle = "blue";
            ctx.fill();
            ctx.closePath();
            if (board[row][col] === 0) {
              ctx.beginPath();
              ctx.arc(x, y, pegRadius - 1, 0, Math.PI * 2, false);
              ctx.fillStyle = "white";
              ctx.fill();
              ctx.closePath();
            } else if (selectedPeg?.x === col && selectedPeg?.y === row) {
              ctx.beginPath();
              ctx.arc(x, y, 5, 0, Math.PI * 2, false);
              ctx.fillStyle = "yellow";
              ctx.fill();
              ctx.closePath();
            }
          }
        }
      }
    }
  }, [board, selectedPeg]);

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    const x = event.clientX - (rect?.left || 0);
    const y = event.clientY - (rect?.top || 0);
    const rectangleSide = 2 * pegRadius + spacing;

    const x_index = Math.floor((x + spacing / 2) / rectangleSide);
    const y_index = Math.floor((y + spacing / 2) / rectangleSide);

    if (
      x_index < 0 ||
      x_index >= board[0].length ||
      y_index < 0 ||
      y_index >= board.length
    ) {
      setSelectedPeg(null);
      return;
    }

    const x_centered =
      spacing + pegRadius + x_index * (2 * pegRadius + spacing);
    const y_centered =
      spacing + pegRadius + y_index * (2 * pegRadius + spacing);

    // Check if within circle and that there is a peg in the circle
    if (Math.sqrt((y - y_centered) ** 2 + (x - x_centered) ** 2) <= pegRadius) {
      if (changeBoardMode) {
        const board_copy = board.slice();
        if (
          board_copy[y_index][x_index] === 1 ||
          board_copy[y_index][x_index] === 0
        ) {
          board_copy[y_index][x_index] = 2;
        } else if (board_copy[y_index][x_index] === 2) {
          board_copy[y_index][x_index] = 1;
        }
        setBoard(board_copy);
        return;
      } else if (changePegsMode) {
        const board_copy = board.slice();
        if (board_copy[y_index][x_index] === 1) {
          board_copy[y_index][x_index] = 0;
        } else if (board_copy[y_index][x_index] === 0) {
          board_copy[y_index][x_index] = 1;
        }
        setBoard(board_copy);
        return;
      }

      // Normal play
      if (board[y_index][x_index] === 1) {
        setSelectedPeg({ x: x_index, y: y_index });
        console.log("selected_peg set:", { x: x_index, y: y_index });
        return;
      }
    }
    setSelectedPeg(null);
  };

  return (
    <div>
      <button
        className="ml-12 mr-12 mt-12 mb-12"
        style={{
          color: "black",
          margin: 4,
          backgroundColor: changeBoardMode ? "green" : "white",
        }}
        onClick={() => {
          setChangeBoardMode(!changeBoardMode);
          setChangePegsMode(false);
        }}
      >
        Change board layout
      </button>
      <button
        className="ml-10 mr-12 mt-12 mb-12"
        style={{
          color: "black",
          margin: 4,
          backgroundColor: changePegsMode ? "green" : "white",
        }}
        onClick={() => {
          setChangePegsMode(!changePegsMode);
          setChangeBoardMode(false);
        }}
      >
        Add or remove pegs
      </button>
      <canvas
        ref={canvasRef}
        width={(maxSize + 1) * spacing + 2 * maxSize * pegRadius}
        height={(maxSize + 1) * spacing + 2 * maxSize * pegRadius}
        onClick={handleClick}
      ></canvas>
    </div>
  );
};

export default Game;
