import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Slide from '../components/Slide';
import { motion } from 'framer-motion';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import BarChartIcon from '@mui/icons-material/BarChart';
import BugReportIcon from '@mui/icons-material/BugReport';

const PlanCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  theme: any;
  isLast?: boolean;
}> = ({ icon, title, description, delay, theme, isLast }) => (
  <Box sx={{ position: 'relative', width: '100%' }}>
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.6, 
        delay, 
        type: "spring",
        stiffness: 100
      }}
      style={{ width: '100%' }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 3,
          background: '#fff',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          border: '2px solid #e0e0e0',
          fontFamily: '"Comic Sans MS", cursive',
          transform: 'rotate(-1deg)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          },
          '&:hover': {
            transform: 'rotate(0deg) scale(1.02)',
            transition: 'all 0.3s ease',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
          <Box sx={{ 
            color: theme.palette.primary.main,
            backgroundColor: `${theme.palette.primary.main}15`,
            padding: 1.5,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& > svg': {
              fontSize: '2.5rem'
            }
          }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              mb: 1,
              color: theme.palette.primary.main,
              fontSize: '1.3rem',
              fontFamily: '"Comic Sans MS", cursive',
            }}>
              {title}
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#555',
              fontSize: '1rem',
              lineHeight: 1.5,
              fontFamily: '"Comic Sans MS", cursive',
            }}>
              {description}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </motion.div>
    {!isLast && (
      <Box sx={{
        position: 'absolute',
        left: '50%',
        bottom: -40,
        width: '2px',
        height: 40,
        background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        transform: 'translateX(-50%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: theme.palette.secondary.main,
        }
      }} />
    )}
  </Box>
);

const InTheNext: React.FC<{ theme: any }> = ({ theme }) => {
  const plans = [
    {
      icon: <RocketLaunchIcon />,
      title: "Release Version 2.0",
      description: "Launching the next version of o-gem with enhanced features and improved performance"
    },
    {
      icon: <BarChartIcon />,
      title: "Support Efficacy Figures",
      description: "Adding macros for figures and listings in efficacy part to enhance data visualization"
    },
    {
      icon: <BugReportIcon />,
      title: "Continuous Improvement",
      description: "Keep identifying and addressing gaps and bugs through user feedback and reviews"
    }
  ];

  return (
    <Slide key="future-plans" title="Our Journey Ahead">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          pt: 3,
          px: { xs: 2, md: 6 },
          height: '100%',
          position: 'relative',
          maxWidth: 800,
          mx: 'auto'
        }}>
          {/* Background decoration */}
          <Box sx={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            width: '300px',
            height: '300px',
            background: `radial-gradient(circle, ${theme.palette.primary.main}20, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(60px)',
            zIndex: 0
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: '15%',
            left: '5%',
            width: '250px',
            height: '250px',
            background: `radial-gradient(circle, ${theme.palette.secondary.main}20, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(50px)',
            zIndex: 0
          }} />

          {/* Plans path */}
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            width: '100%',
            zIndex: 1,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '2px',
              background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              transform: 'translateX(-50%)',
              zIndex: -1
            }
          }}>
            {plans.map((plan, index) => (
              <PlanCard
                key={plan.title}
                icon={plan.icon}
                title={plan.title}
                description={plan.description}
                delay={index * 0.3}
                theme={theme}
                isLast={index === plans.length - 1}
              />
            ))}
          </Box>
        </Box>
      </motion.div>
    </Slide>
  );
};

export default InTheNext; 