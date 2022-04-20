import React from 'react';

const Fallen = ({fallen}) => {

    return (
        <div>
            {fallen?.map((piece, i) => (
                <img
                    key={i}
                    src={require(`..\\src\\assets/${piece.type}_${piece.color}.png`)}
                    alt=""
                    className="piece cursor-pointer"
                />
            ))}
        </div>
    );
};

export default Fallen;