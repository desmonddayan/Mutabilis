import {Navigate, Route, Routes} from "react-router-dom";
import AuthenticatedRoute from "./AuthenticatedRoute.jsx";
import HomePage from "./HomePage.jsx";
import LandingPage from "./LandingPage.jsx";
import TrackPage from "./TrackPage.jsx";
import CommunityPage from "./CommunityPage.jsx";
import getSession from "./Session.jsx";
import {useEffect, useState} from "react";


 function App(){
     const [session, setSession] = useState(null);
     const[loading, setLoading] = useState(true);

     useEffect(() => {
         const fetchSession = async () => {
             const session = getSession();
             setSession(session);
             setLoading(false);
         }
         fetchSession();
     }, [])

    if(loading) {return <div>Loading...</div>}

    return (<>
            <Routes>
                <Route path="/" element={session ? <Navigate to="/home"/> : <LandingPage/>}/>
                <Route path="/home" element={<AuthenticatedRoute session={session}><HomePage/></AuthenticatedRoute>}/>

                <Route path="/track" element={<AuthenticatedRoute session={session}><TrackPage/></AuthenticatedRoute>}/>
                <Route path="/community" element={<AuthenticatedRoute session={session}><CommunityPage/></AuthenticatedRoute>}/>
            </Routes>
    </>
    );
}
export default App;