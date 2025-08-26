const axios = require('axios');
class VideoConfService {
  constructor() {
    this.baseUrl =
      process.env.VIDEO_CONF_BASE_URL || 'https://api.video-conf.com';
    this.apiKey = process.env.VIDEO_CONF_API_KEY;
    if (!this.apiKey) {
      throw new Error('VIDEO_CONF_API_KEY is missing in environment variables');
    }
  }
  async _request(method, endpoint, data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };
    try {
      const response = await axios({ method, url, headers, data });
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      throw new Error(`VideoConfService ${method} ${endpoint} failed: ${msg}`);
    }
  }
  async createMeeting({ topic, startTime, duration, password }) {
    const payload = { topic, start_time: startTime, duration, password };
    return this._request('post', '/meetings', payload);
  }
  async getMeeting(meetingId) {
    return this._request('get', `/meetings/${meetingId}`);
  }
  async updateMeeting(meetingId, updates) {
    return this._request('patch', `/meetings/${meetingId}`, updates);
  }
  async deleteMeeting(meetingId) {
    return this._request('delete', `/meetings/${meetingId}`);
  }
  async generateToken({ meetingId, userName, role }) {
    const payload = {
      meeting_id: meetingId,
      role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };
    const jwk = this._signPayload(payload, this.apiKey);
    return jwk;
  }
  _signPayload(payload, secret) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encode = (obj) =>
      Buffer.from(JSON.stringify(obj)).toString('base64url');
    const unsigned = `${encode(header)}.${encode(payload)}`;
    const crypto = require('crypto');
    const signature = crypto
      .createHmac('sha256', secret)
      .update(unsigned)
      .digest('base64url');
    return `${unsigned}.${signature}`;
  }
}
module.exports = new VideoConfService();
