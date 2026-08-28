import './diaryentry.css'
import {useRef, useState} from 'react'

export default function DiaryEntry(){

    const recognitionRef = useRef(null);
    const existingTextRef = useRef('');
    const [diaryEntry, setDiaryEntry] = useState("");
    const [isRecording, setIsRecording] = useState(false);

    function setIsRecordingTrue(){
        existingTextRef.current = diaryEntry;
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if(!SpeechRecognition){
            alert("Speech recognition is not supported in this browser");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results).map(result => result[0].transcript).join('');
            setDiaryEntry(existingTextRef + transcript);
        }

        recognitionRef.current = recognition;
        recognition.start();
        setIsRecording(true);
    }
    function setIsRecordingFalse(){
        if(recognitionRef.current){
            recognitionRef.current.stop();
            setIsRecording(false);
        }
    }

    return(
        <>
            <div className="diaryTextBoxContainer">
                <textarea className="diaryEntryTextBox"
                          placeholder="Please describe the events of your day..."
                          value = {diaryEntry}
                          onChange={(e) => setDiaryEntry(e.target.value)}/>
                {isRecording ? <button className="microPhoneButton" onClick={setIsRecordingTrue}>Start</button> : <button className="microPhoneButton" onClick={setIsRecordingFalse}>Stop</button>}
            </div>
        </>
    )

}