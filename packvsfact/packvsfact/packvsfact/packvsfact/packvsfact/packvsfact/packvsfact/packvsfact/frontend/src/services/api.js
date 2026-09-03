import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for JWT token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('pvf_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Auth
  async login(email, password) {
    const res = await client.post('/api/auth/login', { email, password });
    if (res.data.access_token) {
      localStorage.setItem('pvf_token', res.data.access_token);
      localStorage.setItem('pvf_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async register(email, full_name, password, role = 'USER') {
    const res = await client.post('/api/auth/register', { email, full_name, password, role });
    if (res.data.access_token) {
      localStorage.setItem('pvf_token', res.data.access_token);
      localStorage.setItem('pvf_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  logout() {
    localStorage.removeItem('pvf_token');
    localStorage.removeItem('pvf_user');
  },

  getCurrentUser() {
    const usr = localStorage.getItem('pvf_user');
    return usr ? JSON.parse(usr) : null;
  },

  // Products & Barcode
  async searchProducts(q = '', category = '', minScore = null, maxPrice = null) {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (category) params.append('category', category);
    if (minScore !== null) params.append('min_score', minScore);
    if (maxPrice !== null) params.append('max_price', maxPrice);

    const res = await client.get(`/api/products/search?${params.toString()}`);
    return res.data;
  },

  async getProductByBarcode(barcode) {
    const res = await client.get(`/api/products/barcode/${barcode}`);
    return res.data;
  },

  async getProductDetail(id) {
    const res = await client.get(`/api/products/${id}`);
    return res.data;
  },

  async submitProduct(productData) {
    const res = await client.post('/api/products/submit', productData);
    return res.data;
  },

  // OCR Label Scanner
  async scanLabelImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await client.post('/api/ocr/scan-label', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  // Multilingual Local AI Assistant
  async askAssistant(query, lang = 'en', productContext = null) {
    const res = await client.post('/api/assistant/ask', { query, lang, product_context: productContext });
    return res.data;
  },

  async getSupportedLanguages() {
    const res = await client.get('/api/assistant/languages');
    return res.data;
  },

  // Healthier Alternatives
  async getAlternatives(productId, maxBudgetInr = 100.0) {
    const res = await client.get(`/api/recommendations/alternatives?product_id=${productId}&max_budget_inr=${maxBudgetInr}`);
    return res.data;
  },

  // Comparison
  async compareProducts(productIds) {
    const idsStr = Array.isArray(productIds) ? productIds.join(',') : productIds;
    const res = await client.get(`/api/compare/products?ids=${idsStr}`);
    return res.data;
  },

  // Demand Intelligence
  async getDemandAlerts() {
    const res = await client.get('/api/demand/alerts');
    return res.data;
  },

  async recordScanEvent(productId, category) {
    const res = await client.post(`/api/demand/record?product_id=${productId}&category=${encodeURIComponent(category)}`);
    return res.data;
  },

  // Verification & Lab Reports
  async uploadLabReport(reportData) {
    const res = await client.post('/api/verification/upload-lab-report', reportData);
    return res.data;
  },

  async getVerificationStatus(productId) {
    const res = await client.get(`/api/verification/status/${productId}`);
    return res.data;
  },

  // Admin Dashboard Operations
  async getAdminOverview() {
    const res = await client.get('/api/admin/overview');
    return res.data;
  },

  async approveVerification(productId) {
    const res = await client.post(`/api/admin/verification/approve?product_id=${productId}`);
    return res.data;
  },

  async rejectVerification(productId, reason = '') {
    const res = await client.post(`/api/admin/verification/reject?product_id=${productId}&reason=${encodeURIComponent(reason)}`);
    return res.data;
  },

  async retrainMLModels() {
    const res = await client.post('/api/admin/train-models');
    return res.data;
  },

  async getAuditLogs() {
    const res = await client.get('/api/admin/audit-logs');
    return res.data;
  },

  // Privacy & Data Rights
  async exportUserData(userId) {
    const res = await client.get(`/api/privacy/export/${userId}`);
    return res.data;
  },

  async deleteUserData(userId) {
    const res = await client.delete(`/api/privacy/delete-data/${userId}`);
    return res.data;
  },

  // System Health
  async getHealthStatus() {
    const res = await client.get('/api/health');
    return res.data;
  }
};

export default api;
