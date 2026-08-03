import './popup.css'
import {useEffect} from "react";

export default function PopUp({popUpState, setPopUpStateFalse}) {

    useEffect(() => {
        if (popUpState) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [popUpState])

    if(popUpState === false){return null}


    return (
        <>
            <div className="popUpBackgroundBlur" onClick={() => setPopUpStateFalse()}>H</div>
            <div className="popUpContainer">
                <div className="popUpHeaderContainer">
                    <div className="popUpDateAndButtonContainer"><h2 className="popUpDate">Monday, June 1, 2026</h2><button className="getOutOfPopUpButton" onClick={() => setPopUpStateFalse()}>X</button></div>
                    <hr className="popUpDividerLine"></hr>
                </div>
                <div className="popUpBodyContainer">
                    <div className="popUpPhotoContainer">
                        <div className="photosTitleContainer"><p className="popUpSectionHeaders">Daily Photos</p></div>
                        <div className="triplePhotosContainer">
                            <div className="photoContainer">
                                <input style={{display: "none"}} type="file" id="photoUpload" accept="image/*"/>
                                <label className="popUpFaceCardImageUpload" htmlFor="photoUpload"></label>
                            </div>
                            <div className="photoContainer">
                                <input style={{display: "none"}} type="file" id="photoUpload" accept="image/*"/>
                                <label className="popUpFaceCardImageUploadMiddle" htmlFor="photoUpload"></label>
                            </div>
                            <div className="photoContainer">
                                <input style={{display: "none"}} type="file" id="photoUpload" accept="image/*"/>
                                <label className="popUpFaceCardImageUpload" htmlFor="photoUpload"></label>
                            </div>
                        </div>
                    </div>
                    <div className="popUpDiaryContainer">
                        <div className="photosTitleContainer"><p className="popUpSectionHeaders">Diary</p><p className="" ></p></div>
                        <div className="diaryTitleContainer"></div>
                        <div className="diaryTextBoxContainer"><textarea className="diaryEntryTextBox" placeholder="Please describe the events of your day..." ></textarea></div>
                    </div>
                </div>
            </div>
        </>
        )
}