const https = require('https');

class LocationService {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('Geocoding API key is required');
    }
    this.apiKey = apiKey;
  }

  _fetchJson(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(json);
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${json.error_message || data}`));
            }
          } catch (err) {
            reject(err);
          }
        });
      }).on('error', reject);
    });
  }

  async getCoordinatesFromAddress(address) {
    if (!address) {
      throw new Error('Address is required');
    }
    const encoded = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${this.apiKey}`;
    const json = await this._fetchJson(url);
    if (json.status !== 'OK' || !json.results || !json.results[0]) {
      throw new Error(`Geocoding failed: ${json.status}`);
    }
    const loc = json.results[0].geometry.location;
    return { latitude: loc.lat, longitude: loc.lng };
  }

  async getAddressFromCoordinates(lat, lng) {
    if (lat == null || lng == null) {
      throw new Error('Latitude and longitude are required');
    }
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`;
    const json = await this._fetchJson(url);
    if (json.status !== 'OK' || !json.results || !json.results[0]) {
      throw new Error(`Reverse geocoding failed: ${json.status}`);
    }
    return json.results[0].formatted_address;
  }

  calculateDistance(coord1, coord2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(coord2.latitude - coord1.latitude);
    const dLon = toRad(coord2.longitude - coord1.longitude);
    const lat1 = toRad(coord1.latitude);
    const lat2 = toRad(coord2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

module.exports = new LocationService(process.env.GEOCODING_API_KEY);