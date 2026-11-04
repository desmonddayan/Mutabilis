import './calendarpicturecard.css'

export default function CalendarPictureCard({handleClick, index, photoUrl, isSelected}){

    return(
        <>
            <div className={`faceCardPictureContainer${isSelected ? "Selected" : ""}`}>
                <button onClick={() => handleClick()} className="faceCardButton">
                    {photoUrl && <img className="faceCardPicture" src={photoUrl} alt={`Day ${index}`} />}
                    <div className="pointerContainer">
                    <p className="indexOfCard">{index}</p>
                    </div>
                </button>
            </div>
        </>
    )
}