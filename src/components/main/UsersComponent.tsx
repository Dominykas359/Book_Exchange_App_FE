import { useEffect, useState } from "react";
import Header from "../../utilities/Header";
import { User } from "../../models/User";
import { fetchAllUsers, deleteUser, updateUser } from "../../api/UserApi";

function UsersComponent() {
    const [users, setUsers] = useState<User[] | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await fetchAllUsers();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userId: string) => {
        try {
            await deleteUser(userId);
            setUsers((prevUsers) => prevUsers?.filter((user) => user.id !== userId) || null);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const toggleAdminRights = async (user: User) => {
        try {
            const updatedUser = { ...user, role: user.role === "ADMIN" ? "USER" : "ADMIN" };
            await updateUser(user.id, updatedUser);

            setUsers((prevUsers) =>
                prevUsers?.map((u) => (u.id === user.id ? updatedUser : u)) || null
            );
        } catch (error) {
            console.error("Error updating user role:", error);
        }
    };

    return (
        <div>
            <Header />
            <div className="p-4">
                <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>
                {users && users.length > 0 ? (
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b">First Name</th>
                                <th className="px-4 py-2 border-b">Last Name</th>
                                <th className="px-4 py-2 border-b">Email</th>
                                <th className="px-4 py-2 border-b">Role</th>
                                <th className="px-4 py-2 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-4 py-2 border-b">{user.firstName}</td>
                                    <td className="px-4 py-2 border-b">{user.lastName}</td>
                                    <td className="px-4 py-2 border-b">{user.email}</td>
                                    <td className="px-4 py-2 border-b">{user.role}</td>
                                    <td className="px-4 py-2 border-b">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded mr-2 hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => toggleAdminRights(user)}
                                            className={`px-3 py-1 rounded ${
                                                user.role === "ADMIN"
                                                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                                            }`}
                                        >
                                            {user.role === "ADMIN" ? "Remove Admin" : "Make Admin"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No users found.</p>
                )}
            </div>
        </div>
    );
}

export default UsersComponent;
