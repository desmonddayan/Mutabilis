import VerticalNavbar from './VerticalNavbar.jsx'
import CalendarPictureCard from './CalendarPictureCard.jsx'
import './trackpage.css'
import {PopUp} from './PopUp.jsx'
import {useEffect, useState} from "react";

function TrackPage({session}){

    const [popUpState, setPopUpState] = useState(false);
    const [weekdayNumber, setWeekDayNumber] = useState(0);
    const [lastDateOfMonth, setLastDateOfMonth] = useState(0);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [groundingSelectedMonth, setGroundingSelectedMonth] = useState(null);
    const [groundingSelectedYear, setGroundingSelectedYear] = useState(null);
    const [lastDateOfLastMonth, setLastDateOfLastMonth] = useState(null);

    useEffect(()=>{
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        setGroundingSelectedMonth(month);
        setGroundingSelectedYear(year);
    },[])

    useEffect( () => {
        if(groundingSelectedMonth == null) return
        const firstDay = new Date(groundingSelectedYear, groundingSelectedMonth, 1);
        setWeekDayNumber(firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1);
        setLastDateOfMonth(new Date(groundingSelectedYear,groundingSelectedMonth + 1, 0).getDate());
        const previousMonthsDate = new Date(groundingSelectedYear, groundingSelectedMonth, 0).getDate();
        setLastDateOfLastMonth(previousMonthsDate - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1) + 1);
    },[groundingSelectedMonth, groundingSelectedYear]);

    function calculateDate(day, month, year){
        setSelectedDay(day);
        if(groundingSelectedMonth - 1 < 0){
            setSelectedMonth(11);
        }
        else if(groundingSelectedMonth + 1 > 11){
            setSelectedMonth(0);
        }
        else{
            setSelectedMonth(groundingSelectedMonth + month);
        }
        setSelectedYear(year);
        setPopUpState(true);
    }

    function back(){
        if(groundingSelectedMonth - 1 < 0){
            setGroundingSelectedYear(groundingSelectedYear - 1)
            setGroundingSelectedMonth(11)
        }
        else{
            setGroundingSelectedMonth(groundingSelectedMonth - 1)
        }
    }
    function forward(){
        if(groundingSelectedMonth + 1 > 11){
            setGroundingSelectedYear(groundingSelectedYear + 1)
            setGroundingSelectedMonth(0)
        }
        else{
            setGroundingSelectedMonth(groundingSelectedMonth + 1)
        }
    }
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return(
        <>
            <div className="screen">
                <VerticalNavbar />
                <div className="contentScreenTrack">
                    <div className="trackPageHeaderContainer">
                            <h2 className="monthAndYearTitle">{months[groundingSelectedMonth]} {groundingSelectedYear}</h2>
                        <div className="trackPageMonthChangeButtonContainer">
                            <button className="calendarBackButton" onClick={()=> back()}>&lt;</button>
                            <button className="calendarForwardButton" onClick={()=> forward()}>&gt;</button>
                        </div>
                    </div>
                    <hr className="popUpDividerLineOne"></hr>

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
                    {Array.from({length: 42}, (_, i) => {
                        if(i < weekdayNumber){
                            return(<CalendarPictureCard
                                key={`${i}-${groundingSelectedMonth}`}
                                index={i + lastDateOfLastMonth}
                                session={session}
                                getSelectedDate={() => calculateDate(i + lastDateOfLastMonth, -1, groundingSelectedMonth - 1 < 0 ? groundingSelectedYear - 1: groundingSelectedYear)}
                                />)
                        }else if((i - weekdayNumber) >= lastDateOfMonth){

                            return(<CalendarPictureCard
                                key={`${i}-${groundingSelectedMonth}`}
                                index={i % lastDateOfMonth - weekdayNumber + 1}
                                session={session}
                                getSelectedDate={() => calculateDate(i % lastDateOfMonth - weekdayNumber + 1, 1, groundingSelectedMonth + 1 > 12 ? groundingSelectedYear + 1: groundingSelectedYear)}
                                />)
                        }
                        else{
                            return(<CalendarPictureCard
                                key={`${i}-${groundingSelectedMonth}`}
                                index = {i + 1 - weekdayNumber}
                                session={session}
                                getSelectedDate={() => calculateDate(i - weekdayNumber + 1, 0, groundingSelectedYear)}
                            />)}
                    })}
                    </div>
                    <PopUp popUpState={popUpState} day={selectedDay} month={selectedMonth} year={selectedYear} session={session} setPopUpStateFalse={() => setPopUpState(false)}/>
                </div>
            </div>
        </>
    )

}
export default TrackPage;