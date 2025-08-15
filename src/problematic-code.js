/**
 * PROBLEMATIC CODE EXAMPLE
 * This file should trigger DriftGuard security warnings
 */

const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');

class ProblematicAPI {
  constructor() {
    this.app = express();
    this.setupRoutes();
  }

  setupRoutes() {
    // No security headers - DriftGuard should flag this
    
    this.app.get('/unsafe-file-read', (req, res) => {
      const { filename } = req.query;
      
      // Path traversal vulnerability - DriftGuard should detect
      const filePath = `./uploads/${filename}`;
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          res.status(500).send('Error reading file');
        } else {
          res.send(data); // No content type validation
        }
      });
    });

    this.app.post('/unsafe-command', (req, res) => {
      const { command } = req.body;
      
      // Command injection vulnerability - DriftGuard should flag
      exec(command, (error, stdout, stderr) => {
        if (error) {
          res.status(500).send(error.message);
        } else {
          res.send(stdout);
        }
      });
    });

    this.app.post('/unsafe-eval', (req, res) => {
      const { code } = req.body;
      
      // Code injection vulnerability - DriftGuard should detect
      try {
        const result = eval(code); // Dangerous!
        res.json({ result });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.get('/leak-secrets', (req, res) => {
      // Information disclosure - DriftGuard should warn
      res.json({
        database_password: process.env.DB_PASSWORD,
        api_key: process.env.API_KEY,
        secret_token: 'hardcoded-secret-123'
      });
    });
  }

  start(port = 3001) {
    this.app.listen(port, () => {
      console.log(`Problematic API listening on port ${port}`);
    });
  }
}

module.exports = ProblematicAPI;