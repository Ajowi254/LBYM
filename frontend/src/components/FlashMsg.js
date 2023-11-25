//flashmsg.js
import { useState } from 'react';
import Alert from '@mui/material/Alert';

function FlashMsg({type='error', messages=[]}) {
  const [open, setOpen] = useState(true);

  return (
    open && messages.map(message => (
      <Alert variant="outlined" severity={type} onClose={() => {setOpen(false)}}key={message}> 
      {message}
      </Alert> 

    ))
  )
}

export default FlashMsg;