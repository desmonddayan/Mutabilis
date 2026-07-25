import {supabase} from "./supabaseClient.js"
import './verticalnavbar.css'

export default function SignOutButton() {

    async function signOut() {
        const {error} = await supabase.auth.signOut();
        if (error) console.error(error);
    }

    return (<>
        <button className="signOutButton" onClick={signOut}>Sign Out</button>
    </>)
}