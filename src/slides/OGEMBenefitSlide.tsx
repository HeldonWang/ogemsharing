import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Slide from '../components/Slide';
import VerifiedIcon from '@mui/icons-material/Verified';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import { motion } from 'framer-motion';

const OGEMBenefitSlide: React.FC<{ theme: any }> = ({ theme }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Slide key="ogem-benefits" title="O-GEM Benefits">
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/images/benefits.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.5,
            zIndex: 0
          }
        }}
      >
        {/* Content Container */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 4
          }}
        >
          <Box
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{
              width: '100%',
              maxWidth: '1200px',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 4
            }}
          >
            {/* Efficiency Card */}
            <motion.div variants={itemVariants}>
              <Box 
                className="main-card float-card"
                sx={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <Box 
                  className="title-card" 
                  sx={{ 
                    background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                    p: 2
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      mr: 2,
                      width: 40,
                      height: 40,
                      boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)'
                    }}>
                      <SpeedIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                      Efficiency
                    </Typography>
                  </Box>
                </Box>
                
                <Box className="content-card" sx={{ p: 3 }}>
                  <List sx={{ py: 1 }}>
                    {[
                      "Short learning curve",
                      "Saving time for one-side TLF generation (75%)",
                      "Less coding",
                      "TLF titles and footnotes doc is easy to be maintained"
                    ].map((item, index) => (
                      <ListItem key={index} sx={{ py: 1.2 }}>
                        <ListItemIcon sx={{ minWidth: '40px' }}>
                          <SpeedIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={item} 
                          primaryTypographyProps={{ 
                            fontWeight: 500,
                            fontSize: '1.05rem',
                            color: '#2c3e50'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            </motion.div>
            
            {/* Compliance Card */}
            <motion.div variants={itemVariants}>
              <Box 
                className="main-card float-card"
                sx={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <Box 
                  className="title-card" 
                  sx={{ 
                    background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                    p: 2
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      mr: 2,
                      width: 40,
                      height: 40,
                      boxShadow: '0 4px 14px rgba(46, 125, 50, 0.3)'
                    }}>
                      <SecurityIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                      Compliance
                    </Typography>
                  </Box>
                </Box>
                
                <Box className="content-card" sx={{ p: 3 }}>
                  <List sx={{ py: 1 }}>
                    {[
                      "Standardized datasets for QC",
                      "Adherence to AZSOL",
                      "Following naming convention standard for TLFs"
                    ].map((item, index) => (
                      <ListItem key={index} sx={{ py: 1.2 }}>
                        <ListItemIcon sx={{ minWidth: '40px' }}>
                          <SecurityIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={item} 
                          primaryTypographyProps={{ 
                            fontWeight: 500,
                            fontSize: '1.05rem',
                            color: '#2c3e50'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </Box>
      </Box>
    </Slide>
  );
};

export default OGEMBenefitSlide; 