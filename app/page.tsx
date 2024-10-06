"use client";
import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Navbar from "@/components/Navbar";

export default function Home() {

  const [zoom, setZoom] = useState(false);
  const controls = useAnimation();

  const triggerZoom = () => {
    setZoom(true);
    setTimeout(() => {
      setZoom(false);
    }, 500);
  };

  useEffect(() => {
    if (zoom) {
      controls.start({ scale: 1.1 });
    } else {
      controls.start({ scale: 1 });
    }
  }, [zoom, controls]);

  useEffect(() => {
    const timer = setTimeout(() => {
      controls.start({ opacity: 1, y: 0 });
    }, 3000);
    return () => clearTimeout(timer);
  }, [controls]);

  return (
    <main className="relative w-full h-screen overflow-hidden text-xs md:text-sm lg:text-base">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 object-cover w-full h-full"
      >
        <source src="ship.mp4" type="video/mp4" />
        <p>Your browser does not support the video tag.</p>
      </video>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center py-4 px-20 text-white bg-black bg-opacity-25"
      >
        <p>
          As Pera Marin Electric, which has adopted the principle of perfectionism since the day it was founded and continues its work on the basis of 'Absolute Customer Satisfaction', we offer organized, proactive, trouble-free and high-quality Ship Electricity service. As an experienced and well-equipped Ship Electricity Company, we not only prevent potential problems, but also provide a comfortable operation by facilitating transactions.
        </p>
      </motion.div>

      <Navbar triggerZoom={triggerZoom} />
    </main>
  );
}
