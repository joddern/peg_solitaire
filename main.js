"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var peg_solitaire_1 = require("./peg_solitaire");
var solver_1 = require("./solver");
var testGame = new peg_solitaire_1.default();
testGame.removeBall({ x: 2, y: 0 }); // French version on https://webgamesonline.com/peg-solitaire/
var testSolver = new solver_1.default(testGame, 2);
testSolver.solveGame();
testSolver.printSolutionSet();
