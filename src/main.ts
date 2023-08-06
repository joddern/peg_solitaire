import PegSolitaire from "./peg_solitaire";
import Solver from "./solver";

let testGame: PegSolitaire = new PegSolitaire();
testGame.removeBall({ x: 2, y: 0 }); // French version on https://webgamesonline.com/peg-solitaire/

let testSolver: Solver = new Solver(testGame, 2);

testSolver.solveGame();

testSolver.printSolutionSet();
