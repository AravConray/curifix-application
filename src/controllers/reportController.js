const reportService = require('../services/reportService');

const reportController = {
  createReport: async (req, res) => {
    try {
      const reportData = req.body;
      if (!reportData || Object.keys(reportData).length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid report data' });
      }
      const createdReport = await reportService.createReport(reportData);
      return res.status(201).json({ success: true, data: createdReport });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  getReports: async (req, res) => {
    try {
      const reports = await reportService.getAllReports();
      return res.status(200).json({ success: true, data: reports });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  getReportById: async (req, res) => {
    const { id } = req.params;
    try {
      const report = await reportService.getReportById(id);
      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }
      return res.status(200).json({ success: true, data: report });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  updateReport: async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
      const updatedReport = await reportService.updateReport(id, updateData);
      if (!updatedReport) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }
      return res.status(200).json({ success: true, data: updatedReport });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  deleteReport: async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await reportService.deleteReport(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }
      return res.status(200).json({ success: true, message: 'Report deleted successfully' });
    } catch (err) {
      console.error(err);
      return res.status message: 'Internal server error' });
    }
  }
};

module.exports = reportController;