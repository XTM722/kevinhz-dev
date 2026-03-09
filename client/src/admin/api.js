const BASE = 'https://kevinhz-api.onrender.com/api'

function getToken() {
  return localStorage.getItem('admin_token')
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

export async function login(username, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  localStorage.setItem('admin_token', data.token)
  return data.token
}

export function logout() {
  localStorage.removeItem('admin_token')
}

export function isLoggedIn() {
  return !!getToken()
}

// Posts
export async function fetchAllPosts() {
  const res = await fetch(`${BASE}/posts/admin/all`, { headers: authHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

export async function createPost(post) {
  const res = await fetch(`${BASE}/posts`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(post),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

export async function updatePost(id, post) {
  const res = await fetch(`${BASE}/posts/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(post),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

export async function deletePost(id) {
  const res = await fetch(`${BASE}/posts/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

// Friend Links
export async function fetchFriendLinks() {
  const res = await fetch(`${BASE}/friendlinks`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

export async function createFriendLink(link) {
  const res = await fetch(`${BASE}/friendlinks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(link),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

export async function deleteFriendLink(id) {
  const res = await fetch(`${BASE}/friendlinks/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}