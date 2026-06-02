import { API_BASE } from './api.js'

const base = `${API_BASE}/api`

function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function req(url, method = 'GET', token = '', body, isForm = false) {
  const res = await fetch(url, {
    method,
    headers: isForm ? authHeader(token) : { 'Content-Type': 'application/json', ...authHeader(token) },
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || data.message || 'Request failed')
  return data
}

export const commsApi = {
  listNotifications: (token, params = {}) => req(`${base}/notifications?${new URLSearchParams(params)}`, 'GET', token),
  unreadCount: (token) => req(`${base}/notifications/unread_count`, 'GET', token),
  markNotificationRead: (token, id) => req(`${base}/notifications/${id}/read`, 'POST', token, {}),
  markAllNotificationsRead: (token) => req(`${base}/notifications/read_all`, 'POST', token, {}),
  deleteNotification: (token, id) => req(`${base}/notifications/${id}`, 'DELETE', token),
  listConversations: (token) => req(`${base}/conversations`, 'GET', token),
  startConversation: (token, payload) => req(`${base}/conversations/start`, 'POST', token, payload),
  listMessages: (token, conversationId, limit = 50) => req(`${base}/conversations/${conversationId}/messages?limit=${limit}`, 'GET', token),
  sendMessage: (token, conversationId, payload) => req(`${base}/conversations/${conversationId}/messages`, 'POST', token, payload),
  markMessageRead: (token, messageId) => req(`${base}/messages/${messageId}/read`, 'POST', token, {}),
  searchUsers: (token, query) => req(`${base}/users/search`, 'POST', token, { query }),
  uploadAttachment: (token, file) => {
    const form = new FormData()
    form.append('file', file)
    return req(`${base}/messages/upload`, 'POST', token, form, true)
  },
}
