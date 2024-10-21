import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, Typography, IconButton, Box, Drawer, TextField, Button, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Search from './components/Search';  // Import the Search component
import axios from 'axios'; // Import axios to make API calls

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]); // State to hold filtered contacts
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [viewContact, setViewContact] = useState({
    id: '',
    firstname: '',
    surname: '',
    email: '',
    phonenumber: '',
    label: '',
  });
  const [editContact, setEditContact] = useState({
    id: '',
    firstname: '',
    surname: '',
    email: '',
    phonenumber: '',
    label: '',
  });
  const [isSearching, setIsSearching] = useState(false); // State to track if search is active

  const fetchContacts = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/contacts/'); // Correct API URL with the /contacts/ prefix
      console.log('Fetched Contacts:', response.data); // Debugging: Log response data
      setContacts(response.data);
      setFilteredContacts(response.data); // Initially set filtered contacts to all contacts
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  }, []);

  useEffect(() => {
    if (!isSearching) {
      fetchContacts();
      const interval = setInterval(fetchContacts, 1000); // Fetch contacts every second if not searching
      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [fetchContacts, isSearching]);

  const handleDelete = async (contactId) => {
    try {
      console.log(`Attempting to delete contact with ID: ${contactId}`); // Debugging: Log the contactId to be deleted
      const response = await axios.delete(`http://localhost:8000/contacts/delete/${contactId}/`); // Call the delete endpoint for the specific contact
      console.log('Delete response:', response); // Debugging: Log the delete response
      if (response.status === 204) { // Check if the delete response is successful
        const updatedContacts = contacts.filter((contact) => contact.id !== contactId);
        console.log('Updated Contacts after deletion:', updatedContacts); // Debugging: Log updated contacts
        setContacts(updatedContacts); // Remove the contact from the local state using contact.id
        setFilteredContacts(updatedContacts); // Update filtered contacts as well
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleAddContact = () => {
    setIsSearching(false); // Ensure we refresh contacts
    fetchContacts(); // Refresh contacts after a new contact is added
  };

  const handleEditClick = (contact) => {
    setEditContact(contact);
    setIsEditDrawerOpen(true);
  };

  const handleViewClick = (contact) => {
    setViewContact(contact);
    setIsViewDrawerOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditContact({ ...editContact, [name]: value });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/contacts/edit/${editContact.id}/`, editContact);
      console.log('Edit Contact Response:', response.data); // Debugging: Log response data after editing contact
      setIsEditDrawerOpen(false); // Close the drawer after saving the changes
      setIsSearching(false); // Ensure we refresh contacts
      fetchContacts(); // Refresh contacts to reflect changes
    } catch (error) {
      console.error('Error editing contact:', error);
    }
  };

  const handleSearchChange = (searchQuery) => {
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts); // If search query is empty, show all contacts
      setIsSearching(false); // No longer searching
    } else {
      setIsSearching(true); // Set searching to true to stop auto refresh
      const filtered = contacts.filter((contact) =>
        contact.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phonenumber.includes(searchQuery) ||
        contact.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContacts(filtered); // Set filtered contacts based on search query
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',                 // Flexbox layout
        flexDirection: 'column',          // Stack items vertically
        alignItems: 'center',             // Center items horizontally
        paddingTop: '50px',               // Space from the top of the viewport
        width: '100vw',                   // Full width of the viewport
        minHeight: '100vh',               // Minimum height to cover the full viewport height
        bgcolor: '#f8f9fa',               // Optional background color
      }}
    >
      <Search onAddContact={handleAddContact} onSearchChange={handleSearchChange} />  {/* Render the Search form with add contact and search handlers */}
      <Box sx={{ marginTop: '20px', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}> {/* Add spacing between Search and ContactCard, and center align the cards */}
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => {
            console.log('Rendering contact:', contact); // Debugging: Log each contact being rendered
            return (
              <Card key={contact.id} sx={{ width: 400, bgcolor: 'blue', color: 'white', position: 'relative', mb: 2 }} onClick={() => handleViewClick(contact)}> {/* Adjusted width and height to improve visual appeal */}
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}> {/* Adjusted flex display to align avatar, name, and icons */}
                  <Avatar sx={{ bgcolor: 'white', color: 'blue' }}>{contact.firstname.charAt(0).toUpperCase()}</Avatar> {/* Avatar on the left side of the contact card with white background and blue text */}
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    {contact.firstname} {contact.surname}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, marginLeft: 'auto' }}> {/* Added space between the name and the icons, icons aligned to the right */}
                    <IconButton color="inherit" onClick={(e) => { e.stopPropagation(); handleEditClick(contact); }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="inherit" onClick={(e) => { e.stopPropagation(); handleDelete(contact.id); }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Typography>No contacts available.</Typography>
        )}
      </Box>

      <Drawer
        anchor="bottom"
        open={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        sx={{ '.MuiDrawer-paper': { padding: '20px', maxHeight: '400px' } }}
      >
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>Edit Contact</Typography>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="First Name"
            variant="outlined"
            name="firstname"
            value={editContact.firstname}
            onChange={handleEditInputChange}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            name="surname"
            value={editContact.surname}
            onChange={handleEditInputChange}
          />
          <TextField
            label="Email"
            variant="outlined"
            name="email"
            value={editContact.email}
            onChange={handleEditInputChange}
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            name="phonenumber"
            value={editContact.phonenumber}
            onChange={handleEditInputChange}
          />
          <TextField
            label="Label"
            variant="outlined"
            name="label"
            value={editContact.label}
            onChange={handleEditInputChange}
          />
          <Button variant="contained" color="primary" onClick={handleSaveEdit}>Save Changes</Button>
        </Box>
      </Drawer>

      <Drawer
        anchor="bottom"
        open={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        sx={{ '.MuiDrawer-paper': { padding: '20px', maxHeight: '400px', textAlign: 'center' } }}
      >
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>View Contact</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}> {/* Centralize the contact information */}
          <Avatar sx={{ bgcolor: 'blue', width: 56, height: 56, mb: 2 }}>{viewContact.firstname.charAt(0).toUpperCase()}</Avatar> {/* Avatar showing the first letter of the firstname */}
          <Typography sx={{ color: 'white' }}>First Name: {viewContact.firstname}</Typography>
          <Typography sx={{ color: 'white' }}>Last Name: {viewContact.surname}</Typography>
          <Typography sx={{ color: 'white' }}>Email: {viewContact.email}</Typography>
          <Typography sx={{ color: 'white' }}>Phone Number: {viewContact.phonenumber}</Typography>
          <Typography sx={{ color: 'white' }}>Label: {viewContact.label}</Typography>
        </Box>
      </Drawer>
    </Box>
  );
};

export default App;
