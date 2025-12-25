import { Routes, Route } from 'react-router-dom';
import { Workspace } from './components/core/Workspace';
import { SEOEnforcer } from './components/core/SEOEnforcer';

function App() {
  return (
    <>
      <SEOEnforcer />
      <Routes>
        <Route path="*" element={<Workspace />} />
      </Routes>
    </>
  );
}

export default App;
