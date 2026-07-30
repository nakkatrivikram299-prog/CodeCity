import { NavLink } from 'react-router-dom';
import { Building2, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-base text-ink flex flex-col justify-center items-center p-4 text-center">
      <div className="glass-panel p-8 max-w-md space-y-4">
        <h1 className="text-6xl font-extrabold font-mono text-accent-bright">404</h1>
        <h2 className="text-xl font-bold font-display text-white">Out of Bounds Grid Sector</h2>
        <p className="text-xs text-ink-muted">
          The requested coordinate or skyline sector does not exist in this matrix.
        </p>
        <NavLink to="/city" className="btn-primary inline-flex mt-4">
          <Building2 className="h-4 w-4" />
          Return to 3D City
        </NavLink>
      </div>
    </div>
  );
}
