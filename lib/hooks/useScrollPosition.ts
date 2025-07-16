"use client";

import { useEffect, useState } from "react";

export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 20); // Cambiar el fondo después de 20px de scroll
    };

    // Agregar listener para scroll
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Limpiar listener al desmontar
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { scrollY, isScrolled };
} 