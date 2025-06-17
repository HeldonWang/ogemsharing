import { useState } from 'react';
import { useTheme } from '@mui/material';
import PresentationLayout from './components/PresentationLayout';

// Import refactored slide components
// page=1
import TitleSlide from './slides/TitleSlide';
// page=2
import OverviewTLFProcessSlide from './slides/OverviewTLFProcessSlide';
// page=3
import OncoCoreEfficacyTablesSlide from './slides/OncoCoreEfficacyTablesSlide';
// page=4
import OGEMEfficacyMacrosSlide from './slides/OGEMEfficacyMacrosSlide';
// page=5
import OGEMCodeDemoSlide from './slides/OGEMCodeDemoSlide';
// page=6
import AZTONCEF04 from './slides/AZTONCEF04';
// page=7
import AZTONCEF04display from './slides/AZTONCEF04display';
// page=8
import AZTONCEF04open from './slides/AZTONCEF04open';
// page=9
import AZTONCEF02 from './slides/AZTONCEF02';
// page=10
import AZTONCEF02aDisplay from './slides/AZTONCEF02aDisplay';
// page=11
import AZTONCEF02open from './slides/AZTONCEF02open';
// page=12
import OGEMBenefitSlide from './slides/OGEMBenefitSlide';
// page=13
import InTheNext from './slides/InTheNext';
// page=14
import LastSection from './slides/LastSection';

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const theme = useTheme();

  const slides = [
    <TitleSlide key="title" theme={theme} />,
    <OverviewTLFProcessSlide key="overview-tlf-process" theme={theme} />,
    <OncoCoreEfficacyTablesSlide key="onco-core-efficacy-tables" theme={theme} />,
    <OGEMEfficacyMacrosSlide key="ogem-efficacy-macros" theme={theme} />,
    <OGEMCodeDemoSlide key="ogem-code-demo" theme={theme} />,
    <AZTONCEF04 key="aztoncef04" theme={theme} />,
    <AZTONCEF04display key="aztoncef04display" theme={theme} />,
    <AZTONCEF04open key="aztoncef04open" theme={theme} />,
    <AZTONCEF02 key="aztoncef02" theme={theme} />,
    <AZTONCEF02aDisplay key="aztoncef02adisplay" theme={theme} />,
    <AZTONCEF02open key="aztoncef02open" theme={theme} />,
    <OGEMBenefitSlide key="ogem-benefits" theme={theme} />,
    <InTheNext key="future-plans" theme={theme} />,
    <LastSection key="last-section" theme={theme} />
  ];

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleGoToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  return (
    <PresentationLayout
      totalSlides={slides.length}
      currentSlide={currentSlide}
      onNextSlide={handleNextSlide}
      onPrevSlide={handlePrevSlide}
      onGoToSlide={handleGoToSlide}
    >
      {slides[currentSlide]}
    </PresentationLayout>
  );
}

export default App;