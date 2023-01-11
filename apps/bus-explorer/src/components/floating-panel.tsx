import { CardProps, Card, Box } from '@mui/material';

export interface FloatingPanelProps extends CardProps {
  children: React.ReactNode;
}

export const FloatingPanel = (props: FloatingPanelProps) => (
  <Box position="absolute" top={16} left={16} bottom={16} overflow="scroll">
    <Card {...props} />
  </Box>
);
