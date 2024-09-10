import React from 'react';

function Projects() {
  return (
    <div className="projects-section">
      <div className="project-box">
        <h3>Weather Web App</h3>
        <p>A VueJS webApp - Vue3, TypeScript, Vuetify, Pinia, Local Storage, IndexedDB, MiniSearch</p>
        <a href="https://github.com/your-github/project-1" target="_blank" rel="noopener noreferrer">View on GitHub</a>
      </div>
      <div className="project-box">
        <h3>Subway System</h3>
        <p>Node.js Backend API - TypeScript, Express.js, Prism ORM, Neo4j, Postgres, Docker & Docker Compose</p>
        <a href="https://github.com/your-github/project-2" target="_blank" rel="noopener noreferrer">View on GitHub</a>
      </div>
      <div className="project-box">
        <h3>Go http load tester</h3>
        <p>Go Lang SRE tool - Go routines, Go channels, Go Ticker, Command line flags, Docker & Docker Compose</p>
        <a href="https://github.com/your-github/project-3" target="_blank" rel="noopener noreferrer">View on GitHub</a>
      </div>
    </div>
  );
}

export default Projects;
