import {Chess} from 'chess.js';
import {BehaviorSubject} from 'rxjs'
import Board from "./components/Board";
import {useEffect} from "react";

let promotion = 'rnb2bnr/pppPkppp/8/4p3/7q/8/PPPP1PPP/RNBQKBNR w KQ - 1 5';
let staleMate = '4k3/4P3/4K3/8/8/8/8/8 b - - 0 78';

const chess = new Chess(staleMate);

const fallenWhite = [];
const fallenBlack = [];

export const gameSubject = new BehaviorSubject();

export function initGame() {
    updateGame();
}

export function resetGame() {
    chess.reset();
    updateGame();
}

export function handleMove(from, to) {



    const promotions = chess.moves({verbose: true}).filter(m => m.promotion);

    if (promotions.some(p => `${p.from}:${p.to}` === `${from}:${to}`)) {
        const pendingPromotion = {from, to, color: promotions[0].color }
        updateGame(pendingPromotion)
        console.log("promote")
    }

    const {pendingPromotion} = gameSubject.getValue();
    if (!pendingPromotion) {
        move(from, to)
    }
}

export function move(from, to, promotion) {
    let tempMove = {from, to};

    if (promotion) {
        tempMove.promotion = promotion;
    }

    const killedPiece = chess.get(to);
    const legalMove = chess.move(tempMove);

    if (legalMove) {
        if (killedPiece) {
            killedPiece.color === 'b' ? fallenBlack.push(killedPiece) : fallenWhite.push(killedPiece)
        }
        updateGame(null, fallenWhite, fallenBlack);
    }
}

function updateGame(pendingPromotion, fallenWhite, fallenBlack) {
    const isGameOver = chess.game_over();

    const newGame = {
        board: chess.board(),
        pendingPromotion,
        isGameOver,
        fallenWhite,
        fallenBlack,
        result: isGameOver ? getGameResult() : null
    }

    gameSubject.next(newGame);
}

function getGameResult() {
    if (chess.in_checkmate()) {
        const winner = chess.turn() === "w" ? 'BLACK' : "WHITE";
        return `CHECKMATE - WINNER - ${winner}`
    } else if (chess.in_draw()) {
        let reason = '50 - MOVES - RULE';
        if (chess.in_stalemate()) {
            reason = "STALEMATE";
        } else if (chess.in_threefold_repetition()) {
            reason = "REPETITION";
        } else if (chess.insufficient_material()) {
            reason = "INSUFFICIENT MATERIAL";
        }
        return `DRAW - ${reason}`
    } else {
        return 'UNKNOWN REASON';
    }
}
