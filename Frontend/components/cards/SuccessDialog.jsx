'use client';

import React from 'react';
import { Dialog, Button } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { green } from '@mui/material/colors';

export const SuccessDialog = ({ open, onClose, textshow, reloadOnClose = true }) => {
  const handleClose = () => {
    if (reloadOnClose) {
      window.location.reload();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 'none',
          px: 3,
          py: 4,
          maxWidth: 400,
          mx: 'auto',
          textAlign: 'center',
        },
      }}
    >
      <div className="flex flex-col items-center">
        <CheckCircle sx={{ fontSize: 100, color: green[400] }} />
        <p className="text-xl font-semibold text-gray-800 mt-4 mb-6">
          {textshow}
        </p>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClose}
          sx={{
            borderRadius: '999px',
            textTransform: 'none',
            px: 4,
            py: 1.5,
            fontSize: '0.875rem',
            boxShadow: 'none',
            backgroundColor: '#3B82F6',
            '&:hover': {
              backgroundColor: '#2563EB',
            },
          }}
        >
          Back
        </Button>
      </div>
    </Dialog>
  );
};
