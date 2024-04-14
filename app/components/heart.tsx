import React from 'react';

interface HeartProps {
    color: string;
}

const Heart: React.FC<HeartProps> = ({ color }) => {
    return <span style={{ color }}>{'\u2665'}</span>;
};

export default Heart;
