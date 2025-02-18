import React, { useState } from "react";
import { Menu, X, Users, Bell } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("friends");

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-[#ccdec2] border border-[#575757] hover:border-l-4 hover:border-r-4 hover:border-[#1d380e] focus:outline-none"
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <X size={24} className="text-gray-900" />
        ) : (
          <Menu size={24} className="text-gray-900" />
        )}
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#eaf5e4] border-l border-[#1d380e] shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pt-16 px-4">
          {activeTab === "friends" ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Friends
              </h2>
              <ul className="space-y-2">
                <li className="p-2 bg-[#ccdec2] rounded border border-[#575757] text-gray-900">
                  Friend 1
                </li>
                <li className="p-2 bg-[#ccdec2] rounded border border-[#575757] text-gray-900">
                  Friend 2
                </li>
                <li className="p-2 bg-[#ccdec2] rounded border border-[#575757] text-gray-900">
                  Friend 3
                </li>
              </ul>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Notifications
              </h2>
              <ul className="space-y-2">
                <li className="p-2 bg-[#ccdec2] rounded border border-[#575757] text-gray-900">
                  Notification 1
                </li>
                <li className="p-2 bg-[#ccdec2] rounded border border-[#575757] text-gray-900">
                  Notification 2
                </li>
                <li className="p-2 bg-[#ccdec2] rounded border border-[#575757] text-gray-900">
                  Notification 3
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="absolute bottom-4 left-0 w-full flex justify-around">
          <button
            onClick={() => setActiveTab("friends")}
            className={`p-2 rounded-full border ${
              activeTab === "friends"
                ? "bg-[#1d380e] text-white"
                : "bg-[#ccdec2] border-[#575757]"
            }`}
          >
            <Users size={24} />
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`p-2 rounded-full border ${
              activeTab === "notifications"
                ? "bg-[#1d380e] text-white"
                : "bg-[#ccdec2] border-[#575757]"
            }`}
          >
            <Bell size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
