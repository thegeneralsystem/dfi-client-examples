import { Refresh as RefreshIcon } from '@mui/icons-material';
import { Box, Typography, Button } from '@mui/material';
import type { UseQueryResult } from '@tanstack/react-query';

export interface RefreshControlProps<Query extends UseQueryResult = UseQueryResult> {
  query: Query;
}

export const RefreshControl = ({
  query: { dataUpdatedAt, isRefetching, isLoading, refetch },
}: RefreshControlProps) => (
  <Box display="flex" alignItems="center" gap={2}>
    {dataUpdatedAt ? (
      <Typography>Last refreshed at {new Date(dataUpdatedAt).toLocaleTimeString()}</Typography>
    ) : null}
    <Button
      variant="outlined"
      color="inherit"
      onClick={!isRefetching && !isLoading ? () => refetch() : undefined}
      startIcon={<RefreshIcon />}
    >
      {isLoading || isRefetching ? 'Refreshing...' : 'Refresh'}
    </Button>
  </Box>
);
