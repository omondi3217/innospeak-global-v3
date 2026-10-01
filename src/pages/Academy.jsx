import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Seo from '../components/ui/Seo.jsx';
import AcademyHero from '../components/sections/academy/AcademyHero.jsx';
import AboutAcademy from '../components/sections/academy/AboutAcademy.jsx';
import ProgrammeCatalogue from '../components/sections/academy/ProgrammeCatalogue.jsx';
import MarketableCourses from '../components/sections/MarketableCourses.jsx';
import CbeAcademy from '../components/sections/academy/CbeAcademy.jsx';
import TvetComingSoon from '../components/sections/academy/TvetComingSoon.jsx';
import LearningModel from '../components/sections/academy/LearningModel.jsx';
import Certification from '../components/sections/academy/Certification.jsx';
import CareerOpportunities from '../components/sections/academy/CareerOpportunities.jsx';
import WhyStudyWithUs from '../components/sections/academy/WhyStudyWithUs.jsx';
import WhoItIsFor from '../components/sections/academy/WhoItIsFor.jsx';
import FAQ from '../components/sections/academy/FAQ.jsx';
import FinalCTA from '../components/sections/academy/FinalCTA.jsx';

export default function Academy() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const pathway = searchParams.get('pathway');

    const timer = setTimeout(() => {
      document.getElementById(pathway)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <>
      <Seo
        title="InnoSpeak Academy"
        description="Develop world-class communication, technical and professional skills through InnoSpeak Academy."
        path="/academy"
      />

      <AcademyHero />
      <AboutAcademy />
      <ProgrammeCatalogue />
      <MarketableCourses
        division="academy"
        limit={6}
        title="Most In-Demand Academy Courses"
        subtitle="Courses aligned with 2026 employer demand in Kenya and worldwide."
      />
      <CbeAcademy />
      <TvetComingSoon />
      <LearningModel />
      <Certification />
      <CareerOpportunities />
      <WhyStudyWithUs />
      <WhoItIsFor />
      <FAQ />
      <FinalCTA />
    </>
  );
}