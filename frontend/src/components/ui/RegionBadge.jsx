import React from 'react';
import './RegionBadge.css';

const REGION_COLORS = {
  mediterranean: 'badge--terracotta',
  asian: 'badge--gold',
  european: 'badge--brown',
  african: 'badge--green',
  americas: 'badge--teal',
  'latin american': 'badge--teal',
  'north american': 'badge--teal',
  'middle eastern': 'badge--gold',
  caribbean: 'badge--green',
};

const RegionBadge = ({ region }) => {
  const key = region?.toLowerCase() || '';
  const colorClass = REGION_COLORS[key] || 'badge--default';

  return (
    <span className={`region-badge ${colorClass}`}>
      {region}
    </span>
  );
};

export default RegionBadge;
