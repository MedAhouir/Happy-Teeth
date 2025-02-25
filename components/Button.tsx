import { FaArrowRight } from "react-icons/fa6";

const Button = ({ className, type, isSending }: { className?: string, type: "button" | "submit", isSending?: boolean }) => {
  return (
    <button type={type} disabled={isSending} className={`${isSending && "bg-gray-400 hover:bg-gray-400 text-black" } "bg-black py-5 px-8 transition-all duration-500 rounded-full font-semibold ${className}`}>
      <div className="flex flex-row gap-2 items-center text-lg">{isSending ? "Sending..." : "Book Now"} <FaArrowRight /></div>
    </button>
  )
}

export default Button