import SignUpButton from "./SignUpButton.jsx";

import './landingpage.css'
import DemoAnimation from "./assets/animation/DemoAnimation.jsx";

function LandingPage() {


  return (

    <>
      <nav className="navbar">
          <div className="landingPageHeaderContainer1">Know Your Skin</div>
          <div className="landingPageHeaderContainer2"></div>
          <div className="landingPageHeaderContainer3"><SignUpButton /></div>
      </nav>
        <hr className="navbarLine"></hr>
        <div className="landingPageScreen">
            <div className="landingPageContainer">
                <h1 className="mutabilisLandingPageText">Mutabilis</h1>
                <div className="animationContainer">
                    <DemoAnimation />
                </div>
            </div>
        </div>
    </>
  )
}

export default LandingPage;
