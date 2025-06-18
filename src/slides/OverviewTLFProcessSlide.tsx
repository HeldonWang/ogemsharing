import React, { useState, useRef } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton } from '@mui/material';
import Slide from '../components/Slide';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';

const MAGNIFIER_SIZE = 160;
const MAGNIFIER_ZOOM = 2.2;

const OverviewTLFProcessSlide: React.FC<{ theme: any }> = ({ theme }) => {
  const [magnifierActive, setMagnifierActive] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  const [imgDims, setImgDims] = useState({ width: 1, height: 1, naturalWidth: 1, naturalHeight: 1 });
  const [popnOpen, setPopnOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!imgRef.current || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 修改边界检查逻辑，允许放大镜到达图片边缘
    const boundedX = Math.max(0, Math.min(x, rect.width));
    const boundedY = Math.max(0, Math.min(y, rect.height));
    
    setMagnifierPos({ x: boundedX, y: boundedY });
  };

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    setImgDims({
      width: img.width,
      height: img.height,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    });
  };

  // 计算放大镜背景位置
  const calculateBackgroundPosition = () => {
    if (!imgRef.current || !containerRef.current) return { bgX: 0, bgY: 0 };
    
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = imgDims.naturalWidth / rect.width;
    const scaleY = imgDims.naturalHeight / rect.height;
    
    // 调整背景位置计算，向左偏移
    const bgX = (magnifierPos.x * scaleX - (MAGNIFIER_SIZE / 2) * scaleX + (MAGNIFIER_SIZE / 2) * MAGNIFIER_ZOOM) * -1;
    const bgY = (magnifierPos.y * scaleY - (MAGNIFIER_SIZE / 2) * scaleY + (MAGNIFIER_SIZE / 2) * MAGNIFIER_ZOOM) * -1;
    
    return { bgX, bgY };
  };

  const { bgX, bgY } = calculateBackgroundPosition();

  return (
    <Slide key="overview-tlf-process" title="Recapture overview - Safety TLF Generation Process">
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
        {/* 左侧流程说明和要点 */}
        <Paper elevation={3} sx={{ p: 3, minWidth: 350, maxWidth: 500, flex: 1, background: '#faf8f6', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
            TLF Environment Setup
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Copy O-GEM to study folder" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
              <ListItemText
                primary={
                  <span>
                    Update <b>localsetup.sas</b> (run before every TLF) and {' '}
                    <span
                      style={{
                        color: theme.palette.primary.primary,
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                      onClick={() => setPopnOpen((v) => !v)}
                    >
                      <b>m_u_popn</b>
                      <ExpandMoreIcon
                        sx={{
                          fontSize: '1.1em',
                          verticalAlign: 'middle',
                          transform: popnOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s'
                        }}
                      />
                    </span>
                  </span>
                }
              />
            </ListItem>
            <Collapse in={popnOpen} timeout="auto" unmountOnExit>
              <Box sx={{ pl: 6, pr: 2, pb: 1 }}>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  <b>m_u_popn</b> is used to create dummy treatment group to fit the table header with the calculation of big N for each group.
                </Typography>
              </Box>
            </Collapse>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
              <ListItemText primary={<span>Convert <b>TOC file</b> to metadata as <b>TLF.TITLES</b></span>} />
            </ListItem>
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: theme.palette.secondary.main }}>
            Output Generation
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary={<span>TLF generation codes (<b>.sas</b>) automatic creation</span>} />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="TLF codes modification and execution" />
            </ListItem>
          </List>
        </Paper>
        {/* 右侧流程图图片+放大镜功能 */}
        <Box sx={{ flex: 1, minWidth: 320, maxWidth: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* 放大镜按钮 */}
          <IconButton
            onClick={() => setMagnifierActive((v) => !v)}
            sx={{ position: 'absolute', top: 12, right: 12, zIndex: 10, background: '#fff', boxShadow: 2 }}
            size="large"
          >
            {magnifierActive ? <ZoomOutIcon /> : <ZoomInIcon />}
          </IconButton>
          {/* 图片和放大镜 */}
          <Box
            ref={containerRef}
            sx={{ position: 'relative', width: '100%', maxWidth: 540, borderRadius: 2, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
            onMouseMove={magnifierActive ? handleMouseMove : undefined}
            onMouseLeave={magnifierActive ? () => setMagnifierPos({ x: -9999, y: -9999 }) : undefined}
          >
            <img
              ref={imgRef}
              src="/images/tlf-process-flow.png"
              alt="TLF Process Flow"
              style={{ width: '100%', borderRadius: 12, display: 'block' }}
              onLoad={handleImgLoad}
            />
            {/* 放大镜效果 */}
            {magnifierActive && (
              <Box
                sx={{
                  pointerEvents: 'none',
                  position: 'absolute',
                  top: magnifierPos.y - MAGNIFIER_SIZE / 2,
                  left: magnifierPos.x - MAGNIFIER_SIZE / 2,
                  width: MAGNIFIER_SIZE,
                  height: MAGNIFIER_SIZE,
                  borderRadius: '50%',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                  border: '2.5px solid #fff',
                  background: `url(/images/tlf-process-flow.png) no-repeat`,
                  backgroundSize: `${imgDims.width * MAGNIFIER_ZOOM}px ${imgDims.height * MAGNIFIER_ZOOM}px`,
                  backgroundPosition: `${bgX}px ${bgY}px`,
                  zIndex: 9,
                  transition: 'top 0.05s, left 0.05s',
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Slide>
  );
};

export default OverviewTLFProcessSlide; 