// pages/ProfilePage.tsx

import { Box, Button, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

type UserProfile = {
  name: string;
  surname: string;
  email: string;
  role: string;
};

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { jwtToken } = useAuth();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setOpen(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    if (jwtToken) {
      fetchProfile();
    }
  }, [jwtToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New password doesn't match.");
      return;
    }

    try {
      await axios.patch(
        `${API_URL}/users/me/change-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Password changed successfully!");
      handleClose();
    } catch (error) {
      console.error("Password change failed", error);
      alert("Failed to change password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold text-center mb-4">USER PROFILE</h1>

        {profile ? (
          <div className="space-y-2">
            <p className="text-lg font-medium">
              <span className="font-bold">Name:</span> {profile.name}{" "}
              {profile.surname}
            </p>
            <p className="text-lg font-medium">
              <span className="font-bold">Email:</span> {profile.email}
            </p>
            <p className="text-lg font-medium">
              <span className="font-bold">Role:</span> {profile.role}
            </p>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}

        <div className="flex justify-center mt-6">
          <Button onClick={handleOpen} variant="outlined">
            Reset password
          </Button>
        </div>

        <Modal open={open} onClose={handleClose}>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Box className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm space-y-3">
              <Typography variant="h6">Reset Password</Typography>

              <input
                type="password"
                name="currentPassword"
                placeholder="Current password"
                className="w-full p-3 border rounded-lg"
                value={formData.currentPassword}
                onChange={handleChange}
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New password"
                className="w-full p-3 border rounded-lg"
                value={formData.newPassword}
                onChange={handleChange}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                className="w-full p-3 border rounded-lg"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <div className="flex justify-end space-x-2">
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Confirm
                </Button>
              </div>
            </Box>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ProfilePage;
