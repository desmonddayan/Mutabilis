import { supabase } from "./supabaseClient.js"
import './landingpage.css'

function SignUpButton(){

    async function signUpWithGoogle(){

        const {error} = await supabase.auth.signInWithOAuth({
                provider: 'google'
            });

            if (error){
                console.error(error)
            }
    }


    return(
        <button className="signUpButton" onClick={() => signUpWithGoogle()}>Sign Up</button>
    )
}
export default SignUpButton;