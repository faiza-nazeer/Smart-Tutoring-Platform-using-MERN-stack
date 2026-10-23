// Single place that knows where the backend lives.
// Set VITE_API_URL in your host (e.g. https://your-api.onrender.com/api). Falls back to local dev.
export const API_URL: string = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/$/, '');

// fetch() wrapper: prefixes the API URL, sends the JWT, and signs the user out if it has expired.
export const apiFetch = async (path: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401 && token) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (window.location.pathname !== '/login') window.location.href = '/login';
  }
  return res;
};

const json = (method: string, body: object): RequestInit => ({
  method,
  body: JSON.stringify(body),
});

export const getCourses = async (): Promise<any[]> => (await apiFetch('/courses')).json();
export const getCourse = async (id: string): Promise<any> => (await apiFetch(`/courses/${id}`)).json();

export const getUsers = async (): Promise<any[]> => (await apiFetch('/users')).json();
export const getUser = async (id: string): Promise<any> => (await apiFetch(`/users/${id}`)).json();
export const updateUser = async (id: string, data: object): Promise<any> =>
  (await apiFetch(`/users/${id}`, json('PUT', data))).json();
export const deleteUser = async (id: string): Promise<any> =>
  (await apiFetch(`/users/${id}`, { method: 'DELETE' })).json();

export const getBookings = async (): Promise<any[]> => (await apiFetch('/bookings')).json();
export const createBooking = async (bookingData: object): Promise<any> =>
  (await apiFetch('/bookings', json('POST', bookingData))).json();
export const updateBooking = async (id: string, data: object): Promise<any> =>
  (await apiFetch(`/bookings/${id}`, json('PUT', data))).json();
export const deleteBooking = async (id: string): Promise<any> =>
  (await apiFetch(`/bookings/${id}`, { method: 'DELETE' })).json();

export const getReviews = async (): Promise<any[]> => (await apiFetch('/reviews')).json();
export const createReview = async (reviewData: object): Promise<any> =>
  (await apiFetch('/reviews', json('POST', reviewData))).json();

export const loginUser = async (email: string, password: string): Promise<any> =>
  (await apiFetch('/auth/login', json('POST', { email, password }))).json();
export const registerUser = async (userData: object): Promise<any> =>
  (await apiFetch('/auth/register', json('POST', userData))).json();
export const forgotPassword = async (email: string, newPassword: string): Promise<any> =>
  (await apiFetch('/auth/forgot-password', json('POST', { email, newPassword }))).json();

export const sendContactMessage = async (data: object): Promise<any> =>
  (await apiFetch('/contact', json('POST', data))).json();
