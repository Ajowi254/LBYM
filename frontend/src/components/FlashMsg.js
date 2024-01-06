import { useState } from 'react';
import Alert from '@mui/material/Alert';

function FlashMsg({ type = 'error', messages = [] }) {
  const [open, setOpen] = useState(true);

  // Ensure messages is always an array and convert non-string elements to strings
  const messageArray = Array.isArray(messages)
    ? messages.map(message => (typeof message === 'object' && message !== null ? message.message : message))
    : [String(messages)]; // Convert everything to string to be safe

  return (
    open &&
    messageArray.map((message, index) => (
      <Alert
        variant="outlined"
        severity={type}
        onClose={() => setOpen(false)}
        key={index} // If messages can be non-unique, use index as key
      >
        {message}
      </Alert>
    ))
  );
}

export default FlashMsg;
