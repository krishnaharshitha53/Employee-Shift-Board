import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AddShift from './pages/AddShift'
import AddEmployee from './pages/AddEmployee'
import Navbar from './components/Navbar'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/" replace />
}

function AdminRoute({ children }) {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  
  if (!token) {
    return <Navigate to="/" replace />
  }
  
  if (role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/add-employee" 
            element={
              <AdminRoute>
                <AddEmployee />
              </AdminRoute>
            } 
          />
          <Route 
            path="/add-shift" 
            element={
              <AdminRoute>
                <AddShift />
              </AdminRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App

