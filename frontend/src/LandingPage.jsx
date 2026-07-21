import SignUpButton from "./SignUpButton.jsx";
// import Session from "./Session.jsx";

import './landingpage.css'

function LandingPage() {


  return (

    <>
      <nav className="navbar">
        <ul className="topNavbarLink">
          <li className="websiteName">Mutable</li>
        </ul>

          <SignUpButton />
      </nav>
        <hr className="navbarLine"></hr>
    </>
  )
}

export default LandingPage
