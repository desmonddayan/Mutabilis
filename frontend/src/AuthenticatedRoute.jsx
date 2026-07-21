import { Navigate } from "react-router-dom"

function AuthenticatedRoute({session, children}) {
    if(!session){
        return <Navigate to="/" />
    } else{
        return children;
    }
}
export default AuthenticatedRoute;