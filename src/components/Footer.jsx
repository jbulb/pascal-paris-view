import '../css/Footer.css';

function Footer() {
  return (
    <div>
      <div className="footer-wrap">
        <div className="inline-footer-isles">
          <h1>Popular Searches</h1>
          <p>Illusionist Spray</p>
          <p>Flex Paste</p>
          <p>Amplifying Foam</p>
        </div>
        <div className="inline-footer-isles">
          <h1>Customer Service</h1>
          <p>Contact</p>
          <p>Shipping Policy</p>
          <p>Return Policy</p>
        </div>
        <div className="inline-footer-isles">
          <h1>Follow</h1>
          <div>
            <span className="social-footer social-footer-0"></span>
            <span className="social-footer social-footer-1"></span>
            <span className="social-footer social-footer-2"></span>
            <span className="social-footer social-footer-3"></span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2016 PASCAL Paris - All Rights Reserved.</p>
          <p>
            Powered by{' '}
            <a href="https://tolvatech.com/" target="_blank" rel="noopener noreferrer">
              TolvaTech
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
