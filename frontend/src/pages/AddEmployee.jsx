import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { employeesAPI } from '../api'

function AddEmployee() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    employee_code: '',
    department: '',
    email: '',
    password: '',
    role: 'user',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)
  const [createdCredentials, setCreatedCredentials] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setShowCredentials(false)

    try {
      const response = await employeesAPI.create(formData)
      
      // Show credentials after successful creation
      setCreatedCredentials({
        employee: response.employee,
        account: response.account
      })
      setShowCredentials(true)
    } catch (err) {
      setError(err.message || 'Failed to create employee account')
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    setShowCredentials(false)
    setCreatedCredentials(null)
    // Reset form
    setFormData({
      name: '',
      employee_code: '',
      department: '',
      email: '',
      password: '',
      role: 'user',
    })
    // Optionally navigate to dashboard or stay on page to add another
    navigate('/dashboard')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create Employee Account</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create a new employee with login account - all fields are required
        </p>
      </div>

      {showCredentials && createdCredentials ? (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Employee Account Created Successfully!
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Share these login credentials with the employee
            </p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Employee Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Name:</span>
                <span className="text-gray-900">{createdCredentials.employee.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Employee Code:</span>
                <span className="text-gray-900">{createdCredentials.employee.employee_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Department:</span>
                <span className="text-gray-900">{createdCredentials.employee.department}</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4">
              Login Credentials
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-yellow-900 mb-1">
                  Email:
                </label>
                <div className="flex items-center justify-between bg-white border border-yellow-300 rounded-md p-3">
                  <code className="text-sm font-mono text-gray-900">{createdCredentials.account.email}</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(createdCredentials.account.email)
                      alert('Email copied to clipboard!')
                    }}
                    className="ml-2 text-yellow-700 hover:text-yellow-900"
                    title="Copy email"
                  >
                    📋
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-900 mb-1">
                  Password:
                </label>
                <div className="flex items-center justify-between bg-white border border-yellow-300 rounded-md p-3">
                  <code className="text-sm font-mono text-gray-900">{createdCredentials.account.password}</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(createdCredentials.account.password)
                      alert('Password copied to clipboard!')
                    }}
                    className="ml-2 text-yellow-700 hover:text-yellow-900"
                    title="Copy password"
                  >
                    📋
                  </button>
                </div>
              </div>
              <div className="mt-4 p-3 bg-red-50 border border-red-300 rounded-md">
                <p className="text-xs text-red-900">
                  ⚠️ <strong>Important:</strong> Copy these credentials now. This is the only time you'll see the password. Share them securely with the employee.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleContinue}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Employee Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter employee full name"
              />
            </div>

            <div>
              <label htmlFor="employee_code" className="block text-sm font-medium text-gray-700">
                Employee Code *
              </label>
              <input
                type="text"
                id="employee_code"
                name="employee_code"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.employee_code}
                onChange={handleChange}
                placeholder="e.g., EMP004"
              />
              <p className="mt-1 text-xs text-gray-500">Must be unique (e.g., EMP001, EMP002, EMP003)</p>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department *
              </label>
              <input
                type="text"
                id="department"
                name="department"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., IT, HR, Sales, Operations"
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Login Account Details</h3>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.email}
                onChange={handleChange}
                placeholder="employee@example.com"
              />
              <p className="mt-1 text-xs text-gray-500">This will be their login email</p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={6}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
              />
              <p className="mt-1 text-xs text-gray-500">Minimum 6 characters. Share this with the employee securely.</p>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role *
              </label>
              <select
                id="role"
                name="role"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">User (Can view own shifts)</option>
                <option value="admin">Admin (Can view all shifts and manage)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">Users can only see their own shifts. Admins can see everything.</p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Employee Account'}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-900 mb-2">What happens next:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Employee record and login account will be created together</li>
              <li>Login credentials will be displayed for you to share</li>
              <li>Employee can immediately login and check their shifts</li>
              <li>You can assign shifts to this employee using "Add Shift"</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddEmployee
