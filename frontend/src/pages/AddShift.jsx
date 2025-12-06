import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { shiftsAPI, employeesAPI } from '../api'

function AddShift() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [formData, setFormData] = useState({
    employee_id: '',
    date: '',
    start_time: '',
    end_time: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingEmployees, setLoadingEmployees] = useState(true)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const data = await employeesAPI.getAll()
      setEmployees(data)
    } catch (err) {
      setError('Failed to load employees')
    } finally {
      setLoadingEmployees(false)
    }
  }

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

    try {
      await shiftsAPI.create(formData)
      // Redirect to dashboard on success
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to create shift')
    } finally {
      setLoading(false)
    }
  }

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Shift</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create a new shift assignment for an employee
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700">
              Employee
            </label>
            {loadingEmployees ? (
              <div className="mt-1 text-sm text-gray-500">Loading employees...</div>
            ) : (
              <select
                id="employee_id"
                name="employee_id"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.employee_id}
                onChange={handleChange}
              >
                <option value="">Select an employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.employee_code}) - {employee.department}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              min={today}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.date}
              onChange={handleChange}
            />
            <p className="mt-1 text-xs text-gray-500">Format: YYYY-MM-DD</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                id="start_time"
                name="start_time"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.start_time}
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-gray-500">Format: HH:mm (24-hour)</p>
            </div>

            <div>
              <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                id="end_time"
                name="end_time"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.end_time}
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-gray-500">Format: HH:mm (24-hour)</p>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || loadingEmployees}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Shift'}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Business Rules:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Shift must be at least 4 hours long</li>
            <li>No overlapping shifts allowed for the same employee on the same date</li>
            <li>Date format: YYYY-MM-DD</li>
            <li>Time format: HH:mm (24-hour)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AddShift
