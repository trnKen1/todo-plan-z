import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Task } from '../../types';

interface CalendarViewProps {
  tasks: Task[];
}

interface NodeRect {
  nodeId: string;
  parentId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const gridRef = useRef<HTMLDivElement>(null);
  const [nodeRects, setNodeRects] = useState<NodeRect[]>([]);
  
  // Hover state for visual highlighting
  const [hoveredParentId, setHoveredParentId] = useState<string | null>(null);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartIdx, setDragStartIdx] = useState<number | null>(null);
  const [dragCurrentIdx, setDragCurrentIdx] = useState<number | null>(null);

  // Create a 35-day grid (5 weeks) relative to today
  const [days] = useState(() => {
    return Array.from({ length: 35 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - d.getDay() + i - 14); 
      return d;
    });
  });

  // Extract all renderable items: both standalone tasks and task nodes
  const allRenderableItems = React.useMemo(() => {
    const items: Array<{
      id: string;
      parentId: string;
      title: string;
      date: Date;
      isCompleted: boolean;
      colorCode: string;
      source: string;
    }> = [];

    tasks.forEach(task => {
      if (task.nodes && task.nodes.length > 0) {
        task.nodes.forEach(node => {
          items.push({
            id: node.id,
            parentId: node.parentId,
            title: task.title, // display parent title
            date: new Date(node.date),
            isCompleted: node.isCompleted,
            colorCode: task.colorCode || '#3b82f6',
            source: task.source
          });
        });
      } else if (task.dueDate) {
        items.push({
          id: task.id,
          parentId: task.id,
          title: task.title,
          date: new Date(task.dueDate),
          isCompleted: task.status === 'done',
          colorCode: task.colorCode || (task.source === 'todoist' ? '#e44332' : '#3b82f6'),
          source: task.source
        });
      }
    });

    return items;
  }, [tasks]);

  // Update SVG lines on render and resize
  const updateLines = useCallback(() => {
    if (!gridRef.current) return;
    const gridBounds = gridRef.current.getBoundingClientRect();
    const nodeElements = gridRef.current.querySelectorAll('[data-node-id]');
    
    const rects: NodeRect[] = [];
    nodeElements.forEach((el) => {
      const element = el as HTMLElement;
      const bounds = element.getBoundingClientRect();
      rects.push({
        nodeId: element.getAttribute('data-node-id')!,
        parentId: element.getAttribute('data-parent-id')!,
        color: element.getAttribute('data-color') || '#3b82f6',
        x: bounds.left - gridBounds.left,
        y: bounds.top - gridBounds.top,
        width: bounds.width,
        height: bounds.height,
      });
    });
    setNodeRects(rects);
  }, []);

  useEffect(() => {
    // Initial draw
    // Use a slight timeout to ensure DOM is fully painted
    const timer = setTimeout(updateLines, 50);
    
    const observer = new ResizeObserver(() => {
      updateLines();
    });
    
    if (gridRef.current) {
      observer.observe(gridRef.current);
    }
    
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [updateLines, allRenderableItems]);

  // Drag Handlers
  const handleMouseDown = (idx: number) => {
    setIsDragging(true);
    setDragStartIdx(idx);
    setDragCurrentIdx(idx);
  };

  const handleMouseEnter = (idx: number) => {
    if (isDragging) {
      setDragCurrentIdx(idx);
    }
  };

  const handleMouseUp = () => {
    if (isDragging && dragStartIdx !== null && dragCurrentIdx !== null) {
      const minIdx = Math.min(dragStartIdx, dragCurrentIdx);
      const maxIdx = Math.max(dragStartIdx, dragCurrentIdx);
      const selectedDates = days.slice(minIdx, maxIdx + 1);
      
      // In a real app, open a modal here. For now just alert.
      if (selectedDates.length > 1) {
        alert(`Selected ${selectedDates.length} days to create linked Task Nodes!\nFrom: ${selectedDates[0].toLocaleDateString()}\nTo: ${selectedDates[selectedDates.length-1].toLocaleDateString()}`);
      }
    }
    setIsDragging(false);
    setDragStartIdx(null);
    setDragCurrentIdx(null);
  };

  // Group rects by parent to draw lines
  const parentPaths = React.useMemo(() => {
    const groups: Record<string, NodeRect[]> = {};
    nodeRects.forEach(rect => {
      // Only draw lines if there are multiple nodes for a parent
      if (!groups[rect.parentId]) groups[rect.parentId] = [];
      groups[rect.parentId].push(rect);
    });

    const paths: Array<{ id: string; d: string; color: string; isHovered: boolean }> = [];
    
    Object.keys(groups).forEach(parentId => {
      const group = groups[parentId];
      if (group.length > 1) {
        // Sort by X coordinate (time)
        group.sort((a, b) => a.x - b.x);
        
        let d = '';
        for (let i = 0; i < group.length - 1; i++) {
          const start = group[i];
          const end = group[i + 1];
          
          // Draw from right edge of start to left edge of end
          const startX = start.x + start.width;
          const startY = start.y + start.height / 2;
          const endX = end.x;
          const endY = end.y + end.height / 2;
          
          // Control points for a smooth bezier curve between nodes
          const cpX1 = startX + (endX - startX) / 3;
          const cpY1 = startY;
          const cpX2 = endX - (endX - startX) / 3;
          const cpY2 = endY;

          if (i === 0) {
            d += `M ${startX} ${startY} `;
          } else {
            // Already at startX, startY from previous segment
            d += `L ${start.x} ${start.y + start.height / 2} M ${startX} ${startY} `;
          }
          
          d += `C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${endX} ${endY} `;
        }
        
        paths.push({
          id: parentId,
          d,
          color: group[0].color,
          isHovered: hoveredParentId === parentId
        });
      }
    });
    
    return paths;
  }, [nodeRects, hoveredParentId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      
      <div 
        ref={gridRef}
        className="calendar-grid" 
        style={{ gridTemplateRows: 'auto repeat(5, 1fr)', flex: 1, position: 'relative' }}
      >
        {/* SVG Overlay for connecting lines */}
        <svg 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0
          }}
        >
          {parentPaths.map(path => (
            <path
              key={path.id}
              d={path.d}
              fill="none"
              stroke={path.color}
              strokeWidth={path.isHovered ? 4 : 2}
              opacity={path.isHovered ? 0.9 : 0.4}
              style={{ transition: 'all 0.2s ease', strokeLinecap: 'round' }}
            />
          ))}
        </svg>

        {/* Header */}
        {daysOfWeek.map(day => (
          <div key={day} className="calendar-header">{day}</div>
        ))}
        
        {/* Days */}
        {days.map((day, idx) => {
          // Determine if this day is within the drag selection
          let isSelected = false;
          if (isDragging && dragStartIdx !== null && dragCurrentIdx !== null) {
            const min = Math.min(dragStartIdx, dragCurrentIdx);
            const max = Math.max(dragStartIdx, dragCurrentIdx);
            isSelected = idx >= min && idx <= max;
          }

          const dayItems = allRenderableItems.filter(t => t.date.toDateString() === day.toDateString());

          return (
            <div 
              key={idx} 
              className={`calendar-day ${isSelected ? 'drag-selection' : ''}`}
              onMouseDown={() => handleMouseDown(idx)}
              onMouseEnter={() => handleMouseEnter(idx)}
              style={{ zIndex: 1, position: 'relative', userSelect: 'none' }}
            >
              <div className="calendar-day-header">
                {day.getDate()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {dayItems.map(item => {
                  const isHovered = hoveredParentId === item.parentId;
                  return (
                    <div 
                      key={item.id}
                      data-node-id={item.id}
                      data-parent-id={item.parentId}
                      data-color={item.colorCode}
                      onMouseEnter={() => setHoveredParentId(item.parentId)}
                      onMouseLeave={() => setHoveredParentId(null)}
                      style={{ 
                        fontSize: '0.75rem', 
                        background: `${item.colorCode}33`, // 20% opacity hex
                        borderLeft: `3px solid ${item.colorCode}`,
                        color: 'var(--text-primary)',
                        padding: '4px 6px',
                        borderRadius: '0 4px 4px 0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        cursor: 'pointer',
                        transform: isHovered ? 'scale(1.02)' : 'none',
                        boxShadow: isHovered ? `0 0 8px ${item.colorCode}66` : 'none',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        zIndex: isHovered ? 2 : 1
                      }}
                    >
                      <span style={{ textDecoration: item.isCompleted ? 'line-through' : 'none', opacity: item.isCompleted ? 0.6 : 1 }}>
                        {item.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
