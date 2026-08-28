import './calendarpicturecard.css'

export default function CalendarPictureCard({getSelectedDate, index}){

    return(
        <>
            <div className="faceCardPictureContainer">
                <button onClick={() => getSelectedDate()} className="faceCardButton"><img className="faceCardPicture"  alt={index}></img>
                    <p className="indexOfCard">{index}</p>
                </button>
            </div>
        </>
    )
}