import React from 'react';
import './Grantpermission.css';

function Grantpermission() {
  const Grantpermissionpath = "/screenshots/Frame 85 (2).svg";
  const additionalSvgPath = "/screenshots/Frame 80.svg";

  return (
    <div className="Grant-permission">
      <img src={Grantpermissionpath} alt="Grant-permission" />
      <img src={additionalSvgPath} alt="Additional-SVG" />
    </div>
  );
}

export default Grantpermission;
