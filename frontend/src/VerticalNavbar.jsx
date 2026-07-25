import {Link} from "react-router-dom";
import SignOutButton from "./SignOutButton";
import './verticalnavbar.css'

function VerticalNavbar(){
    return(
        <>
            <nav className="applicationnavbar">
                <div className="navbar-top">
                <div className="logoTitleContainer"><h2 className="title">Mutable</h2></div>
                <div className="sideNavbarListContainer">
                    <ul className="sideNavbarButtonContainer">
                        <li className="bulletPointRemoval"><Link className="navbarLink" to="/home"><button className="sideNavbarButton">Home</button></Link></li>
                        <li className="bulletPointRemoval"><Link className="navbarLink" to="/track"><button className="sideNavbarButton">Track</button></Link></li>
                        <li className="bulletPointRemoval"><Link className="navbarLink" to="/community"><button className="sideNavbarButton">Community</button></Link></li>
                    </ul>
                </div>
                </div>
                <div className="signOutButtonContainer">
                    <div><SignOutButton /></div>
                </div>
            </nav>
        </>
    )
}

export default VerticalNavbar