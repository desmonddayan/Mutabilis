import './diaryentry.css'

export default function DiaryEntry({diaryEntry, setDiaryEntry, isRecording, setIsRecording, setIsRecordingFalse, existingTextRef, recognitionRef}){


    function setIsRecordingTrue(){

        existingTextRef.current = diaryEntry;
        const SpeechRecognition = window.SpeechRecognition;

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

            setDiaryEntry(existingTextRef.current + transcript);
        }

        recognitionRef.current = recognition;
        recognition.start();
        setIsRecording(true);
    }

    return(
        <>
            <div className="diaryTextBoxContainer">
                <textarea className="diaryEntryTextBox"
                          placeholder="Note flare-ups, diet, events, mood, pillow changes, supplements, hair products, cooking products, and etc..."
                          value = {diaryEntry}
                          onChange={(e) => setDiaryEntry(e.target.value)}/>
                <div className="microphoneButtonContainer">{isRecording ? <button className="microPhoneButton" onClick={() => setIsRecordingFalse()}>Stop</button> : <button className="microPhoneButton" onClick={() => setIsRecordingTrue()}>Start</button>}</div>

            </div>
        </>
    )

}