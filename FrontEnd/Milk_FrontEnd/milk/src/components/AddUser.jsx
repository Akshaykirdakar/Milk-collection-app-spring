import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URLS } from '../config/api';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  Badge as BadgeIcon,
  CalendarMonth as CalendarIcon,
  ContactMail as ContactMailIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const calculateAge = (dob) => {
  if (!dob) return '';

  const today = new Date();
  const birthDate = new Date(dob);

  if (Number.isNaN(birthDate.getTime())) {
    return '';
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age >= 0 ? String(age) : '';
};

const initialFormData = {
  username: '',
  createdAt: '',
  updatedAt: '',
  password: '',
  role: '',
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  userMobile: '',
  userEmail: '',
  userAge: '',
  userGender: '',
  userActiveInactive: '',
};

export default function AddUser({
  userId = null,
  userData = null,
  refreshData = () => {},
  onClose = null,
}) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialFormData);
  const [touched, setTouched] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!userData) {
      setFormData(initialFormData);
      return;
    }

    setFormData({
      username: userData.username || '',
      createdAt: userData.createdAt || '',
      updatedAt: userData.updatedAt || '',
      password: '',
      role: userData.role || '',
      firstName: userData.firstName || '',
      middleName: userData.middleName || '',
      lastName: userData.lastName || '',
      dob: userData.dob || '',
      userMobile: userData.userMobile || '',
      userEmail: userData.userEmail || '',
      userAge: userData.userAge || calculateAge(userData.dob),
      userGender: userData.userGender || '',
      userActiveInactive: userData.userActiveInactive || '',
    });
  }, [userData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'dob' ? { userAge: calculateAge(value) } : {}),
    }));
  };

  const handleFieldBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const requiredError = (fieldName, value) => touched[fieldName] && !String(value ?? '').trim();

  const hasValidationErrors = () => {
    return (
      !String(formData.role ?? '').trim() ||
      !String(formData.firstName ?? '').trim() ||
      !String(formData.lastName ?? '').trim() ||
      !String(formData.dob ?? '').trim() ||
      !String(formData.userGender ?? '').trim() ||
      !String(formData.userActiveInactive ?? '').trim() ||
      !String(formData.userMobile ?? '').trim() ||
      (!userId && !String(formData.password ?? '').trim())
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    // Mark all fields as touched to show validation errors
    const allFields = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allFields);

    // Check for validation errors
    if (hasValidationErrors()) {
      setSubmitting(false);
      setErrorMessage(t('fillRequiredFields', 'Please fill in all required fields'));
      return;
    }

    const now = new Date().toISOString();
    const payload = {
      ...formData,
      userAge: formData.userAge || calculateAge(formData.dob),
      updatedAt: now,
    };

    if (!userId) {
      payload.createdAt = now;
    }

    try {
      if (userId) {
        await axios.put(`${API_URLS.updateUser}/${userId}`, payload);
      } else {
        await axios.post(API_URLS.addUser, payload);
        setFormData(initialFormData);
      }

      refreshData();
      if (typeof onClose === 'function') {
        onClose();
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        'Failed to save user';
      setErrorMessage(typeof message === 'string' ? message : 'Failed to save user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1100, mx: 'auto', width: '100%' }}>
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: { xs: 2.5, sm: 4 },
          borderRadius: 2,
          width: '100%',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
          {userId ? t('updateUser') : t('addNewUser')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          {t('fillUserDetails')}
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {userId && (
            <TextField
              label={t('username', 'Username')}
              name="username"
              value={formData.username}
              margin="normal"
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
          )}

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <PersonIcon fontSize="small" />
                {t('personalDetails', 'Personal Details')}
              </Typography>

              <Grid container spacing={2}>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    required
                    label={t('role', 'Role')}
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    onBlur={handleFieldBlur}
                    error={requiredError('role', formData.role)}
                    helperText={requiredError('role', formData.role) ? t('required', 'Required') : ' '}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label={t('firstName', 'First Name')}
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleFieldBlur}
                    error={requiredError('firstName', formData.firstName)}
                    helperText={
                      requiredError('firstName', formData.firstName) ? t('required', 'Required') : ' '
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label={t('middleName', 'Middle Name')}
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    onBlur={handleFieldBlur}
                    helperText=" "
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    required
                    label={t('lastName', 'Last Name')}
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleFieldBlur}
                    error={requiredError('lastName', formData.lastName)}
                    helperText={requiredError('lastName', formData.lastName) ? t('required', 'Required') : ' '}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    type="date"
                    label={t('dob', 'Date of Birth')}
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    onBlur={handleFieldBlur}
                    InputLabelProps={{ shrink: true }}
                    error={requiredError('dob', formData.dob)}
                    helperText={requiredError('dob', formData.dob) ? t('required', 'Required') : ' '}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label={t('userAge', 'Age')}
                    name="userAge"
                    value={formData.userAge}
                    InputProps={{ readOnly: true }}
                    helperText=" "
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth required error={requiredError('userGender', formData.userGender)}>
                    <InputLabel>{t('userGender', 'Gender')}</InputLabel>
                    <Select
                      label={t('userGender', 'Gender')}
                      name="userGender"
                      value={formData.userGender}
                      onChange={handleChange}
                      onBlur={handleFieldBlur}
                    >
                      <MenuItem value="">{t('select', 'Select')}</MenuItem>
                      <MenuItem value="Male">{t('male', 'Male')}</MenuItem>
                      <MenuItem value="Female">{t('female', 'Female')}</MenuItem>
                      <MenuItem value="Other">{t('other', 'Other')}</MenuItem>
                    </Select>
                    <FormHelperText>
                      {requiredError('userGender', formData.userGender) ? t('required', 'Required') : ' '}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl
                    fullWidth
                    required
                    error={requiredError('userActiveInactive', formData.userActiveInactive)}
                  >
                    <InputLabel>{t('userActiveInactive', 'Status')}</InputLabel>
                    <Select
                      label={t('userActiveInactive', 'Status')}
                      name="userActiveInactive"
                      value={formData.userActiveInactive}
                      onChange={handleChange}
                      onBlur={handleFieldBlur}
                    >
                      <MenuItem value="">{t('select', 'Select')}</MenuItem>
                      <MenuItem value="Active">{t('active', 'Active')}</MenuItem>
                      <MenuItem value="Inactive">{t('inactive', 'Inactive')}</MenuItem>
                    </Select>
                    <FormHelperText>
                      {requiredError('userActiveInactive', formData.userActiveInactive)
                        ? t('required', 'Required')
                        : ' '}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <ContactMailIcon fontSize="small" />
                {t('accountDetails', 'Account Details')}
              </Typography>

              <Grid container spacing={2}>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label={t('userEmail', 'Email')}
                    name="userEmail"
                    type="email"
                    value={formData.userEmail}
                    onChange={handleChange}
                    onBlur={handleFieldBlur}
                    helperText=" "
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    required
                    label={t('userMobile', 'Mobile')}
                    name="userMobile"
                    value={formData.userMobile}
                    onChange={handleChange}
                    onBlur={handleFieldBlur}
                    error={requiredError('userMobile', formData.userMobile)}
                    helperText={
                      requiredError('userMobile', formData.userMobile) ? t('required', 'Required') : ' '
                    }
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label={t('password', 'Password')}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleFieldBlur}
                    required={!userId}
                    error={!userId && requiredError('password', formData.password)}
                    helperText={
                      userId
                        ? t('leaveBlankPassword', 'Leave blank to keep current password')
                        : requiredError('password', formData.password) ? t('required', 'Required') : ' '
                    }
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography
                variant="subtitle2"
                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <BadgeIcon fontSize="small" />
                {t('metadata', 'System Information')}
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label={t('createdAt', 'Created At')}
                    value={formData.createdAt}
                    InputProps={{ readOnly: true }}
                    helperText=" "
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label={t('updatedAt', 'Updated At')}
                    value={formData.updatedAt}
                    InputProps={{ readOnly: true }}
                    helperText=" "
                  />
                </Grid>
                <Grid size={12}>
                  <Typography
                    variant="caption"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}
                  >
                    <CalendarIcon fontSize="inherit" />
                    {t(
                      'timestampsAuto',
                      'Timestamps are updated automatically when you save this form.'
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            {typeof onClose === 'function' && (
              <Button variant="outlined" onClick={onClose} disabled={submitting}>
                {t('cancel', 'Cancel')}
              </Button>
            )}
            <Button type="submit" variant="contained" disabled={submitting}>
              {userId ? t('update', 'Update') : t('submit', 'Submit')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
