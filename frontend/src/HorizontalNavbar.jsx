import {Link} from "react-router-dom";
import SignOutButton from "./SignOutButton";
import './horizontalnavbar.css'

function HorizontalNavbar(){
    return(
        <>
            <div className="positionFixedContainer">
                <nav className="applicationnavbar">
                    <div className="setHorizontalPadding">
                        <div className="navbar-top">
                            <div className="sideNavbarListContainer">
                                <ul className="sideNavbarButtonContainer">
                                    <li className="bulletPointRemoval"><Link className="navbarLink" to="/home"><button className="sideNavbarButton">Home</button></Link></li>
                                    <li className="bulletPointRemoval"><Link className="navbarLink" to="/track"><button className="sideNavbarButton">Track</button></Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="logoTitleContainer">
                            <h2 className="titleNextToLogo">Mutabilis</h2>
                        </div>
                        <div className="signOutButtonContainer">
                            <SignOutButton />
                        </div>
                    </div>
                </nav>
                <hr className="divider" />
            </div>
        </>
    )
}

export default HorizontalNavbar