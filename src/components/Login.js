import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginThunk } from '../redux/authSlice';
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import { FaUserCircle } from 'react-icons/fa';
import Loader from './ui/Loader';
import { useEffect } from 'react';

export default function Login() {
  const dispatch = useDispatch();
  const { error, status, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (user) navigate('/pending-items', { replace: true });
  }, [user, navigate]);

  const onSubmit = async (data) => {
    const res = await dispatch(loginThunk(data));
    if (res.meta.requestStatus === 'fulfilled') {
      navigate('/pending-items', { replace: true });
    }
  };

  if (status === 'loading') return <Loader size={40} />;

  return (
    <Container component="main" maxWidth="sm">
      <Paper
      elevation={5}
        sx={{
          marginTop: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem 3rem'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <FaUserCircle />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email',
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            margin="normal"
            fullWidth
            type="password"
            label="Password"
            autoComplete="current-password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error.error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={status === 'loading'}
            sx={{ mt: 3, mb: 2 }}
          >
            {status === 'loggingin' ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
