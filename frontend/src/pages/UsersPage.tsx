// pages/UsersPage.tsx

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import { useState } from "react";

const initialProfiles = [
    { name: "Mariusz", surname: "Kowalski", email: "mkowalski@gmail.com", role: "Admin", isActive: "True" },
    { name: "Mariuszz", surname: "Kowalskii", email: "mkowalskii@gmail.com", role: "Employee", isActive: "False" },
    { name: "Mariuszzz", surname: "Kowalskiii", email: "mkowalskiii@gmail.com", role: "Admin", isActive: "False" }
];

const UsersPage = () => {
    const [profiles, setProfiles] = useState(initialProfiles);

    const handleVerify = (index: number) => {
        setProfiles((prevProfiles) =>
            prevProfiles.map((profile, i) =>
                i === index ? { ...profile, isActive: "True" } : profile
            )
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-bg bg-white p-8 rounded-xl shadow-sm">
                <h1 className="text-3xl font-bold text-center mb-2">USERS</h1>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Weryfikacja</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Surname</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Active</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {profiles.map((profile, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={profile.isActive === "True"}
                                            onClick={() => handleVerify(index)}
                                        >
                                            Weryfikuj
                                        </Button>
                                    </TableCell>
                                    <TableCell>{profile.name}</TableCell>
                                    <TableCell>{profile.surname}</TableCell>
                                    <TableCell>{profile.email}</TableCell>
                                    <TableCell>{profile.role}</TableCell>
                                    <TableCell>{profile.isActive}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default UsersPage;
