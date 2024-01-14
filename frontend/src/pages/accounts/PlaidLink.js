//plaidlink.js
import { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import ExpenseBudApi from '../../api/api';
import Button from '@mui/material/Button';

function PlaidAuth({plaidData, onLinkSuccess}) {
  const [accessToken, setAccessToken] = useState();

  useEffect(() => {
    async function getPublicToken() {
      try {
        let accessToken = await ExpenseBudApi.exchangePublicToken({
          public_token: plaidData.public_token,
          metadata: plaidData.metadata
        }); 
        setAccessToken(accessToken);
        if (onLinkSuccess) {
          onLinkSuccess();
        }
      } catch(e) {
      console.error('failed', e)
      }
    } 
     
    getPublicToken();
  }, [])
  return accessToken && (<PlaidLink />)
}

function PlaidLink({onLinkSuccess}) {
  const [linkToken, setLinkToken] = useState();
  const [publicToken, setPublicToken] = useState();
  const [plaidData, setPlaidData] = useState({}); //includes public token and metadata

  useEffect(() => {
    async function createLinkToken() {
      const response = await ExpenseBudApi.createLinkToken();
      setLinkToken(response.link_token);
    }

    createLinkToken();
  }, [])
  
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      const data = {
        public_token,
        metadata
      }

      setPublicToken(public_token)
      setPlaidData(data)

    },
  });
    
  return publicToken ? (<PlaidAuth plaidData={plaidData} onLinkSuccess={onLinkSuccess}/>) : (
    <Button onClick={() => open()} disabled={!ready} variant="outlined" sx={{mt: 2}}>
      Connect a bank account
    </Button>
  );

}

export default PlaidLink;