import './popup.css'
import DiaryEntry from './DiaryEntry'
import {useEffect, useState} from "react";

export function PopUp({popUpState, setPopUpStateFalse, day, month, year}) {

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const [sleepCount, setSleepCount] = useState(8);
    const [waterCount, setWaterCount] = useState(2);
    const [stressCount, setStressCount] = useState(0);
    const [waterUnitState, setWaterUnitState] = useState("Litres");



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


    return (
        <>
            <div className="popUpBackgroundBlur" onClick={() => setPopUpStateFalse()}></div>
            <div className="popUpContainer">
                <div className="popUpHeaderContainer">
                    <div className="popUpDateAndButtonContainer">
                        <div>
                            <p className="subText">Daily Check-In</p>
                            <h2 className="popUpDate">{day} {months[month]} {year}</h2>
                        </div>
                        <button className="getOutOfPopUpButton" onClick={() => setPopUpStateFalse()}>X</button>
                    </div>
                </div>
                <hr className="popUpDividerLine"></hr>
                <div className="popUpBodyContainer">
                    <div className="popUpPhotoContainer">
                        <div className="photosTitleContainer">
                            <p className="popUpSectionHeaders">Daily Photos</p>
                            <p className="subText">Same lighting & framing each day</p>
                        </div>
                        <div className="triplePhotosContainer">
                            <div className="photoContainer">
                                <input style={{display: "none"}} type="file" id="photoUpload" accept="image/*"/>
                                <label className="popUpFaceCardImageUpload" htmlFor="photoUpload"><div className="text">
                                    <p className="textOne">Left</p>
                                    <p className="textTwo">Tap & Drag to Upload</p>
                                </div></label>
                            </div>
                            <div className="photoContainer">
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
                            <p className="popUpSectionHeaders">Diary</p>
                            <p className="subText">Note flare-ups, diet, events, mood, pillow changes, supplements, hair and cooking products -- the AI reads this for patterns</p></div>
                        <DiaryEntry />
                    </div>
                    <div className="popUpRoutineAndLifeStyleFactorContainer">
                        <div className="routineContainer">
                            <p className="routineTitleText">Routine</p>
                            <hr className="popUpDividerLine"></hr>
                            <div className="subRoutineContainer">
                                <div className="dayRoutineContainer">h</div>
                                <div className="nightRoutineContainer">h</div>
                            </div>
                        </div>
                        <div className="lifeStyleFactorContainer">
                            <p className="lifeStyleFactorTitleText">Lifestyle Factors</p>
                            <hr className="popUpDividerLine"></hr>
                            <div className="lifeStyleFactorCountContainer">
                                <div className="singleLifeStyleFactorContainer">
                                    <p className="factor">Sleep</p>
                                    <div className="counterContainer">
                                        <button className="counterButton" onClick={() => {if(sleepCount > 0){setSleepCount(sleepCount - 1)}}}>-</button>
                                        <p className="countedCounter">{sleepCount} {sleepCount === 1 ? 'Hour': 'Hours'}</p>
                                        <button className="counterButton" onClick={() => {if(sleepCount < 24){setSleepCount(sleepCount + 1)}}}>+</button>
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
                                        <button className="counterButton" onClick={() => {if(waterCount > 0){setWaterCount(waterCount - 0.25)}}}>-</button>
                                        <p className="countedCounter">{waterCount} {waterUnit()}</p>
                                        <button className="counterButton" onClick={() => setWaterCount(waterCount + 0.25)}>+</button>
                                    </div>
                                </div>
                                <div className="singleLifeStyleFactorContainer">
                                    <p className="factor">Stress</p>
                                    <div className="counterContainer">
                                        <button className="counterButton" onClick={() => {if(stressCount > 0){setStressCount(stressCount - 1)}}}>&lt;</button>
                                        <p className="countedCounter">{stressUnit()}</p>
                                        <button className="counterButton" onClick={() => {if(stressCount < 4){setStressCount(stressCount + 1)}}}>&gt;</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="popUpDividerLine"></hr>
                <div className="submitButtonContainer">
                    <button className="saveEntryButton"><b>Save Entry</b></button>
                </div>
            </div>
        </>
    )
}