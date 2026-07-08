import {Link} from "react-router-dom";
import './verticalnavbar.css'

function VerticalNavbar(){
    return(
        <>
            <div className="applicationnavbar">
                <div className="logoTitle"><h2 className="title">Mutable</h2></div>
                <nav className="sideNavbarListContainer">
                    <ul className="sideNavbarButtonContainer">
                        <li className="bulletPointRemoval"><Link className="navbarLink" to="/home"><button className="sideNavbarButton">Home</button></Link></li>
                        <li className="bulletPointRemoval"><Link className="navbarLink" to="/home/track"><button className="sideNavbarButton">Track</button></Link></li>
                        <li className="bulletPointRemoval"><Link className="navbarLink" to="/home/community"><button className="sideNavbarButton">Community</button></Link></li>
                    </ul>
                </nav>
                <div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </>
    )
}

export default VerticalNavbar