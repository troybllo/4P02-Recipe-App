import React, { useState } from "react";
import { Menu, X, Users, Bell, ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("friends");

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="relative">
      {/* Button to open/close the sidebar */}
      <button
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-[#ccdec2] border border-[#575757]"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar container */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-[#eaf5e4] border-r border-[#1d380e]
          shadow-lg transform transition-transform duration-300 ease-in-out

          /* Slide in/out */
          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          /* Collapsed or expanded width */
          ${isCollapsed ? "w-16" : "w-64"}

          /* Extra padding on the right side (10px) */
          pr-[10px]
        `}
      >
        {/* Collapse Button */}
        {isOpen && (
          <button
            onClick={toggleCollapse}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-300"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        )}

        {/* Top spacing + left padding. Increase as desired */}
        <div className={`pt-16 ${isCollapsed ? "px-2" : "px-6"}`}>
          {activeTab === "friends" ? (
            <div>
              {/* Title row for "Friends" */}
              {!isCollapsed && (
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Friends
                </h2>
              )}

              {/* Friends List */}
              <ul className="space-y-3">
                <li
                  className={`
                    relative flex items-center
                    bg-[#ccdec2] border border-[#575757] text-gray-900
                    rounded-[30px] hover:border-2 hover:border-[#1d380e]

                    /* Make the item bigger in both modes */
                    ${isCollapsed ? "w-14 h-14 justify-center" : "p-3 pl-12"}
                  `}
                >
                  {/* Larger icon for better visibility */}
                  <Users size={28} className={!isCollapsed ? "mr-3" : ""} />
                  {/* Only show text if expanded */}
                  {!isCollapsed && <span className="text-base">Friend 1</span>}
                </li>

                <li
                  className={`
                    relative flex items-center
                    bg-[#ccdec2] border border-[#575757] text-gray-900
                    rounded-[30px] hover:border-2 hover:border-[#1d380e]
                    ${isCollapsed ? "w-14 h-14 justify-center" : "p-3 pl-12"}
                  `}
                >
                  <Users size={28} className={!isCollapsed ? "mr-3" : ""} />
                  {!isCollapsed && <span className="text-base">Friend 2</span>}
                </li>
              </ul>
            </div>
          ) : (
            <div>
              {/* Title row for "Notifications" */}
              {!isCollapsed && (
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Notifications
                </h2>
              )}

              {/* Notifications List */}
              <ul className="space-y-3">
                <li
                  className={`
                    relative flex items-center
                    bg-[#ccdec2] border border-[#575757] text-gray-900
                    rounded-[30px] hover:border-2 hover:border-[#1d380e]
                    ${isCollapsed ? "w-14 h-14 justify-center" : "p-3 pl-12"}
                  `}
                >
                  {!isCollapsed && <span className="text-base">Notification 1</span>}
                </li>
                <li
                  className={`
                    relative flex items-center
                    bg-[#ccdec2] border border-[#575757] text-gray-900
                    rounded-[30px] hover:border-2 hover:border-[#1d380e]
                    ${isCollapsed ? "w-14 h-14 justify-center" : "p-3 pl-12"}
                  `}
                >
                  {!isCollapsed && <span className="text-base">Notification 2</span>}
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Bottom tabs */}
        <div className="absolute bottom-4 left-0 w-full flex justify-around">
          <button
            onClick={() => setActiveTab("friends")}
            className={`
              p-3 rounded-full border
              ${activeTab === "friends" ? "bg-[#1d380e] text-white" : "bg-[#ccdec2] border-[#575757]"}
            `}
          >
            <Users size={28} />
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`
              p-3 rounded-full border
              ${activeTab === "notifications" ? "bg-[#1d380e] text-white" : "bg-[#ccdec2] border-[#575757]"}
            `}
          >
            <Bell size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}
