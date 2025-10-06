import './App.css'
import { Routes, Route } from 'react-router-dom';

import AppLayout from './AppLayout.tsx'
import DashboardPage from "./components/pages/DashboardPage.tsx";
import CircuitMapPage from "./components/pages/CircuitMapPage.tsx";
import NotFoundPage from "./components/pages/NotFoundPage.tsx";
function App() {


  return (
    <>
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="factures" element={<div>Page des factures</div>} />
                <Route path="circuits" element={<CircuitMapPage />} />
            </Route>

            {/* Ici, vous pourriez ajouter des routes qui n'utilisent PAS AppLayout */}
            {/* <Route path="/login" element={<LoginPage />} /> */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>

    </>
  )
}

export default App
