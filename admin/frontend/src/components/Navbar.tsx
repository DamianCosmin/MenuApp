import { NavLink } from 'react-router-dom';

function Navbar() {
 return (
    <nav className="navbar navbar-expand-lg fixed-top navbar-orange text-white px-4">
      <NavLink className="navbar-brand fs-3" to="/">MenuApp</NavLink>
      
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>
      
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item fs-5">
            <NavLink className={({ isActive }) => "nav-link " + (isActive ? "nav-link-active" : "")} to="/orders">Orders</NavLink>
          </li>
          <li className="nav-item fs-5">
            <NavLink className={({ isActive }) => "nav-link " + (isActive ? "nav-link-active" : "")} to="/tables">Tables</NavLink>
          </li>
          <li className="nav-item fs-5">
            <NavLink className={({ isActive }) => "nav-link " + (isActive ? "nav-link-active" : "")} to="/analytics">Analytics</NavLink>
          </li>
          <li className="nav-item fs-5">
            <NavLink className={({ isActive }) => "nav-link " + (isActive ? "nav-link-active" : "")} to="/login">Login</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;