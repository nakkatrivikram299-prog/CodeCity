import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Loading indicator used as a Suspense fallback for lazy-loaded pages and the 3D scene.
 * `fullscreen` covers the viewport (e.g. during initial auth check); otherwise it
 * renders inline within its container (e.g. a card while data fetches).
 */
export default function Loading({ label = 'Loading', fullscreen = false }) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-12 w-12">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-accent/20"
          animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-t-accent-bright border-r-accent border-b-transparent border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <p className="stat-label">{label}&hellip;</p>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-base">
        {content}
      </div>
    );
  }

  return <div className="flex min-h-[200px] items-center justify-center">{content}</div>;
}

Loading.propTypes = {
  label: PropTypes.string,
  fullscreen: PropTypes.bool,
};
