import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotificationStore } from "../../store/notificationStore";

export const Notifications = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Email Alerts");

  const notificationsOps = useNotificationStore((state) => state.notification);

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 cursor-pointer select-none"
        role="button"
        tabIndex={0}
        aria-label="Notifications"
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => e.key === "Enter" && setOpen(!open)}
      >
        <Bell size={20} />
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-100 bg-white border rounded-xl shadow-lg p-1 z-50">
          {notificationsOps.map((alert) => (
            <div
              key={alert}
              onClick={() => {
                setSelected(alert);
                setOpen(false);
              }}
              className={`px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-gray-100 ${
                selected === alert ? "bg-gray-50 font-medium" : ""
              }`}
            >
              {alert}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
