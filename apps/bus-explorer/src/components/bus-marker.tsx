import type { Point } from 'dfi-utils';
import { Marker } from 'react-map-gl';
import { useCallback } from 'react';
import { Box, SxProps } from '@mui/material';

const boxSx: SxProps = { cursor: 'pointer' };

const circleStyle: React.CSSProperties = { transition: 'opacity 0.2s' };

export interface BusMarkerProps {
  point: Point;
  hoveredPoint?: Point | null;
  onClick?: (point: Point) => void;
  onMouseEnter?: (point: Point) => void;
  onMouseLeave?: (point: Point) => void;
}

export const BusMarker = ({
  point,
  hoveredPoint,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: BusMarkerProps) => {
  const handleClick = useCallback(() => onClick?.(point), [onClick]);
  const handleMouseEnter = useCallback(() => onMouseEnter?.(point), [onMouseEnter]);
  const handleMouseLeave = useCallback(() => onMouseLeave?.(point), [onMouseLeave]);

  return (
    <Marker
      key={point.id}
      longitude={point.coordinate[0]}
      latitude={point.coordinate[1]}
      anchor="center"
      onClick={handleClick}
    >
      <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} sx={boxSx}>
        <svg viewBox="-2 -2 30 30" width={30} height={30}>
          <circle
            cx="12"
            cy="12"
            r="12"
            fill="#D01A1E"
            stroke="white"
            strokeWidth={3}
            opacity={!hoveredPoint || hoveredPoint === point ? 1 : 0.3}
            style={circleStyle}
          />
        </svg>
      </Box>
    </Marker>
  );
};
