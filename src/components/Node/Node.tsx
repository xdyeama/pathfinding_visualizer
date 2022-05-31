import React from 'react';
import './Node.css';

interface NodePropTypes {
  col: number;
  row: number;

  isStart: boolean;
  isFinish: boolean;
  isWall: boolean;
  onMouseDown: (row: number, col: number) => void;
  onMouseUp: () => void;
  onMouseEnter: (row: number, col: number) => void;
}

const Node: React.FC<NodePropTypes> = ({
  col,
  row,
  isStart,
  isFinish,
  isWall,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  const extraClassName = isFinish
    ? 'node-finish'
    : isStart
    ? 'node-start'
    : isWall
    ? 'node-wall'
    : '';

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}></div>
  );
};

export default Node;
