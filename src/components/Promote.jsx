import React from 'react';
import {move} from "../gameLogic/Game";

const promotionPieces = ['r', 'n', 'b', 'q'];

const Promote = ({promotion: {from, to, color}}) => {
    
    return (
        <div className="board">
            {promotionPieces.map((p, i) => (
                <div className="promote-square" key={i}>
                    <div
                        className="piece-container"
                        onClick={()=> move(from, to, p)}>
                        <img
                            src={require(`..\\src\\assets/${p}_${color}.png`)}
                            alt=""
                            className="piece cursor-pointer"
                            />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Promote;