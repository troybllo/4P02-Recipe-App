import ReactCardFlip from 'react-card-flip';
import '../styling/card.css';
import { useState } from 'react';

function Card(){
    return (
        <ReactCardFlip>
            <div className = 'card'>
                <h1>Front</h1>
            </div>

            <div className = 'card card-back'>
                <h1>Back</h1>
            </div>
        </ReactCardFlip>
    );
}

export default Card;