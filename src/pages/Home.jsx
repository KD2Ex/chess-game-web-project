import React, {useState} from 'react';
import {auth, db} from "../API/firebase";
import {useHistory} from "react-router-dom";

const Home = () => {
    const {currentUser} = auth
    const [showModal, setShowModal] = useState(false);
    const history = useHistory()
    const newGameOptions = [
        {label: "Белые", value: 'w'},
        {label: "Черные", value: 'b'},
        {label: "Случайно", value: 'r'}
    ]


    function handlePlayOnline() {
        setShowModal(true);
    }

    function startLocalGame() {
        history.push(`/game/local`)
    }

    async function startOnlineGame(startingColor) {
        const member = {
            uid: currentUser.uid,
            piece: startingColor === 'r' ? ['b','w'][Math.round(Math.random())] : startingColor,
            name: localStorage.getItem('userName'),
            creator: true
        }
        const game = {
            status: 'waiting',
            members: [member],
            gameId: `${Math.random().toString(36).substr(2, 9)}_${Date.now()}`
        }
        await db.collection('games').doc(game.gameId).set(game);
        history.push(`/game/${game.gameId}`)
    }


    return (
        <>
            <div className="columns home">
                <div className="column ">
                    <button onClick={startLocalGame}>
                        Играть локально
                    </button>

                    <button className="" onClick={handlePlayOnline}>
                        Играть онлайн
                    </button>
                </div>
            </div>
            <div className={`modal ${showModal ? 'is-active' : ''}`}>
                <div className="modal-background"></div>
                <div className="modal-content">
                    <div className="card picker">
                        <div className="card-content">
                            Выберите цвет фигур:
                        </div>
                        <footer className="card-footer-item ">
                            {newGameOptions.map( ({ label, value } ) => (
                                <span className="card-footer-item picker-items"
                                      key={value}
                                      onClick={() => startOnlineGame(value)}>
                                    {label}
                                </span>
                            ))}
                        </footer>
                    </div>
                </div>
                <button className="modal-close is-large"
                        onClick={() => setShowModal(false)}/>
            </div>
        </>

    );
};

export default Home;