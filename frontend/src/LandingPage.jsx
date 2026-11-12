import SignUpButton from "./SignUpButton.jsx";

import './landingpage.css'
import DemoAnimation from "./assets/animation/DemoAnimation.jsx";
import {Link} from "react-router-dom";

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
        <div className="landingPageScreenInformation">
            <div className="landingPageInformationContainer">
                <hr className="landingPageDivider"/>
                <div className="landingPageThreeTextContainer">
                    <div className="individualLandingPageTextContainer">
                        <div className="landingPageHeaderText">Three photos a day</div>
                        <div className="landingPageDescriptionText">Take a front, left and right photo of your face daily to track changes over time and get AI analysis. </div>
                    </div>
                    <div className="individualLandingPageTextContainer">
                        <div className="landingPageHeaderText">A short diary</div>
                        <div className="landingPageDescriptionText">Document the events of your day, what you ate, and what touched your face, you never know what lifestyle patterns may be affecting your skin.</div>
                    </div>
                    <div className="individualLandingPageTextContainer">
                        <div className="landingPageHeaderText">Ask about any day</div>
                        <div className="landingPageDescriptionText">Select days on the calendar and ask why your skin went the way it did. Answers point to specific lifestyle patterns and products allowing you to be more confident about your skin.</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="privacyPolicyContainer">
            <div className="centerPrivacyPolicyContainer">
                <Link to="/privacy" className="privacyPolicyLink">Privacy Policy</Link>
            </div>
        </div>
    </>
  )
}

export default LandingPage;
