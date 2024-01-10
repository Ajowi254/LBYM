//ParentComponent.js
import React from 'react';
import AccountList from '../pages/accounts/AccountList';
import HomeList from '../pages/home/HomeList';

function ParentComponent() {
  return (
    <div>
      <AccountList onTransactionsUpdated={() => {/* logic here if needed */}} />
      <HomeList />
    </div>
  );
}

export default ParentComponent;
