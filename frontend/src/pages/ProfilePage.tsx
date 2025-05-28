// pages/ProfilePage.tsx

import { Box, Button, Modal, Typography } from "@mui/material";
import { useState } from "react";

const profile = { name: "Mariusz", surname: "Kowalski", email: "mkowalski@gmail.com", role: "Admin" };

const ProfilePage = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        if(formData.newPassword !== formData.confirmPassword)
        {
            alert("New password doesn't match.")
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm">
                {/* Logo */}
                <h1 className="text-3xl font-bold text-center mb-2">USER PROFILE</h1>
                <div className="space-y-2">
                    <p className="text-lg font-medium">
                        <span className="font-bold">Name:</span> {profile.name} {profile.surname}
                    </p>
                    <p className="text-lg font-medium">
                        <span className="font-bold">Email:</span> {profile.email}
                    </p>
                    <p className="text-lg font-medium">
                        <span className="font-bold">Role:</span> {profile.role}
                    </p>
                </div>
                <div className="flex justify-center mt-4">
                    <Button onClick={handleOpen}>Reset password</Button>
                </div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <Box className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Reset Password
                            </Typography>
                                <input
                                    type='password'
                                    name='currentPassword'
                                    placeholder='Current password'
                                    className='w-full p-3 border rounded-lg'
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                />
                                <input
                                    type='password'
                                    name='newPassword'
                                    placeholder='Password'
                                    className='w-full p-3 border rounded-lg'
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                />
                                <input
                                    type='password'
                                    name='confirmPassword'
                                    placeholder='Confirm password'
                                    className='w-full p-3 border rounded-lg'
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            <div className="mt-4 flex justify-end space-x-2">
                                <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                                <Button variant="contained" color="primary" onClick={handleSubmit}>Confirm</Button>
                            </div>
                        </Box>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default ProfilePage;
