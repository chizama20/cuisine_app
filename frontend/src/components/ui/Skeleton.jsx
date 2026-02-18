import React from 'react';
import './Skeleton.css';

const Skeleton = ({ variant = 'text', width, height, count = 1 }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {items.map((i) => (
        <div
          key={i}
          className={`skeleton skeleton--${variant}`}
          style={{ width, height }}
        />
      ))}
    </>
  );
};

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <Skeleton variant="text" height="24px" width="70%" />
    <Skeleton variant="text" height="14px" width="40%" />
    <Skeleton variant="text" height="14px" width="50%" />
  </div>
);

export default Skeleton;
