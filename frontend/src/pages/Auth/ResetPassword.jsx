import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useResetPasswordMutation } from "../../redux/api/usersApislice";

const fontHeading = { fontFamily: "'Cormorant Garamond', serif" };
const fontBody = { fontFamily: "'Inter', sans-serif" };

const BouncingDotsLoader = () => (
  <div className="flex space-x-1.5 justify-center items-center h-full">
    {[0, 1, 2].map((index) => (
      <motion.div
        key={index}
        className="w-2 h-2 bg-[#0a0a0a] rounded-full"
        animate={{ y: ["0%", "-80%", "0%"] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.15,
        }}
      />
    ))}
  </div>
);

const ResetPassword = () => {
  const { token } = useParams();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setErrorMsg("Please fill all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({ token, newPassword }).unwrap();
      setIsSuccess(true);
    } catch (err) {
      setErrorMsg(err?.data?.message || err?.message || "An error occurred. The link might be invalid or expired.");
    }
  };

  const inputClasses = "w-full mt-1 p-3 bg-[#0a0a0a] text-[#E8E6E1] border border-[#333] rounded-lg outline-none focus:border-b-2 focus:border-b-[#C9A84C] focus:bg-[#111] transition-all duration-300 placeholder-[#666]";
  const iconClasses = "absolute top-4 left-3 text-[#C9A84C] w-5 h-5";

  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#141414] rounded-2xl p-8 sm:p-10 border border-[#C9A84C]/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)] text-center">
          <h1 className="text-4xl text-[#C9A84C] font-semibold mb-4" style={fontHeading}>Success!</h1>
          <p className="text-[#E8E6E1] mb-8 leading-relaxed" style={fontBody}>
            Your password has been successfully reset. You can now log in with your new credentials.
          </p>
          <Link 
            to="/login"
            className="w-full bg-[#C9A84C] hover:bg-[#B8963E] text-[#0a0a0a] font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center uppercase tracking-wide"
            style={fontBody}
          >
            Proceed to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#141414] rounded-2xl p-8 sm:p-10 border border-[#C9A84C]/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col justify-center">
          <h1 className="text-4xl text-[#C9A84C] font-semibold mb-2 text-center" style={fontHeading}>Set New Password</h1>
          <p className="text-[#9C9690] mb-8 text-center" style={fontBody}>
            Please enter your new password below.
          </p>

          <div className="mb-4 relative">
            <Lock className={iconClasses} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="New Password" 
              className={`${inputClasses} pl-10 pr-10`} 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={fontBody}
              autoComplete="new-password"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-4 right-3 text-[#9C9690] hover:text-[#C9A84C] transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
            </button>
          </div>

          <div className="mb-6 relative">
            <Lock className={iconClasses} />
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirm New Password" 
              className={`${inputClasses} pl-10 pr-10`} 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={fontBody}
              autoComplete="new-password"
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-4 right-3 text-[#9C9690] hover:text-[#C9A84C] transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
            </button>
          </div>

          <AnimatePresence>
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="text-[#ff6b6b] text-sm mb-4 text-center"
                style={fontBody}
              >
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#C9A84C] hover:bg-[#B8963E] text-[#0a0a0a] font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center h-12"
            style={fontBody}
          >
            {isLoading ? <BouncingDotsLoader /> : "Reset Password"}
          </button>

          <div className="mt-6 text-center border-t border-[#333] pt-6">
            <Link to="/forgot-password" className="text-[#C9A84C] hover:text-[#E8E6E1] font-semibold transition-colors" style={fontBody}>
              Request a new reset link
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
