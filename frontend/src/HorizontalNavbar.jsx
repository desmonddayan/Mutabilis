import {Link, NavLink} from "react-router-dom";
import SignOutButton from "./SignOutButton";
import './horizontalnavbar.css'

function HorizontalNavbar(){
    return(
        <>
            <div className="positionFixedContainer">
                <nav className="applicationnavbar">
                    <div className="setHorizontalPadding">
                        <div className="navbar-top">
                            <h2 className="titleNextToLogo">Mutabilis</h2>
                        </div>
                        {/*<div className="logoTitleContainer">*/}
                        {/*    <div className="sideNavbarListContainer">*/}
                        {/*        <ul className="sideNavbarButtonContainer">*/}
                        {/*            <li className="bulletPointRemoval"><NavLink className="navbarLink" to="/track"><button className="sideNavbarButton">Track</button></NavLink></li>*/}
                        {/*        </ul>*/}
                        {/*    </div>*/}

                        {/*</div>*/}
                        {/*<div className="signOutButtonContainer">*/}
                        {/*    <SignOutButton />*/}
                        {/*</div>*/}
                    </div>
                </nav>
            </div>
        </>
    )
}

export default HorizontalNavbar