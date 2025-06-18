import React, { useState } from 'react';
import { Box, Typography, Collapse, Paper, Dialog } from '@mui/material';
import Slide from '../components/Slide';
import { motion } from 'framer-motion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const OGEMEfficacyMacrosSlide: React.FC<{ theme: any }> = ({ theme }) => {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [reset, setReset] = useState(true); // 控制回正和图片显示
  const [imgOpen, setImgOpen] = useState(false); // 控制图片放大

  // 天平角度逻辑
  let tilt = 0;
  if (!reset) {
    if (leftOpen && !rightOpen) tilt = -18;
    else if (!leftOpen && rightOpen) tilt = 18;
    else tilt = 0;
  }

  // 右侧内容切换
  let rightContent = (
    <>
      <Typography variant="h5" sx={{ fontWeight: 700, color: theme?.palette?.primary?.main || '#36e09e', mb: 2 }}>
        Why O-GEM Macros?
      </Typography>
      <Typography variant="body1" sx={{ color: '#444', fontSize: 18, lineHeight: 1.7, mb: 2 }}>
        Our efficacy macros are designed to <b>balance stability and flexibility</b>.<br />
        You can easily switch between standardized and complex outputs, ensuring both <b>consistency</b> and <b>customization</b> for your needs.
      </Typography>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
        <img
          src={`${import.meta.env.BASE_URL}images/breakdownpic.png`}
          alt="Breakdown"
          style={{ maxWidth: '100%', maxHeight: 240, borderRadius: 8, boxShadow: '0 2px 12px #0002', cursor: 'zoom-in', transition: 'box-shadow 0.2s' }}
          onClick={() => setImgOpen(true)}
        />
      </Box>
      <Dialog open={imgOpen} onClose={() => setImgOpen(false)} maxWidth="xl" PaperProps={{ sx: { bgcolor: '#fff', boxShadow: 'none' } }}>
        <Box sx={{ width: '90vw', height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff', borderRadius: 2 }} onClick={() => setImgOpen(false)}>
          <img src={`${import.meta.env.BASE_URL}images/breakdownpic.png`} alt="Breakdown Large" style={{ maxWidth: '88vw', maxHeight: '88vh', borderRadius: 8, boxShadow: '0 2px 24px #0008' }} />
        </Box>
      </Dialog>
    </>
  );
  if (!reset) {
    if (leftOpen && !rightOpen) {
      rightContent = (
        <>
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme?.palette?.primary?.main || '#36e09e', mb: 2 }}>
            Standardized Output
          </Typography>
          <Typography variant="body1" sx={{ color: '#444', fontSize: 18, lineHeight: 1.7, mb: 2 }}>
            Display macro with flexible output dataset modification
          </Typography>
          <Box sx={{ mt: 1, pl: 1 }}>
            <Typography variant="subtitle2" sx={{ color: '#888', fontWeight: 600, mb: 0.5 }}>Display Macros:</Typography>
            <Box component="ul" sx={{ pl: 3, mb: 0, color: '#444', fontSize: 16 }}>
              <li>m_t_aztoncef04</li>
              <li>m_t_aztoncef05</li>
              <li>m_t_aztoncef02a</li>
              <li>m_t_aztoncef02b</li>
              <li>Etc.</li>
            </Box>
          </Box>
        </>
      );
    } else if (rightOpen && !leftOpen) {
      rightContent = (
        <>
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme?.palette?.primary?.main || '#36e09e', mb: 2 }}>
            Complex Output
          </Typography>
          <Typography variant="body1" sx={{ color: '#444', fontSize: 18, lineHeight: 1.7, mb: 2 }}>
            Open template code with multiple utility macros
          </Typography>
          <Box sx={{ mt: 1, pl: 1 }}>
            <Typography variant="subtitle2" sx={{ color: '#888', fontWeight: 600, mb: 0.5 }}>Utility Macros:</Typography>
            <Box component="ul" sx={{ pl: 3, mb: 0, color: '#444', fontSize: 16 }}>
              <li>m_u_effcount</li>
              <li>m_u_cox_logrank</li>
              <li>m_u_km</li>
              <li>m_u_binom_cpgrp</li>
              <li>m_u_binom_odds</li>
              <li>Etc.</li>
            </Box>
          </Box>
        </>
      );
    }
  }

  // 点击天平回正
  const handleBalanceClick = () => {
    setLeftOpen(false);
    setRightOpen(false);
    setReset(true);
  };

  // 点击文本框时取消回正
  const handleLeftClick = () => {
    setLeftOpen(v => !v);
    setRightOpen(false);
    setReset(false);
  };
  const handleRightClick = () => {
    setRightOpen(v => !v);
    setLeftOpen(false);
    setReset(false);
  };

  return (
    <Slide title="O-GEM Efficacy Macros">
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start', justifyContent: 'center', height: '100%', width: '100%' }}>
        {/* 左侧内容框 */}
        <Box sx={{ flex: 1, minWidth: 320, mr: { xs: 0, md: 4 }, mt: { xs: 4, md: 0 }, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start' }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, bgcolor: '#f7f7f7', minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            {rightContent}
          </Paper>
        </Box>

        {/* 右侧：大文本框+天平 */}
        <Box sx={{ flex: 1.2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 340, height: '100%' }}>
          {/* 上方大文本框区 */}
          <Box sx={{ display: 'flex', gap: 4, mb: 2, width: '100%', justifyContent: 'center' }}>
            {/* 左大文本框 */}
            <Paper elevation={4} sx={{ width: 220, minHeight: 70, p: 2, bgcolor: '#f7f7f7', borderRadius: 3, textAlign: 'center', cursor: 'pointer', border: leftOpen ? '2px solid #36e09e' : '2px solid #e0e0e0', transition: 'border 0.2s', boxShadow: leftOpen ? '0 0 12px #36e09e44' : undefined, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 18 }} onClick={handleLeftClick}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 18, color: '#444' }}>Standardized Outputs</Typography>
                <ExpandMoreIcon sx={{ ml: 1, transform: leftOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }} />
              </Box>
              <Collapse in={leftOpen}>
                <Typography sx={{ fontSize: 17, color: '#36e09e', fontWeight: 700, mt: 1 }}>Simplicity and Consistency</Typography>
              </Collapse>
            </Paper>
            {/* 右大文本框 */}
            <Paper elevation={4} sx={{ width: 220, minHeight: 70, p: 2, bgcolor: '#f7f7f7', borderRadius: 3, textAlign: 'center', cursor: 'pointer', border: rightOpen ? '2px solid #ff6b6b' : '2px solid #e0e0e0', transition: 'border 0.2s', boxShadow: rightOpen ? '0 0 12px #ff6b6b44' : undefined, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 18 }} onClick={handleRightClick}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 18, color: '#444' }}>Complex Outputs</Typography>
                <ExpandMoreIcon sx={{ ml: 1, transform: rightOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }} />
              </Box>
              <Collapse in={rightOpen}>
                <Typography sx={{ fontSize: 17, color: '#ff6b6b', fontWeight: 700, mt: 1 }}>Flexibility and Complexity</Typography>
              </Collapse>
            </Paper>
          </Box>
          {/* 天平动画区，上移并可点击回正 */}
          <Box sx={{ position: 'relative', width: '100%', height: 240, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ position: 'relative', left: 0, top: '30%', transform: 'translateY(-50%)', width: 340, height: 180, cursor: 'pointer' }} onClick={handleBalanceClick}>
              {/* 天平杆动画 */}
              <motion.div
                style={{ width: '100%', height: 20, position: 'absolute', top: 60, left: 0, zIndex: 2, originX: 0.5, originY: 0.5 }}
                animate={{ rotate: tilt }}
                transition={{ type: 'spring', stiffness: 80, damping: 10 }}
              >
                <Box sx={{ width: '100%', height: 16, bgcolor: '#fff', border: '3px solid #444', borderRadius: 8, boxShadow: '0 2px 8px #0002' }} />
                {/* 左托盘 */}
                <Box sx={{ position: 'absolute', left: 18, top: 18, width: 80, height: 32, bgcolor: '#fff', border: '3px solid #444', borderRadius: '0 0 40px 40px', borderTop: 'none', boxShadow: '0 2px 8px #0001', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} />
                {/* 右托盘 */}
                <Box sx={{ position: 'absolute', right: 18, top: 18, width: 80, height: 32, bgcolor: '#fff', border: '3px solid #444', borderRadius: '0 0 40px 40px', borderTop: 'none', boxShadow: '0 2px 8px #0001', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} />
              </motion.div>
              {/* 天平底座 */}
              <Box sx={{ position: 'absolute', left: '50%', top: 10, transform: 'translateX(-50%)', width: 36, height: 36, borderRadius: '50%', border: '3px solid #444', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ width: 18, height: 6, bgcolor: '#bbb', borderRadius: 2 }} />
              </Box>
            </Box>
          </Box>
          {/* 底部主标题 */}
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#444', mt: 2, fontFamily: 'Comic Sans MS, Comic Sans, cursive', textShadow: '1px 2px 8px #fff8' }}>
            Balancing Simplicity and Complexity
          </Typography>
        </Box>
      </Box>
    </Slide>
  );
};

export default OGEMEfficacyMacrosSlide; 