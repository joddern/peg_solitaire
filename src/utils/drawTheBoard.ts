import { pegRadius, spacing } from "../components/GameBoard";
import { BoardCoord, BoardElement } from "../mechanics/peg_solitaire";

export const drawTheBoard = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  board: BoardElement[][],
  selectedPeg: BoardCoord | null
) => {
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");

  if (ctx) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas?.width ?? 0, canvas?.height ?? 0);

    // Draw the pegs
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] !== BoardElement.Restricted) {
          const x = col * (pegRadius * 2 + spacing) + pegRadius + spacing;
          const y = row * (pegRadius * 2 + spacing) + pegRadius + spacing;
          ctx.beginPath();
          ctx.arc(x, y, pegRadius, 0, Math.PI * 2, false);
          ctx.fillStyle = "blue";
          ctx.fill();
          ctx.closePath();
          if (board[row][col] === BoardElement.Empty) {
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
};
