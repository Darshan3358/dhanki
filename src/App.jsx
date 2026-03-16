import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './AdminPage/AdminDashboard';

// If someone lands on / with ?ref=0xABC, redirect them straight to /register?ref=0xABC
const HomeRedirect = () => {
    const [params] = useSearchParams();
    const ref = params.get('ref');
    if (ref) {
        return <Navigate to={`/register?ref=${ref}`} replace />;
    }
    return <Login />;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Auth routes */}
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Legacy /ref/:refId param style still works */}
                <Route path="/ref/:refId" element={<Register />} />

                {/* Dashboard routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/buy-token" element={<Dashboard />} />
                <Route path="/referral" element={<Dashboard />} />
                <Route path="/level-income" element={<Dashboard />} />
                <Route path="/profile" element={<Dashboard />} />
                <Route path="/support" element={<Dashboard />} />

                {/* Admin Page */}
                <Route path="/dhanki-admin" element={<AdminDashboard />} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
