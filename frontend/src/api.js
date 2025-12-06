const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

// Helper function to get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('token')
}

// Helper function to make API requests with automatic JWT header
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken()
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const config = {
    ...options,
    headers,
  }
  
  let response
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, config)
  } catch (networkError) {
    throw new Error(`Network error: Unable to connect to server at ${API_BASE_URL}. Please ensure the backend server is running.`)
  }
  
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`
    try {
      const error = await response.json()
      errorMessage = error.error || errorMessage
    } catch (parseError) {
      errorMessage = `Server returned an error (${response.status}). Please check if the backend server is running correctly.`
    }
    throw new Error(errorMessage)
  }
  
  return response.json()
}

// Auth API
export const authAPI = {
  login: async (email, password) => {
    return apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },
}

// Employees API
export const employeesAPI = {
  getAll: async () => {
    return apiRequest('/employees')
  },
  
  create: async (employeeData) => {
    return apiRequest('/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    })
  },
}

// Users API
export const usersAPI = {
  create: async (userData) => {
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },
}

// Shifts API
export const shiftsAPI = {
  getAll: async (employee = null, date = null) => {
    let url = '/shifts'
    const params = new URLSearchParams()
    if (employee) params.append('employee', employee)
    if (date) params.append('date', date)
    if (params.toString()) url += '?' + params.toString()
    return apiRequest(url)
  },
  
  create: async (shiftData) => {
    return apiRequest('/shifts', {
      method: 'POST',
      body: JSON.stringify(shiftData),
    })
  },
  
  delete: async (shiftId) => {
    return apiRequest(`/shift/${shiftId}`, {
      method: 'DELETE',
    })
  },
}

export default {
  auth: authAPI,
  employees: employeesAPI,
  shifts: shiftsAPI,
  users: usersAPI,
}
