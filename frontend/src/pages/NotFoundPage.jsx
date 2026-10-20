import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage({ user }) {
  const homePath = user ? (user.role === 'admin' ? '/admin/dashboard' : '/my-leaves') : '/login';

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '60px' }}>
      <div style={{ fontSize: '4rem', marginBottom: '16px' }}>404</div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Page Not Found</h1>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to={homePath} className="btn btn-primary">
        Return to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
