import HorizontalNavbar from './HorizontalNavbar.jsx'
import CalendarPictureCard from './CalendarPictureCard.jsx'
import './trackpage.css'
import {supabase} from './supabaseClient.js'
import {PopUp} from './PopUp.jsx'
import {useEffect, useRef, useState} from "react";

function TrackPage({session}){

    const [popUpState, setPopUpState] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [groundingSelectedMonth, setGroundingSelectedMonth] = useState(new Date().getMonth());
    const [groundingSelectedYear, setGroundingSelectedYear] = useState(new Date().getFullYear());
    const [savedPhotoEntries, setSavedPhotoEntries] = useState({});
    const [textAreaInput, setTextAreaInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [selectState, setSelectState] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const [aiReply, setAiReply] = useState("");
    const [chatHistory, setChatHistory] = useState([]);


    const textAreaRef = useRef(null);

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



    useEffect(() => {
        if (!session) return;
        getSavedPhotoEntries();
    }, [session?.user?.id, gridStart, gridEnd]);

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
            setSelectedDates([]);
            getSavedChatHistory();
        } catch(error){
            console.log(error);
        }
    }

    const handleSelectedDatesEntry = (dateKey) => {
        if(selectedDates.includes(dateKey)){
            setSelectedDates(selectedDates.filter(d => d !== dateKey));
        }
        else if(selectedDates.length > 2){
            return;
        }
        else{
            setSelectedDates([...selectedDates, dateKey]);
        }

    }

    function calculateDate(day, month, year){
        setSelectedDay(day);
        setSelectedMonth(month);
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
                <HorizontalNavbar />
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
                        {Array.from({ length: 42 }, (_, i) => {
                            const d = new Date(groundingSelectedYear, groundingSelectedMonth, i - weekdayOffset + 1);
                            const dateKey = toDateKey(d);

                            return (
                                <CalendarPictureCard
                                    key={dateKey}
                                    photoUrl={savedPhotoEntries[dateKey]}
                                    index={d.getDate()}
                                    isSelected={selectedDates.includes(dateKey)}
                                    session={session}
                                    handleClick={() =>
                                        selectState
                                            ? handleSelectedDatesEntry(dateKey)
                                            : calculateDate(d.getDate(), d.getMonth(), d.getFullYear())
                                    }
                                />
                            );
                        })}
                    </div>
                    <PopUp key={`${selectedDay}-${selectedMonth}-${selectedYear}`} popUpState={popUpState} day={selectedDay} month={selectedMonth} year={selectedYear} session={session} setPopUpStateFalse={() => setPopUpState(false)}/>
                    <div className="chatSectionContainer">

                        <div className="chatHeaderContainer">
                        <div className="selectStateButtonAndSelectedContainer">
                            <div className="chatBotHeaderContainer">
                                <button className={`selectStateButton${selectState ? "active" : ""}`} onClick={() => setSelectState(prev => !prev)}>Date Select Mode</button>
                            </div>
                            <div className="selectedDatesContainer">
                                <div className="selectedDatesText"><p>Selected Dates: </p>
                                    <div className="selectedDatesTextInnerContainer">
                                        {selectedDates.length === 0 ? "Nothing Selected" : selectedDates.map((d, i) => (
                                                <div key={i} className="selectedDateText">{d}</div>
                                            )
                                        )
                                            }</div>
                                </div>
                            </div>
                        </div>
                            <button className="chatClearButtonContainer" onClick={() => setSelectedDates([])}>
                                Clear Selections
                            </button>
                        </div>


                        <hr className="popUpDividerLineFive" />
                        <div className="claudeChatContainer">
                            <div className="chatMessageContainer">
                                {chatHistory.map((m,i) => (
                                    <div className={`individualMessageContainer${m.role}`} key={i}>
                                        <div className={`chatHistoryMessageContainer${m.role}`}>{m.message}</div>
                                    </div>
                                ))}
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