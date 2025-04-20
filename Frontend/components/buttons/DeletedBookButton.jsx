'use client'
import Image from "next/image"
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material"
import { useState } from 'react'
import { deleteBooking } from '@api/booking'
import { SuccessDialog } from "@components/cards/SuccessDialog"
import { useRouter } from "@node_modules/next/navigation"
import { useEffect } from "react"

const DeletedBookButton = ({booking_id}) => {

    const router = useRouter();

    const [openConfirm, setOpenConfirm] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    const handleOpenConfirm = () => setOpenConfirm(true)
    const handleCloseConfirm = () => setOpenConfirm(false)

    useEffect(()=>{
        const token = localStorage.getItem('token');
        const storedLogin = localStorage.getItem("res_login");
        if(token){
            setToken(token);
        }
        if (storedLogin) {
            const parsedUser = JSON.parse(storedLogin);
            setUser(parsedUser);
        }
    },[])

    const handleDeleteConfirm = async () => {
        try {
        await deleteBooking(token, booking_id, user.account.hotel_id)
        setOpenConfirm(false)
        setOpenSuccess(true)
        } catch (error) {
        console.error("Failed to delete booking:", error)
        setOpenConfirm(false)
        // You can optionally show an error dialog here
        }
    }

    const handleSuccessClose = () => {
        router.push('/my-booking-page');
    }

    return (
        <>
        <button
            className="w-full group bg-white-400 text-red-500 font-semibold text-center py-2 rounded-md border-2
            hover:bg-red-500 hover:shadow-lg hover:border-2 border-red-500 hover:text-white transition-all duration-200
            flex items-center justify-center gap-2"
            onClick={handleOpenConfirm}
        >
            Deleted Booking
            <div className="relative w-5 h-5">
            <Image
                src="/icons/bin-red.png"
                alt="Bin Icon Red"
                fill
                className="object-contain group-hover:hidden"
            />
            <Image
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
            Confirm Delete
            </DialogTitle>
            <DialogContent sx={{ py: 1 }}>
            <DialogContentText
                sx={{
                fontSize: '0.875rem',
                color: '#4B5563',
                mb: 2,
                }}
            >
                Are you sure you want to delete this booking? This action cannot be undone.
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
                Cancel
            </Button>
            <Button
                onClick={handleDeleteConfirm}
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
                Delete
            </Button>
            </DialogActions>
        </Dialog>

        {/* Success Dialog */}
        <SuccessDialog
            open={openSuccess}
            onClose={handleSuccessClose}
            textshow="Booking deleted successfully!"
            reloadOnClose={false}
        />
        </>
    )
}

export default DeletedBookButton
