import {Chess} from '../../node_modules/chess.js/chess';
import {BehaviorSubject} from 'rxjs'
import {map} from 'rxjs/operators'
import {auth} from '../API/firebase'
import Board from "../components/Board";
import {useEffect} from "react";
import {fromDocRef} from "rxfire/firestore";
import {fromRef} from "rxfire/database";

let promotion = 'rnb2bnr/pppPkppp/8/4p3/7q/8/PPPP1PPP/RNBQKBNR w KQ - 1 5';
let staleMate = '4k3/4P3/4K3/8/8/8/8/8 b - - 0 78';
let foolsMate = 'rn1qkbnr/pp1bp2p/5p2/2pp2p1/2PP4/4P3/PP3PPP/RNBQKBNR w KQkq - 0 1'

let gameRef
let member

const chess = new Chess();

const fallenWhite = [];
const fallenBlack = [];

export let gameSubject

export async function initGame(gameRefDb) {
    const {currentUser} = auth;
    if (gameRefDb) {
        gameRef = gameRefDb
        const initialGame = await gameRefDb.get().then(doc => doc.data())
        if (!initialGame) {
            return "notfound";
        }
        const creator = initialGame.members.find(m => m.creator === true)

        if (initialGame.status === "waiting" && creator.uid !== currentUser.uid) {
            const currUser = {
                uid: currentUser.uid,
                name: localStorage.getItem('userName'),
                piece: creator.piece === 'w' ? 'b' : 'w'
            }
            const updatedMembers = [...initialGame.members, currUser]
            await gameRefDb.update({members: updatedMembers, status: 'ready'})
        } else if (!initialGame.members.map(m => m.uid).includes(currentUser.uid)) {
            return 'intruder';
        }

        chess.reset();
        gameSubject = fromDocRef(gameRefDb).pipe(
            map(gameDoc => {
                const game = gameDoc.data()
                const { pendingPromotion, gameData, ...restOfGame} = game
                member = game.members.find(m => m.uid === currentUser.uid)
                const opponent = game.members.find(m => m.uid !== currentUser.uid)

                if (gameData) {
                    chess.load(gameData)
                }
                const isGameOver = chess.game_over()
                return {
                    board: chess.board(),
                    pendingPromotion,
                    isGameOver,
                    position: member.piece,
                    member,
                    opponent,
                    turn: chess.turn(),
                    result: isGameOver ? getGameResult() : null,
                    ...restOfGame
                }
            })
        )

    } else {
        gameRef = null
        gameSubject = new BehaviorSubject()
        const savedGame = localStorage.getItem('savedGameFEN')
        if (savedGame) {
            chess.load(savedGame);
        }
        updateGame();
    }

}

export async function resetGame() {
    if (gameRef) {
        await updateGame(null, true)
        chess.reset()
    } else {
        chess.reset();
        fallenWhite.length = 0;
        fallenBlack.length = 0;
        updateGame();
    }


}

export function handleMove(from, to) {

    const promotions = chess.moves({verbose: true}).filter(m => m.promotion);
    let pendingPromotion

    if (promotions.some(p => `${p.from}:${p.to}` === `${from}:${to}`)) {
        pendingPromotion = {from, to, color: promotions[0].color }
        updateGame(pendingPromotion)
        console.log("promote")
    }

    if (!pendingPromotion) {
        move(from, to)
    }
}

export function move(from, to, promotion) {
    let tempMove = {from, to};

    if (promotion) {
        tempMove.promotion = promotion;
    }
    if (gameRef) {
        if (member.piece === chess.turn()) {
            const legalMove = chess.move(tempMove);
            if (legalMove) {
                updateGame();
            }
        }
    } else {
        const killedPiece = chess.get(to);
        const legalMove = chess.move(tempMove);

        if (legalMove) {
            if (killedPiece) {
                killedPiece.color === 'b' ? fallenBlack.push(killedPiece) : fallenWhite.push(killedPiece)
            }
            updateGame(null, false, fallenWhite, fallenBlack);
        }
    }
}

async function updateGame(pendingPromotion, reset, fallenWhite, fallenBlack) {
    const isGameOver = chess.game_over();

    if (gameRef) {
        const updatedDate = {
            gameData: chess.fen(),
            pendingPromotion: pendingPromotion || null
        }
        if (reset) {
            updatedDate.status = "over"
        }
        await gameRef.update(updatedDate)
    } else {
        const newGame = {
            board: chess.board(),
            pendingPromotion,
            isGameOver,
            fallenWhite,
            fallenBlack,
            turn: chess.turn(),
            position: chess.turn(),
            result: isGameOver ? getGameResult() : null
        }

        localStorage.setItem('savedGameFEN', chess.fen())


        gameSubject.next(newGame);
    }


}

function getGameResult() {
    if (chess.in_checkmate()) {
        const winner = chess.turn() === "w" ? 'ЧЕРНЫЕ' : "БЕЛЫЕ";
        return `МАТ - ПОБЕДИТЕЛЬ - ${winner}`
    } else if (chess.in_draw()) {
        let reason = 'ПРАВИЛО - 50 - ХОДОВ';
        if (chess.in_stalemate()) {
            reason = "ПАТ";
        } else if (chess.in_threefold_repetition()) {
            reason = "ПОВТОРЕНИЕ";
        } else if (chess.insufficient_material()) {
            reason = "НЕДОСТАТОЧНО - ФИГУР";
        }
        return `НИЧЬЯ - ${reason}`
    } else {
        return 'НЕИЗВЕСТНАЯ ПРИЧИНА';
    }
}
