"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import LandingNavbar from "@/Components/LandingNavbar";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { CanvasRevealEffectDemo } from "@/Components/CanvasRevelDemo";
import { Globe } from "@/components/ui/globe";
import FancyTestimonialsSlider from "@/components/ui/testimonal-slider"
import SocialCard from "@/Components/SocialCard"


const LandingPage = () => {
  const router = useRouter();

  const testimonials = [
  {
    img: "https://avatar.vercel.sh/arun",
    quote: "ChatSync is insanely fast — sharing files and messages feels instant.",
    name: "Arun",
    role: "Developer",
  },
  {
    img: "https://avatar.vercel.sh/chandan",
    quote: "The security on ChatSync is unmatched. It feels premium yet effortless.",
    name: "Chandan",
    role: "Designer",
  },
];



  const faqs = [
    { q: "Is ChatSync free to use?", a: "Yes." },
    { q: "Can I send large files?", a: "Yes — uploads are resumable." },
    { q: "Is my data secure?", a: "Absolutely. Fully encrypted." },
  ];

  useEffect(() => {
    axios
      .get("/api/auth/me", { withCredentials: true })
      .then((res) => res.status === 200 && router.push("/dashboard"))
      .catch(() => { });
  }, []);

  return (
    <div className="font-inter min-h-screen bg-black text-white w-full overflow-x-hidden relative">
      {/* animation overflow guard */}
      <div className="fixed left-0 top-0 w-screen overflow-x-hidden pointer-events-none -z-50"></div>
      <div className="relative w-full max-w-[100vw] overflow-x-hidden">

        <LandingNavbar />

        {/* HERO */}
        <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
          <BackgroundBeamsWithCollision className="bg-black">
            <div className="relative z-20 px-6 max-w-4xl mx-auto text-center">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Chat without limits
              </h2>

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

              <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
                A next-gen communication platform designed for unmatched speed and security.
              </p>

              <button
                onClick={() => router.push("/login")}
                className="mt-10 px-8 py-3 text-base sm:text-lg font-semibold rounded-xl
                transition-all duration-300 cursor-pointer bg-black/40 backdrop-blur-md
                border border-fuchsia-500/40 hover:border-fuchsia-500
                shadow-[0_0_12px_rgba(236,72,153,0.25)]
                hover:shadow-[0_0_25px_rgba(236,72,153,0.55)]
                hover:scale-[1.03] active:scale-[0.97]"
              >
                <span className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                  Start Chatting — It’s Free
                </span>
              </button>
            </div>
          </BackgroundBeamsWithCollision>
        </section>

        {/* FEATURES */}
        <div id="features" className="bg-white py-10">
          <span className="pointer-events-none bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-transparent
          text-center font-semibold leading-tight whitespace-pre-wrap
          text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl block w-full mb-10">
            Features
          </span>
          <CanvasRevealEffectDemo />
        </div>

        {/* FAQ */}
        <section id="faq" className="py-28 bg-gradient-to-b from-black to-gray-900 px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-4xl font-extrabold text-center mb-14">Frequently Asked Questions</h3>
            <div className="space-y-6">
              {faqs.map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-black/60 border border-white/10 hover:border-fuchsia-500 transition backdrop-blur">
                  <h4 className="text-lg font-semibold mb-2">{item.q}</h4>
                  <p className="text-gray-300">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="py-28 bg-gradient-to-b from-gray-900 to-black px-6">
          <div className="max-w-6xl mx-auto text-center mb-10">
            <h3 className="text-4xl font-extrabold tracking-tight">What People Are Saying</h3>
          </div>
          <FancyTestimonialsSlider testimonials={testimonials} autorotateTiming={5000} />
        </section>

        {/* GLOBE */}
        <div className="bg-background w-full h-full relative flex size-full items-center justify-center overflow-hidden border px-6 md:px-40 pt-8 pb-40 md:pb-60">
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

        {/* CONTACT DEVELOPER */}
        <section id="contact-developer" className="py-32 bg-gradient-to-b from-black via-gray-900 to-black px-6 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(236,72,153,0.18),transparent_70%)]" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
              Contact Developer
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed mb-16">
              Have feedback, want to collaborate, or found a feature you'd love to see?
              I’d love to hear from you. Reach out anytime.
            </p>

            {/* Social animated card */}
            <div className="flex justify-center mb-16">
              <SocialCard />
            </div>
          </div>
        </section>



        {/* CTA */}
        <section className="py-28 text-center bg-black">
          <div className="max-w-xl mx-auto">
            <h3 className="text-4xl font-extrabold mb-6">Ready to join the future of communication?</h3>
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
          <p>© {new Date().getFullYear()} ChatSync — Designed for the future.</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
