import './calendarpicturecard.css'

export default function CalendarPictureCard({number, setPopUpStateTrue}){


    return(
        <>
            <div className="faceCardPictureContainer">
                <button onClick={() => setPopUpStateTrue()} className="faceCardButton"><img className="faceCardPicture" alt={number}></img></button>

            </div>
        </>
    )
}