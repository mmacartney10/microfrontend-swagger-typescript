
import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
 return (
    <nav>
      <ul>
        <li>
          <NavLink
            to="/"
            className="btn-secondary"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-secondary)',
            })}
          >
            🏠 Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className="btn-secondary"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-secondary)',
            })}
          >
            ℹ️ About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/tasks"
            className="btn-secondary"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-secondary)',
            })}
          >
            ✅ Tasks
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/products"
            className="btn-secondary"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-secondary)',
            })}
          >
            📦 Products
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/orders"
            className="btn-secondary"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-secondary)',
            })}
          >
            🛒 Orders
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/users"
            className="btn-secondary"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-secondary)',
            })}
          >
            👥 Users
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/categories"
            className="btn-secondary"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-secondary)',
            })}
          >
            🏷️ Categories
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/analytics"
            className="btn-secondary"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-secondary)',
            })}
          >
            📊 Analytics
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/health"
            className="btn-secondary"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-secondary)',
            })}
          >
            🔍 Health
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/settings"
            className="btn-secondary"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-secondary)',
            })}
          >
            ⚙️ Settings
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
