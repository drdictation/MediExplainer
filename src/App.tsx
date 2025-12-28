import { Routes, Route } from 'react-router-dom';
import { Workspace } from './components/core/Workspace';
import { SEOEnforcer } from './components/core/SEOEnforcer';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsOfService } from './components/legal/TermsOfService';
import { About } from './components/legal/About';

function App() {
  return (
    <>
      <SEOEnforcer />
      <Routes>
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Workspace />} />
      </Routes>
    </>
  );
}

export default App;
