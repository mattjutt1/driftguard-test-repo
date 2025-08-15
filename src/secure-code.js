/**
 * SECURE CODE EXAMPLE
 * This file should pass DriftGuard security checks
 */

const express = require('express');
const helmet = require('helmet');
const crypto = require('crypto');

class SecureAPI {
  constructor() {
    this.app = express();
    this.setupSecurity();
    this.setupRoutes();
  }

  setupSecurity() {
    // Use Helmet for security headers
    this.app.use(helmet());
    
    // Rate limiting would go here in production
    // Content Security Policy is handled by Helmet
    
    // Input validation middleware
    this.app.use(express.json({ limit: '1mb' }));
  }

  setupRoutes() {
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
      });
    });

    this.app.post('/api/data', this.validateInput, (req, res) => {
      const { data } = req.body;
      
      // Secure data processing
      const processedData = this.processSecurely(data);
      
      res.json({ 
        success: true, 
        processedData,
        timestamp: new Date().toISOString()
      });
    });
  }

  validateInput(req, res, next) {
    const { data } = req.body;
    
    if (!data || typeof data !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid input: data must be a string' 
      });
    }
    
    if (data.length > 1000) {
      return res.status(400).json({ 
        error: 'Input too large' 
      });
    }
    
    next();
  }

  processSecurely(data) {
    // Secure processing with proper sanitization
    const sanitized = data.replace(/[<>]/g, '');
    
    // Generate secure hash
    const hash = crypto.createHash('sha256')
      .update(sanitized)
      .digest('hex');
    
    return { sanitized, hash };
  }

  start(port = 3000) {
    this.app.listen(port, () => {
      console.log(`Secure API listening on port ${port}`);
    });
  }
}

module.exports = SecureAPI;