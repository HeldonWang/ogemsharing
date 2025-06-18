import React, { useState } from 'react';
import { Box, Typography, Card, Paper, Chip, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import Slide from '../components/Slide';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import FlexibleIcon from '@mui/icons-material/AllInclusive';
import BalanceIcon from '@mui/icons-material/Balance';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { sas } from '@codemirror/legacy-modes/mode/sas';

// Placeholder SAS code examples
const leftSasCode = `
%setup(version=260,
    localsetup=root/%scan(&_exec_programpath.,2,/)/%scan(&_exec_programpath.,3,/)/%scan(&_exec_programpath.,4,/)/ar/%scan(&_exec_programpath.,6,/)/common/%scan(&_exec_programpath.,8,/)/macro/localsetup.sas
);

/* Remove call to localsetup macro if it is not needed */
%localsetup;
/**************************************************************************
 * 1. Dataset setup.
 *************************************************************************/
data adtte;
    set adam.adtte;
    where paramcd='TRPROGM' and parqual='INDEPENDENT ASSESSOR' and mittfl='Y';
run;
/**************************************************************************
 * 2. Header and treatment group setting.
 *************************************************************************/
%m_u_popn(
    inds=adam.adsl,
    pop_flag=mittfl="Y",
    trtgrpn=trt01pn,
    trtlev=1|2,
    UniqueIDVars=usubjid,
    trtfmtC=_tlf_setup_trtfmteff,
    gmacro=mittpopb,
    BigN=Y,
    nformat=,
    debug=Y
);
/**************************************************************************
 * 3. Analaysis process.
 *************************************************************************/
/* Number counting part */
%m_u_effcount(
    inds=adtte,
    pop_flag=mittfl='Y',
    trtgrpn=trt01pn,
    denomds=,
    pop_mvar=mittpopb,
    index={cond=CNSR=0 # label=%nrbquote(Total events [a], n (%)) #level=0 subord=1}
          {cond=cnsr=0 and find(evntdesc,'RECIST progression') label=RECIST progression level=1 subord=2}
          {cond=cnsr=0 and find(evntdesc,'RECIST progression with target') label=Target lesion [b] level=2 subord=3}
          {cond=cnsr=1 label=%nrbquote(Censored patients, n (%)) level=0 subord=4}
          {cond=cnsr=1 and find(evntdesc,'Censored RECIST progression') label=Censored RECIST progression [c] level=1 subord=5},
    statlabel=Y,
    ord=1,
    debug=N
);

/* PFS median and rate at x time with CI */
%m_u_km(
    inds=adtte,
    WHR=,
    alpha=0.05,
    method=KM,
    conftype=LOG,
    trtgrpn=trt01pN,
    trtgrpnord=2 | 1,
    trtgrpn2=,
    var_time=AVAL,
    var_status=CNSR,
    cen_num=0,
    evnt_num=,
    step_list=160 to 1686 by 160,
    step_unit=days,
    XDIVISOR=,
    plot=0,
    outdat_median=final2,
    median_label=Progression-free survival (<<unit>>) [e] [f],
    outdat_timelist=final3,
    timelist_label=Progression-free survival rate [e]
);

/* Comparison between group (HR, CI and p-value) */
%m_u_cox_logrank(
    inds=adtte,
    out=final_cox/*default: a_final_cox*/,
    blocklbl=Comparison of treatment groups [g],
    modelkey=cox|logrank,
    transfl=Y,
    trtgrpn=trt01pn,
    var=aval,
    byvar=,
    alpha=0.05,
    censor=,
    indicator=,
    ties=,
    pair=1-2,
    strata=STRAT1 STRAT2,
    pvalside=,
    missval=,
    digit=,
    cidecimal=,
    hrlbl=,
    pvallbl=,
    cilbl=,
    prefix=,
    debug=Y
);

/**************************************************************************
 * 4. Final report data manipulation.
 *************************************************************************/
data final0;
    set final_effcount_1(keep=col: ord) final_cox(in=b);
    if b then ord=2;
run;

data final0; set final0; ord=1; run;
data final2; set final2; ord=3; run;
data final3; set final3; ord=4; run;
data final;
    set final0 final2 final3;
    ord1 = _n_;
run;

%m_u_col_header(
    inds=final,
    outds=final1,
    gmacro=mittpopb
); /* call macro to add label for each treatment group variables */
/* %m_ucol_header(inds=final0,outds=final1,gmacro=mittpopb ); call macro to add label for each treatment group variables */

%let output = %scan(&_exec_programname.,1, ".");
%let sfx = a;
data final tlf.&output.&sfx.(drop=ord);
    set final1(rename=(col1=col3 col2=col4 col_blocklabel=col1 col_statlabel=col2));
    label col2 = 'Statistic';
run;

/**************************************************************************
 * 5. Output
 *************************************************************************/
%istartv2(SUFFIX=a);
%m_u_report(
    table=final,
    lenlist=31#17#17#17,
    justlist=l#l#c#c,
    justlist_header=l#l#c#c,
    nolblist=Y#N#N#N,
    orderlist=Y#Y#N#N,
    defcol=(col1 col2 col3 col4),
    blank_after=ord,
    pg=18
);
%istopv2;
`; // Repeat to create scrollable content

const rightSasCode = `
%setup(version=260,
       localsetup=root/%scan(&_exec_programpath.,2,/)/%scan(&_exec_programpath.,3,/)/%scan(&_exec_programpath.,4,/)/ar/%scan(&_exec_programpath.,6,/)/common/%scan(&_exec_programpath.,8,/)/macro/localsetup.sas);

** Remove call to localsetup macro if it is not needed **;
%localsetup;
								
/**************************************************************************
 * 1. Dataset setup.
 *************************************************************************/
data adtte;
	set adam.adtte;
run;
/**************************************************************************
 * 2. call display macro.
 *************************************************************************/
%m_t_aztoncef04(
    /*public*/
     inds					=	 adtte
    ,whr            		=	paramcd='TRPROGM' and parqual='INDEPENDENT ASSESSOR'
    ,pop_flag       		=	mittfl='Y'
    ,pop_mvar				=	ittdummyn2
    ,trtgrpn       		 	=	trt01pN 		
    ,var					=	aval
    ,alpha					=	0.05
    /*,pair       			=	1-2|4-2|6-2|5-2|7-2*/
    ,pair       			=	1-5|4-5|6-5|3-5|7-5
    ,debug					=   Y
    /*effcount*/   
    ,effcount_index			=   {cond=CNSR=0 # label=%nrbquote(Total events [a], n (%)) #level=0 subord=1}
								  {cond=cnsr=0 and find(evntdesc,'RECIST progression')  # label=RECIST progression #level=1 subord=2}
								  {cond=cnsr=0 and find(evntdesc,'RECIST progression with target') # label=Target lesion [b] #level=2 subord=3}
								  {cond=cnsr=1 label=%nrbquote(Censored patients, n (%)) #level=0 subord=4}
								  {cond=cnsr=1 and find(evntdesc,'Censored RECIST progression')  # label=Censored RECIST progression [c] #level=1 /*section=6*/ subord=5}
						      
    /*cox, logrank*/
    ,coxlog_blocklbl	    =   Comparison of treatment groups [g]
    ,coxlog_modelkey		=   cox|logrank			
    ,coxlog_strata			= 	STRAT1 STRAT2                                                                          
       
    /*km*/	 
	,km_method         		=   km
	,km_conftype       		=   log 
    ,km_cen_num       		=   0
	,km_step_list	   		=   160 to 1686 by 160
    ,km_step_unit      		=   days
	,km_median_label   		=   Progression-free survival (days) [e] [f]
	,km_timelist_label 		=   Progression-free survival rate [e]
    /*desc_stat*/		
	,desc_stat_inds    		 =   adtte
	,desc_stat_whr    		 =  %str(paramcd='TRTTFST' and mittfl='Y')
	,desc_stat_var     		 =  aval
	,desc_stat_label   		 =  %str(Duration between <<RECIST>> progression and the last evaluable <<RECIST>>  assessment prior to progression (<<unit>>))

    /*report*/
	, lenlist 		   		=  20#7#10#10#10#10#10#10 
	, justlist 		   		=  l#l#c#c#c#c#c#c 
	, justlist_header 		=  l#l#c#c#c#c#c#c 
	, nolblist 		   		=  Y#N#N#N#N#N#N#N 
	, orderlist 	   		=  N#N#N#N#N#N#N#N
	, defcol 		  		=  (col1 col2 col3 col5 col6 col7 col8 col4)
	, rtf					=	y
	, sfx					=	a
);

`; // Repeat to create scrollable content

// Feature cards for OGEM characteristics
const featureCards = [
  {
    id: 'simplicity',
    title: 'Simplicity',
    description: 'Easy to understand and maintain code structure',
    icon: <AutoFixHighIcon sx={{ color: '#36e09e', fontSize: '2rem' }} />
  },
  {
    id: 'flexibility',
    title: 'Flexibility',
    description: 'Adaptable to various analysis requirements',
    icon: <FlexibleIcon sx={{ color: '#36e09e', fontSize: '2rem' }} />
  },
  {
    id: 'consistency',
    title: 'Consistency',
    description: 'Standardized approach across all analyses',
    icon: <BalanceIcon sx={{ color: '#36e09e', fontSize: '2rem' }} />
  },
  {
    id: 'accuracy',
    title: 'Accuracy',
    description: 'Precise and reliable results every time',
    icon: <PrecisionManufacturingIcon sx={{ color: '#36e09e', fontSize: '2rem' }} />
  }
];

const OGEMCodeDemoSlide: React.FC<{ theme: any }> = ({ theme }) => {
  const [scrollValue, setScrollValue] = useState(0);
  
  const handleScrollChange = (event: any, newValue: number) => {
    setScrollValue(newValue);
  };

  return (
    <Slide title="Code Structure and Steps">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: 'calc(100% - 60px)',
        justifyContent: 'space-between',
        mt: -2
      }}>
        {/* Code comparison section */}
        <Box sx={{ 
          display: 'flex',
          gap: 2,
          height: '450px',
          mb: 4
        }}>
          {/* Right code window */}
          <Box sx={{ width: '50%' }}>
            <Typography variant="subtitle2" sx={{ 
              fontSize: '1.2rem', 
              mb: 1,
              color: theme.palette.primary.main,
              fontWeight: 600
            }}>
              Display Macros for Standard Outputs
            </Typography>
            <Card sx={{ 
              height: '100%',
              bgcolor: '#181c24',
              position: 'relative',
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              {/* Vertical scroll indicator */}
              <Box sx={{ 
                position: 'absolute',
                right: 5,
                top: '15%',
                height: '70%',
                width: 24,
                zIndex: 10,
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Box sx={{
                  height: '100%',
                  width: 4,
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  position: 'relative'
                }}>
                  <Box 
                    sx={{
                      position: 'absolute',
                      left: '-5px',
                      width: 14,
                      height: 18,
                      bgcolor: '#666',
                      borderRadius: 2,
                      top: `${scrollValue}%`,
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseDown={(e) => {
                      const container = e.currentTarget.parentElement;
                      if (!container) return;
                      const containerHeight = container.clientHeight;
                      const handleMouseMove = (moveEvent: MouseEvent) => {
                        const containerRect = container.getBoundingClientRect();
                        const y = moveEvent.clientY - containerRect.top;
                        const percentage = Math.max(0, Math.min(100, (y / containerHeight) * 100));
                        handleScrollChange(null, percentage);
                      };
                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };
                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  >
                    <DragIndicatorIcon sx={{ fontSize: '0.6rem', color: '#fff' }} />
                  </Box>
                </Box>
              </Box>
              
              {/* Code content */}
              <Box sx={{ 
                height: '100%',
                overflow: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' }
              }}
              ref={(el: HTMLDivElement | null) => {
                if (el) {
                  const maxScroll = el.scrollHeight - el.clientHeight;
                  el.scrollTop = (scrollValue / 100) * maxScroll;
                }
              }}
              >
                <CodeMirror
                  value={rightSasCode}
                  height="100%"
                  theme="dark"
                  extensions={[StreamLanguage.define(sas)]}
                  editable={false}
                  style={{
                    fontSize: '0.82rem',
                    backgroundColor: '#181c24'
                  }}
                />
              </Box>
            </Card>
          </Box>

          {/* Left code window */}
          <Box sx={{ width: '50%' }}>
            <Typography variant="subtitle2" sx={{ 
              fontSize: '1.2rem', 
              mb: 1,
              color: theme.palette.primary.main,
              fontWeight: 600
            }}>
              Template Code with Utility Macros
            </Typography>
            <Card sx={{ 
              height: '100%',
              bgcolor: '#181c24',
              position: 'relative',
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              {/* Vertical scroll indicator */}
              <Box sx={{ 
                position: 'absolute',
                right: 5,
                top: '15%',
                height: '70%',
                width: 24,
                zIndex: 10,
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Box sx={{
                  height: '100%',
                  width: 4,
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  position: 'relative'
                }}>
                  <Box 
                    sx={{
                      position: 'absolute',
                      left: '-5px',
                      width: 14,
                      height: 18,
                      bgcolor: '#666',
                      borderRadius: 2,
                      top: `${scrollValue}%`,
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseDown={(e) => {
                      const container = e.currentTarget.parentElement;
                      if (!container) return;
                      const containerHeight = container.clientHeight;
                      const handleMouseMove = (moveEvent: MouseEvent) => {
                        const containerRect = container.getBoundingClientRect();
                        const y = moveEvent.clientY - containerRect.top;
                        const percentage = Math.max(0, Math.min(100, (y / containerHeight) * 100));
                        handleScrollChange(null, percentage);
                      };
                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };
                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  >
                    <DragIndicatorIcon sx={{ fontSize: '0.6rem', color: '#fff' }} />
                  </Box>
                </Box>
              </Box>
              
              {/* Code content */}
              <Box sx={{ 
                height: '100%',
                overflow: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' }
              }}
              ref={(el: HTMLDivElement | null) => {
                if (el) {
                  const maxScroll = el.scrollHeight - el.clientHeight;
                  el.scrollTop = (scrollValue / 100) * maxScroll;
                }
              }}
              >
                <CodeMirror
                  value={leftSasCode}
                  height="100%"
                  theme="dark"
                  extensions={[StreamLanguage.define(sas)]}
                  editable={false}
                  style={{
                    fontSize: '0.82rem',
                    backgroundColor: '#181c24'
                  }}
                />
              </Box>
            </Card>
          </Box>
        </Box>

        {/* Feature Cards Section */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 2,
          mb: 2,
          mt: 4,
          height: '100px',
          px: 4
        }}>
          {featureCards.map((card) => (
            <Box
              key={card.id}
              sx={{
                position: 'relative',
                '&:hover': {
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
            >
              <Card sx={{ 
                p: 1.5,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'rgba(54, 224, 158, 0.1)',
                borderRadius: '8px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'rgba(54, 224, 158, 0.15)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }
              }}>
                <Box sx={{ mr: 2 }}>
                  {card.icon}
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ 
                    fontSize: '0.9rem', 
                    fontWeight: 600,
                    mb: 0.3,
                    color: theme.palette.primary.main
                  }}>
                    {card.title}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    fontSize: '0.75rem', 
                    display: 'block', 
                    color: '#666',
                    lineHeight: 1.2
                  }}>
                    {card.description}
                  </Typography>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Slide>
  );
};

export default OGEMCodeDemoSlide; 