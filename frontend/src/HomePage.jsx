import VerticalNavbar from './VerticalNavbar.jsx'
import './homepage.css'
import {Link} from 'react-router-dom'
import {useEffect} from "react";
function HomePage({session}){


    useEffect( () => {

    }, []);

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
                            <div className="routineContainer"></div>
                            <div className="noteContainer"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
        )

}
export default HomePage;