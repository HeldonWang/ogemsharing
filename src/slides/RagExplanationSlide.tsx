import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Card, Paper, Divider, Chip, Button, Avatar, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import Slide from '../components/Slide';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import WidgetsIcon from '@mui/icons-material/Widgets';
import StorageIcon from '@mui/icons-material/Storage';
import SearchIcon from '@mui/icons-material/Search';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CodeIcon from '@mui/icons-material/Code';
import TuneIcon from '@mui/icons-material/Tune';
import CalculateIcon from '@mui/icons-material/Calculate';

// Sample text from the protocol document
const protocolText = `
CLINICAL STUDY PROTOCOL

Protocol Title: A Phase III, Randomized, Double-Blind, Placebo-Controlled Study to Assess the Efficacy and Safety of Drug XYZ in Patients with Advanced Refractory Solid Tumors

Protocol Number: XYZ-1001
Version: 3.0
Date: January 15, 2025

1. INTRODUCTION
1.1 Background
Cancer remains one of the leading causes of death worldwide, with approximately 19.3 million new cases and 10 million cancer deaths in 2020. Despite significant advances in cancer therapy, patients with advanced solid tumors often develop resistance to available treatments, leading to disease progression and limited survival outcomes.

Immune checkpoint inhibitors (ICIs) have revolutionized the treatment of various cancers by enhancing the ability of the immune system to recognize and eliminate tumor cells. However, only a subset of patients responds to ICI therapy, and many eventually develop acquired resistance.

1.2 Investigational Product
Drug XYZ is a small molecule inhibitor of the XYZ kinase pathway with an IC50 of 3.2 nM. It is formulated as immediate-release tablets for oral administration.

1.3 Clinical Studies
As of the protocol date, Drug XYZ has been evaluated in a Phase 1 dose-escalation and expansion study in 87 patients with advanced solid tumors. The most common treatment-related adverse events were fatigue, nausea, decreased appetite, and reversible transaminase elevations.

4.1 Inclusion Criteria
Participants must meet all the following criteria to be eligible:
1. Age ≥18 years at the time of signing informed consent
2. Confirmed diagnosis of advanced or metastatic solid tumor
3. Disease progression after standard therapy including immunotherapy
4. ECOG performance status of 0 or 1
5. Adequate organ function
`;

// Example text chunks for visualization
const textChunks = [
  { 
    id: 1, 
    text: "CLINICAL STUDY PROTOCOL\n\nProtocol Title: A Phase III, Randomized, Double-Blind, Placebo-Controlled Study to Assess the Efficacy and Safety of Drug XYZ in Patients with Advanced Refractory Solid Tumors\n\nProtocol Number: XYZ-1001\nVersion: 3.0\nDate: January 15, 2025", 
    tags: ["header", "metadata"],
    vectors: [0.12, 0.83, -0.44, 0.71, -0.32],
    embedInfo: "This chunk contains protocol metadata which is embedded to capture document identification information. Embedding focuses on protocol identifiers, version numbers, and study type."
  },
  { 
    id: 2, 
    text: "1. INTRODUCTION\n1.1 Background\nCancer remains one of the leading causes of death worldwide, with approximately 19.3 million new cases and 10 million cancer deaths in 2020. Despite significant advances in cancer therapy, patients with advanced solid tumors often develop resistance to available treatments, leading to disease progression and limited survival outcomes.", 
    tags: ["introduction", "background"],
    vectors: [0.54, 0.21, -0.19, 0.63, -0.58],
    embedInfo: "This introduction chunk is embedded to capture the disease context and background. The embedding emphasizes medical terminology, disease statistics, and general research context for the trial."
  },
  { 
    id: 3, 
    text: "Immune checkpoint inhibitors (ICIs) have revolutionized the treatment of various cancers by enhancing the ability of the immune system to recognize and eliminate tumor cells. However, only a subset of patients responds to ICI therapy, and many eventually develop acquired resistance.", 
    tags: ["background", "treatment"],
    vectors: [0.88, -0.32, 0.04, -0.17, 0.29],
    embedInfo: "This treatment-focused chunk is embedded to capture mechanisms of action, therapeutic classes, and clinical efficacy concepts. The embedding prioritizes immunotherapy-related terminology."
  },
  { 
    id: 4, 
    text: "1.2 Investigational Product\nDrug XYZ is a small molecule inhibitor of the XYZ kinase pathway with an IC50 of 3.2 nM. It is formulated as immediate-release tablets for oral administration.", 
    tags: ["drug", "investigational product"],
    vectors: [-0.35, 0.67, 0.12, -0.25, 0.78],
    embedInfo: "This product information chunk is embedded to capture pharmaceutical details. The embedding focuses on drug characteristics, mechanism of action, and pharmaceutical formulation terminology."
  },
  { 
    id: 5, 
    text: "1.3 Clinical Studies\nAs of the protocol date, Drug XYZ has been evaluated in a Phase 1 dose-escalation and expansion study in 87 patients with advanced solid tumors. The most common treatment-related adverse events were fatigue, nausea, decreased appetite, and reversible transaminase elevations.", 
    tags: ["clinical studies", "safety"],
    vectors: [-0.22, -0.43, 0.72, 0.65, 0.39],
    embedInfo: "This safety data chunk is embedded to capture clinical outcomes and adverse event information. The embedding emphasizes medical side effects, patient population characteristics, and clinical study terminology."
  },
  { 
    id: 6, 
    text: "4.1 Inclusion Criteria\nParticipants must meet all the following criteria to be eligible:\n1. Age ≥18 years at the time of signing informed consent\n2. Confirmed diagnosis of advanced or metastatic solid tumor\n3. Disease progression after standard therapy including immunotherapy\n4. ECOG performance status of 0 or 1\n5. Adequate organ function", 
    tags: ["inclusion criteria", "eligibility"],
    vectors: [-0.56, -0.24, -0.63, 0.38, 0.91],
    embedInfo: "This eligibility criteria chunk is embedded to capture patient selection parameters. The embedding focuses on clinical assessment terminology, patient characteristics, and requirement specifications."
  }
];

// Example queries for the demo
const queryExamples = [
  "What are the inclusion criteria for the study?",
  "What is the investigational product?",
  "What adverse events were observed?",
  "What is the primary endpoint of the study?",
  "What patient population is being studied?"
];

// Similarity scores for ranking visualization
// Define similarity scores for each query
const similarityScoresByQuery = {
  "What are the inclusion criteria for the study?": [
    { chunkId: 6, score: 0.92, relevance: "High", reasons: ["Contains all eligibility criteria", "Directly answers the query", "Contains structured list format"] },
    { chunkId: 2, score: 0.41, relevance: "Low", reasons: ["Mentions 'patients' but no eligibility criteria", "Discusses disease background only", "Too general for the query"] },
    { chunkId: 5, score: 0.37, relevance: "Low", reasons: ["Mentions patient population but not selection criteria", "Focus is on safety not eligibility", "Contains study results, not requirements"] },
    { chunkId: 4, score: 0.26, relevance: "Very Low", reasons: ["No mention of patient criteria", "Focus on drug characteristics", "Irrelevant to eligibility"] },
    { chunkId: 3, score: 0.22, relevance: "Very Low", reasons: ["Discusses treatment mechanisms", "No mention of patient selection", "Irrelevant to the query"] },
    { chunkId: 1, score: 0.18, relevance: "Very Low", reasons: ["Contains metadata only", "No clinical content related to eligibility", "Administrative information only"] }
  ],
  "What is the investigational product?": [
    { chunkId: 4, score: 0.95, relevance: "High", reasons: ["Direct description of drug XYZ", "Contains mechanism of action", "Contains formulation details"] },
    { chunkId: 5, score: 0.53, relevance: "Medium", reasons: ["Mentions the drug in clinical studies", "Contains partial information about the product", "Focus is on clinical results not drug characteristics"] },
    { chunkId: 3, score: 0.39, relevance: "Low", reasons: ["Related to treatments but not specific to the investigational product", "Discusses immunotherapy in general", "No specific drug XYZ details"] },
    { chunkId: 6, score: 0.27, relevance: "Very Low", reasons: ["Mentions treatments indirectly", "No information about drug characteristics", "Focus on patient eligibility"] },
    { chunkId: 2, score: 0.24, relevance: "Very Low", reasons: ["General cancer treatment context", "No specific product information", "Background information only"] },
    { chunkId: 1, score: 0.19, relevance: "Very Low", reasons: ["Contains study title with drug XYZ", "No detailed information about the product", "Administrative information only"] }
  ],
  "What adverse events were observed?": [
    { chunkId: 5, score: 0.94, relevance: "High", reasons: ["Lists specific adverse events", "Mentions fatigue, nausea, decreased appetite", "Directly addresses safety outcomes"] },
    { chunkId: 4, score: 0.32, relevance: "Low", reasons: ["Describes the drug but not adverse events", "Related to the medication being studied", "No safety data included"] },
    { chunkId: 3, score: 0.29, relevance: "Very Low", reasons: ["Mentions therapy resistance", "No specific adverse events", "Focus on mechanism not safety"] },
    { chunkId: 6, score: 0.25, relevance: "Very Low", reasons: ["Mentions organ function", "No adverse event data", "Eligibility criteria only"] },
    { chunkId: 2, score: 0.21, relevance: "Very Low", reasons: ["General disease context", "No safety information", "Background information only"] },
    { chunkId: 1, score: 0.12, relevance: "Very Low", reasons: ["Protocol metadata only", "No clinical content", "Administrative information only"] }
  ],
  "What is the primary endpoint of the study?": [
    { chunkId: 1, score: 0.56, relevance: "Medium", reasons: ["Contains study title and design", "Mentions efficacy and safety assessment", "No explicit primary endpoint defined"] },
    { chunkId: 2, score: 0.43, relevance: "Low", reasons: ["Mentions survival outcomes", "Related to potential endpoints", "No explicit endpoint definition"] },
    { chunkId: 5, score: 0.38, relevance: "Low", reasons: ["Contains safety data", "Related to secondary endpoints", "No primary endpoint specified"] },
    { chunkId: 6, score: 0.31, relevance: "Very Low", reasons: ["Patient eligibility only", "No endpoint information", "Unrelated to study outcomes"] },
    { chunkId: 3, score: 0.28, relevance: "Very Low", reasons: ["Treatment mechanism context", "No endpoint information", "Background information only"] },
    { chunkId: 4, score: 0.22, relevance: "Very Low", reasons: ["Drug information only", "No endpoint details", "Unrelated to study outcomes"] }
  ],
  "What patient population is being studied?": [
    { chunkId: 2, score: 0.88, relevance: "High", reasons: ["Describes patient population with advanced solid tumors", "Mentions resistance to available treatments", "Contains disease progression context"] },
    { chunkId: 6, score: 0.85, relevance: "High", reasons: ["Lists specific inclusion criteria", "Defines exact patient characteristics", "Contains performance status requirements"] },
    { chunkId: 5, score: 0.71, relevance: "Medium", reasons: ["Mentions study involved 87 patients", "Specifies advanced solid tumors", "Includes partial population information"] },
    { chunkId: 1, score: 0.47, relevance: "Low", reasons: ["Study title mentions advanced refractory solid tumors", "Contains high-level population info", "No detailed patient characteristics"] },
    { chunkId: 3, score: 0.34, relevance: "Very Low", reasons: ["General therapy context", "Mentions subset of patients", "No specific study population details"] },
    { chunkId: 4, score: 0.19, relevance: "Very Low", reasons: ["Drug information only", "No patient population details", "Unrelated to eligibility or demographics"] }
  ]
};

const tableCategories = [
  {
    title: 'K-M Related',
    description: 'Tables related to Kaplan-Meier analysis, e.g., survival curves, median survival, hazard ratios.'
  },
  {
    title: 'Ratio Related',
    description: 'Tables showing response rates, risk ratios, odds ratios, etc.'
  },
  {
    title: 'Time to Event Related',
    description: 'Tables summarizing time-to-event endpoints, e.g., progression-free survival, time to response.'
  },
  {
    title: 'Other',
    description: 'Other efficacy tables not covered above, e.g., waterfall plots, subgroup analyses.'
  }
];

const OncoCoreEfficacyTablesSlide: React.FC<{ theme: any }> = ({ theme }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'K-M Related',
      icon: <WidgetsIcon />,
      content: (
        <Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Kaplan-Meier (K-M) related tables are used to summarize survival data, including survival curves, median survival times, and hazard ratios.
          </Typography>
          <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              Example Tables
              </Typography>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Overall Survival (OS) K-M Table</li>
              <li>Progression-Free Survival (PFS) K-M Table</li>
              <li>Hazard Ratio Summary Table</li>
            </ul>
                </Paper>
        </Box>
      )
    },
    {
      title: 'Ratio Related',
      icon: <CalculateIcon />,
      content: (
        <Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Ratio related tables display response rates, risk ratios, odds ratios, and other comparative statistics.
          </Typography>
          <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              Example Tables
                        </Typography>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Objective Response Rate (ORR) Table</li>
              <li>Risk Ratio Table</li>
              <li>Odds Ratio Table</li>
            </ul>
                      </Paper>
        </Box>
      )
    },
    {
      title: 'Time to Event Related',
      icon: <AccessTimeIcon />,
      content: (
        <Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Time to event related tables summarize endpoints such as time to progression, time to response, and duration of response.
          </Typography>
          <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              Example Tables
              </Typography>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Time to Progression Table</li>
              <li>Time to Response Table</li>
              <li>Duration of Response Table</li>
            </ul>
                </Paper>
        </Box>
      )
    },
    {
      title: 'Other',
      icon: <WidgetsIcon />,
      content: (
        <Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Other efficacy tables include waterfall plots, subgroup analyses, and any other tables not covered above.
          </Typography>
          <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              Example Tables
              </Typography>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Waterfall Plot Table</li>
              <li>Subgroup Analysis Table</li>
              <li>Other Custom Efficacy Tables</li>
            </ul>
              </Paper>
        </Box>
      )
    }
  ];

  const nextStep = () => {
    setCurrentStep(prevStep => Math.min(prevStep + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 0));
  };

  return (
    <Slide key="onco-core-efficacy-tables" title="Onco core efficacy Tables Classification">
      <Box className="main-card" sx={{ height: "100%" }}>
        <Box 
          className="content-card" 
          sx={{ 
            height: 'calc(100% - 10px)', 
            margin: '5px',
            p: '16px'
          }}
        >
          {/* Steps indicator */}
          <Box sx={{ display: 'flex', mb: 2 }}>
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onClick={() => setCurrentStep(index)}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: currentStep === index ? theme.palette.primary.main : 'rgba(0,0,0,0.08)',
                      width: 32,
                      height: 32,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {React.cloneElement(step.icon, { 
                      sx: { fontSize: '1rem', color: currentStep === index ? 'white' : 'rgba(0,0,0,0.5)' } 
                    })}
                  </Avatar>
                  
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      ml: 1, 
                      fontWeight: currentStep === index ? 600 : 400,
                      color: currentStep === index ? 'text.primary' : 'text.secondary',
                      cursor: 'pointer'
                    }}
                  >
                    {step.title}
                  </Typography>
                </Box>

                {index < steps.length - 1 && (
                  <Box 
                    sx={{ 
                      flex: 1, 
                      height: 1, 
                      bgcolor: 'rgba(0,0,0,0.1)', 
                      alignSelf: 'center', 
                      mx: 1.5,
                      maxWidth: '30px'
                    }} 
                  />
                )}
              </React.Fragment>
            ))}
          </Box>

          {/* Main content */}
          <Box sx={{ flex: 1, height: 'calc(100% - 60px)', overflowY: 'auto' }}>
            {steps[currentStep].content}
          </Box>
          
          {/* Navigation buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              startIcon={<NavigateBeforeIcon />}
              disabled={currentStep === 0}
              onClick={prevStep}
              variant="outlined"
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Previous
            </Button>
            
            <Button
              endIcon={<NavigateNextIcon />}
              disabled={currentStep === steps.length - 1}
              onClick={nextStep}
              variant="contained"
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </Slide>
  );
};

export default OncoCoreEfficacyTablesSlide;