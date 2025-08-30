"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";

const announcements = [
  "“Memory” collection now available",
  "Free delivery on orders over €160",
];

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="complementary"
      aria-label="Announcement banner"
      className="grid h-[34px] w-full grid-cols-[1fr_auto] border-b border-white/[.15] bg-white/[.08] text-white lg:h-[40px] lg:grid-cols-1"
    >
      <div className="col-span-1 col-start-1 grid items-center overflow-hidden lg:col-span-full lg:row-span-full">
        {/* Desktop view: Fading text */}
        <ul
          aria-label="list announcement"
          className="relative hidden h-full w-full items-center justify-items-center lg:grid"
        >
          {announcements.map((text, index) => (
            <li
              key={index}
              aria-label="announcement"
              className={`text-center text-sm uppercase text-white/60 col-span-full row-span-full transition-opacity duration-1000 ${
                currentAnnouncement === index ? "opacity-100" : "opacity-0"
              }`}
            >
              {text}
            </li>
          ))}
        </ul>

        {/* Mobile view: Scrolling marquee. Requires custom 'animate-marquee' and 'animate-marquee2' in tailwind.config.js */}
        <div className="relative flex w-full items-center overflow-x-hidden lg:hidden">
          <ul className="flex flex-shrink-0 animate-marquee whitespace-nowrap">
            {announcements.map((text, index) => (
              <li key={`m1-${index}`} className="px-4 text-sm uppercase text-white/60">
                {text}
              </li>
            ))}
          </ul>
          <ul
            className="absolute top-0 flex flex-shrink-0 animate-marquee2 whitespace-nowrap"
            aria-hidden="true"
          >
            {announcements.map((text, index) => (
              <li key={`m2-${index}`} className="px-4 text-sm uppercase text-white/60">
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        aria-label="change language"
        className="col-span-1 col-start-2 flex items-center justify-self-end gap-x-3 border-l border-white/[.15] bg-white/[.05] px-4 lg:col-span-full lg:row-span-full lg:gap-x-6 lg:px-8"
      >
        <Link
          href="/"
          aria-label="Change language to French"
          className="text-base font-light text-white/60 transition-colors hover:text-white"
        >
          <span className="hidden lg:inline">Français</span>
          <span className="lg:hidden">Fr</span>
        </Link>
        <Link
          href="/en"
          aria-label="Change language to English"
          className="text-base font-light text-white transition-colors hover:text-white/80"
        >
          <span className="hidden lg:inline">English</span>
          <span className="lg:hidden">En</span>
        </Link>
        <button
          aria-label="close banner"
          onClick={() => setIsVisible(false)}
          className="text-white/50 transition-colors hover:text-white"
        >
          <X className="h-[18px] w-[18px]" />
          <span className="sr-only">close banner</span>
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;