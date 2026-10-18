import './popup.css'
import Routine from './Routine'
import DiaryEntry from './DiaryEntry'
import {useEffect, useRef, useState} from "react";
import {supabase} from "./supabaseClient.js";

export function PopUp({popUpState, setPopUpStateFalse, day, month, year, session}) {

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const [sleepCount, setSleepCount] = useState(8);
    const [waterCount, setWaterCount] = useState(2);
    const [stressCount, setStressCount] = useState(0);
    const [waterUnitState, setWaterUnitState] = useState("Litres");
    const recognitionRef = useRef(null);
    const existingTextRef = useRef("")
    const [selectedRoutineArray, setSelectedRoutineArray] = useState([])
    const [diaryEntry, setDiaryEntry] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [leftFacePhoto, setLeftFacePhoto] = useState("");
    const [middleFacePhoto, setMiddleFacePhoto] = useState("");
    const [rightFacePhoto, setRightFacePhoto] = useState("");
    const [photoFiles, setPhotoFiles] = useState({left: null, middle: null, right: null});

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

    function handlePhotoSubmission(slot, event){
        const file = event.target.files[0];
        if (!file) return;

        const photoUrl = URL.createObjectURL(file);

        setPhotoFiles(prev => ({...prev, [slot]: file}))

        if(slot === "left"){
            setLeftFacePhoto(photoUrl);
        }
        else if (slot === "middle"){
            setMiddleFacePhoto(photoUrl);
        }
        else if (slot === "right"){
            setRightFacePhoto(photoUrl);
        }

        event.target.value = "";
    }

    const resizeImage = async(file, maxSize = 1200) => {
        const bitmap = await createImageBitmap(file)
        const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);
        canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        return new Promise((resolve => canvas.toBlob(resolve, "image/jpeg", 0.8)));
    }

    const uploadFacePhoto = async(file, date, slot) => {
        const blob = await resizeImage(file);
        if(!blob) return null;
        const path = `${session.user.id}/${date}/${slot}.jpg`;

        const {error} = await supabase.storage.from("skin-photos").upload(path, blob, {upsert: true, contentType: "image/jpeg"});

        if(error){
            console.log(error)
            return null
        }
        return path
    }

    const handleDailyEntry = async(diaryEntry, sleepCount, waterCount, waterUnitState, stressUnit, selectedRoutineArray) => {
        const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const paths = {}

        for(const slot of ["left","middle","right"]){
            const file = photoFiles[slot]
            if (!file) continue;

            const path = await uploadFacePhoto(file, date, slot);
            if(!path) return;
            paths[slot] = path;
        }

        const response = await fetch(`http://localhost:8080/api/v1/dailyEntry/add`, {
            method: 'POST',
            headers: {'Authorization': `Bearer ${session.access_token}`, "Content-Type": "application/json"},
            body: JSON.stringify({
                entryDate: date,
                diaryEntry,
                waterCount,
                waterUnitState,
                stressUnit,
                sleepCount,
                leftFacePhotoPath: paths.left ?? null,
                middleFacePhotoPath: paths.middle ?? null,
                rightFacePhotoPath: paths.right ?? null,
                routineIds: selectedRoutineArray
            })
        })


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
                                <input style={{display: "none"}} type="file" id="photoUploadLeft" accept="image/*" onChange={(e) => handlePhotoSubmission("left", e)}/>
                                <label className="popUpFaceCardImageUpload" htmlFor="photoUploadLeft">
                                    {leftFacePhoto ? (
                                        <img className="uploadedPhotoContainer" src={leftFacePhoto} alt=""/>
                                    ) : (
                                        <div className="text">
                                            <p className="textOne">Left</p>
                                            <p className="textTwo">Tap & Drag to Upload</p>
                                        </div>
                                    )}
                                </label>
                            </div>
                            <div className="middlePhotoContainer">
                                <input style={{display: "none"}} type="file" id="photoUploadMiddle" accept="image/*" onChange={(e) => handlePhotoSubmission("middle", e)}/>
                                <label className="popUpFaceCardImageUploadMiddle" htmlFor="photoUploadMiddle">
                                    {middleFacePhoto ? (
                                        <img className="uploadedPhotoContainer" src={middleFacePhoto} alt=""/>
                                    ) : (
                                        <div className="text">
                                            <p className="textOne">Middle</p>
                                            <p className="textTwo">Tap & Drag to Upload</p>
                                        </div>
                                    )}
                                </label>
                            </div>
                            <div className="photoContainer">
                                <input style={{display: "none"}} type="file" id="photoUploadRight" accept="image/*" onChange={(e) => handlePhotoSubmission("right", e)} />
                                <label className="popUpFaceCardImageUpload" htmlFor="photoUploadRight">
                                    {rightFacePhoto ? (
                                        <img className="uploadedPhotoContainer" src={rightFacePhoto} alt=""/>
                                    ) : (
                                        <div className="text">
                                            <p className="textOne">Right</p>
                                            <p className="textTwo">Tap & Drag to Upload</p>
                                        </div>
                                    )}

                                </label>
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
                                <Routine session={session} parentIndex={"popUp"}  selectedRoutineArray={selectedRoutineArray} setSelectedRoutineArray={setSelectedRoutineArray} />
                        </div>
                        <div className="lifeStyleFactorContainer">
                            <div className="lifeStyleFactorHeadlineTextContainer">
                                <p className="headlineText">Lifestyle</p>
                            </div>
                            <hr className="subDivider"></hr>
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
                    <button className="saveEntryButton" onClick={()=>{setPopUpStateFalse(); setIsRecordingFalse(); handleDailyEntry(diaryEntry, sleepCount, waterCount, waterUnitState, stressUnit(), selectedRoutineArray)}}><b>Save Entry</b></button>
                </div>
            </div>
        </>
    )
}