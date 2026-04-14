import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function OtpModal({
  otp,
  setOtp,
  onVerify,
  onClose,
  loading,
}: any) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-2xl w-[90%] max-w-sm space-y-4">

        <h2 className="text-xl font-semibold text-center">
          Verify Email
        </h2>

        <Input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <Button onClick={onVerify} className="w-full" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </Button>

        <button
          onClick={onClose}
          className="text-sm text-gray-400 w-full text-center"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}