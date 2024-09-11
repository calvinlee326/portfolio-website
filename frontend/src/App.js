import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import Projects from './Projects';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>
          <a href="/">Calvin Lee</a>
        </h1>
        <h2>
          I'm {' '}
          <Typewriter
            words={['Software Engineer', 'Data Enthusiast', 'AI Enthusiast']}
            loop={Infinity}
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1000}
          />
        </h2>
        <div className="icons">
          <a href="https://www.linkedin.com/in/chunchenglee326/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a href="https://github.com/calvinlee326" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href="mailto:calvinlee326@gmail.com">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a href="https://tinyurl.com/ye2b3nyt" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFileAlt} />
          </a>
        </div>
      </header>

      <section>
        <h2 style={{ color: '#00FF00' }}>Demos</h2>
        <Projects />
      </section>
    </div>
    
  );
}

export default App;
