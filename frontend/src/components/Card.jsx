import ReactCardFlip from 'react-card-flip';
import '../styling/card.css';
import { useState } from 'react';

function Card(){
    const [isFlipped, setIsFlipped] = useState(false);

    function flipCard(){
        setIsFlipped(!isFlipped);
    }

    return (
        <ReactCardFlip flipDirection='horizontal' isFlipped={isFlipped}>
            <div className = 'card' onClick={flipCard}>

                <div className = 'top-card'>
                    <div className = 'top-card-image'>
                        <img src="https://yt3.googleusercontent.com/ILnbrhLSQugpA6mlTk1KYSYhJxJ0jki97EAHuyDQ7xI_zsPXLTEf0f0lL-3WdbZKaerE3rbM=s160-c-k-c0x00ffffff-no-rj" />
                        <div className='top-card-text'>
                            <p><b>Chef: </b>Swa</p>
                            <p><b>Cooked on: </b>Tuesday</p>
                        </div>
                    </div>
                    <div className = 'recipe-facts'>
                        <div className='box'>
                            <h1>Fact</h1>
                        </div>
                        <div className='box'>
                            <h1>Fact</h1>
                        </div>
                        <div className='box'>
                            <h1>Fact</h1>
                        </div>
                        <div className='box'>
                            <h1>Fact</h1>
                        </div>
                    </div>
                </div>

                <div className="middle-image">
                    <img src="https://clicklovegrow.com/wp-content/uploads/2020/03/Naomi-Sherman-Advanced-Graduate4.jpg"/>
                </div>

                <div className="hint">
                    <p>Tip: Click on the image to flip the card</p>
                </div>

                <button className="full-recipe-button">
                    <div>
                        <h1>See Full Recipe</h1>
                        <p>Opens a new tab</p>
                    </div>
                </button>
                

            </div>

            <div className = 'card card-back' onDoubleClick={flipCard}>
                <div className = 'back-top-card'>

                </div>

                <div className="back-save-card">

                </div>

                <button className="full-recipe-button">
                    <div>
                        <h1>See Full Recipe</h1>
                        <p>Opens a new tab</p>
                    </div>
                </button>
            </div>
        </ReactCardFlip>
    );
}

export default Card;