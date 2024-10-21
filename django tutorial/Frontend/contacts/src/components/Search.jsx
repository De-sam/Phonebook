
import React, { useState } from 'react';
import { TextField, Box, Button, Drawer, Typography, MenuItem } from '@mui/material';
import axios from 'axios';

const Search = ({ onAddContact, onSearchChange }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    firstname: '',
    surname: '',
    email: '',
    phonenumber: '',
    label: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const labels = ["work", "office", "home", "business", "family"];

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  const handleAddContact = async () => {
    try {
      const response = await axios.post('http://localhost:8000/contacts/add/', newContact);
      console.log('Add Contact Response:', response.data); // Debugging: Log response data after adding contact
      setIsDrawerOpen(false); // Close the drawer after adding the contact
      setNewContact({ firstname: '', surname: '', email: '', phonenumber: '', label: '' }); // Reset form
      if (onAddContact) {
        onAddContact(); // Optionally call the function to update contacts in the main app
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      if (error.response) {
        console.error('Response data:', error.response.data); // Log server response for better debugging
      }
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value); // Notify parent component of search query change
    }
  };

  return (
    <Box 
      component="form"
      sx={{
        display: 'flex',         // Flexbox layout to align search and button
        width: '100%',           // Make the Box take the full width
        maxWidth: '600px',       // Limit the max width
        mx: 'auto',              // Center horizontally
        px: 2,                   // Add padding to the left and right
      }}
      onSubmit={(e) => e.preventDefault()}  // Prevent form submission for now
    >
      <TextField
        variant="outlined"
        size="medium"
        fullWidth  // Ensures the input takes the full width of the available space
        placeholder="Search"  // Placeholder text for the search field
        value={searchQuery}
        onChange={handleSearchChange} // Trigger search on change
        sx={{ marginRight: 2 }}  // Adds space between the search field and the button
      />
      <Button
        variant="contained"
        color="primary"
        size="medium"
        onClick={handleDrawerToggle}  // Open drawer for adding new contact
      >
        Add
      </Button>

      <Drawer
        anchor="bottom"
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
        sx={{ '.MuiDrawer-paper': { padding: '20px', maxHeight: '400px' } }}
      >
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>Add New Contact</Typography>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="First Name"
            variant="outlined"
            name="firstname"
            value={newContact.firstname}
            onChange={handleInputChange}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            name="surname"
            value={newContact.surname}
            onChange={handleInputChange}
          />
          <TextField
            label="Email"
            variant="outlined"
            name="email"
            value={newContact.email}
            onChange={handleInputChange}
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            name="phonenumber"
            value={newContact.phonenumber}
            onChange={handleInputChange}
          />
          <TextField
            label="Label"
            select
            variant="outlined"
            name="label"
            value={newContact.label}
            onChange={handleInputChange}
          >
            {labels.map((label) => (
              <MenuItem key={label} value={label}>{label}</MenuItem>
            ))}
          </TextField>
          <Button variant="contained" color="primary" onClick={handleAddContact}>Save Contact</Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Search;