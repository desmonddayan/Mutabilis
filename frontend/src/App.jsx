import {Navigate, Route, Routes} from "react-router-dom";
import AuthenticatedRoute from "./AuthenticatedRoute.jsx";
import HomePage from "./HomePage.jsx";
import LandingPage from "./LandingPage.jsx";
import TrackPage from "./TrackPage.jsx";
import CommunityPage from "./CommunityPage.jsx";
import {useEffect, useState} from "react";
import {supabase} from "./supabaseClient.js";


 function App(){
     const [session, setSession] = useState(null);
     const[loading, setLoading] = useState(true);



     useEffect(() => {
         const fetchSession = async () => {
             const {data: {session}} = await supabase.auth.getSession();
             setSession(session);
             setLoading(false);
         }
         fetchSession();


         const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
             setSession(session);
             setLoading(false);

             const saveUser = async () => {

                 await fetch('http://localhost:8080/api/v1/users/me', {
                         method: 'POST',
                         headers: {'Authorization': `Bearer ${session.access_token}`,
                             'Content-Type': 'application/json'},
                         body: JSON.stringify({
                             email: session.user.email,
                             name: session.user.user_metadata.full_name,
                             avatarURL: session.user.user_metadata.avatar_url
                         })
                     }
                 )
             }
             if (_event === "SIGNED_IN"){
                 saveUser();
             }
         })
         return () => subscription.unsubscribe();
     }, [])

    if(loading) {return <div>Loading...</div>}

    return (<>
            <Routes>
                <Route path="/" element={session ? <Navigate to="/home"/> : <LandingPage />}/>
                <Route path="/home" element={<AuthenticatedRoute session={session}><HomePage session={session}/></AuthenticatedRoute>}/>
                <Route path="/track" element={<AuthenticatedRoute session={session}><TrackPage session={session}/></AuthenticatedRoute>}/>
                <Route path="/community" element={<AuthenticatedRoute session={session}><CommunityPage/></AuthenticatedRoute>}/>
            </Routes>
    </>
    );
}
export default App;