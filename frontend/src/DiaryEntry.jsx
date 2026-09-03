import './diaryentry.css'

export default function DiaryEntry({diaryEntry, setDiaryEntry, isRecording, setIsRecording, existingTextRef, recognitionRef}){


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
    function setIsRecordingFalse(){
        if(recognitionRef.current){
            recognitionRef.current.onend = () => {
                setDiaryEntry(prev => prev + ". ");
                existingTextRef.current = existingTextRef.current + ". ";
            }
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
                {isRecording ? <button className="microPhoneButton" onClick={() => setIsRecordingFalse()}>Stop</button> : <button className="microPhoneButton" onClick={() => setIsRecordingTrue()}>Start</button>}
            </div>
        </>
    )

}