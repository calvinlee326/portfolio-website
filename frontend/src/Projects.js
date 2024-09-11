import React from 'react';
import './App.css';

function Projects() {
  return (
    <div className="projects-section">
      <div className="project-item">
        <div className="project-title">
          <a href="https://github.com/calvinlee326/Converter-Android-App" target="_blank" rel="noopener noreferrer">Converter-Android-App
</a>
        </div>
        <div className="project-description">
          This is a simple and easy-to-use Android app designed to convert various units such as length, weight, temperature, and more.
        </div>
      </div>
      <div className="project-item">
        <div className="project-title">
          <a href="https://github.com/your-github/project-2" target="_blank" rel="noopener noreferrer">Subway System</a>
        </div>
        <div className="project-description">
          Node.js Backend API - TypeScript, Express.js, Prism ORM, Neo4j, Postgres, Docker & Docker Compose
        </div>
      </div>
      <div className="project-item">
        <div className="project-title">
          <a href="https://github.com/your-github/project-3" target="_blank" rel="noopener noreferrer">Go http load tester</a>
        </div>
        <div className="project-description">
          Go Lang SRE tool - Go routines, Go channels, Go Ticker, Command line flags, Docker & Docker Compose
        </div>
      </div>
    </div>
  );
}

export default Projects;