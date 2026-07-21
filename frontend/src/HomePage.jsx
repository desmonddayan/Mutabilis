import VerticalNavbar from './VerticalNavbar.jsx'

import './homepage.css'
import Session from "./Session.jsx";

function HomePage(){

            const saveUser = async () => {

                const session = await Session();

                const logInResponse = await fetch('http://localhost:8080/api/v1/users/me', {
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
                console.log(logInResponse.status);
                const data = await logInResponse.json();
                console.log(data);
            }
            saveUser();



    return(

        <>
            <div className="screen">
                <VerticalNavbar />
            </div>
        </>
        )

}
export default HomePage;