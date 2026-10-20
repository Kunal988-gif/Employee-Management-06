import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span>🏢</span> LeaveManager
        </Link>

        <nav>
          <ul className="nav-links">
            {user ? (
              <>
                {user.role === 'employee' && (
                  <>
                    <li>
                      <NavLink to="/apply-leave">Apply Leave</NavLink>
                    </li>
                    <li>
                      <NavLink to="/my-leaves">My Leaves</NavLink>
                    </li>
                  </>
                )}

                {user.role === 'admin' && (
                  <>
                    <li>
                      <NavLink to="/admin/dashboard">Dashboard</NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/requests">Leave Requests</NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/leave-types">Leave Types</NavLink>
                    </li>
                  </>
                )}

                <li className="nav-user">
                  <span className="user-badge">{user.role}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.name}</span>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>
                <li>
                  <NavLink to="/register">Register</NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
