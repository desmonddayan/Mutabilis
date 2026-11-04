import HorizontalNavbar from './HorizontalNavbar.jsx'
import Routine from './Routine.jsx'
import './homepage.css'
import {Link} from 'react-router-dom'
import {useEffect, useState} from "react";


function HomePage({session}){
    return(
        <>
            <div className="screen">
                <HorizontalNavbar />
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
                            <Routine session={session} parentIndex={"homePage"}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
        )

}
export default HomePage;