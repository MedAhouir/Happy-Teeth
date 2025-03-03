"use client";

import { useState } from "react";
import Button from "./Button";
import TeethModel from "./TeethModel";
import { IoCalendarOutline } from "react-icons/io5";
import { AlertDialogDemo } from "./AlertDialogDemo";

const Contact = () => {
  const [isSending, setIsSending] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    tooth: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
    date: false,
    tooth: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: false });
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    if (selectedDate) {
      const formattedDate = new Date(selectedDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      setFormData({ ...formData, date: formattedDate });
      setErrors({ ...errors, date: false });
    }
  };

  const handleToothSelect = (toothName: string) => {
    setFormData((prevData) => ({
      ...prevData,
      tooth: prevData.tooth === toothName ? "" : toothName,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      tooth: false,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: formData.name.trim() === "",
      email: formData.email.trim() === "",
      phone: formData.phone.trim() === "",
      date: formData.date.trim() === "",
      tooth: formData.tooth.trim() === "",
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).includes(true)) {
      setIsSending(true);
      try {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await res.json();
        setIsSending(false);

        if (res.ok) {
          setIsSuccess(true);
          setAlertMessage("Your appointment has been booked successfully!");
          setFormData({ name: "", email: "", phone: "", date: "", tooth: "" });
        } else {
          setIsSuccess(false);
          setAlertMessage(result.error || "Booking failed! Please try again.");
        }
      } catch (error) {
        console.error("Booking Error:", error); // Logs the error to the console
        setIsSending(false);
        setIsSuccess(false);
        setAlertMessage("Server error! Please try again later.");
      }
    }
  };

  return (
    <section id="contact" className="relative px-4 sm:px-8 lg:px-12 py-8 my-10 text-lg">
      <h1 className="text-6xl lg:text-7xl font-semibold font-mulish leading-tight">
        Book Online <br />
        Now <span className="text-green-500">.</span>
      </h1>
      <div className="max-w-5xl mx-auto mt-5 flex flex-col-reverse lg:flex-row items-center justify-between gap-2">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 flex flex-col gap-10">
          <form className="bg-white shadow-lg rounded-3xl p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              {/* Name Input */}
              <div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-4 border-2 rounded-xl outline-none transition ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">Name is required.</p>}
              </div>

              {/* Email Input */}
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-4 border-2 rounded-xl outline-none transition ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">Email is required.</p>}
              </div>

              {/* Phone Input */}
              <div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full p-4 border-2 rounded-xl outline-none transition ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">Phone number is required.</p>}
              </div>

              {/* Date Picker */}
              <div className="relative">
                <input
                  name="date"
                  type="date"
                  className="absolute opacity-0 w-0 h-0"
                  onChange={handleDateChange}
                  id="datePicker"
                  min={new Date().toISOString().split("T")[0]}
                />
                <button
                  type="button"
                  className={`flex items-center gap-2 w-full p-4 border-2 rounded-xl transition ${
                    errors.date ? "border-red-500 text-red-500" : "border-gray-300 text-gray-500"
                  }`}
                  onClick={() => {
                    const datePicker = document.getElementById("datePicker") as HTMLInputElement;
                    if (datePicker && typeof datePicker.showPicker === "function") {
                      datePicker.showPicker();
                    }
                  }}
                >
                  <IoCalendarOutline size={24} />
                  {formData.date || "Select Date"}
                </button>
                {errors.date && <p className="text-red-500 text-sm mt-1">Date is required.</p>}
              </div>

              {/* Selected Tooth Display */}
              <div className="text-center">
                <p className="text-lg font-semibold">Selected Tooth:</p>
                <p className={`text-xl font-bold ${errors.tooth ? "text-red-500" : "text-green-500"}`}>
                  {formData.tooth || "None Selected"}
                </p>
                {errors.tooth && <p className="text-red-500 text-sm mt-1">Please select a tooth.</p>}
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <Button
                  text="Book Now"
                  isSending={isSending}
                  className={`bg-black text-white w-full py-3 text-lg rounded-xl ${
                    !isSending ? "hover:bg-green-500 hover:text-black" : ""
                  } transition`}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Right Section (Teeth Model) */}
        <div className="w-full lg:w-1/2 flex flex-col items-center text-center">
          <h2 className="font-semibold font-mulish text-4xl lg:text-5xl text-black">
            Select Your <span className="text-green-500">Tooth</span> <br />
            By Clicking On It
          </h2>
          <TeethModel onToothSelect={handleToothSelect} />
        </div>
      </div>

      {/* Alert Dialog for Booking Result */}
      <AlertDialogDemo message={alertMessage} isSuccess={isSuccess} onClose={() => setIsSuccess(null)} />
    </section>
  );
};

export default Contact;
