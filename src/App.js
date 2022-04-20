import React, {useEffect, useState} from "react";
import './App.css';
import {gameSubject, initGame, resetGame} from './Game'
import Board from "./components/Board";
import Fallen from "./components/Fallen";


function App() {
    const [board, setBoard] = useState([]);
    const [fallenWhite, setFallenWhite] = useState([]);
    const [fallenBlack, setFallenBlack] = useState([]);
    const [isGameOver, setIsGameOver] = useState();
    const [result, setResult] = useState();


    useEffect(() => {
        initGame();
        const subscribe = gameSubject.subscribe((game) =>{
            setBoard(game.board);
            setIsGameOver(game.isGameOver);
            setResult(game.result);
            setFallenBlack(game.fallenBlack);
            setFallenWhite(game.fallenWhite);
        }
    );
        return () => subscribe.unsubscribe();

    }, [])

  return (

      <div className="container">
          {isGameOver ? (
              <h2 className="vertical-text">
                  GAME OVER
                  <button onClick={resetGame}>
                      <span  className="vertical-text">NEW GAME</span>
                  </button>
              </h2>
          ) : null }

          <div>

              <div className="fallen-container">
                  <Fallen fallen={fallenWhite}/>
                  {/*{fallenWhite ?  : null}*/}
              </div>
              <div className="board-container">
                  <Board board={board}/>
              </div>
              <div className="fallen-container">
                  <Fallen fallen={fallenBlack}/>
                  {/*{fallenBlack ?  : null}*/}
              </div>
          </div>

          {result ? <p className="vertical-text">{result}</p> : null}



      </div>
  );
}

export default App;
