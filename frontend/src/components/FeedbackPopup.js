// FeedbackPopup.js
import { Dialog, DialogTitle, DialogContent, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import { useState } from 'react';

const options = [
  'Peer Referral (Friend or Family)',
  'Blogger/Influencer',
  'Search Engine (Online Search)',
  'Facebook',
  'Instagram',
  'TikTok',
  'Twitter',
  'YouTube',
  'Chris Loves Julia',
  'LBYM Blog',
];

function FeedbackPopup({ open, onClose }) {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = () => {
    // Handle the submission here
    console.log(value);
    setSubmitted(true);
    localStorage.setItem('hasGivenFeedback', 'true');
  };

  const handleClose = () => {
    onClose();
    setSubmitted(false); // Reset the submitted state when closing the popup
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      {!submitted ? (
        <>
          <DialogTitle>How did you hear about us? We'd love to hear from you!</DialogTitle>
          <DialogContent>
            <RadioGroup value={value} onChange={handleChange}>
              {options.map((option, index) => (
                <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
              ))}
            </RadioGroup>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogContent>
        </>
      ) : (
        <>
          <DialogTitle>Thank you for your submission!</DialogTitle>
          <DialogContent>Happy budgeting with LBYM!</DialogContent>
          <Button onClick={handleClose}>Close</Button>
        </>
      )}
    </Dialog>
  );
}

export default FeedbackPopup;
