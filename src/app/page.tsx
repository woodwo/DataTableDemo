import React from 'react';
import CustomerTable from '../components/CustomerTable';
import Box from '@mui/material/Box';

const Home: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh', padding: 2 }}>
      <CustomerTable />
    </Box>
  );
};

export default Home;
