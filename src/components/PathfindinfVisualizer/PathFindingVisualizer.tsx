import React, {useState, useEffect} from 'react';
import {dijkstra, getNodesInShortestPathOrder} from '../../algorithms/dijkstra';
import {NodeType, GridType} from '../../assets/types';
import Node from '../Node/Node';
import './PathFindingVisualizer.css';

interface PVPropTypes {
  children: React.ReactNode;
}

const START_NODE_ROW: number = 10;
const START_NODE_COL: number = 15;
const FINISH_NODE_ROW: number = 10;
const FINISH_NODE_COL: number = 35;

const createNode = (col: number, row: number) => {
  const node: NodeType = {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
  return node;
};

const getInitialGrid: () => GridType = () => {
  const grid: GridType = [];
  for (let row = 0; row < 20; row++) {
    const currentRow: NodeType[] = [];
    for (let col = 0; col < 50; col++) {
      const newNode: NodeType = createNode(col, row);
      currentRow.push(newNode);
    }
    grid.push(currentRow);
  }
  return grid;
};

const getNewGridWithWallToggled = (
  grid: GridType,
  row: number,
  col: number,
) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const PathFindingVisualizer: React.FC<PVPropTypes> = ({children}) => {
  const [gridState, setGridState] = useState<{
    grid: NodeType[][];
    mouseIsPressed: boolean;
  }>({grid: [], mouseIsPressed: false});

  useEffect(() => {
    const grid = getInitialGrid();
    setGridState(prevState => {
      return {grid: grid, mouseIsPressed: prevState.mouseIsPressed};
    });
  }, []);

  const animateShortestPath = (nodesInShortestPathOrder: NodeType[]) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`)!.className =
          'node node-shortest-path';
      }, 50 * i);
    }
  };

  const animateDijkstra = (
    visitedNodesInOrder: NodeType[] | undefined,
    nodesInShortestPathOrder: NodeType[],
  ) => {
    for (let i = 0; i <= visitedNodesInOrder!.length; i++) {
      if (i === visitedNodesInOrder!.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder![i];
        document.getElementById(`node-${node.row}-${node.col}`)!.className =
          'node node-visited';
      }, 10 * i);
    }
  };

  const visualizeDijkstra = () => {
    const {grid} = gridState;
    const startNode: NodeType = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode: NodeType = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPath: NodeType[] =
      getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPath);
  };

  const handleMouseDown = (row: number, col: number) => {
    const newGrid: GridType = getNewGridWithWallToggled(
      gridState.grid,
      row,
      col,
    );
    setGridState({grid: newGrid, mouseIsPressed: true});
  };

  const handleMouseUp = (row: number, col: number) => {
    setGridState(prevState => {
      return {grid: prevState.grid, mouseIsPressed: false};
    });
  };

  const handleMouseEnter: (row: number, col: number) => void = (row, col) => {
    if (!gridState.mouseIsPressed) return;
    const newGrid: GridType = getNewGridWithWallToggled(
      gridState.grid,
      row,
      col,
    );
    setGridState(prevState => {
      return {grid: newGrid, mouseIsPressed: prevState.mouseIsPressed};
    });
  };

  return (
    <>
      <button onClick={visualizeDijkstra}>Visualize Dijktra algorithm</button>
      <div className="grid">
        <h1>PathFindingVisualizer</h1>
        {gridState.grid.map((row, rowID) => {
          return (
            <div key={rowID}>
              {row.map((node, nodeID) => {
                return (
                  <Node
                    key={nodeID}
                    col={node.col}
                    row={node.row}
                    isStart={node.isStart}
                    isFinish={node.isFinish}
                    isWall={node.isWall}
                    onMouseDown={() => handleMouseDown(node.row, node.col)}
                    onMouseEnter={() => handleMouseEnter(node.row, node.col)}
                    onMouseUp={() => handleMouseUp(node.row, node.col)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PathFindingVisualizer;
