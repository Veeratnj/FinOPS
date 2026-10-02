// AuthFooter.tsx

const AuthFooter = () => {
  return (
    <>
      <footer className="auth-footer">
        <div className="auth-footer-top">
          {/* Logo */}
          <div className="auth-footer-logo-section">
            

            {/* Replace with real logo */}
            
            <img
              src="/Kore Value Logo.png"
              alt="Logo"
              className="auth-footer-logo-image"
            />
            
          </div>

          {/* Footer Content */}
          <div className="auth-footer-links-container">
            {/* Services */}
            <div className="auth-footer-column auth-footer-services">
              <h3>Services</h3>

              <div className="auth-footer-grid-two">
                <ul>
                  <li>Cost Analyzer</li>
                  <li>Category Views</li>
                  <li>K8s Cost Observability</li>
                  <li>Recommendations</li>
                  <li>Anomaly Detection</li>
                  <li>Budgeting</li>
                </ul>

                <ul>
                  <li>Reporting</li>
                  <li>Virtual Tags</li>
                  <li>Cost Allocation</li>
                  <li>Unit Economics</li>
                  <li>Forecasting</li>
                </ul>
              </div>
            </div>

            {/* Resource */}
            <div className="auth-footer-column">
              <h3>Resource</h3>

              <ul>
                <li>Blogs</li>
                <li>E-Books</li>
                <li>Release Notes</li>
              </ul>
            </div>

            {/* Company */}
            <div className="auth-footer-column">
              <h3>Company</h3>

              <ul>
                <li>About Us</li>
                <li>Customers</li>
                <li>Governance</li>
                <li>Privacy Policy</li>
                <li>Terms of Use</li>
                <li>Security</li>
              </ul>
            </div>

            {/* Platform */}
            <div className="auth-footer-column auth-footer-platform">
              <h3>Platform</h3>

              <div className="auth-footer-grid-two">
                <ul>
                  <li className="auth-footer-white">
                    Business Requirement
                  </li>
                  <li>AI Financial Management</li>
                  <li>Savings Acquisition Cost</li>
                  <li>Cost-per-Result</li>
                  <li>(TCO) for Hybrid Systems</li>
                  <li>GPU Cost Attribution</li>
                  <li>Kubernetes ROI Tracking</li>
                  <li>Unified Billing</li>
                </ul>

                <ul>
                  <li className="auth-footer-white">
                    Supported Platforms
                  </li>
                  <li>Multi Cloud</li>
                  <li>On-Prem</li>
                  <li>Private Cloud</li>
                  <li>Single Cloud</li>
                  <li>Data Center</li>
                  <li>GPU Orchestration</li>
                  <li>Individual GPU Server</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="auth-footer-bottom">
          <p className="auth-footer-copyright">
            © 2026 Seynova AI-Powered Cloud Intelligence Platform
          </p>
        </div>
      </footer>

      <style>{`
        .auth-footer {
          width: 100%;
          background: #040b03;
          color: #7d7d7d;
          padding-top: 20px;
          border-top: 2px solid #567a00;
          font-family: "Poppins", sans-serif;
          overflow: hidden;
          position: relative;
        }

        .auth-footer::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at center, rgba(124, 255, 0, 0.06) 1px, transparent 1px);
          background-size: 18px 18px;
          opacity: 0.35;
          pointer-events: none;
        }

       .auth-footer-top {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  padding: 0 28px 10px;
  gap: 8px;
}

        .auth-footer-logo-section {
          min-width: 70px;
          padding-top: 4px;
        }

        .auth-footer-logo {
          width: 46px;
          height: 46px;
          border-radius: 16px;
          background: linear-gradient(180deg, #8eff00 0%, #537c00 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 22px;
          font-weight: bold;
          box-shadow: 0 0 10px rgba(142, 255, 0, 0.25);
        }

        .auth-footer-logo-image {
  width: 38px;
  height: 38px;
  object-fit: contain;
}

        .auth-footer-links-container {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  gap: 0;
}
  .auth-footer-column {
  margin-right: 34px;
}

.auth-footer-platform {
  min-width: 420px;
  margin-right: 0;
}

        .auth-footer-column h3 {
  color: #82d400;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  line-height: 1;
}

        .auth-footer-column ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .auth-footer-column li {
  font-size: 11px;
  line-height: 1.55;
  font-weight: 400;
  color: #7c7c7c;
  white-space: nowrap;
}

        .auth-footer-grid-two {
  display: flex;
  gap: 10px;
}

        .auth-footer-services {
  min-width: 240px;
}

.auth-footer-platform {
  min-width: 420px;
}

        .auth-footer-white {
          color: #ffffff !important;
          font-weight: 500 !important;
          margin-bottom: 2px;
        }

        .auth-footer-bottom {
  position: relative;
  z-index: 2;
  border-top: 2px solid #5f8e00;
  padding: 8px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

        .auth-footer-copyright {
          font-size: 10px;
          color: #666666;
          margin: 0;
          text-align: center;
        }

        @media (max-width: 1400px) {
          .auth-footer-top {
            flex-direction: column;
          }

          .auth-footer-links-container {
            flex-wrap: wrap;
            gap: 30px;
          }

          .auth-footer-platform {
            min-width: auto;
          }
        }

        @media (max-width: 768px) {
          .auth-footer-top {
            padding: 0 20px 18px;
          }

          .auth-footer-links-container {
            flex-direction: column;
          }

          .auth-footer-grid-two {
            flex-direction: column;
            gap: 10px;
          }

          .auth-footer-services,
          .auth-footer-platform {
            min-width: auto;
          }

          .auth-footer-column li {
            white-space: normal;
          }
            
        }
      `}</style>
    </>
  );
};

export default AuthFooter;