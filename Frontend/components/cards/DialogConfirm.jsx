import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
  } from '@mui/material'
  
  export const DialogConfirm = ({
    open,
    onClose,
    onConfirm,
    roomNumber,
    numPeople,
    checkIn,
    checkOut
  }) => {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 'none',
            px: 3,
            py: 2,
            maxWidth: 400,
            mx: 'auto',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#111827',
            pb: 1,
          }}
        >
          Confirm Booking Update
        </DialogTitle>
        <DialogContent sx={{ py: 1 }}>
          <DialogContentText
            sx={{
              fontSize: '0.875rem',
              color: '#4B5563',
              mb: 2,
            }}
          >
            You’re about to update your booking with the following details:
          </DialogContentText>
  
          <ul className="text-sm text-gray-700 space-y-1">
            <li><span className="font-medium">Room No:</span> {roomNumber}</li>
            <li><span className="font-medium">People:</span> {numPeople}</li>
            <li><span className="font-medium">Check-in:</span> {checkIn}</li>
            <li><span className="font-medium">Check-out:</span> {checkOut}</li>
          </ul>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1.5,
            px: 3,
            pb: 2,
            pt: 1,
          }}
        >
          <Button
            onClick={onClose}
            variant="text"
            sx={{
              fontWeight: 500,
              color: '#6B7280',
              textTransform: 'none',
              fontSize: '0.875rem',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '0.875rem',
              px: 3,
              py: 1,
              boxShadow: 'none',
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
  