import {Link} from "react-router-dom";
import SignOutButton from "./SignOutButton";
import './verticalnavbar.css'

function VerticalNavbar(){
    return(
        <>
            <nav className="applicationnavbar">
                <div className="navbar-top">
                <div className="logoTitleContainer"><img className="flower" src="https://png.pngtree.com/png-vector/20240830/ourmid/pngtree-tropical-red-hibiscus-flower-and-clipart-png-image_13641592.png"/><h2 className="titleNextToLogo">Mutabilis</h2></div>
                <div className="sideNavbarListContainer">
                    <ul className="sideNavbarButtonContainer">
                        <li className="bulletPointRemoval"><Link className="navbarLink" to="/home"><button className="sideNavbarButton">Home</button></Link></li>
                        <li className="bulletPointRemoval"><Link className="navbarLink" to="/track"><button className="sideNavbarButton">Track</button></Link></li>
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