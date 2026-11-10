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
                          onChange={(e) => setDiaryEntry(e.target.value)}>
                </textarea>
                <div className="microphoneButtonContainer">{isRecording ? <button className="microPhoneButtonOff" onClick={() => setIsRecordingFalse()}><svg xmlns="http://www.w3.org/2000/svg" className="microPhoneIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="13" rx="3" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></svg></button> : <button className="microPhoneButton" onClick={() => setIsRecordingTrue()}>    <svg xmlns="http://www.w3.org/2000/svg" className="microPhoneIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="13" rx="3" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></svg></button>}</div>
                {/*<div className="microphoneButtonContainer">{isRecording ? <button className="microPhoneButton" onClick={() => setIsRecordingFalse()}>Stop</button> : <button className="microPhoneButton" onClick={() => setIsRecordingTrue()}>    <svg xmlns="http://www.w3.org/2000/svg" className="microPhoneIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="13" rx="3" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></svg></button>}</div>*/}
            </div>
        </>
    )

}