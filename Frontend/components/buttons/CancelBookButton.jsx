'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";
import { useEffect, useState } from 'react';
import { changeBookingStatus } from "@api/booking";
import { SuccessDialog } from "@components/cards/SuccessDialog";
import NextImage from "next/image"

const CancelBookButton = ({booking_id}) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [token, setToken] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [user, setUser] = useState(null);

  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedLogin = localStorage.getItem("res_login");
    if (token) {
      setToken(token);
    }
    if (storedLogin) {
      const parsedUser = JSON.parse(storedLogin);
      setUser(parsedUser);
    }
    setBookingId(booking_id);
    // console.log("Booking is: ",booking_id , " Token is: " ,token)
  }, []);

  const handleCancelConfirm = async () => {
    try{
      await changeBookingStatus({
        token:token,
        booking_id:bookingId,
        new_status:'canceled'
      });
      setOpenConfirm(false);
      setOpenSuccess(true);
    }catch(err){
      console.error("Failed to Cancel Booking",err);
      setOpenConfirm(false);
    }
  };

  const handleSuccessClose = () => {
    setOpenSuccess(false);
  };

  return (
    <>
      <button
        className="w-full group bg-white-400 text-red-500 font-semibold text-center py-2 rounded-md border-2
        hover:bg-red-500 hover:shadow-lg hover:border-2 border-red-500 hover:text-white transition-all duration-200
        flex items-center justify-center gap-2"
        onClick={handleOpenConfirm}
      >
        Cancel Booking
        <div className="relative w-5 h-5">
          <NextImage
            src="/icons/bin-red.png"
            alt="Bin Icon Red"
            fill
            className="object-contain group-hover:hidden"
            />
          <NextImage
            src="/icons/bin-white.png"
            alt="Bin Icon White"
            fill
            className="object-contain hidden group-hover:block"
          />
        </div>
      </button>

      {/* Confirm Dialog */}
      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
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
          Confirm Cancellation
        </DialogTitle>
        <DialogContent sx={{ py: 1 }}>
          <DialogContentText
            sx={{
              fontSize: '0.875rem',
              color: '#4B5563',
              mb: 2,
            }}
          >
            Are you sure you want to cancel this booking?
          </DialogContentText>
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
            onClick={handleCloseConfirm}
            variant="text"
            sx={{
              fontWeight: 500,
              color: '#6B7280',
              textTransform: 'none',
              fontSize: '0.875rem',
            }}
          >
            No
          </Button>
          <Button
            onClick={handleCancelConfirm}
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '0.875rem',
              px: 3,
              py: 1,
              boxShadow: 'none',
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <SuccessDialog
        open={openSuccess}
        onClose={handleSuccessClose}
        textshow="Booking cancelled successfully!"
        reloadOnClose={true}
      />
    </>
  );
};

export default CancelBookButton;