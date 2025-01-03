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
          <span className="typewriter-prefix">I'm </span>
          <span>
            <Typewriter
              words={['Backend Developer', 'AI Enthusiast', 'QA Engineer']}
              loop={Infinity}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </span>
        </h2>
        <div className="icons">
          <a href="https://www.linkedin.com/in/chunchenglee326/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a href="https://github.com/calvinlee326" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href="mailto:chunchenglee@outlook.com">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a href="https://drive.google.com/file/d/1PhwIVJ5egaXMwoxL23juFsIrhWARsb9t/view?usp=sharing" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFileAlt} />
          </a>
        </div>
      </header>

      <section className="demos-section">
        <h2>Projects</h2>
        <Projects />
      </section>
    </div>
  );
}

export default App;