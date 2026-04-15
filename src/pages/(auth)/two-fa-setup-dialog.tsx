import { useState } from "react";
import api from "@/lib/axios";
import QRCode from "qrcode.react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  email: string;
};

export default function TwoFASetupDialog({ open, onClose, email }: Props) {
  const [step, setStep] = useState<"qr" | "verify">("qr");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpenChange = async (isOpen: boolean) => {
    if (isOpen && !qrCode) {
      await generateQRCode();
    } else if (!isOpen) {
      onClose();
    }
  };

  const generateQRCode = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await api.post("/auth/setup-2fa", {
        email,
      });

      setQrCode(res.data.qrCode);
      setSecret(res.data.secret);
      setStep("qr");
    } catch (err) {
      setError("Failed to generate 2FA setup");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setError("");
      setLoading(true);

      await api.post("/auth/verify-2fa-setup", {
        email,
        secret,
        code,
      });

      // Success - close dialog
      setStep("qr");
      setCode("");
      setQrCode("");
      setSecret("");
      onClose();
    } catch (err: unknown) {
      setError("Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Enable Two-Factor Authentication
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === "qr"
              ? "Scan this QR code with your authenticator app"
              : "Enter the 6-digit code from your authenticator app"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {step === "qr" && qrCode && (
            <>
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg border">
                  <img src={qrCode} alt="2FA QR Code" className="w-40 h-40" />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">
                  Secret Key (backup):
                </p>
                <code className="text-sm font-mono break-all">{secret}</code>
              </div>

              <p className="text-sm text-gray-600 text-center">
                Can't scan? Enter this code manually in your authenticator app.
              </p>

              <Button onClick={() => setStep("verify")} className="w-full">
                I've Scanned the QR Code
              </Button>
            </>
          )}

          {step === "verify" && (
            <>
              <p className="text-sm text-muted-foreground text-center">
                Enter the 6-digit code from your authenticator app
              </p>

              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                minLength={6}
                placeholder="000000"
                className="text-center text-lg tracking-widest"
              />

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep("qr")}
                  className="flex-1"
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  onClick={handleVerify}
                  disabled={code.length !== 6 || loading}
                  className="flex-1"
                >
                  {loading ? "Verifying..." : "Verify & Enable"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
