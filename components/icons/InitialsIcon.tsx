import React from 'react';

export const InitialsIcon = () => (
  <svg style={{display: "inline-block", marginRight: "0.3em"}} width="35" height="35" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#615fff" />
        <stop offset="100%" stopColor="#f6339a" />
      </linearGradient>
    </defs>
    <rect width="200" height="200" fill="url(#grad)" rx="20" ry="20" />
    <text
      x="50%"
      y="55%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="90"
      fontFamily="Arial"
      fill="#fff"
      fontWeight="bold"
    >
      KK
    </text>
  </svg>
);
