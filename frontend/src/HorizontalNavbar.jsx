import {Link, NavLink} from "react-router-dom";
import SignOutButton from "./SignOutButton";
import './horizontalnavbar.css'

function HorizontalNavbar(){
    return(
        <>
            <div className="positionFixedContainer">
                <nav className="applicationnavbar">
                    <div className="setHorizontalPadding">
                        <div className="threeSplitDiv"></div>
                        <div className="navbar-top">
                            <h2 className="titleNextToLogo">Mutabilis</h2>
                        </div>
                        <div className="signOutButtonContainer">
                            <SignOutButton />
                        </div>
                    </div>
                </nav>
            </div>
        </>
    )
}

export default HorizontalNavbar