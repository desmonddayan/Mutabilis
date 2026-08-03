import VerticalNavbar from './VerticalNavbar.jsx'
import CalendarPictureCard from './CalendarPictureCard.jsx'
import './trackpage.css'
import PopUp from './PopUp.jsx'
import {useEffect, useState} from "react";

function TrackPage({session}){

    const [popUpState, setPopUpState] = useState(false);

    const numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35]

    useEffect(() => {

    }, [])

    return(
        <>
            <div className="screen">
                <VerticalNavbar />
                <div className="contentScreenTrack">
                    <div className="weekDatesContainer">
                        <p className="weekDates">Monday</p>
                        <p className="weekDates">Tuesday</p>
                        <p className="weekDates">Wednesday</p>
                        <p className="weekDates">Thursday</p>
                        <p className="weekDates">Friday</p>
                        <p className="weekDates">Saturday</p>
                        <p className="weekDates">Sunday</p>
                    </div>

                    <div className='calendarGrid'>
                        {numbers.map(number => (

                            <CalendarPictureCard key={number} session={session} setPopUpStateTrue={() => setPopUpState(true)} number={number}/>
                        ))}
                    </div>
                    <PopUp popUpState={popUpState} setPopUpStateFalse={() => setPopUpState(false)}/>
                </div>
            </div>
        </>
    )

}
export default TrackPage;