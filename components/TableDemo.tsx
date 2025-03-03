import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export function TableDemo() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updatingType, setUpdatingType] = useState("") 

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("/api/bookings", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const updateAppointmentStatus = async (id: string, status: string) => {
    setUpdatingId(id); // Show loading for this appointment
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      // Update local state after successful API response
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === id ? { ...appointment, status } : appointment
        )
      );
    } catch (error) {
      console.error("Error updating appointment:", error);
    } finally {
      setUpdatingId(null); // Remove loading state
    }
  };

  const handleConfirmation = (id: string) => {
    updateAppointmentStatus(id, "Confirmed");
    setUpdatingType("Confirmation")
  };

  const handleCancellation = (id: string) => {
    updateAppointmentStatus(id, "Cancelled");
    setUpdatingType("Cancellation")
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>A list of your appointments.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Tooth</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className='w-[200px] text-center'>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow key={appointment._id}>
            <TableCell className="font-medium">{appointment.name}</TableCell>
            <TableCell>{appointment.phone}</TableCell>
            <TableCell>{appointment.date}</TableCell>
            <TableCell>{appointment.tooth}</TableCell>
            <TableCell
              className={`${
                appointment.status === "Pending"
                  ? "text-yellow-600"
                  : appointment.status === "Confirmed"
                  ? "text-green-500"
                  : "text-red-700"
              }`}
            >
              {appointment.status}
            </TableCell>
            {appointment.status === "Pending" && (
              <TableCell className='w-[200px] text-center'>
                {updatingId === appointment._id ? <Loader2 className="mx-auto animate-spin text-gray-500" /> : <>
                
                <button
                  onClick={() => handleConfirmation(appointment._id)}
                  className="h-10 px-3 mx-2 py-1 text-sm text-white bg-green-500 rounded-3xl hover:bg-green-700 transition-all duration-500"
                  disabled={updatingId === appointment._id}
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleCancellation(appointment._id)}
                  className="h-10 px-3 mx-2 py-1 text-sm text-white bg-red-500 rounded-3xl hover:bg-red-700 transition-all duration-500"
                  disabled={updatingId === appointment._id}
                >
                  Cancel
                </button>
                </> 
                }
                
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">{appointments.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
