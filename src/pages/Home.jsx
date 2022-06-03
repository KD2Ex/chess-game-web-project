import React, {useState} from 'react';

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const newGameOptions = [
        {label: "Белые", value: 'w'},
        {label: "Черные", value: 'b'},
        {label: "Случайно", value: 'r'}
    ]


    function handlePlayOnline() {
        setShowModal(true);
    }


    return (
        <>
            <div className="columns home">
                <div className="column ">
                    <button>
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
                                <span className="card-footer-item" key={value}>
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