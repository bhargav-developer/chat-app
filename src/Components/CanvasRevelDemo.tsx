"use client";
import React from "react";

import { AnimatePresence, motion } from "motion/react";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { MessageSquare, Upload, Lock } from "lucide-react"; // <-- your app icons

export function CanvasRevealEffectDemo() {
  return (
    <>
      <div className="py-10 flex flex-col lg:flex-row items-center justify-center bg-white dark:bg-black w-full gap-4 mx-auto px-8">
        
        {/* CARD 1 - Chat */}
        <Card title="Real-Time Chat" icon={<MessageSquare className="w-12 h-12 text-fuchsia-400" />}>
          <CanvasRevealEffect animationSpeed={5.1} containerClassName="bg-black" colors={[[236,72,153],[232,121,249]]} />
          <HoverText text="Ultra-fast messaging with zero delay" />
        </Card>

        {/* CARD 2 - File Transfer */}
        <Card title="Fast File Transfers" icon={<Upload className="w-12 h-12 text-blue-400" />}>
          <CanvasRevealEffect animationSpeed={3} containerClassName="bg-black" colors={[[59,130,246],[147,197,253]]} />
          <HoverText text="Send files up to 5GB safely & instantly" />
        </Card>

        {/* CARD 3 - Encryption */}
        <Card title="End-to-End Encryption" icon={<Lock className="w-12 h-12 text-emerald-400" />}>
          <CanvasRevealEffect animationSpeed={3} containerClassName="bg-black" colors={[[16,185,129],[52,211,153]]} />
          <HoverText text="Your privacy is protected — always encrypted" />
        </Card>
      </div>
    </>
  );
}

const HoverText = ({ text }: { text: string }) => (
  <p className="absolute bottom-6 left-0 right-0 text-center text-white/90 text-lg font-medium opacity-0 group-hover/canvas-card:opacity-100 transition duration-300 z-20">
    {text}
  </p>
);

const Card = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2] max-w-sm w-full mx-auto p-4 relative h-[30rem]"
    >
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

      <AnimatePresence>
        {hovered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full w-full absolute inset-0">
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20">
        <div className="text-center group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200 w-full mx-auto flex items-center justify-center">
          {icon}
        </div>
        <h2 className="dark:text-white text-xl opacity-0 group-hover/canvas-card:opacity-100 relative z-10 text-black mt-4 font-bold group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200">
          {title}
        </h2>
      </div>
    </div>
  );
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className} {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
