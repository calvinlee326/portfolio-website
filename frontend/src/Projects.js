import React from 'react';
import './App.css';

function Projects() {
  return (
    <div className="projects-section">
      <div className="project-item">
        <div className="project-title">
          <a href="https://github.com/your-github/project-1" target="_blank" rel="noopener noreferrer">Weather Web App</a>
        </div>
        <div className="project-description">
          A VueJS webApp - Vue3, TypeScript, Vuetify, Pinia, Local Storage, IndexedDB, MiniSearch
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