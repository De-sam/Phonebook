import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ContactCard = ({ contacts }) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
      {contacts.map((contact, index) => (
        <Card key={index} sx={{ width: 300, bgcolor: 'blue', color: 'white', position: 'relative' }}>
          <CardContent>
            <Typography variant="h6">
              {contact.firstName} {contact.lastName}
            </Typography>
          </CardContent>
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <IconButton color="inherit" onClick={() => console.log(`Edit contact: ${contact.firstName}`)}>
              <EditIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => console.log(`Delete contact: ${contact.firstName}`)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default ContactCard;
