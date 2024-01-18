// ConnectBank.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Slider from 'react-slick';
import './ConnectBank.css';
import Connect2bnkNav from './connect2bnkNav';
import SetGoal from './Setgoals';
import Grantpermission from './Grantpermission';
import SetGoalnav from './SetGoalnav'; 
import GrantpermNav from './GrantpermNav.js';

function ConnectBank() {
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(0);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: setCurrentStep
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
      {currentStep === 0 && (
        <div className="svg-container">
          <img src={iconPath} alt="Connect Bank Icon" className="connect-bank-icon" />
          <img src={contentIconPath} alt="Content Icon" className="content-icon" />
        </div>
      )}
      <Slider {...settings}>
        {currentStep === 0 && (
          <div>
            {/* Content for Step 1 */}
          </div>
        )}
        {currentStep === 1 && (
          <SetGoal />
        )}
        {currentStep === 2 && (
          <Grantpermission />
        )}
      </Slider>
      {currentStep === 0 && <Connect2bnkNav />} {/* Show Connect2bnkNav for Step 1 */}
      {currentStep === 1 && <SetGoalnav />} {/* Show SetGoalnav for Step 2 */}
      {currentStep === 2 && <GrantpermNav />} {/* Show GrantpermNav for Step 2 */}
    </div>
  );
}

export default ConnectBank;
