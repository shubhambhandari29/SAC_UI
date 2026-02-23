import { Box, CircularProgress } from '@mui/material';

export default function Loader({ size, height = '100vh' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height,
      }}
    >
      <CircularProgress size={size} color="inherit" />
    </Box>
  );
}
