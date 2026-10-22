import VerticalNavbar from './VerticalNavbar.jsx'
import CalendarPictureCard from './CalendarPictureCard.jsx'
import './trackpage.css'
import {supabase} from './supabaseClient.js'
import {PopUp} from './PopUp.jsx'
import {useEffect, useRef, useState} from "react";

function TrackPage({session}){

    const [popUpState, setPopUpState] = useState(false);
    const [weekdayNumber, setWeekDayNumber] = useState(0);
    const [lastDateOfMonth, setLastDateOfMonth] = useState(0);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [groundingSelectedMonth, setGroundingSelectedMonth] = useState(new Date().getMonth());
    const [groundingSelectedYear, setGroundingSelectedYear] = useState(new Date().getFullYear());
    const [lastDateOfLastMonth, setLastDateOfLastMonth] = useState(null);
    const [savedPhotoEntries, setSavedPhotoEntries] = useState({});
    const [textAreaInput, setTextAreaInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [selectState, setSelectState] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const [aiReply, setAiReply] = useState("");
    const [chatHistory, setChatHistory] = useState([]);


    const textAreaRef = useRef(null);
    const bottomRef = useRef(null);

    const toDateKey = (d) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    const firstOfMonth = new Date(groundingSelectedYear, groundingSelectedMonth, 1);
    const weekdayOffset = firstOfMonth.getDay() === 0 ? 6 : firstOfMonth.getDay() - 1;

    const gridStart = toDateKey(new Date(groundingSelectedYear, groundingSelectedMonth, 1 - weekdayOffset));
    const gridEnd   = toDateKey(new Date(groundingSelectedYear, groundingSelectedMonth, 41 - weekdayOffset));


    const getSavedChatHistory = async() => {
        const response = await fetch(`http://localhost:8080/api/v1/chat/getChatHistory`, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${session.access_token}`}
        })
        const data = await response.json();
        setChatHistory(data)
    }
    useEffect(() => {
        getSavedChatHistory();
    }, [])
    const getSavedPhotoEntries = async() => {
        const response = await fetch(`http://localhost:8080/api/v1/dailyEntry/getPhotoEntry?startDate=${gridStart}&endDate=${gridEnd}`,{
            method: 'GET',
            headers: {'Authorization': `Bearer ${session.access_token}`}
        })

        const data = await response.json();

        const paths = data.map(e => e.middleFacePhotoPath).filter(Boolean);

        let urlByPath = {};
        if (paths.length > 0) {
            const { data: signed, error } = await supabase.storage
                .from("skin-photos")
                .createSignedUrls(paths, 3600);
            if (!error) {
                urlByPath = Object.fromEntries(
                    signed.filter(s => s.signedUrl).map(s => [s.path, s.signedUrl])
                );
            }
        }

        const byDate = {};
        data.forEach(e => {
            byDate[e.entryDate] = urlByPath[e.middleFacePhotoPath] ?? null;
        });
        setSavedPhotoEntries(byDate);
    }
    useEffect(()=>{
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        setGroundingSelectedMonth(month);
        setGroundingSelectedYear(year);
    },[])

    useEffect(()=>{
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages])

    useEffect(() => {
        if (!session) return;
        getSavedPhotoEntries();
    }, [session?.user?.id, gridStart, gridEnd]);

    useEffect( () => {
        if(groundingSelectedMonth == null) return
        const firstDay = new Date(groundingSelectedYear, groundingSelectedMonth, 1);
        setWeekDayNumber(firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1);
        setLastDateOfMonth(new Date(groundingSelectedYear,groundingSelectedMonth + 1, 0).getDate());
        const previousMonthsDate = new Date(groundingSelectedYear, groundingSelectedMonth, 0).getDate();
        setLastDateOfLastMonth(previousMonthsDate - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1) + 1);
    },[groundingSelectedMonth, groundingSelectedYear]);

    const sendMessage = async() => {
        const next = [...messages, {role: "user", text : textAreaInput}];
        setMessages(next);
        try{
            const response = await fetch(`http://localhost:8080/api/v1/chat/sendMessage`, {
                method: 'POST',
                headers: {'Authorization': `Bearer ${session.access_token}`,
                "Content-Type": 'application/json',},
                body: JSON.stringify({
                    selectedDates: selectedDates,
                    textAreaInput: textAreaInput
                }),
            })
            const data = await response.text();
            setAiReply(data);
            setTextAreaInput('');
            getSavedChatHistory();
        } catch(error){
            console.log(error);
        }
    }

    const handleSelectedDatesEntry = (dateKey) => {
        if(selectedDates.includes(dateKey)){
            setSelectedDates(selectedDates.filter(d => d !== dateKey));
        }
        else{
            setSelectedDates([...selectedDates, dateKey]);
        }

    }


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
        setPopUpState(true)
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
                        const d = new Date(groundingSelectedYear, groundingSelectedMonth, i - weekdayOffset + 1)
                        const dateKey = toDateKey(d);

                        if(i < weekdayNumber){
                            return(<CalendarPictureCard
                                key={dateKey}
                                photoUrl={savedPhotoEntries[dateKey]}
                                index={i + lastDateOfLastMonth}
                                session={session}
                                handleClick={() => selectState ? handleSelectedDatesEntry(dateKey) : calculateDate(i + lastDateOfLastMonth, -1, groundingSelectedMonth - 1 < 0 ? groundingSelectedYear - 1: groundingSelectedYear)}
                                />)
                        }else if((i - weekdayNumber) >= lastDateOfMonth){

                            return(<CalendarPictureCard
                                key={dateKey}
                                photoUrl={savedPhotoEntries[dateKey]}
                                index={i % lastDateOfMonth - weekdayNumber + 1}
                                session={session}
                                handleClick={() => selectState ? handleSelectedDatesEntry(dateKey) :  calculateDate(i % lastDateOfMonth - weekdayNumber + 1, 1, groundingSelectedMonth + 1 > 12 ? groundingSelectedYear + 1: groundingSelectedYear)}
                                />)
                        }
                        else{
                            return(<CalendarPictureCard
                                key={dateKey}
                                photoUrl={savedPhotoEntries[dateKey]}
                                index = {i + 1 - weekdayNumber}
                                session={session}
                                handleClick={() => selectState ? handleSelectedDatesEntry(dateKey) : calculateDate(i - weekdayNumber + 1, 0, groundingSelectedYear)}
                            />)}
                    })}
                    </div>
                    <PopUp key={`${selectedDay}-${selectedMonth}-${selectedYear}`} popUpState={popUpState} day={selectedDay} month={selectedMonth} year={selectedYear} session={session} setPopUpStateFalse={() => setPopUpState(false)}/>
                    <div className="chatSectionContainer">
                        <div className="selectRow">
                            <button className="selectStateButton" onClick={() => setSelectState(prev => !prev)}>Select Mode: {selectState ? "ON" : "OFF"}</button>
                            <div className="selectedDatesContainer">
                                <div className="selectedDatesText">Selected Dates: </div>
                                {selectedDates.map((d, i) => (
                                        <div key={i} className="selectedDateText">{d}</div>
                                    )
                                )}
                            </div>
                        </div>
                        <hr className="popUpDividerLineTwo" />

                        <div className="claudeChatContainer">
                            <div className="chatMessageContainer">
                                {chatHistory.map((m,i) => (
                                    <div className={`individualMessageContainer${m.role}`} key={i}>
                                        <div className={`chatHistoryMessageContainer${m.role}`}>{m.message}</div>
                                    </div>
                                ))}
                                <div ref={bottomRef}></div>
                            </div>
                            <div className="chatInputAndSelectContainer">

                                <div className="chatInputContainer">
                                    <textarea
                                        ref={textAreaRef}
                                        className="chatInputTextArea"
                                        rows = {1}
                                        placeholder="Ask about your skin..."
                                        value={textAreaInput}
                                        onChange={e => setTextAreaInput(e.target.value)}
                                        onKeyDown={e => {if(e.key === 'Enter' && !e.shiftKey){e.preventDefault(); sendMessage()}}}
                                    />
                                    <button className="sendQueryButton" onClick={() => sendMessage()}>Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}
export default TrackPage;