import { cn, convertTo12HourFormat, getPhysicalLocations } from "@/lib/utils";
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
  mapHeight?: string;
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
const formatBusinessHoursCalendar = (timetable: any) => {
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
      openTime: convertTo12HourFormat(schedule?.open_time || ""),
      closeTime: convertTo12HourFormat(schedule?.close_time || ""),
      isToday: new Date().getDay() === (index + 1) % 7,
    };
  });
};

export const Location = ({ contactContent, mapHeight = "100%" }: Props) => {
  // Use all physical locations
  const physicalLocations = getPhysicalLocations(contactContent.locations || []);
  
  if (physicalLocations.length === 0) {
    return (
      <div className="space-y-4 flex flex-col justify-start h-full">
        <div className="w-full h-64 overflow-hidden bg-gray-200 flex items-center justify-center" style={{ height: mapHeight }}>
          <p className="text-gray-500">No location information available</p>
        </div>
      </div>
    );
  }

  // Use first physical location for map and hours (or combine multiple if needed)
  const mainLocation = physicalLocations[0];
  const businessHours = formatBusinessHoursCalendar(mainLocation.timetable);
  
  // Generate Google Maps URL with business name + address for better SEO
  const generateMapUrl = () => {
    // Try with business name + address first
    const businessNameAddress = `${mainLocation.name} ${mainLocation.address.street}, ${mainLocation.address.city}, ${mainLocation.address.state} ${mainLocation.address.zip_code}`;
    
    // Fallback to address only if business name is not available
    const addressOnly = mainLocation.address.full_address || 
      `${mainLocation.address.street}, ${mainLocation.address.city}, ${mainLocation.address.state} ${mainLocation.address.zip_code}`;
    
    // Use business name + address if name exists, otherwise fallback to address only
    const searchQuery = mainLocation.name ? businessNameAddress : addressOnly;

    return `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };
  
  const mapUrl = generateMapUrl();

  return (
    <div className="space-y-4 flex flex-col justify-start h-full">
      {/* Map */}
      <div className="w-full h-64 overflow-hidden" style={{ height: mapHeight }}>
        <iframe
          src={mapUrl}
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
                  <div>{dayInfo.openTime}</div>
                  <div>{dayInfo.closeTime}</div>
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
