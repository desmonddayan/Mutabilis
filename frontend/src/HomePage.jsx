import VerticalNavbar from './VerticalNavbar.jsx'
import './homepage.css'
import {Link} from 'react-router-dom'
import {useState} from "react";


function HomePage({session}){

    const [routinePopUpState, setRoutinePopUpState] = useState(false)
    const [dayTimeCheckedState, setDayTimeCheckedState] = useState(false)
    const [stepCount, setStepCount] = useState(1)
    const [productArray, setProductArray] = useState([])
    const [productName, setProductName] = useState('')

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
                        <div className="routineAndNoteContainer">
                            <div className="routineContainer">

                                <div className="routineTextAndButtonContainer">
                                    <p className="homePageRoutineText">Routine</p>
                                    <button className="addRoutineButton" onClick={() => setRoutinePopUpState(true)}>+</button>
                                </div>
                                <div>
                                {routinePopUpState ?
                                    <div>
                                        <p>Routine Name:</p>
                                        <input type="text" placeholder="Type Here: "/>
                                        <input type="radio" name="dayTime" id="morningRadioButton" onChange={()=>setDayTimeCheckedState(false)}/>
                                        <label htmlFor="morningRadioButton">Morning</label>
                                        <input type="radio" name="dayTime" id="eveningRadioButton" onChange={()=>setDayTimeCheckedState(true)}/>
                                        <label htmlFor="eveningRadioButton">Evening</label>
                                        <p>Product Name:</p>
                                        <input id="productNameEntry" type ="text" placeholder="Type Here: "/>
                                        <button>Add Product</button>
                                        {productArray.map(product => <li key={product}>{product}</li>)}
                                        <button>Submit</button>
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