import PegSolitaire, { BoardElement, Move } from "./peg_solitaire";

export default class Solver {
  private gameBoard: PegSolitaire;
  private solutionSet: Move[];
  private unsolvablePositions: Set<string>;
  private ballsThreshold: number;
  private boardBallCount: number;
  private creationTime: number;

  private possibleMoves: Move[];

  private movesCounter: number;

  constructor(gameBoard: PegSolitaire, ballsThreshold: number) {
    this.gameBoard = gameBoard;
    this.solutionSet = [];
    this.unsolvablePositions = new Set<string>();
    this.ballsThreshold = ballsThreshold;
    this.boardBallCount = gameBoard.countBalls();
    this.creationTime = new Date().getTime();

    this.possibleMoves = gameBoard.findLegalMoves();

    this.movesCounter = 0;
  }

  // Solver function must:
  // Find all possible moves right now:
  // - for each of these moves, play it, then recursively look for new moves
  // Stop if there is only a few balls left.
  // When there there are no possible moves, check how many balls are left
  // No moves then remove the last done move

  addMove(move: Move) {
    this.gameBoard.doMove(move);
    this.solutionSet.push(move);
  }

  removeMove(move: Move) {
    this.gameBoard.undoMove(move);
    this.solutionSet.pop(); // Only removes last, good enough?
  }

  solveGame(): boolean {
    // Check how many balls left after a move
    if (this.boardBallCount <= this.ballsThreshold) return true;

    // Check if this position is unsolvable
    if (this.unsolvablePositions.has(JSON.stringify(this.gameBoard))) {
      return false;
    }

    while (this.possibleMoves.length > 0) {
      const currentMove: Move = this.possibleMoves.pop() as Move;
      this.addMove(currentMove);
      this.findDirectionAndUpdateOnExecuted(currentMove);
      this.boardBallCount--;
      // console.log(this.movesCounter++);

      // Since there are more balls left and possible moves, reccur
      const gameSolved: boolean = this.solveGame();
      if (gameSolved) return true;

      // If the game has returned not true, then go back one step
      this.removeMove(currentMove);
      this.findDirectionAndUpdateOnRemoved(currentMove);
      this.boardBallCount++;
    }

    // If all moves are checked, none returned true games, then return further
    // TODO:
    // This should also add a board to unSolvableBoard.

    this.unsolvablePositions.add(JSON.stringify(this.gameBoard.getBoard()));

    return false;
  }

  getSolution(): Move[] {
    return this.solutionSet;
  }

  printSolutionSet(): void {
    console.log(this.solutionSet);
  }

  // NEW FUNCTIONS

  findDirectionAndUpdateOnExecuted(move: Move) {
    if (move.to.x - move.from.x > 0) {
      this.updatePossibleMovesBasedOnExecutedMoveRight(move);
    } else if (move.to.x - move.from.x < 0) {
      this.updatePossibleMovesBasedOnExecutedMoveLeft(move);
    } else if (move.to.y - move.from.y > 0) {
      this.updatePossibleMovesBasedOnExecutedMoveDown(move);
    } else if (move.to.y - move.from.y < 0) {
      this.updatePossibleMovesBasedOnExecutedMoveUp(move);
    }
  }

  findDirectionAndUpdateOnRemoved(move: Move) {
    if (move.to.x - move.from.x > 0) {
      this.updatePossibleMovesBasedOnRemovedMoveRight(move);
    } else if (move.to.x - move.from.x < 0) {
      this.updatePossibleMovesBasedOnRemovedMoveLeft(move);
    } else if (move.to.y - move.from.y > 0) {
      this.updatePossibleMovesBasedOnRemovedMoveDown(move);
    } else if (move.to.y - move.from.y < 0) {
      this.updatePossibleMovesBasedOnRemovedMoveUp(move);
    }
  }

  findSurroundingCoordsOfMove(move: Move) {
    if (move.to.x - move.from.x > 0) {
      // Right move
      const fromCoord = move.from;
      const betweenCoord = {
        x: move.from.x + 1,
        y: move.from.y,
      };
      const toCoord = move.to;

      const a1 = { x: fromCoord.x, y: fromCoord.y - 1 };
      const b1 = { x: fromCoord.x, y: fromCoord.y + 1 };
      const c1 = { x: fromCoord.x - 1, y: fromCoord.y };
      const d1 = { x: betweenCoord.x, y: betweenCoord.y - 1 };
      const e1 = { x: betweenCoord.x, y: betweenCoord.y + 1 };
      const f1 = { x: toCoord.x + 1, y: toCoord.y };
      const g1 = { x: toCoord.x, y: toCoord.y - 1 };
      const h1 = { x: toCoord.x, y: toCoord.y + 1 };

      const a2 = { x: fromCoord.x, y: fromCoord.y - 2 };
      const b2 = { x: fromCoord.x, y: fromCoord.y + 2 };
      const c2 = { x: fromCoord.x - 2, y: fromCoord.y };
      const d2 = { x: betweenCoord.x, y: betweenCoord.y - 2 };
      const e2 = { x: betweenCoord.x, y: betweenCoord.y + 2 };
      const f2 = { x: toCoord.x + 2, y: toCoord.y };
      const g2 = { x: toCoord.x, y: toCoord.y - 2 };
      const h2 = { x: toCoord.x, y: toCoord.y + 2 };
    } else if (move.to.x - move.from.x < 0) {
      // Left move
      const fromCoord = move.from;
      const betweenCoord = {
        x: move.from.x - 1,
        y: move.from.y,
      };
      const toCoord = move.to;

      const a1 = { x: fromCoord.x, y: fromCoord.y + 1 };
      const b1 = { x: fromCoord.x, y: fromCoord.y - 1 };
      const c1 = { x: fromCoord.x + 1, y: fromCoord.y };
      const d1 = { x: betweenCoord.x, y: betweenCoord.y + 1 };
      const e1 = { x: betweenCoord.x, y: betweenCoord.y - 1 };
      const f1 = { x: toCoord.x - 1, y: toCoord.y };
      const g1 = { x: toCoord.x, y: toCoord.y + 1 };
      const h1 = { x: toCoord.x, y: toCoord.y - 1 };

      const a2 = { x: fromCoord.x, y: fromCoord.y + 2 };
      const b2 = { x: fromCoord.x, y: fromCoord.y - 2 };
      const c2 = { x: fromCoord.x + 2, y: fromCoord.y };
      const d2 = { x: betweenCoord.x, y: betweenCoord.y + 2 };
      const e2 = { x: betweenCoord.x, y: betweenCoord.y - 2 };
      const f2 = { x: toCoord.x - 2, y: toCoord.y };
      const g2 = { x: toCoord.x, y: toCoord.y + 2 };
      const h2 = { x: toCoord.x, y: toCoord.y - 2 };
    } else if (move.to.y - move.from.y > 0) {
      // Down move
      const fromCoord = move.from;
      const betweenCoord = {
        x: move.from.x,
        y: move.from.y + 1,
      };
      const toCoord = move.to;

      const a1 = { x: fromCoord.x + 1, y: fromCoord.y };
      const b1 = { x: fromCoord.x - 1, y: fromCoord.y };
      const c1 = { x: fromCoord.x, y: fromCoord.y - 1 };
      const d1 = { x: betweenCoord.x + 1, y: betweenCoord.y };
      const e1 = { x: betweenCoord.x - 1, y: betweenCoord.y };
      const f1 = { x: toCoord.x, y: toCoord.y + 1 };
      const g1 = { x: toCoord.x + 1, y: toCoord.y };
      const h1 = { x: toCoord.x - 1, y: toCoord.y };

      const a2 = { x: fromCoord.x + 2, y: fromCoord.y };
      const b2 = { x: fromCoord.x - 2, y: fromCoord.y };
      const c2 = { x: fromCoord.x, y: fromCoord.y - 2 };
      const d2 = { x: betweenCoord.x + 2, y: betweenCoord.y };
      const e2 = { x: betweenCoord.x - 2, y: betweenCoord.y };
      const f2 = { x: toCoord.x, y: toCoord.y + 2 };
      const g2 = { x: toCoord.x + 2, y: toCoord.y };
      const h2 = { x: toCoord.x - 2, y: toCoord.y };
    } else if (move.to.y - move.from.y < 0) {
      // Up move
      const fromCoord = move.from;
      const betweenCoord = {
        x: move.from.x,
        y: move.from.y - 1,
      };
      const toCoord = move.to;

      const a1 = { x: fromCoord.x - 1, y: fromCoord.y };
      const b1 = { x: fromCoord.x + 1, y: fromCoord.y };
      const c1 = { x: fromCoord.x, y: fromCoord.y + 1 };
      const d1 = { x: betweenCoord.x - 1, y: betweenCoord.y };
      const e1 = { x: betweenCoord.x + 1, y: betweenCoord.y };
      const f1 = { x: toCoord.x, y: toCoord.y - 1 };
      const g1 = { x: toCoord.x - 1, y: toCoord.y };
      const h1 = { x: toCoord.x + 1, y: toCoord.y };

      const a2 = { x: fromCoord.x - 2, y: fromCoord.y };
      const b2 = { x: fromCoord.x + 2, y: fromCoord.y };
      const c2 = { x: fromCoord.x, y: fromCoord.y + 2 };
      const d2 = { x: betweenCoord.x - 2, y: betweenCoord.y };
      const e2 = { x: betweenCoord.x + 2, y: betweenCoord.y };
      const f2 = { x: toCoord.x, y: toCoord.y - 2 };
      const g2 = { x: toCoord.x - 2, y: toCoord.y };
      const h2 = { x: toCoord.x + 2, y: toCoord.y };
    }
  }

  updatePossibleMovesBasedOnExecutedMoveDown(move: Move) {
    const board = this.gameBoard.getBoard();
    const fromCoord = move.from;
    const betweenCoord = {
      x: move.from.x,
      y: move.from.y + 1,
    };
    const toCoord = move.to;

    const a1 = { x: fromCoord.x + 1, y: fromCoord.y };
    const b1 = { x: fromCoord.x - 1, y: fromCoord.y };
    const c1 = { x: fromCoord.x, y: fromCoord.y - 1 };
    const d1 = { x: betweenCoord.x + 1, y: betweenCoord.y };
    const e1 = { x: betweenCoord.x - 1, y: betweenCoord.y };
    const f1 = { x: toCoord.x, y: toCoord.y + 1 };
    const g1 = { x: toCoord.x + 1, y: toCoord.y };
    const h1 = { x: toCoord.x - 1, y: toCoord.y };

    // 1
    if (board[a1.y] !== undefined && board[a1.y][a1.x] === BoardElement.Ball) {
      const a2 = { x: fromCoord.x + 2, y: fromCoord.y };

      if (
        board[a2.y] !== undefined &&
        board[a2.y][a2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: a2,
          to: fromCoord,
        });
      } else if (
        board[a2.y] !== undefined &&
        board[a2.y][a2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: fromCoord,
            to: a2,
          }),
          1
        );
      }

      // 2
      if (
        board[b1.y] !== undefined &&
        board[b1.y][b1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: a1,
            to: b1,
          }),
          1
        );
      }
    }

    // 2
    if (board[b1.y] !== undefined && board[b1.y][b1.x] === BoardElement.Ball) {
      const b2 = { x: fromCoord.x - 2, y: fromCoord.y };

      if (
        board[b2.y] !== undefined &&
        board[b2.y][b2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: b2,
          to: fromCoord,
        });
      } else if (
        board[b2.y] !== undefined &&
        board[b2.y][b2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: fromCoord,
            to: b2,
          }),
          1
        );
      }

      // 1
      if (
        board[a1.y] !== undefined &&
        board[a1.y][a1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: b1,
            to: a1,
          }),
          1
        );
      }
    }

    // 3
    if (board[c1.y] !== undefined && board[c1.y][c1.x] === BoardElement.Ball) {
      const c2 = { x: fromCoord.x, y: fromCoord.y - 2 };

      if (
        board[c2.y] !== undefined &&
        board[c2.y][c2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: c2,
          to: fromCoord,
        });
      } else if (
        board[c2.y] !== undefined &&
        board[c2.y][c2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: fromCoord,
            to: c2,
          }),
          1
        );
      }
    } else if (
      board[c1.y] !== undefined &&
      board[c1.y][c1.x] === BoardElement.Empty
    ) {
      this.possibleMoves.splice(
        this.possibleMoves.indexOf({
          from: betweenCoord,
          to: c1,
        }),
        1
      );
    }

    // 4
    if (board[d1.y] !== undefined && board[d1.y][d1.x] === BoardElement.Ball) {
      const d2 = { x: betweenCoord.x + 2, y: betweenCoord.y };

      if (
        board[d2.y] !== undefined &&
        board[d2.y][d2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: d2,
          to: betweenCoord,
        });
      } else if (
        board[d2.y] !== undefined &&
        board[d2.y][d2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: betweenCoord,
            to: d2,
          }),
          1
        );
      }

      // 5
      if (
        board[e1.y] !== undefined &&
        board[e1.y][e1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: d1,
            to: e1,
          }),
          1
        );
      }
    }

    // 5
    if (board[e1.y] !== undefined && board[e1.y][e1.x] === BoardElement.Ball) {
      const e2 = { x: betweenCoord.x - 2, y: betweenCoord.y };

      if (
        board[e2.y] !== undefined &&
        board[e2.y][e2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: e2,
          to: betweenCoord,
        });
      } else if (
        board[e2.y] !== undefined &&
        board[e2.y][e2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: betweenCoord,
            to: e2,
          }),
          1
        );
      }

      // 4
      if (
        board[d1.y] !== undefined &&
        board[d1.y][d1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: e1,
            to: d1,
          }),
          1
        );
      }
    }

    // 6
    if (board[f1.y] !== undefined && board[f1.y][f1.x] === BoardElement.Ball) {
      this.possibleMoves.push({
        from: f1,
        to: betweenCoord,
      });
      const f2 = { x: toCoord.x, y: toCoord.y + 2 };

      if (
        board[f2.y] !== undefined &&
        board[f2.y][f2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: toCoord,
          to: f2,
        });
      } else if (
        board[f2.y] !== undefined &&
        board[f2.y][f2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: f2,
            to: toCoord,
          }),
          1
        );
      }
    }

    // 7
    if (board[g1.y] !== undefined && board[g1.y][g1.x] === BoardElement.Ball) {
      const g2 = { x: toCoord.x + 2, y: toCoord.y };

      if (
        board[g2.y] !== undefined &&
        board[g2.y][g2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: g2,
            to: toCoord,
          }),
          1
        );
      } else if (
        board[g2.y] !== undefined &&
        board[g2.y][g2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: toCoord,
          to: g2,
        });
      }

      // 8
      if (
        board[h1.y] !== undefined &&
        board[h1.y][h1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: g1,
          to: h1,
        });
      }
    }

    // 8
    if (board[h1.y] !== undefined && board[h1.y][h1.x] === BoardElement.Ball) {
      const h2 = { x: toCoord.x - 2, y: toCoord.y };

      if (
        board[h2.y] !== undefined &&
        board[h2.y][h2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: h2,
            to: toCoord,
          }),
          1
        );
      } else if (
        board[h2.y] !== undefined &&
        board[h2.y][h2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: toCoord,
          to: h2,
        });
      }

      // 7
      if (
        board[g1.y] !== undefined &&
        board[g1.y][g1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: h1,
          to: g1,
        });
      }
    }
  }

  updatePossibleMovesBasedOnExecutedMoveUp(move: Move) {
    const board = this.gameBoard.getBoard();
    const fromCoord = move.from;
    const betweenCoord = {
      x: move.from.x,
      y: move.from.y - 1,
    };
    const toCoord = move.to;

    const a1 = { x: fromCoord.x - 1, y: fromCoord.y };
    const b1 = { x: fromCoord.x + 1, y: fromCoord.y };
    const c1 = { x: fromCoord.x, y: fromCoord.y + 1 };
    const d1 = { x: betweenCoord.x - 1, y: betweenCoord.y };
    const e1 = { x: betweenCoord.x + 1, y: betweenCoord.y };
    const f1 = { x: toCoord.x, y: toCoord.y - 1 };
    const g1 = { x: toCoord.x - 1, y: toCoord.y };
    const h1 = { x: toCoord.x + 1, y: toCoord.y };

    // 1
    if (board[a1.y] !== undefined && board[a1.y][a1.x] === BoardElement.Ball) {
      const a2 = { x: fromCoord.x - 2, y: fromCoord.y };

      if (
        board[a2.y] !== undefined &&
        board[a2.y][a2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: a2,
          to: fromCoord,
        });
      } else if (
        board[a2.y] !== undefined &&
        board[a2.y][a2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: fromCoord,
            to: a2,
          }),
          1
        );
      }

      // 2
      if (
        board[b1.y] !== undefined &&
        board[b1.y][b1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: a1,
            to: b1,
          }),
          1
        );
      }
    }

    // 2
    if (board[b1.y] !== undefined && board[b1.y][b1.x] === BoardElement.Ball) {
      const b2 = { x: fromCoord.x + 2, y: fromCoord.y };

      if (
        board[b2.y] !== undefined &&
        board[b2.y][b2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: b2,
          to: fromCoord,
        });
      } else if (
        board[b2.y] !== undefined &&
        board[b2.y][b2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: fromCoord,
            to: b2,
          }),
          1
        );
      }

      // 1
      if (
        board[a1.y] !== undefined &&
        board[a1.y][a1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: b1,
            to: a1,
          }),
          1
        );
      }
    }

    // 3
    if (board[c1.y] !== undefined && board[c1.y][c1.x] === BoardElement.Ball) {
      const c2 = { x: fromCoord.x, y: fromCoord.y + 2 };

      if (
        board[c2.y] !== undefined &&
        board[c2.y][c2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: c2,
          to: fromCoord,
        });
      } else if (
        board[c2.y] !== undefined &&
        board[c2.y][c2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: fromCoord,
            to: c2,
          }),
          1
        );
      }
    } else if (
      board[c1.y] !== undefined &&
      board[c1.y][c1.x] === BoardElement.Empty
    ) {
      this.possibleMoves.splice(
        this.possibleMoves.indexOf({
          from: betweenCoord,
          to: c1,
        }),
        1
      );
    }

    // 4
    if (board[d1.y] !== undefined && board[d1.y][d1.x] === BoardElement.Ball) {
      const d2 = { x: betweenCoord.x - 2, y: betweenCoord.y };

      if (
        board[d2.y] !== undefined &&
        board[d2.y][d2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: d2,
          to: betweenCoord,
        });
      } else if (
        board[d2.y] !== undefined &&
        board[d2.y][d2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: betweenCoord,
            to: d2,
          }),
          1
        );
      }

      // 5
      if (
        board[e1.y] !== undefined &&
        board[e1.y][e1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: d1,
            to: e1,
          }),
          1
        );
      }
    }

    // 5
    if (board[e1.y] !== undefined && board[e1.y][e1.x] === BoardElement.Ball) {
      const e2 = { x: betweenCoord.x + 2, y: betweenCoord.y };

      if (
        board[e2.y] !== undefined &&
        board[e2.y][e2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: e2,
          to: betweenCoord,
        });
      } else if (
        board[e2.y] !== undefined &&
        board[e2.y][e2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: betweenCoord,
            to: e2,
          }),
          1
        );
      }

      // 4
      if (
        board[d1.y] !== undefined &&
        board[d1.y][d1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: e1,
            to: d1,
          }),
          1
        );
      }
    }

    // 6
    if (board[f1.y] !== undefined && board[f1.y][f1.x] === BoardElement.Ball) {
      this.possibleMoves.push({
        from: f1,
        to: betweenCoord,
      });
      const f2 = { x: toCoord.x, y: toCoord.y - 2 };

      if (
        board[f2.y] !== undefined &&
        board[f2.y][f2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: toCoord,
          to: f2,
        });
      } else if (
        board[f2.y] !== undefined &&
        board[f2.y][f2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: f2,
            to: toCoord,
          }),
          1
        );
      }
    }

    // 7
    if (board[g1.y] !== undefined && board[g1.y][g1.x] === BoardElement.Ball) {
      const g2 = { x: toCoord.x - 2, y: toCoord.y };

      if (
        board[g2.y] !== undefined &&
        board[g2.y][g2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: g2,
            to: toCoord,
          }),
          1
        );
      } else if (
        board[g2.y] !== undefined &&
        board[g2.y][g2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: toCoord,
          to: g2,
        });
      }

      // 8
      if (
        board[h1.y] !== undefined &&
        board[h1.y][h1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: g1,
          to: h1,
        });
      }
    }

    // 8
    if (board[h1.y] !== undefined && board[h1.y][h1.x] === BoardElement.Ball) {
      const h2 = { x: toCoord.x + 2, y: toCoord.y };

      if (
        board[h2.y] !== undefined &&
        board[h2.y][h2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: h2,
            to: toCoord,
          }),
          1
        );
      } else if (
        board[h2.y] !== undefined &&
        board[h2.y][h2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: toCoord,
          to: h2,
        });
      }

      // 7
      if (
        board[g1.y] !== undefined &&
        board[g1.y][g1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: h1,
          to: g1,
        });
      }
    }
  }

  updatePossibleMovesBasedOnExecutedMoveLeft(move: Move) {
    const board = this.gameBoard.getBoard();
    const fromCoord = move.from;
    const betweenCoord = {
      x: move.from.x - 1,
      y: move.from.y,
    };
    const toCoord = move.to;

    const a1 = { x: fromCoord.x, y: fromCoord.y + 1 };
    const b1 = { x: fromCoord.x, y: fromCoord.y - 1 };
    const c1 = { x: fromCoord.x + 1, y: fromCoord.y };
    const d1 = { x: betweenCoord.x, y: betweenCoord.y + 1 };
    const e1 = { x: betweenCoord.x, y: betweenCoord.y - 1 };
    const f1 = { x: toCoord.x - 1, y: toCoord.y };
    const g1 = { x: toCoord.x, y: toCoord.y + 1 };
    const h1 = { x: toCoord.x, y: toCoord.y - 1 };

    // 1
    if (board[a1.y] !== undefined && board[a1.y][a1.x] === BoardElement.Ball) {
      const a2 = { x: fromCoord.x, y: fromCoord.y + 2 };

      if (
        board[a2.y] !== undefined &&
        board[a2.y][a2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: a2,
          to: fromCoord,
        });
      } else if (
        board[a2.y] !== undefined &&
        board[a2.y][a2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: fromCoord,
            to: a2,
          }),
          1
        );
      }

      // 2
      if (
        board[b1.y] !== undefined &&
        board[b1.y][b1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: a1,
            to: b1,
          }),
          1
        );
      }
    }

    // 2
    if (board[b1.y] !== undefined && board[b1.y][b1.x] === BoardElement.Ball) {
      const b2 = { x: fromCoord.x, y: fromCoord.y - 2 };

      if (
        board[b2.y] !== undefined &&
        board[b2.y][b2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: b2,
          to: fromCoord,
        });
      } else if (
        board[b2.y] !== undefined &&
        board[b2.y][b2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: fromCoord,
            to: b2,
          }),
          1
        );
      }

      // 1
      if (
        board[a1.y] !== undefined &&
        board[a1.y][a1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: b1,
            to: a1,
          }),
          1
        );
      }
    }

    // 3
    if (board[c1.y] !== undefined && board[c1.y][c1.x] === BoardElement.Ball) {
      const c2 = { x: fromCoord.x + 2, y: fromCoord.y };

      if (
        board[c2.y] !== undefined &&
        board[c2.y][c2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: c2,
          to: fromCoord,
        });
      } else if (
        board[c2.y] !== undefined &&
        board[c2.y][c2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: fromCoord,
            to: c2,
          }),
          1
        );
      }
    } else if (
      board[c1.y] !== undefined &&
      board[c1.y][c1.x] === BoardElement.Empty
    ) {
      this.possibleMoves.splice(
        this.possibleMoves.indexOf({
          from: betweenCoord,
          to: c1,
        }),
        1
      );
    }

    // 4
    if (board[d1.y] !== undefined && board[d1.y][d1.x] === BoardElement.Ball) {
      const d2 = { x: betweenCoord.x, y: betweenCoord.y + 2 };

      if (
        board[d2.y] !== undefined &&
        board[d2.y][d2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: d2,
          to: betweenCoord,
        });
      } else if (
        board[d2.y] !== undefined &&
        board[d2.y][d2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: betweenCoord,
            to: d2,
          }),
          1
        );
      }

      // 5
      if (
        board[e1.y] !== undefined &&
        board[e1.y][e1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: d1,
            to: e1,
          }),
          1
        );
      }
    }

    // 5
    if (board[e1.y] !== undefined && board[e1.y][e1.x] === BoardElement.Ball) {
      const e2 = { x: betweenCoord.x, y: betweenCoord.y - 2 };

      if (
        board[e2.y] !== undefined &&
        board[e2.y][e2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: e2,
          to: betweenCoord,
        });
      } else if (
        board[e2.y] !== undefined &&
        board[e2.y][e2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: betweenCoord,
            to: e2,
          }),
          1
        );
      }

      // 4
      if (
        board[d1.y] !== undefined &&
        board[d1.y][d1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: e1,
            to: d1,
          }),
          1
        );
      }
    }

    // 6
    if (board[f1.y] !== undefined && board[f1.y][f1.x] === BoardElement.Ball) {
      this.possibleMoves.push({
        from: f1,
        to: betweenCoord,
      });
      const f2 = { x: toCoord.x - 2, y: toCoord.y };

      if (
        board[f2.y] !== undefined &&
        board[f2.y][f2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: toCoord,
          to: f2,
        });
      } else if (
        board[f2.y] !== undefined &&
        board[f2.y][f2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: f2,
            to: toCoord,
          }),
          1
        );
      }
    }

    // 7
    if (board[g1.y] !== undefined && board[g1.y][g1.x] === BoardElement.Ball) {
      const g2 = { x: toCoord.x, y: toCoord.y + 2 };

      if (
        board[g2.y] !== undefined &&
        board[g2.y][g2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: g2,
            to: toCoord,
          }),
          1
        );
      } else if (
        board[g2.y] !== undefined &&
        board[g2.y][g2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: toCoord,
          to: g2,
        });
      }

      // 8
      if (
        board[h1.y] !== undefined &&
        board[h1.y][h1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: g1,
          to: h1,
        });
      }
    }

    // 8
    if (board[h1.y] !== undefined && board[h1.y][h1.x] === BoardElement.Ball) {
      const h2 = { x: toCoord.x, y: toCoord.y - 2 };

      if (
        board[h2.y] !== undefined &&
        board[h2.y][h2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: h2,
            to: toCoord,
          }),
          1
        );
      } else if (
        board[h2.y] !== undefined &&
        board[h2.y][h2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: toCoord,
          to: h2,
        });
      }

      // 7
      if (
        board[g1.y] !== undefined &&
        board[g1.y][g1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: h1,
          to: g1,
        });
      }
    }
  }

  updatePossibleMovesBasedOnExecutedMoveRight(move: Move) {
    const board = this.gameBoard.getBoard();
    const fromCoord = move.from;
    const betweenCoord = {
      x: move.from.x + 1,
      y: move.from.y,
    };
    const toCoord = move.to;

    const a1 = { x: fromCoord.x, y: fromCoord.y - 1 };
    const b1 = { x: fromCoord.x, y: fromCoord.y + 1 };
    const c1 = { x: fromCoord.x - 1, y: fromCoord.y };
    const d1 = { x: betweenCoord.x, y: betweenCoord.y - 1 };
    const e1 = { x: betweenCoord.x, y: betweenCoord.y + 1 };
    const f1 = { x: toCoord.x + 1, y: toCoord.y };
    const g1 = { x: toCoord.x, y: toCoord.y - 1 };
    const h1 = { x: toCoord.x, y: toCoord.y + 1 };

    // 1
    if (board[a1.y] !== undefined && board[a1.y][a1.x] === BoardElement.Ball) {
      const a2 = { x: fromCoord.x, y: fromCoord.y - 2 };

      if (
        board[a2.y] !== undefined &&
        board[a2.y][a2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: a2,
          to: fromCoord,
        });
      } else if (
        board[a2.y] !== undefined &&
        board[a2.y][a2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: fromCoord,
            to: a2,
          }),
          1
        );
      }

      // 2
      if (
        board[b1.y] !== undefined &&
        board[b1.y][b1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: a1,
            to: b1,
          }),
          1
        );
      }
    }

    // 2
    if (board[b1.y] !== undefined && board[b1.y][b1.x] === BoardElement.Ball) {
      const b2 = { x: fromCoord.x, y: fromCoord.y + 2 };

      if (
        board[b2.y] !== undefined &&
        board[b2.y][b2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: b2,
          to: fromCoord,
        });
      } else if (
        board[b2.y] !== undefined &&
        board[b2.y][b2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: fromCoord,
            to: b2,
          }),
          1
        );
      }

      // 1
      if (
        board[a1.y] !== undefined &&
        board[a1.y][a1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: b1,
            to: a1,
          }),
          1
        );
      }
    }

    // 3
    if (board[c1.y] !== undefined && board[c1.y][c1.x] === BoardElement.Ball) {
      const c2 = { x: fromCoord.x - 2, y: fromCoord.y };

      if (
        board[c2.y] !== undefined &&
        board[c2.y][c2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: c2,
          to: fromCoord,
        });
      } else if (
        board[c2.y] !== undefined &&
        board[c2.y][c2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: fromCoord,
            to: c2,
          }),
          1
        );
      }
    } else if (
      board[c1.y] !== undefined &&
      board[c1.y][c1.x] === BoardElement.Empty
    ) {
      this.possibleMoves.splice(
        this.possibleMoves.indexOf({
          from: betweenCoord,
          to: c1,
        }),
        1
      );
    }

    // 4
    if (board[d1.y] !== undefined && board[d1.y][d1.x] === BoardElement.Ball) {
      const d2 = { x: betweenCoord.x, y: betweenCoord.y - 2 };

      if (
        board[d2.y] !== undefined &&
        board[d2.y][d2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: d2,
          to: betweenCoord,
        });
      } else if (
        board[d2.y] !== undefined &&
        board[d2.y][d2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: betweenCoord,
            to: d2,
          }),
          1
        );
      }

      // 5
      if (
        board[e1.y] !== undefined &&
        board[e1.y][e1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: d1,
            to: e1,
          }),
          1
        );
      }
    }

    // 5
    if (board[e1.y] !== undefined && board[e1.y][e1.x] === BoardElement.Ball) {
      const e2 = { x: betweenCoord.x, y: betweenCoord.y + 2 };

      if (
        board[e2.y] !== undefined &&
        board[e2.y][e2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: e2,
          to: betweenCoord,
        });
      } else if (
        board[e2.y] !== undefined &&
        board[e2.y][e2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: betweenCoord,
            to: e2,
          }),
          1
        );
      }

      // 4
      if (
        board[d1.y] !== undefined &&
        board[d1.y][d1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: e1,
            to: d1,
          }),
          1
        );
      }
    }

    // 6
    if (board[f1.y] !== undefined && board[f1.y][f1.x] === BoardElement.Ball) {
      this.possibleMoves.push({
        from: f1,
        to: betweenCoord,
      });
      const f2 = { x: toCoord.x + 2, y: toCoord.y };

      if (
        board[f2.y] !== undefined &&
        board[f2.y][f2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: toCoord,
          to: f2,
        });
      } else if (
        board[f2.y] !== undefined &&
        board[f2.y][f2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: f2,
            to: toCoord,
          }),
          1
        );
      }
    }

    // 7
    if (board[g1.y] !== undefined && board[g1.y][g1.x] === BoardElement.Ball) {
      const g2 = { x: toCoord.x, y: toCoord.y - 2 };

      if (
        board[g2.y] !== undefined &&
        board[g2.y][g2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: g2,
            to: toCoord,
          }),
          1
        );
      } else if (
        board[g2.y] !== undefined &&
        board[g2.y][g2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: toCoord,
          to: g2,
        });
      }

      // 8
      if (
        board[h1.y] !== undefined &&
        board[h1.y][h1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: g1,
          to: h1,
        });
      }
    }

    // 8
    if (board[h1.y] !== undefined && board[h1.y][h1.x] === BoardElement.Ball) {
      const h2 = { x: toCoord.x, y: toCoord.y + 2 };

      if (
        board[h2.y] !== undefined &&
        board[h2.y][h2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: h2,
            to: toCoord,
          }),
          1
        );
      } else if (
        board[h2.y] !== undefined &&
        board[h2.y][h2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: toCoord,
          to: h2,
        });
      }

      // 7
      if (
        board[g1.y] !== undefined &&
        board[g1.y][g1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: h1,
          to: g1,
        });
      }
    }
  }

  updatePossibleMovesBasedOnRemovedMoveDown(move: Move) {
    const board = this.gameBoard.getBoard();
    const fromCoord = move.from;
    const betweenCoord = {
      x: move.from.x,
      y: move.from.y + 1,
    };
    const toCoord = move.to;

    const a1 = { x: fromCoord.x + 1, y: fromCoord.y };
    const b1 = { x: fromCoord.x - 1, y: fromCoord.y };
    const c1 = { x: fromCoord.x, y: fromCoord.y - 1 };
    const d1 = { x: betweenCoord.x + 1, y: betweenCoord.y };
    const e1 = { x: betweenCoord.x - 1, y: betweenCoord.y };
    const f1 = { x: toCoord.x, y: toCoord.y + 1 };
    const g1 = { x: toCoord.x + 1, y: toCoord.y };
    const h1 = { x: toCoord.x - 1, y: toCoord.y };

    // 1
    if (board[a1.y] !== undefined && board[a1.y][a1.x] === BoardElement.Ball) {
      const a2 = { x: fromCoord.x + 2, y: fromCoord.y };

      if (
        board[a2.y] !== undefined &&
        board[a2.y][a2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: a2,
            to: fromCoord,
          }),
          1
        );
      } else if (
        board[a2.y] !== undefined &&
        board[a2.y][a2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: fromCoord,
          to: a2,
        });
      }

      // 2
      if (
        board[b1.y] !== undefined &&
        board[b1.y][b1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: a1,
          to: b1,
        });
      }
    }

    // 2
    if (board[b1.y] !== undefined && board[b1.y][b1.x] === BoardElement.Ball) {
      const b2 = { x: fromCoord.x - 2, y: fromCoord.y };

      if (
        board[b2.y] !== undefined &&
        board[b2.y][b2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: b2,
            to: fromCoord,
          }),
          1
        );
      } else if (
        board[b2.y] !== undefined &&
        board[b2.y][b2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: fromCoord,
          to: b2,
        });
      }

      // 1
      if (
        board[a1.y] !== undefined &&
        board[a1.y][a1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: b1,
          to: a1,
        });
      }
    }

    // 3
    if (board[c1.y] !== undefined && board[c1.y][c1.x] === BoardElement.Ball) {
      const c2 = { x: fromCoord.x, y: fromCoord.y - 2 };

      if (
        board[c2.y] !== undefined &&
        board[c2.y][c2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: c2,
            to: fromCoord,
          }),
          1
        );
      } else if (
        board[c2.y] !== undefined &&
        board[c2.y][c2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: fromCoord,
          to: c2,
        });
      }
    } else if (
      board[c1.y] !== undefined &&
      board[c1.y][c1.x] === BoardElement.Empty
    ) {
      this.possibleMoves.push({
        from: betweenCoord,
        to: c1,
      });
    }

    // 4
    if (board[d1.y] !== undefined && board[d1.y][d1.x] === BoardElement.Ball) {
      const d2 = { x: betweenCoord.x + 2, y: betweenCoord.y };

      if (
        board[d2.y] !== undefined &&
        board[d2.y][d2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: d2,
            to: betweenCoord,
          }),
          1
        );
      } else if (
        board[d2.y] !== undefined &&
        board[d2.y][d2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: betweenCoord,
          to: d2,
        });
      }

      // 5
      if (
        board[e1.y] !== undefined &&
        board[e1.y][e1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: d1,
          to: e1,
        });
      }
    }

    // 5
    if (board[e1.y] !== undefined && board[e1.y][e1.x] === BoardElement.Ball) {
      const e2 = { x: betweenCoord.x - 2, y: betweenCoord.y };

      if (
        board[e2.y] !== undefined &&
        board[e2.y][e2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: e2,
            to: betweenCoord,
          }),
          1
        );
      } else if (
        board[e2.y] !== undefined &&
        board[e2.y][e2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: betweenCoord,
          to: e2,
        });
      }

      // 4
      if (
        board[d1.y] !== undefined &&
        board[d1.y][d1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: e1,
          to: d1,
        });
      }
    }

    // 6
    if (board[f1.y] !== undefined && board[f1.y][f1.x] === BoardElement.Ball) {
      this.possibleMoves.splice(
        this.possibleMoves.indexOf({
          from: f1,
          to: betweenCoord,
        }),
        1
      );
      const f2 = { x: toCoord.x, y: toCoord.y + 2 };

      if (
        board[f2.y] !== undefined &&
        board[f2.y][f2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: toCoord,
            to: f2,
          }),
          1
        );
      } else if (
        board[f2.y] !== undefined &&
        board[f2.y][f2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: f2,
          to: toCoord,
        });
      }
    }

    // 7
    if (board[g1.y] !== undefined && board[g1.y][g1.x] === BoardElement.Ball) {
      const g2 = { x: toCoord.x + 2, y: toCoord.y };

      if (
        board[g2.y] !== undefined &&
        board[g2.y][g2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: g2,
          to: toCoord,
        });
      } else if (
        board[g2.y] !== undefined &&
        board[g2.y][g2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: toCoord,
            to: g2,
          }),
          1
        );
      }

      // 8
      if (
        board[h1.y] !== undefined &&
        board[h1.y][h1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: g1,
            to: h1,
          }),
          1
        );
      }
    }

    // 8
    if (board[h1.y] !== undefined && board[h1.y][h1.x] === BoardElement.Ball) {
      const h2 = { x: toCoord.x - 2, y: toCoord.y };

      if (
        board[h2.y] !== undefined &&
        board[h2.y][h2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: h2,
          to: toCoord,
        });
      } else if (
        board[h2.y] !== undefined &&
        board[h2.y][h2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: toCoord,
            to: h2,
          }),
          1
        );
      }

      // 7
      if (
        board[g1.y] !== undefined &&
        board[g1.y][g1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: h1,
            to: g1,
          }),
          1
        );
      }
    }
  }

  updatePossibleMovesBasedOnRemovedMoveUp(move: Move) {
    const board = this.gameBoard.getBoard();
    const fromCoord = move.from;
    const betweenCoord = {
      x: move.from.x,
      y: move.from.y - 1,
    };
    const toCoord = move.to;

    const a1 = { x: fromCoord.x - 1, y: fromCoord.y };
    const b1 = { x: fromCoord.x + 1, y: fromCoord.y };
    const c1 = { x: fromCoord.x, y: fromCoord.y + 1 };
    const d1 = { x: betweenCoord.x - 1, y: betweenCoord.y };
    const e1 = { x: betweenCoord.x + 1, y: betweenCoord.y };
    const f1 = { x: toCoord.x, y: toCoord.y - 1 };
    const g1 = { x: toCoord.x - 1, y: toCoord.y };
    const h1 = { x: toCoord.x + 1, y: toCoord.y };

    // 1
    if (board[a1.y] !== undefined && board[a1.y][a1.x] === BoardElement.Ball) {
      const a2 = { x: fromCoord.x - 2, y: fromCoord.y };

      if (
        board[a2.y] !== undefined &&
        board[a2.y][a2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: a2,
            to: fromCoord,
          }),
          1
        );
      } else if (
        board[a2.y] !== undefined &&
        board[a2.y][a2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: fromCoord,
          to: a2,
        });
      }

      // 2
      if (
        board[b1.y] !== undefined &&
        board[b1.y][b1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: a1,
          to: b1,
        });
      }
    }

    // 2
    if (board[b1.y] !== undefined && board[b1.y][b1.x] === BoardElement.Ball) {
      const b2 = { x: fromCoord.x + 2, y: fromCoord.y };

      if (
        board[b2.y] !== undefined &&
        board[b2.y][b2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: b2,
            to: fromCoord,
          }),
          1
        );
      } else if (
        board[b2.y] !== undefined &&
        board[b2.y][b2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: fromCoord,
          to: b2,
        });
      }

      // 1
      if (
        board[a1.y] !== undefined &&
        board[a1.y][a1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: b1,
          to: a1,
        });
      }
    }

    // 3
    if (board[c1.y] !== undefined && board[c1.y][c1.x] === BoardElement.Ball) {
      const c2 = { x: fromCoord.x, y: fromCoord.y + 2 };

      if (
        board[c2.y] !== undefined &&
        board[c2.y][c2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: c2,
            to: fromCoord,
          }),
          1
        );
      } else if (
        board[c2.y] !== undefined &&
        board[c2.y][c2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: fromCoord,
          to: c2,
        });
      }
    } else if (
      board[c1.y] !== undefined &&
      board[c1.y][c1.x] === BoardElement.Empty
    ) {
      this.possibleMoves.push({
        from: betweenCoord,
        to: c1,
      });
    }

    // 4
    if (board[d1.y] !== undefined && board[d1.y][d1.x] === BoardElement.Ball) {
      const d2 = { x: betweenCoord.x - 2, y: betweenCoord.y };

      if (
        board[d2.y] !== undefined &&
        board[d2.y][d2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: d2,
            to: betweenCoord,
          }),
          1
        );
      } else if (
        board[d2.y] !== undefined &&
        board[d2.y][d2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: betweenCoord,
          to: d2,
        });
      }

      // 5
      if (
        board[e1.y] !== undefined &&
        board[e1.y][e1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: d1,
          to: e1,
        });
      }
    }

    // 5
    if (board[e1.y] !== undefined && board[e1.y][e1.x] === BoardElement.Ball) {
      const e2 = { x: betweenCoord.x + 2, y: betweenCoord.y };

      if (
        board[e2.y] !== undefined &&
        board[e2.y][e2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: e2,
            to: betweenCoord,
          }),
          1
        );
      } else if (
        board[e2.y] !== undefined &&
        board[e2.y][e2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: betweenCoord,
          to: e2,
        });
      }

      // 4
      if (
        board[d1.y] !== undefined &&
        board[d1.y][d1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: e1,
          to: d1,
        });
      }
    }

    // 6
    if (board[f1.y] !== undefined && board[f1.y][f1.x] === BoardElement.Ball) {
      this.possibleMoves.splice(
        this.possibleMoves.indexOf({
          from: f1,
          to: betweenCoord,
        }),
        1
      );
      const f2 = { x: toCoord.x, y: toCoord.y - 2 };

      if (
        board[f2.y] !== undefined &&
        board[f2.y][f2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: toCoord,
            to: f2,
          }),
          1
        );
      } else if (
        board[f2.y] !== undefined &&
        board[f2.y][f2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: f2,
          to: toCoord,
        });
      }
    }

    // 7
    if (board[g1.y] !== undefined && board[g1.y][g1.x] === BoardElement.Ball) {
      const g2 = { x: toCoord.x - 2, y: toCoord.y };

      if (
        board[g2.y] !== undefined &&
        board[g2.y][g2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: g2,
          to: toCoord,
        });
      } else if (
        board[g2.y] !== undefined &&
        board[g2.y][g2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: toCoord,
            to: g2,
          }),
          1
        );
      }

      // 8
      if (
        board[h1.y] !== undefined &&
        board[h1.y][h1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: g1,
            to: h1,
          }),
          1
        );
      }
    }

    // 8
    if (board[h1.y] !== undefined && board[h1.y][h1.x] === BoardElement.Ball) {
      const h2 = { x: toCoord.x + 2, y: toCoord.y };

      if (
        board[h2.y] !== undefined &&
        board[h2.y][h2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: h2,
          to: toCoord,
        });
      } else if (
        board[h2.y] !== undefined &&
        board[h2.y][h2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: toCoord,
            to: h2,
          }),
          1
        );
      }

      // 7
      if (
        board[g1.y] !== undefined &&
        board[g1.y][g1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: h1,
            to: g1,
          }),
          1
        );
      }
    }
  }

  updatePossibleMovesBasedOnRemovedMoveLeft(move: Move) {
    const board = this.gameBoard.getBoard();
    const fromCoord = move.from;
    const betweenCoord = {
      x: move.from.x - 1,
      y: move.from.y,
    };
    const toCoord = move.to;

    const a1 = { x: fromCoord.x, y: fromCoord.y + 1 };
    const b1 = { x: fromCoord.x, y: fromCoord.y - 1 };
    const c1 = { x: fromCoord.x + 1, y: fromCoord.y };
    const d1 = { x: betweenCoord.x, y: betweenCoord.y + 1 };
    const e1 = { x: betweenCoord.x, y: betweenCoord.y - 1 };
    const f1 = { x: toCoord.x - 1, y: toCoord.y };
    const g1 = { x: toCoord.x, y: toCoord.y + 1 };
    const h1 = { x: toCoord.x, y: toCoord.y - 1 };

    // 1
    if (board[a1.y] !== undefined && board[a1.y][a1.x] === BoardElement.Ball) {
      const a2 = { x: fromCoord.x, y: fromCoord.y + 2 };

      if (
        board[a2.y] !== undefined &&
        board[a2.y][a2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: a2,
            to: fromCoord,
          }),
          1
        );
      } else if (
        board[a2.y] !== undefined &&
        board[a2.y][a2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: fromCoord,
          to: a2,
        });
      }

      // 2
      if (
        board[b1.y] !== undefined &&
        board[b1.y][b1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: a1,
          to: b1,
        });
      }
    }

    // 2
    if (board[b1.y] !== undefined && board[b1.y][b1.x] === BoardElement.Ball) {
      const b2 = { x: fromCoord.x, y: fromCoord.y - 2 };

      if (
        board[b2.y] !== undefined &&
        board[b2.y][b2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: b2,
            to: fromCoord,
          }),
          1
        );
      } else if (
        board[b2.y] !== undefined &&
        board[b2.y][b2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: fromCoord,
          to: b2,
        });
      }

      // 1
      if (
        board[a1.y] !== undefined &&
        board[a1.y][a1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: b1,
          to: a1,
        });
      }
    }

    // 3
    if (board[c1.y] !== undefined && board[c1.y][c1.x] === BoardElement.Ball) {
      const c2 = { x: fromCoord.x + 2, y: fromCoord.y };

      if (
        board[c2.y] !== undefined &&
        board[c2.y][c2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: c2,
            to: fromCoord,
          }),
          1
        );
      } else if (
        board[c2.y] !== undefined &&
        board[c2.y][c2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: fromCoord,
          to: c2,
        });
      }
    } else if (
      board[c1.y] !== undefined &&
      board[c1.y][c1.x] === BoardElement.Empty
    ) {
      this.possibleMoves.push({
        from: betweenCoord,
        to: c1,
      });
    }

    // 4
    if (board[d1.y] !== undefined && board[d1.y][d1.x] === BoardElement.Ball) {
      const d2 = { x: betweenCoord.x, y: betweenCoord.y + 2 };

      if (
        board[d2.y] !== undefined &&
        board[d2.y][d2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: d2,
            to: betweenCoord,
          }),
          1
        );
      } else if (
        board[d2.y] !== undefined &&
        board[d2.y][d2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: betweenCoord,
          to: d2,
        });
      }

      // 5
      if (
        board[e1.y] !== undefined &&
        board[e1.y][e1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: d1,
          to: e1,
        });
      }
    }

    // 5
    if (board[e1.y] !== undefined && board[e1.y][e1.x] === BoardElement.Ball) {
      const e2 = { x: betweenCoord.x, y: betweenCoord.y - 2 };

      if (
        board[e2.y] !== undefined &&
        board[e2.y][e2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: e2,
            to: betweenCoord,
          }),
          1
        );
      } else if (
        board[e2.y] !== undefined &&
        board[e2.y][e2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: betweenCoord,
          to: e2,
        });
      }

      // 4
      if (
        board[d1.y] !== undefined &&
        board[d1.y][d1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: e1,
          to: d1,
        });
      }
    }

    // 6
    if (board[f1.y] !== undefined && board[f1.y][f1.x] === BoardElement.Ball) {
      this.possibleMoves.splice(
        this.possibleMoves.indexOf({
          from: f1,
          to: betweenCoord,
        }),
        1
      );
      const f2 = { x: toCoord.x - 2, y: toCoord.y };

      if (
        board[f2.y] !== undefined &&
        board[f2.y][f2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: toCoord,
            to: f2,
          }),
          1
        );
      } else if (
        board[f2.y] !== undefined &&
        board[f2.y][f2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: f2,
          to: toCoord,
        });
      }
    }

    // 7
    if (board[g1.y] !== undefined && board[g1.y][g1.x] === BoardElement.Ball) {
      const g2 = { x: toCoord.x, y: toCoord.y + 2 };

      if (
        board[g2.y] !== undefined &&
        board[g2.y][g2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: g2,
          to: toCoord,
        });
      } else if (
        board[g2.y] !== undefined &&
        board[g2.y][g2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: toCoord,
            to: g2,
          }),
          1
        );
      }

      // 8
      if (
        board[h1.y] !== undefined &&
        board[h1.y][h1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: g1,
            to: h1,
          }),
          1
        );
      }
    }

    // 8
    if (board[h1.y] !== undefined && board[h1.y][h1.x] === BoardElement.Ball) {
      const h2 = { x: toCoord.x, y: toCoord.y - 2 };

      if (
        board[h2.y] !== undefined &&
        board[h2.y][h2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: h2,
          to: toCoord,
        });
      } else if (
        board[h2.y] !== undefined &&
        board[h2.y][h2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: toCoord,
            to: h2,
          }),
          1
        );
      }

      // 7
      if (
        board[g1.y] !== undefined &&
        board[g1.y][g1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: h1,
            to: g1,
          }),
          1
        );
      }
    }
  }

  updatePossibleMovesBasedOnRemovedMoveRight(move: Move) {
    const board = this.gameBoard.getBoard();
    const fromCoord = move.from;
    const betweenCoord = {
      x: move.from.x + 1,
      y: move.from.y,
    };
    const toCoord = move.to;

    const a1 = { x: fromCoord.x, y: fromCoord.y - 1 };
    const b1 = { x: fromCoord.x, y: fromCoord.y + 1 };
    const c1 = { x: fromCoord.x - 1, y: fromCoord.y };
    const d1 = { x: betweenCoord.x, y: betweenCoord.y - 1 };
    const e1 = { x: betweenCoord.x, y: betweenCoord.y + 1 };
    const f1 = { x: toCoord.x + 1, y: toCoord.y };
    const g1 = { x: toCoord.x, y: toCoord.y - 1 };
    const h1 = { x: toCoord.x, y: toCoord.y + 1 };

    // 1
    if (board[a1.y] !== undefined && board[a1.y][a1.x] === BoardElement.Ball) {
      const a2 = { x: fromCoord.x, y: fromCoord.y - 2 };

      if (
        board[a2.y] !== undefined &&
        board[a2.y][a2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: a2,
            to: fromCoord,
          }),
          1
        );
      } else if (
        board[a2.y] !== undefined &&
        board[a2.y][a2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: fromCoord,
          to: a2,
        });
      }

      // 2
      if (
        board[b1.y] !== undefined &&
        board[b1.y][b1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: a1,
          to: b1,
        });
      }
    }

    // 2
    if (board[b1.y] !== undefined && board[b1.y][b1.x] === BoardElement.Ball) {
      const b2 = { x: fromCoord.x, y: fromCoord.y + 2 };

      if (
        board[b2.y] !== undefined &&
        board[b2.y][b2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: b2,
            to: fromCoord,
          }),
          1
        );
      } else if (
        board[b2.y] !== undefined &&
        board[b2.y][b2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: fromCoord,
          to: b2,
        });
      }

      // 1
      if (
        board[a1.y] !== undefined &&
        board[a1.y][a1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: b1,
          to: a1,
        });
      }
    }

    // 3
    if (board[c1.y] !== undefined && board[c1.y][c1.x] === BoardElement.Ball) {
      const c2 = { x: fromCoord.x - 2, y: fromCoord.y };

      if (
        board[c2.y] !== undefined &&
        board[c2.y][c2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: c2,
            to: fromCoord,
          }),
          1
        );
      } else if (
        board[c2.y] !== undefined &&
        board[c2.y][c2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: fromCoord,
          to: c2,
        });
      }
    } else if (
      board[c1.y] !== undefined &&
      board[c1.y][c1.x] === BoardElement.Empty
    ) {
      this.possibleMoves.push({
        from: betweenCoord,
        to: c1,
      });
    }

    // 4
    if (board[d1.y] !== undefined && board[d1.y][d1.x] === BoardElement.Ball) {
      const d2 = { x: betweenCoord.x, y: betweenCoord.y - 2 };

      if (
        board[d2.y] !== undefined &&
        board[d2.y][d2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: d2,
            to: betweenCoord,
          }),
          1
        );
      } else if (
        board[d2.y] !== undefined &&
        board[d2.y][d2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: betweenCoord,
          to: d2,
        });
      }

      // 5
      if (
        board[e1.y] !== undefined &&
        board[e1.y][e1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: d1,
          to: e1,
        });
      }
    }

    // 5
    if (board[e1.y] !== undefined && board[e1.y][e1.x] === BoardElement.Ball) {
      const e2 = { x: betweenCoord.x, y: betweenCoord.y + 2 };

      if (
        board[e2.y] !== undefined &&
        board[e2.y][e2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: e2,
            to: betweenCoord,
          }),
          1
        );
      } else if (
        board[e2.y] !== undefined &&
        board[e2.y][e2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: betweenCoord,
          to: e2,
        });
      }

      // 4
      if (
        board[d1.y] !== undefined &&
        board[d1.y][d1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.push({
          from: e1,
          to: d1,
        });
      }
    }

    // 6
    if (board[f1.y] !== undefined && board[f1.y][f1.x] === BoardElement.Ball) {
      this.possibleMoves.splice(
        this.possibleMoves.indexOf({
          from: f1,
          to: betweenCoord,
        }),
        1
      );
      const f2 = { x: toCoord.x + 2, y: toCoord.y };

      if (
        board[f2.y] !== undefined &&
        board[f2.y][f2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: toCoord,
            to: f2,
          }),
          1
        );
      } else if (
        board[f2.y] !== undefined &&
        board[f2.y][f2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: f2,
          to: toCoord,
        });
      }
    }

    // 7
    if (board[g1.y] !== undefined && board[g1.y][g1.x] === BoardElement.Ball) {
      const g2 = { x: toCoord.x, y: toCoord.y - 2 };

      if (
        board[g2.y] !== undefined &&
        board[g2.y][g2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: g2,
          to: toCoord,
        });
      } else if (
        board[g2.y] !== undefined &&
        board[g2.y][g2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: toCoord,
            to: g2,
          }),
          1
        );
      }

      // 8
      if (
        board[h1.y] !== undefined &&
        board[h1.y][h1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: g1,
            to: h1,
          }),
          1
        );
      }
    }

    // 8
    if (board[h1.y] !== undefined && board[h1.y][h1.x] === BoardElement.Ball) {
      const h2 = { x: toCoord.x, y: toCoord.y + 2 };

      if (
        board[h2.y] !== undefined &&
        board[h2.y][h2.x] === BoardElement.Ball
      ) {
        this.possibleMoves.push({
          from: h2,
          to: toCoord,
        });
      } else if (
        board[h2.y] !== undefined &&
        board[h2.y][h2.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: toCoord,
            to: h2,
          }),
          1
        );
      }

      // 7
      if (
        board[g1.y] !== undefined &&
        board[g1.y][g1.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: h1,
            to: g1,
          }),
          1
        );
      }
    }
  }
}
