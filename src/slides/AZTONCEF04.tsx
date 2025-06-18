import React from 'react';
import { Box, Typography } from '@mui/material';
import Slide from '../components/Slide';

const AZTONCEF04: React.FC<{ theme: any }> = ({ theme }) => {
  return (
    <Slide key="aztoncef04" title="Example: AZTONCEF04">
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
          src={`${import.meta.env.BASE_URL}images/ef04.PNG`}
          alt="AZTONCEF04 Example"
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

export default AZTONCEF04; 