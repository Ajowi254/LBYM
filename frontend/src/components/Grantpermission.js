//Grantpermission.js
import React from 'react';

function Grantpermission() {
  const Grantpermissionpath = "/screenshots/Frame 85 (2).svg";
  const additionalSvgPath = "/screenshots/Frame 80.svg";

  return (
    <div>
      <img src={Grantpermissionpath} alt="Grant-permission" className="Grant-permission" />
      <img src={additionalSvgPath} alt="Additional-SVG" className="Additional-SVG" />
      {/* Add any other content for Step 3 here */}
    </div>
  );
}

export default Grantpermission;
