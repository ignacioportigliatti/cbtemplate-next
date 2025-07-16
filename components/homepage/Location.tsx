import { cn } from "@/lib/utils";
import { ContactContent } from "@/lib/wordpress.d";
import Link from "next/link";
import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGoogle,
  FaPinterest,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

interface Props {
  contactContent: ContactContent;
}

const socialMedia = [
  {
    name: "Facebook",
    icon: <FaFacebook className="w-5 h-5" />,
  },
  {
    name: "Instagram",
    icon: <FaInstagram className="w-5 h-5" />,
  },
  {
    name: "LinkedIn",
    icon: <FaLinkedin className="w-5 h-5" />,
  },
  {
    name: "Google",
    icon: <FaGoogle className="w-5 h-5" />,
  },
  {
    name: "Pinterest",
    icon: <FaPinterest className="w-5 h-5" />,
  },
];

// Utility function to format business hours for calendar view
const formatBusinessHoursCalendar = (timetable: ContactContent["location"]["timetable"]) => {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ] as const;
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return days.map((day, index) => {
    const schedule = timetable[day];
    return {
      day: dayNames[index],
      fullDay: day,
      isOpen: schedule?.is_open || false,
      openTime: schedule?.open_time?.replace(":00", "") || "",
      closeTime: schedule?.close_time?.replace(":00", "") || "",
      isToday: new Date().getDay() === (index + 1) % 7,
    };
  });
};

export const Location = ({ contactContent }: Props) => {
  // Use dynamic timetable if available, otherwise fallback to hardcoded hours
  const businessHours = formatBusinessHoursCalendar(contactContent.location.timetable);

  return (
    <div className="space-y-4 flex flex-col justify-start h-full">
      {/* Map */}
      <div className="w-full h-64 overflow-hidden">
        <iframe
          src={`https://maps.google.com/maps?q=${encodeURIComponent(
            contactContent.location.address,
          )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Business Location"
        ></iframe>
      </div>

      {/* Business Hours Calendar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1 text-xs">
        {businessHours.map((dayInfo, index) => (
          <div
            key={index}
            className={cn(
              "p-2 border text-center opacity-80 min-h-20 hover:opacity-100 transition-all",
              dayInfo.isToday
                ? "border-accent opacity-100 bg-accent/20"
                : "border-gray-600 bg-background-500",
              !dayInfo.isOpen && "border-red-400 bg-red-400/10",
            )}
          >
            <div className={`font-medium mb-1 ${dayInfo.isToday ? "text-accent" : "text-text/80"}`}>
              {dayInfo.day}
            </div>
            <div className="text-text/80 text-xs">
              {dayInfo.isOpen ? (
                <div className="space-y-0.5">
                  <div>{dayInfo.openTime}h</div>
                  <div>{dayInfo.closeTime}h</div>
                </div>
              ) : (
                <div className="text-red-400">Closed</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Location;
