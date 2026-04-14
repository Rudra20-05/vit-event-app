import React from 'react';

const Icon = ({ path }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor" 
      style={{ width: '1.25em', height: '1.25em' }}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

export default Icon;