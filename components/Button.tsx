import { FaArrowRight, FaSpinner } from "react-icons/fa6";

const Button = ({
  text,
  className = "",
  isSending = false,
}: {
  text: string;
  className?: string;
  isSending?: boolean;
}) => {
  return (
    <button
      type="submit"
      disabled={isSending}
      className={`flex items-center justify-center gap-2 text-lg font-semibold rounded-full py-5 px-8 transition-all duration-500 ${
        isSending ? "bg-gray-400 text-black cursor-not-allowed" : "bg-black text-white hover:bg-green-500 hover:text-black"
      } ${className}`}
    >
      {isSending ? (
        <>
          <FaSpinner className="animate-spin" />
          { text==="Sign In" ? "Signing In ..." : "Sending..."}
        </>
      ) : (
        <>
          {text}
          <FaArrowRight />
        </>
      )}
    </button>
  );
};

export default Button;
