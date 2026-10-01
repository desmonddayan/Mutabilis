import VerticalNavbar from './VerticalNavbar.jsx'
import './homepage.css'
import {Link} from 'react-router-dom'
import {useState} from "react";


function HomePage({session}){

    const [routinePopUpState, setRoutinePopUpState] = useState(false)
    const [routineName, setRoutineName] = useState('')
    const [dayTimeCheckedState, setDayTimeCheckedState] = useState(false)
    const [stepCount, setStepCount] = useState(1)
    const [productArray, setProductArray] = useState([])
    const [productName, setProductName] = useState('')
    const [routineTime, setRoutineTime] = useState('')
    const [timeButtonStyleOne, setTimeButtonStyleOne] = useState("timeButtonStyleGray")
    const [timeButtonStyleTwo, setTimeButtonStyleTwo] = useState("timeButtonStyleGray")
    const [timeButtonStyleThree, setTimeButtonStyleThree] = useState("timeButtonStyleGray")


    // Get User Data On Their Routine and Notes
    // async function getUserProfile(){
    //     const session = await Session();
    //     await fetch('http://localhost/api/v1/users/me',{
    //             method: 'GET',
    //             headers: {'Authorization': `Bearer ${session.access_token}`, ContentType: 'application/json'},
    //             body: JSON.stringify({})
    //         }
    //     )
    // }
    //
    const handleProductEntry = async(productName) => {
        const response = await fetch(`http://localhost:8080/api/v1/products/search?productName=${productName}`, {
            method: 'POST',
            headers: {'Authorization': `Bearer ${session.access_token}`}
        })

        const productList = response.json();
    }

    function handleRoutineEntry(){

    }

    function handleTimeButtonClick(buttonNumber){
        if(buttonNumber === 1){
            setTimeButtonStyleOne("timeButtonStyleBlue");
            setTimeButtonStyleTwo("timeButtonStyleGray");
            setTimeButtonStyleThree("timeButtonStyleGray");
        }
        else if(buttonNumber === 2){
            setTimeButtonStyleOne("timeButtonStyleGray");
            setTimeButtonStyleTwo("timeButtonStyleBlue");
            setTimeButtonStyleThree("timeButtonStyleGray");
        }
        else{
            setTimeButtonStyleOne("timeButtonStyleGray");
            setTimeButtonStyleTwo("timeButtonStyleGray");
            setTimeButtonStyleThree("timeButtonStyleBlue");
        }
    }

    return(
        <>
            <div className="screen">
                <VerticalNavbar />
                <div className="contentScreen">
                    <div className="contentContainer">
                        <div className="userInformationContainer">
                            <div className="userInformation">
                                <img className="profilePictureHomePage" src={session?.user?.user_metadata?.avatar_url}  alt="User Profile Picture"/>
                                <div className="messageContainer">
                                    <h2 className="welcomeMessage">Welcome!</h2>
                                    <h2 className="userName">{session.user.user_metadata.full_name}</h2>
                                </div>
                            </div>
                            <Link to="/track"><button className="trackPageRedirect">Today's Check In</button></Link>
                        </div>
                        <hr className="popUpDividerLineTwo"></hr>
                        <div className="routineAndNoteContainer">
                            <div className="routineContainer">

                                <div className="routineTextAndButtonContainer">
                                    <p className="homePageRoutineText">Routine</p>
                                    {routinePopUpState ? <button className="addRoutineButton" onClick={() => setRoutinePopUpState(false) }>X</button> : <button className="addRoutineButton" onClick={() => setRoutinePopUpState(true)}>+</button>}

                                </div>
                                <div className="routineInnerContainer">
                                {routinePopUpState ?
                                    <div>
                                        <div className="routineFormIndividualContainer">
                                            <div className="routineNameContainer">
                                                <input type="text" value={routineName} placeholder="Routine Name..." className="routineTextBox" onChange={(event) => {setRoutineName(event.target.value)}}/>
                                                <div className="timeSetButtonContainer">
                                                    <button className={timeButtonStyleOne} onClick={() => {setRoutineTime("AM"); handleTimeButtonClick(1)}}>AM</button>
                                                    <button className={timeButtonStyleTwo} onClick={() => {setRoutineTime("PM"); handleTimeButtonClick(2)}}>PM</button>
                                                    <button className={timeButtonStyleThree} onClick={() => {setRoutineTime("AMPM"); handleTimeButtonClick(3)}}>AM&#183;PM</button>
                                                </div>
                                            </div>
                                            <hr className="routineDivider"></hr>
                                        </div>
                                        {/*<input type="radio" name="dayTime" id="morningRadioButton"  onChange={()=>setDayTimeCheckedState(false)}/>*/}
                                        {/*<label htmlFor="morningRadioButton" className="radioText">Morning</label>*/}
                                        {/*<input type="radio" name="dayTime" id="eveningRadioButton"  onChange={()=>setDayTimeCheckedState(true)}/>*/}
                                        {/*<label htmlFor="eveningRadioButton" className="radioText">Evening</label>*/}
                                        <div className="routineProductSubmitContainer">
                                            <input id="productNameEntry" type ="text" value={productName} className="productEntryTextBox" onChange={(event) => setProductName(event.target.value)} placeholder="Product Name..."/>


                                            <button className="productSearchButton" onClick={() => handleProductEntry(productName)}>Search</button>
                                            {/*setProductArray([...productArray, productName]) ; setProductName("")*/}

                                        </div>
                                        <div className="productSearchContaienr">
                                            {productArray.map(product => <div className="productContainer"><p>{stepCount}. </p><li key={product}>{product}</li></div>)}
                                            <div className="productContainer"> </div>
                                        </div>
                                        <button onClick={() => {setProductName("") ; setRoutinePopUpState(false); setRoutineName(""); handleRoutineEntry()}}>Submit</button>
                                    </div>
                                    :
                                    <div></div>
                                }
                                </div>



                            </div>
                            <div className="noteContainer">
                            <p className="homePageRoutineText">Notes</p>
                                <div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
        )

}
export default HomePage;