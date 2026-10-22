import './calendarpicturecard.css'

export default function CalendarPictureCard({handleClick, index, photoUrl}){

    return(
        <>
            <div className="faceCardPictureContainer">
                <button onClick={() => handleClick()} className="faceCardButton">
                    {photoUrl && <img className="faceCardPicture" src={photoUrl} alt={`Day ${index}`} />}
                    <div className="pointerContainer">
                    <p className="indexOfCard">{index}</p>
                        {photoUrl ? null : (                    <svg className="pointerButton" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                            <path d="M5 3 L5 19 L9.5 15 L12.5 21 L15 20 L12 14 L18 14 Z" />
                        </svg>)}
                    </div>
                </button>
            </div>
        </>
    )
}