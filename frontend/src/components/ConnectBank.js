// ConnectBank.js
import React from 'react';
function ConnectBank({ onBack, onSkip, onConnect }) {
    return (
      <div>
        <h1>Connect to Bank</h1>
        <p>Connect to your primary checking account...</p>
        <button onClick={onConnect}>Connect</button>
        <button onClick={onSkip}>Skip</button>
        <button onClick={onBack}>Back</button>
        // ... rest of your component
      </div>
    );
  }
  export default ConnectBank;