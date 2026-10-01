import Seo from '../components/ui/Seo.jsx';
import LabsHero from '../components/sections/labs/LabsHero';
import AboutLabs from '../components/sections/labs/AboutLabs';
import LabTracks from '../components/sections/labs/LabTracks';
import LabsCourseCatalogue from '../components/sections/labs/LabsCourseCatalogue';
import MarketableCourses from '../components/sections/MarketableCourses.jsx';
import InnovationProcess from '../components/sections/labs/InnovationProcess';
import EntrepreneurshipInnovation from '../components/sections/labs/EntrepreneurshipInnovation';
import LabOutcomes from '../components/sections/labs/LabOutcomes';
import LabsFAQ from '../components/sections/labs/LabsFAQ';
import SubmitChallenge from '../components/sections/labs/SubmitChallenge';

export default function Labs() {
  return (
    <>
      <Seo title="Labs" path="/labs" />
      <LabsHero />
      <AboutLabs />
      <LabTracks />
      <LabsCourseCatalogue />
      <MarketableCourses
        division="labs"
        limit={6}
        title="High-Demand Labs Courses"
        subtitle="AI, cloud, cybersecurity and data courses aligned with 2026 employer demand."
      />
      <InnovationProcess />
      <EntrepreneurshipInnovation />
      <LabOutcomes />
      <LabsFAQ />
      <SubmitChallenge />
    </>
  );
}