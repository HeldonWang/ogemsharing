import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import Slide from '../components/Slide';
import { motion } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShareIcon from '@mui/icons-material/Share';

const LastSection: React.FC<{ theme: any }> = ({ theme }) => {
  return (
    <Slide key="last-section" title="Q&A and Thanks">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        padding: '2rem'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Typography variant="h3" sx={{ 
            fontWeight: 700, 
            mb: 4, 
            textAlign: 'center',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Questions & Answers
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Typography variant="h4" sx={{ 
            fontWeight: 600, 
            mb: 3, 
            textAlign: 'center',
            color: theme.palette.text.primary
          }}>
            Thank You!
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3
          }}>
            {/* O-GEM Link */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShareIcon sx={{ color: theme.palette.primary.main }} />
              <Typography variant="h6" sx={{ 
                color: theme.palette.text.secondary
              }}>
                Visit O-GEM:
              </Typography>
              <Link 
                href="https://azcollaboration.sharepoint.com/sites/O-GEM2/SitePages/CollabHome.aspx" 
                target="_blank"
                sx={{ 
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                O-GEM Collaboration Site
              </Link>
            </Box>

            {/* User Manual Link */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MenuBookIcon sx={{ color: theme.palette.primary.main }} />
              <Typography variant="h6" sx={{ 
                color: theme.palette.text.secondary
              }}>
                User Manual:
              </Typography>
              <Link 
                href="https://glowing-broccoli-63jkjyr.pages.github.io/" 
                target="_blank"
                sx={{ 
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                O-GEM Documentation
              </Link>
            </Box>

            {/* Support Email */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon sx={{ color: theme.palette.primary.main }} />
              <Typography variant="h6" sx={{ 
                color: theme.palette.text.secondary
              }}>
                Support Email:
              </Typography>
              <Link 
                href="mailto:o365groups-ogem@AZCollaboration.onmicrosoft.com"
                sx={{ 
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                o365groups-ogem@AZCollaboration.onmicrosoft.com
              </Link>
            </Box>
          </Box>
        </motion.div>
      </Box>
    </Slide>
  );
};

export default LastSection; 