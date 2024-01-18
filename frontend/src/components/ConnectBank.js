// ConnectBank.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Slider from 'react-slick';
import './ConnectBank.css';
import Connect2bnkNav from './connect2bnkNav';
import SetGoal from './Setgoals';
import Grantpermission from './Grantpermission';

function ConnectBank() {
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(0); // Index starts from 0

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: setCurrentStep // This will update the current step when the slide changes
  };

  const iconPath = "/screenshots/Frame 66 (1).svg";
  const contentIconPath = "/screenshots/Frame 76.svg";

  return (
    <div className="connect-bank-container">
      <div className="progress-indicator">
        <div className={`progress-step ${currentStep === 0 ? 'active' : ''}`} onClick={() => setCurrentStep(0)}>Step 1</div>
        <div className={`progress-step ${currentStep === 1 ? 'active' : ''}`} onClick={() => setCurrentStep(1)}>Step 2</div>
        <div className={`progress-step ${currentStep === 2 ? 'active' : ''}`} onClick={() => setCurrentStep(2)}>Step 3</div>
      </div>
      <Slider {...settings}>
        {currentStep === 0 && (
          <div>
            <div>
              <img src={iconPath} alt="Connect Bank Icon" className="connect-bank-icon" />
            </div>
            <div style={{ marginTop: '40px' }}>
              <img src={contentIconPath} alt="Content Icon" className="content-icon" />
            </div>
          </div>
        )}
        {currentStep === 1 && <SetGoal />} {/* Use SetGoal as the content for Step 2 */}
        {currentStep === 2 && <div>Step 3 Content</div>}
      </Slider>
      <Connect2bnkNav /> {/* This line includes the navigation bar */}
    </div>
  );
}

export default ConnectBank;
