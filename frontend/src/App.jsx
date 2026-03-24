import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/useAuthStore'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ListDetail from './pages/ListDetail'
import ShoppingMode from './pages/ShoppingMode'

function PrivateRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/lists/:id" element={<PrivateRoute><ListDetail /></PrivateRoute>} />
        <Route path="/lists/:id/shopping" element={<PrivateRoute><ShoppingMode /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
