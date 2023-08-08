import React, { useEffect, useRef, useState } from "react";

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
  // Define the game board (1 for peg, 0 for empty)
  const [board, setBoard] = useState([
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
  ]);

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

  function updateBoardSomeWhat() {
    const rand_x = getRandomInt(0, board[0].length - 1);
    const rand_y = getRandomInt(0, board.length - 1);
    const board_copy = board.slice();
    board_copy[rand_y][rand_x] === 1
      ? (board_copy[rand_y][rand_x] = 0)
      : (board_copy[rand_y][rand_x] = 1);
    setBoard(board_copy);
  }

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    console.log("handleClick called!");
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    const x = event.clientX - (rect?.left || 0);
    const y = event.clientY - (rect?.top || 0);
    console.log("x coord: ", x, ".\ny coord: ", y);
    const rectangleSide = 2 * pegRadius + spacing;

    const x_index = Math.floor((x + spacing / 2) / rectangleSide);
    const y_index = Math.floor((y + spacing / 2) / rectangleSide);
    console.log("x_index: ", x_index, ".\ny_index: ", y_index);
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
    if (
      Math.sqrt((y - y_centered) ** 2 + (x - x_centered) ** 2) <= pegRadius &&
      board[y_index][x_index] === 1
    ) {
      setSelectedPeg({ x: x_index, y: y_index });
      console.log("selected_peg set:", { x: x_index, y: y_index });
      return;
    }
    setSelectedPeg(null);
  };

  return (
    <div>
      <button onClick={updateBoardSomeWhat}> Change random peg </button>
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
