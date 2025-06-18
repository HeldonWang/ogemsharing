import React from 'react';
import { Box, Typography } from '@mui/material';
import Slide from '../components/Slide';

const AZTONCEF02: React.FC<{ theme: any }> = ({ theme }) => {
  return (
    <Slide key="aztoncef02" title="Example: AZTONCEF02">
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start',
        width: '100%',
        height: '100%',
        pt: 2,
        pb: 6,
        px: 4
      }}>
        <Box
          component="img"
          src="./images/ef02.PNG"
          alt="AZTONCEF02 Example"
          sx={{
            maxWidth: '100%',
            maxHeight: '75vh',
            objectFit: 'contain',
            boxShadow: 3,
            borderRadius: 2,
            mt: -2
          }}
        />
      </Box>
    </Slide>
  );
};

export default AZTONCEF02; 