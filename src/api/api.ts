const BASE_URL = 'http://localhost:5000/api';

export const getCourses = async (): Promise<any[]> => {
  const res = await fetch(`${BASE_URL}/courses`);
  return res.json();
};

export const getCourse = async (id: string): Promise<any> => {
  const res = await fetch(`${BASE_URL}/courses/${id}`);
  return res.json();
};

export const getUsers = async (): Promise<any[]> => {
  const res = await fetch(`${BASE_URL}/users`);
  return res.json();
};

export const createBooking = async (bookingData: object): Promise<any> => {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });
  return res.json();
};

export const getReviews = async (): Promise<any[]> => {
  const res = await fetch(`${BASE_URL}/reviews`);
  return res.json();
};

export const createReview = async (reviewData: object): Promise<any> => {
  const res = await fetch(`${BASE_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData),
  });
  return res.json();
};

export const getBookings = async (): Promise<any[]> => {
  const res = await fetch('http://localhost:5000/api/bookings');
  return res.json();
};

export const deleteUser = async (id: string): Promise<any> => {
  const res = await fetch(`http://localhost:5000/api/users/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};

export const updateUser = async (id: string, data: object): Promise<any> => {
  const res = await fetch(`http://localhost:5000/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteBooking = async (id: string): Promise<any> => {
  const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};

export const updateBooking = async (id: string, data: object): Promise<any> => {
  const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginUser = async (email: string, password: string): Promise<any> => {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const registerUser = async (userData: object): Promise<any> => {
  const res = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return res.json();
};
export const sendContactMessage = async (data: object): Promise<any> => {
  const res = await fetch('http://localhost:5000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const forgotPassword = async (email: string, newPassword: string): Promise<any> => {
  const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, newPassword }),
  });
  return res.json();
};