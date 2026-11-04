import { API_URL } from "./config";
import {Navigate, Route, Routes} from "react-router-dom";
import AuthenticatedRoute from "./AuthenticatedRoute.jsx";
import HomePage from "./HomePage.jsx";
import LandingPage from "./LandingPage.jsx";
import TrackPage from "./TrackPage.jsx";
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

                 await fetch(`${API_URL}/api/v1/users/me`, {
                         method: 'POST',
                         headers: {'Authorization': `Bearer ${session.access_token}`
                     }
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
            </Routes>
    </>
    );
}
export default App;