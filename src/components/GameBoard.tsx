import React, { useEffect, useRef, useState } from "react";
import PegSolitaire, {
  BoardCoord,
  BoardElement,
  Move,
} from "../mechanics/peg_solitaire";
import { drawTheBoard } from "../utils/drawTheBoard";
import Solver from "../mechanics/solver";

export const maxSize = 7;
export const pegRadius = 20;
export const spacing = 10;

const pegsLeftCriteria = 4; // Will lag the whole program if too low with too many pieces...

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedPeg, setSelectedPeg] = useState<BoardCoord | null>(null);
  const [changeBoardMode, setChangeBoardMode] = useState<boolean>(false);
  const [changePegsMode, setChangePegsMode] = useState<boolean>(false);

  const [sequence, setSequence] = useState<Move[] | null>(null);
  const [playSequenceMode, setPlaySequenceMode] = useState<boolean>(false);

  const gameInstance = new PegSolitaire();
  const [board, setBoard] = useState(gameInstance.getBoard());

  const [isSolving, setIsSolving] = useState<boolean>(false);

  useEffect(() => {
    drawTheBoard(canvasRef, board, selectedPeg);
  }, [board, selectedPeg]);

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isSolving) {
      return;
    }
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

    // Check if within circle
    if (Math.sqrt((y - y_centered) ** 2 + (x - x_centered) ** 2) <= pegRadius) {
      setPlaySequenceMode(false);
      if (changeBoardMode) {
        gameInstance.toggleRestricted({ x: x_index, y: y_index });
        const board_copy = gameInstance.getBoard().slice();
        setSequence(null);
        setBoard(board_copy);
        return;
      } else if (changePegsMode) {
        gameInstance.toggleBall({ x: x_index, y: y_index });
        const board_copy = gameInstance.getBoard().slice();
        setSequence(null);
        setBoard(board_copy);
        return;
      }

      // Normal play
      if (board[y_index][x_index] === BoardElement.Ball) {
        setSelectedPeg({ x: x_index, y: y_index });
        return;
      } else if (
        selectedPeg !== null &&
        board[y_index][x_index] === BoardElement.Empty
      ) {
        if (
          gameInstance.checkIfEligibleMove({
            from: selectedPeg,
            to: { x: x_index, y: y_index },
          }) &&
          gameInstance.checkLegalityOfEligibleMove({
            from: selectedPeg,
            to: { x: x_index, y: y_index },
          })
        ) {
          gameInstance.doMove({
            from: selectedPeg,
            to: { x: x_index, y: y_index },
          });
          const board_copy = gameInstance.getBoard().slice();
          setSequence(null);
          setBoard(board_copy);
          setSelectedPeg(null);
          return;
        }
      }
    }
    setSelectedPeg(null);
  };

  useEffect(() => {
    const playSequence = async () => {
      if (sequence === null) {
        setPlaySequenceMode(false);
        return;
      }
      for (let i = 0; i < sequence.length; i++) {
        const move = sequence[i];
        setSelectedPeg(move.from);
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
        await sleep(1000);
        if (
          gameInstance.checkIfEligibleMove({
            from: move.from,
            to: move.to,
          }) &&
          gameInstance.checkLegalityOfEligibleMove({
            from: move.from,
            to: move.to,
          }) &&
          playSequenceMode &&
          sequence !== null
        ) {
          gameInstance.doMove({
            from: move.from,
            to: move.to,
          });
        } else {
          return;
        }
      }
      if (playSequenceMode) {
        setPlaySequenceMode(false);
      }
    };

    playSequence();
  }, [playSequenceMode]);

  const findSolution = () => {
    const start = new Date().getTime();

    const board_copy = JSON.parse(JSON.stringify(board));
    const copyOfCurrentGameInstance = new PegSolitaire(
      gameInstance.getWidth(),
      gameInstance.getHeight(),
      board_copy
    );
    const newSolverInstance = new Solver(
      copyOfCurrentGameInstance,
      pegsLeftCriteria
    );
    newSolverInstance.solveGame();

    console.log("Solving time: ", new Date().getTime() - start);

    setSequence(newSolverInstance.getSolution());
    setIsSolving(false);
  };

  return (
    <>
      <div>
        <button
          disabled={isSolving}
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
          disabled={isSolving}
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
        <button
          disabled={isSolving}
          style={{
            color: "black",
            margin: 4,
            backgroundColor: playSequenceMode ? "green" : "white",
          }}
          onClick={() => {
            setPlaySequenceMode(true);
          }}
        >
          Play sequence
        </button>
        <button
          disabled={isSolving}
          style={{
            color: "black",
            margin: 4,
            backgroundColor: isSolving ? "green" : "white",
          }}
          onClick={() => {
            setIsSolving(true);
            findSolution();
          }}
        >
          Find solution for pegs left criteria: {pegsLeftCriteria}
        </button>
      </div>
      <div>
        {sequence?.map((move, index) => {
          return (
            <p key={index}>
              {" "}
              Move number {(index + 1).toString()}: {JSON.stringify(move)}{" "}
            </p>
          );
        })}
      </div>
    </>
  );
};

export default Game;
