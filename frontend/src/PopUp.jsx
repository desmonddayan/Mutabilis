import './popup.css'
import DiaryEntry from './DiaryEntry'
import {useEffect, useRef, useState} from "react";

export function PopUp({popUpState, setPopUpStateFalse, day, month, year}) {

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const [sleepCount, setSleepCount] = useState(8);
    const [waterCount, setWaterCount] = useState(2);
    const [stressCount, setStressCount] = useState(0);
    const [waterUnitState, setWaterUnitState] = useState("Litres");
    const recognitionRef = useRef(null);
    const existingTextRef = useRef("");
    const [diaryEntry, setDiaryEntry] = useState("");
    const [isRecording, setIsRecording] = useState(false);


    useEffect(() => {
        if (popUpState) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [popUpState])

    if (popUpState === false) {
        return null
    }

    function waterUnit(){
        if(waterUnitState === "Litres"){
            if(waterCount === 1){
                return "Litre";}
            else{return "Litres";}
        }
        else{
            if(waterCount === 1){
                return "Cup";
            }
            else{
                return "Cups";
            }
        }
    }
    function stressUnit(){
        if(stressCount === 0){
            return "None";
        }
        else if (stressCount === 1){
            return "Mild";
        }
        else if(stressCount === 2){
            return "Moderate";
        }
        else if(stressCount === 3){
            return "High";
        }
        else{
            return "Severe";
        }
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

    return (
        <>
            <div className="popUpBackgroundBlur" onClick={() => {setPopUpStateFalse(); setIsRecordingFalse()}}></div>
            <div className="popUpContainer">
                <div className="popUpHeaderContainer">
                    <div className="popUpDateAndButtonContainer">
                        <div>
                            <p className="subText">Selfies and Diary</p>
                            <h2 className="popUpDate">{day} {months[month]} {year}</h2>
                        </div>
                        <button className="getOutOfPopUpButton" onClick={() => {setPopUpStateFalse(); setIsRecordingFalse()}}>X</button>
                    </div>
                </div>
                <hr className="popUpDividerLine"></hr>
                <div className="popUpBodyContainer">
                    <div className="popUpPhotoContainer">
                        <p className="headlineText">Selfies (Same Lighting and Framing)</p>
                        <div className="triplePhotosContainer">
                            <div className="photoContainer">
                                <input style={{display: "none"}} type="file" id="photoUpload" accept="image/*"/>
                                <label className="popUpFaceCardImageUpload" htmlFor="photoUpload"><div className="text">
                                    <p className="textOne">Left</p>
                                    <p className="textTwo">Tap & Drag to Upload</p>
                                </div></label>
                            </div>
                            <div className="middlePhotoContainer">
                                <input style={{display: "none"}} type="file" id="photoUpload" accept="image/*"/>
                                <label className="popUpFaceCardImageUploadMiddle" htmlFor="photoUpload"><div className="text"><p className="textOne">Middle</p>
                                    <p className="textTwo">Tap & Drag to Upload</p></div></label>
                            </div>
                            <div className="photoContainer">
                                <input style={{display: "none"}} type="file" id="photoUpload" accept="image/*"/>
                                <label className="popUpFaceCardImageUpload" htmlFor="photoUpload"><div className="text"><p className="textOne">Right</p>
                                    <p className="textTwo">Tap & Drag to Upload</p></div></label>
                            </div>
                        </div>
                    </div>
                    <div className="popUpDiaryContainer">
                        <div className="photosTitleContainer">
                            <p className="headlineText">Diary (Journal Every Event)</p>
                         </div>
                        <DiaryEntry
                            recognitionRef = {recognitionRef}
                            existingTextRef = {existingTextRef}
                            setIsRecordingFalse = {setIsRecordingFalse}
                            diaryEntry = {diaryEntry}
                            setDiaryEntry = {setDiaryEntry}
                            isRecording = {isRecording}
                            setIsRecording = {setIsRecording}
                        />
                    </div>
                    <div className="popUpRoutineAndLifeStyleFactorContainer">
                        <div className="routinePopUpContainer">
                            <p className="headlineText">Routine</p>
                            <div className="subRoutineContainer">
                                <div className="dayRoutineContainer">h</div>
                                <div className="nightRoutineContainer">h</div>
                            </div>
                        </div>
                        <div className="lifeStyleFactorContainer">
                            <p className="headlineText">Lifestyle</p>
                            <div className="lifeStyleFactorCountContainer">
                                <div className="singleLifeStyleFactorContainer">
                                    <p className="factor">Sleep</p>
                                    <div className="counterContainer">
                                        <button className="counterButton" onClick={() => {if(sleepCount > 0){setSleepCount(sleepCount - 1)}}}><b>-</b></button>
                                        <p className="countedCounter">{sleepCount} {sleepCount === 1 ? 'Hour': 'Hours'}</p>
                                        <button className="counterButton" onClick={() => {if(sleepCount < 24){setSleepCount(sleepCount + 1)}}}><b>+</b></button>
                                    </div>
                                </div>
                                <div className="singleLifeStyleFactorContainer">
                                    <div className="waterIntakeContainer">
                                        <p className="factor">Water</p>
                                        <div className="waterUnitButtonContainer">
                                            <button className="waterUnitButton" onClick={() => setWaterUnitState("Litres")}>Litres</button>
                                            <button className="waterUnitButton" onClick={() => setWaterUnitState("Cups")}>Cups</button>
                                        </div>
                                    </div>
                                    <div className="counterContainer">
                                        <button className="counterButton" onClick={() => {if(waterCount > 0){setWaterCount(waterCount - 0.25)}}}><b>-</b></button>
                                        <p className="countedCounter">{waterCount} {waterUnit()}</p>
                                        <button className="counterButton" onClick={() => setWaterCount(waterCount + 0.25)}><b>+</b></button>
                                    </div>
                                </div>
                                <div className="singleLifeStyleFactorContainer">
                                    <p className="factor">Stress</p>
                                    <div className="counterContainer">
                                        <button className="counterButton" onClick={() => {if(stressCount > 0){setStressCount(stressCount - 1)}}}><b>&lt;</b></button>
                                        <p className="countedCounter">{stressUnit()}</p>
                                        <button className="counterButton" onClick={() => {if(stressCount < 4){setStressCount(stressCount + 1)}}}><b>&gt;</b></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="popUpDividerLine"></hr>
                <div className="submitButtonContainer">
                    <button className="saveEntryButton" onClick={()=>{setPopUpStateFalse(); setIsRecordingFalse()}}><b>Save Entry</b></button>
                </div>
            </div>
        </>
    )
}