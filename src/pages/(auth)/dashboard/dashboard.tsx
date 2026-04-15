import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store";
import { Shield } from "lucide-react";
import TwoFASetupDialog from "@/pages/(auth)/two-fa-dialog/two-fa-setup-dialog";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuthStore();
  const [twoFASetupOpen, setTwoFASetupOpen] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-gray-600">Welcome, {user.email}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Security Section */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Security Settings</h2>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">
                    {is2FAEnabled
                      ? "2FA is enabled on your account"
                      : "Add an extra layer of security to your account"}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setTwoFASetupOpen(true)}
                disabled={is2FAEnabled}
              >
                {is2FAEnabled ? "Enabled" : "Enable 2FA"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <TwoFASetupDialog
        open={twoFASetupOpen}
        onClose={() => setTwoFASetupOpen(false)}
        email={user.email}
        token={token}
        onSuccess={() => {
          setIs2FAEnabled(true);
          setTwoFASetupOpen(false);
        }}
      />
    </div>
  );
}
