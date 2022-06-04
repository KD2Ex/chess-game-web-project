import React, {useEffect, useState} from "react";
import '../styles/App.css';
import {gameSubject, initGame, resetGame} from '../gameLogic/Game'
import Board from "../components/Board";
import Fallen from "../components/Fallen";
import {useParams, useHistory} from "react-router-dom";
import {db} from "../API/firebase";
import {share} from "rxjs/operators";


function GameApp() {
    const [board, setBoard] = useState([]);
    const [fallenWhite, setFallenWhite] = useState([]);
    const [fallenBlack, setFallenBlack] = useState([]);
    const [position, setPosition] = useState();

    const [isGameOver, setIsGameOver] = useState();
    const [result, setResult] = useState();
    const [initResult, setInitResult] = useState(null)
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState('waiting')
    const [game, setGame] = useState({})
    const {id} = useParams()
    const history = useHistory()
    const sharableLink = window.location.href;


    useEffect(() => {
        let subscribe
        async function init() {
            console.log(id);
            const res = await initGame(id === 'local' ? null : db.doc(`games/${id}`));
            setInitResult(res);
            setLoading(false);
            if (!res) {
                subscribe = gameSubject.subscribe((game) => {
                    setBoard(game.board);
                    setIsGameOver(game.isGameOver);
                    setResult(game.result);
                    setFallenBlack(game.fallenBlack);
                    setFallenWhite(game.fallenWhite);
                    setPosition(game.position);
                    setStatus(game.status);
                    setGame(game);
                });
            }
        }
        init();

        return () => subscribe && subscribe.unsubscribe();

    }, [id])

    async function copyToClipboard() {
        await navigator.clipboard.writeText(sharableLink);
    }

    if (loading) {
        return 'Loading....'
    }
    if (initResult === "notfound") {
        return "Game Not found"
    }
    if (initResult === "intruder") {
        return "The game is already full"
    }



  return (

          <div  className="app-container">


              {isGameOver ? (
                  <h2 className="vertical-text">
                      ИГРА ОКОНЧЕНА
                      <button onClick={async () => {
                          await resetGame()
                          history.push('/')
                      }}>
                          <span  className="vertical-text">НОВАЯ ИГРА</span>
                      </button>
                  </h2>
              ) : null }

              <div>
                  <div>
                      {game.opponent && game.opponent.name
                          ? <span className="user-name">{game.opponent.name}</span>
                          :null}
                  </div>
                  <div className="fallen-container">
                      <Fallen fallen={fallenWhite}/>
                      {/*{fallenWhite ?  : null}*/}
                  </div>
                  <div className="board-container">

                      <Board board={board} position={position}/>



                  </div>
                  <div className="fallen-container">
                      <Fallen fallen={fallenBlack}/>
                      {/*{fallenBlack ?  : null}*/}
                  </div>
                  <div>
                      {game.member && game.member.name
                          ? <span className="user-name">{game.member.name}</span>
                          :null}
                  </div>
              </div>

              {result ? <p className="vertical-text">{result}</p> : null}

              {!isGameOver ? (
                  <div className="game-control">
                      <span>
                      Ход {game.turn === 'w' ? "белых" : "черных"}
                      </span>
                      <br/>
                      {sharableLink.slice(-5) === "local" ? (
                          <button className="button-reset" onClick={resetGame}>
                              <span className="horizontal-text">Перезапустить</span>
                          </button>
                      ): null}


                  </div>

              ) : null}


              {status === "waiting" ? (
                  <div className="share-link">
                  <span>
                      Поделитесь ссылкой, чтобы начать игру
                  </span>
                      <br/>
                      <input type={"text"} readOnly value={sharableLink}/>
                      <button onClick={copyToClipboard}>
                          Copy
                      </button>
                  </div>

              ) : null}


          </div>

  );
}

export default GameApp;
