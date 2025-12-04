"use client";

import React, { useEffect } from "react";
import { MessageSquare, Upload, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import LandingNavbar from "@/Components/LandingNavbar";
import { Globe } from "@/components/ui/globe";
import { CanvasRevealEffectDemo } from "@/Components/CanvasRevelDemo";

const LandingPage = () => {
  const router = useRouter();


  const faqs = [
    { q: "Is ChatSync free to use?", a: "Yes." },
    {
      q: "Can I send large files?",
      a: "Yes — file uploads are resumable and optimized for reliability.",
    },
    {
      q: "Is my data secure?",
      a: "Absolutely. All communications are secured with end-to-end encryption.",
    },
  ];

  useEffect(() => {
    axios
      .get("/api/auth/me", { withCredentials: true })
      .then((res) => res.status === 200 && router.push("/dashboard"))
      .catch(() => { });
  }, []);

  return (
    <div className="font-inter min-h-screen bg-black text-white">
      {/* Header */}
      <LandingNavbar />


      {/* HERO */}
      {/* HERO */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <BackgroundBeamsWithCollision className="bg-black">
          <div className="relative z-20 px-6 max-w-4xl mx-auto text-center">

            {/* MAIN HEADLINE */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Chat without limits
            </h2>

            {/* SUBTITLE (FLIP TEXT) */}
            <div className="mt-4 text-xl sm:text-2xl md:text-3xl font-semibold text-white/90">
              <ContainerTextFlip
                words={[
                  "Send anything Lose nothing",
                  "Share Anything Anytime Instantly",
                  "Fast like lightning Safe like a vault",
                  "Built for privacy Built for speed",
                ]}
                className="mx-auto"
              />
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
              A next-gen communication platform designed for unmatched speed,
              security and seamless file sharing — built for people who don’t want limits.
            </p>

            {/* CTA BUTTON */}
            <button
              onClick={() => router.push("/login")}
              className="
          mt-10 px-8 py-3 text-base cursor-pointer sm:text-lg font-semibold rounded-xl
          transition-all duration-300
          bg-black/40 backdrop-blur-md
          border border-fuchsia-500/40
          hover:border-fuchsia-500
          shadow-[0_0_12px_rgba(236,72,153,0.25)]
          hover:shadow-[0_0_25px_rgba(236,72,153,0.55)]
          hover:scale-[1.03] active:scale-[0.97]
        "
            >
              <span className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                Start Chatting — It’s Free
              </span>
            </button>

          </div>
        </BackgroundBeamsWithCollision>
      </section>



      <hr className="border border-pink-500/25" />
      {/* FEATURES */}
     
     <CanvasRevealEffectDemo/>


      {/* FAQ */}
      <section
        id="faq"
        className="py-28 bg-gradient-to-b from-black to-gray-900 px-6"
      >
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl font-extrabold text-center mb-14 tracking-tight">
            Frequently Asked Questions
          </h3>

          <div className="space-y-6">
            {faqs.map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-black/60 border border-white/10 hover:border-fuchsia-500 transition backdrop-blur"
              >
                <h4 className="text-lg font-semibold mb-2">{item.q}</h4>
                <p className="text-gray-300">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-background w-full h-full relative flex size-full items-center justify-center overflow-hidden border px-40 pt-8 pb-40 md:pb-60">
        <span
          className="
    pointer-events-none
    bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-transparent
    dark:from-white dark:to-slate-900/10
    text-center font-semibold leading-tight
    whitespace-pre-wrap

    text-3xl    /* 📱 mobile */
    sm:text-4xl /* ⬆ small tablets */
    md:text-6xl /* ⬆ tablets */
    lg:text-7xl /* ⬆ laptops */
    xl:text-8xl /* ⬆ large desktops */
  "
        >
          Globally connected, privately protected
        </span>

        <Globe className="top-39" />
        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
      </div>

      {/* CTA */}
      <section className="py-28 text-center bg-black">
        <div className="max-w-xl mx-auto">
          <h3 className="text-4xl font-extrabold mb-6 tracking-tight">
            Ready to join the future of communication?
          </h3>
          <p className="text-lg text-gray-300 mb-10">
            Create your free account and start chatting securely today.
          </p>

          <button
            onClick={() => router.push("/login")}
            className="px-12 py-4 text-lg font-semibold rounded-xl transition-all
              bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500
              text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]
              hover:shadow-[0_0_40px_rgba(236,72,153,0.8)]
              hover:scale-[1.04] active:scale-[0.98] duration-300"
          >
            Get Started — It’s Free
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-white/10 py-12 px-6 text-center text-gray-400">
        <p>
          © {new Date().getFullYear()} ChatSync — Designed for the future.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
