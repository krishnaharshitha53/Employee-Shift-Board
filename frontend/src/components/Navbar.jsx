import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    navigate('/')
  }

  if (!token) {
    return null
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-gray-800">
              Employee Shift Board
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {role === 'admin' && (
              <>
                <Link
                  to="/add-employee"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Add Employee
                </Link>
                <Link
                  to="/add-shift"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Add Shift
                </Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

