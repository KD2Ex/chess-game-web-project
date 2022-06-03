import React, {useEffect, useState} from 'react';
import Square from "./Square";
import Piece from "./Piece";
import {useDrop} from "react-dnd";
import {gameSubject, handleMove, move} from "../Game";
import Promote from "./Promote";


const BoardSquare = ({ piece, black, position, turn }) => {
    const [promotion, setPromotion] = useState(null);

    const [, drop] = useDrop({
        accept: "piece",
        drop: (item) => {
            const [fromPosition] = item.id.split('_');
            handleMove(fromPosition, position)
        }
    })

    useEffect(() => {
        const subscribe = gameSubject.subscribe(
            ({pendingPromotion}) =>
            pendingPromotion && pendingPromotion.to === position
                ? setPromotion(pendingPromotion)
                : setPromotion(null)
        )
        return () => subscribe.unsubscribe();
    }, [position])

    return (
        <div className='board-square' ref={drop}>
            <Square black={black}>



                {position[0] === 'a' ? (
                    <div className={`coordinates-${black ? "light" : "dark"}-${turn}`}>
                        {position[1]}
                    </div>
                ) : null}
                {position[1] === '1' ? (
                    <div className={`coordinates-${black ? "light" : "dark"}-${turn} letter`}>
                        {position[0]}
                    </div>
                ) : null}

                {promotion ? (
                    <Promote promotion={promotion}/>
                ) : piece ? (
                    <Piece piece={piece} position={position}/>
                ) : null}
            </Square>
        </div>
    );
};

export default BoardSquare;