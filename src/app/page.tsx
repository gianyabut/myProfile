import { ArrowRight, Award } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <main>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container nav-content">
          <div className="logo">
            GCY<span>.</span>
          </div>
          <div className="nav-links">
            <a href="#about" className="nav-link">About</a>
            <a href="#experience" className="nav-link">Experience</a>
            <a href="#portfolio" className="nav-link">Portfolio</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-left">
            <span className="hero-meta">Full Stack Developer</span>
            <h1 className="hero-title">
              Architecting
              <span>digital experiences.</span>
            </h1>
            <p className="hero-subtitle">
              Based in Metro Manila, Philippines. Bridging the gap between enterprise-grade backend systems and dynamic frontend interfaces for over a decade.
            </p>
            <a href="#portfolio" className="btn-minimal">
              View Work <ArrowRight size={20} />
            </a>
          </div>
          <div className="hero-right">
            <div className="hero-image-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
              <img src="/hero.png" alt="Abstract architectural shape" className="hero-image" />
            </div>
            {/* Intentional negative space / small detail */}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 10 }}>
              Est. 2010 &mdash; Present
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">About.</h2>
            <span className="section-label">01 // Profile</span>
          </div>
          <div className="about-grid">
            <div className="about-image-wrapper">
              <img src="/about.png" alt="Abstract portrait" className="about-image" />
            </div>

            <div className="about-content">
              <div className="about-text">
                <p>
                  My journey started over 13 years ago, evolving from basic web development to leading complex billing systems and enterprise architectures. I specialize in building scalable, secure, and intuitive web applications.
                </p>
                <p>
                  I thrive in Agile environments, leveraging <strong>Test-Driven Development (TDD)</strong> to ensure code quality. Whether it's architecting a secured messaging solution for the Australian eHealth system or creating a dynamic SAAS HR platform, my focus remains strictly on delivering precise impact.
                </p>
                
                <div className="awards-list">
                  <div className="award-item">
                    <Award size={24} color="var(--accent-orange)" />
                    <span>Programmer of the Year 2009</span>
                  </div>
                  <div className="award-item">
                    <Award size={24} color="var(--accent-orange)" />
                    <span>Certified NC4 Programmer</span>
                  </div>
                </div>
              </div>
              
              <div className="skills-wrapper">
                <h3 className="skills-header">Core Competencies</h3>
                <div className="skills-list">
                  <div className="skill-row"><span>ASP.NET / C#</span><span>01</span></div>
                  <div className="skill-row"><span>MVC / Web API 2</span><span>02</span></div>
                  <div className="skill-row"><span>Entity Framework</span><span>03</span></div>
                  <div className="skill-row"><span>AngularJS / React</span><span>04</span></div>
                  <div className="skill-row"><span>SQL Server / Azure</span><span>05</span></div>
                  <div className="skill-row"><span>TDD / Agile</span><span>06</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Experience.</h2>
            <span className="section-label">02 // Career</span>
          </div>
          
          <div className="timeline-container">
            {/* Macquarie Telecom */}
            <div className="timeline-item">
              <div className="timeline-meta">
                <span className="timeline-date">Apr 2017 - Present</span>
                <span className="timeline-company">Macquarie Telecom</span>
              </div>
              <div className="timeline-content">
                <h3 className="timeline-role">Team Leader Billing Development</h3>
                <p className="timeline-desc">Leading development for complex billing systems, ensuring high performance, accuracy, and automation for enterprise-level operations.</p>
              </div>
            </div>

            {/* Nimbyx */}
            <div className="timeline-item">
              <div className="timeline-meta">
                <span className="timeline-date">Dec 2015 - Feb 2017</span>
                <span className="timeline-company">Nimbyx</span>
              </div>
              <div className="timeline-content">
                <h3 className="timeline-role">Full Stack Developer</h3>
                <p className="timeline-desc">Led a team developing Dental Systems using MVC, Web API 2, Entity Framework, and Azure. Built responsive web apps using AngularJS and Bootstrap.</p>
              </div>
            </div>

            {/* Chamonix IT Solutions */}
            <div className="timeline-item">
              <div className="timeline-meta">
                <span className="timeline-date">Jun 2014 - Dec 2015</span>
                <span className="timeline-company">Chamonix IT</span>
              </div>
              <div className="timeline-content">
                <h3 className="timeline-role">.Net Developer</h3>
                <p className="timeline-desc">Developed eHealth systems for Australian hospitals using WCF and MVC. Built cross-platform mobile apps with Xamarin.Forms and dynamic SAAS HR systems using AngularJS.</p>
              </div>
            </div>

            {/* Loanworks Technologies */}
            <div className="timeline-item">
              <div className="timeline-meta">
                <span className="timeline-date">Sep 2012 - Jun 2014</span>
                <span className="timeline-company">Loanworks</span>
              </div>
              <div className="timeline-content">
                <h3 className="timeline-role">Analyst / Programmer</h3>
                <p className="timeline-desc">Developed modules for Macquarie Telecom Australia Billing System, including automation services. Nominated for Employee of the Month multiple times.</p>
              </div>
            </div>

            {/* Metrobank */}
            <div className="timeline-item">
              <div className="timeline-meta">
                <span className="timeline-date">Jul 2011 - Aug 2012</span>
                <span className="timeline-company">Metrobank</span>
              </div>
              <div className="timeline-content">
                <h3 className="timeline-role">Web Developer</h3>
                <p className="timeline-desc">Built the Metrobank Careers Page and Internal Case Management System using C#.net, ASP.net, and SQL Server 2k8.</p>
              </div>
            </div>
            
            {/* Seawolf */}
            <div className="timeline-item">
              <div className="timeline-meta">
                <span className="timeline-date">Jul 2010 - Jul 2011</span>
                <span className="timeline-company">Seawolf</span>
              </div>
              <div className="timeline-content">
                <h3 className="timeline-role">Software Developer</h3>
                <p className="timeline-desc">Developed modules for Triune Deposit and Loans Solution deployed across multiple rural banks. Built group buying site localroam.ph.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Selected Work.</h2>
            <span className="section-label">03 // Output</span>
          </div>

          <div className="portfolio-grid">
            {/* Card 1 */}
            <div className="portfolio-card">
              <div className="portfolio-image-placeholder">
                <img src="/port1.png" alt="Data Flow" className="portfolio-image" />
              </div>
              <div className="portfolio-meta">
                <h3 className="portfolio-title">Enterprise Dashboard</h3>
                <span className="portfolio-category">Frontend</span>
              </div>
            </div>
            {/* Card 2 */}
            <div className="portfolio-card">
              <div className="portfolio-image-placeholder">
                <img src="/port2.png" alt="Geometric Network" className="portfolio-image" />
              </div>
              <div className="portfolio-meta">
                <h3 className="portfolio-title">Scalable Billing API</h3>
                <span className="portfolio-category">Backend</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-main">
              Let's build<br />
              <span style={{ fontStyle: 'italic', color: 'var(--accent-orange)' }}>something exceptional.</span>
            </div>
            <div className="footer-links">
              <a href="mailto:gian.yabut@yahoo.com" className="footer-link">
                Email <ArrowRight size={16} />
              </a>
              <a href="https://www.linkedin.com/in/gian-carlo-yabut-a53b9566" target="_blank" rel="noopener noreferrer" className="footer-link">
                LinkedIn <ArrowRight size={16} />
              </a>
            </div>
          </div>
          <div style={{ marginTop: '8rem', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>&copy; {new Date().getFullYear()} GIAN CARLO YABUT</span>
            <span style={{ textTransform: 'uppercase', letterSpacing: '2px' }}>Manila, PH</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
