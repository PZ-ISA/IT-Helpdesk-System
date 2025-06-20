import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Ticket from "../components/tickets/Ticket";
import type { Ticket as TicketType } from "../types/types";

const API_URL = "http://localhost:5000/api";

const TicketsPage = () => {
  const { jwtToken, role } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "open" | "closed">(
    "newest"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);

  type SortOption = "newest" | "oldest" | "open" | "closed";

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(
          role === "Admin"
            ? `${API_URL}/admin/tickets?pageNumber=1&pageSize=50`
            : `${API_URL}/tickets?pageNumber=1&pageSize=50`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
            withCredentials: true,
          }
        );

        setTickets(res.data.items); // lub dostosuj do zwracanego formatu
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [jwtToken, role]);

  const sorted = [...tickets].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "open":
        return a.status === "Open" ? -1 : 1;
      case "closed":
        return a.status === "Closed" ? -1 : 1;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <div className="flex items-center gap-3">
          <label className="text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSortBy(e.target.value as SortOption)
            }
            className="px-3 py-2 border rounded-md"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <button
            onClick={() => navigate("/main/tickets/new")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Create New Ticket
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : (
        <div className="grid gap-4">
          {sorted.length > 0 ? (
            sorted.map((t) => <Ticket key={t.id} ticket={t} />)
          ) : (
            <div className="text-gray-500 text-center">No tickets found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketsPage;
