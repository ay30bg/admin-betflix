import { Link } from 'react-router-dom';
import '../styles/header.css';

function AdminAuthHeader() {
    return (
        <header className="header">
            <div className="header-container">
                <Link to="/admin" className="header-logo" aria-label="Company Admin Home">
                    Company Admin
                </Link>
                <Link to="/" className="auth-main-site-link">
                    Back to Main Site
                </Link>
            </div>
        </header>
    );
}

export default AdminAuthHeader;
