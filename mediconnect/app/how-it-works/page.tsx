"use client";

import React, { useState } from "react";
import GlassPanel from "../../components/widgets/GlassPanel";
import AnimatedButton from "../../components/widgets/AnimatedButton";
import {
  UserPlus,
  Search,
  Video,
  FileCheck,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: UserPlus,
    title: "Create Account",
    desc: "Sign up in seconds and fill your basic health profile.",
  },
  {
    icon: Search,
    title: "Find Doctor or Ask AI",
    desc: "Browse top specialists or let our AI triage guide you.",
  },
  {
    icon: Video,
    title: "Video Consultation",
    desc: "Connect instantly via high-definition secure video.",
  },
  {
    icon: FileCheck,
    title: "Get Prescription",
    desc: "Receive your digital prescription and follow-up plan.",
  },
];

const faqs = [
  {
    q: "Is the video consultation secure?",
    a: "Yes, all our video consultations use end-to-end WebRTC encryption ensuring complete privacy.",
  },
  {
    q: "Can I use the prescription anywhere?",
    a: "Absolutely. Our digitally signed PDF prescriptions are valid across all registered pharmacies in India.",
  },
  {
    q: "What if the call drops?",
    a: "You have a 15-minute window to reconnect without any additional charges.",
  },
];

export default function HowItWorks() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen py-20">
      {/* Header */}
      <section className="px-4 max-w-4xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
          Simple. Fast.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric to-cyan">
            Effective.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          Get the medical attention you need in four easy steps without leaving
          your home.
        </p>
      </section>

      {/* Horizontal Timeline */}
      <section className="px-4 max-w-7xl mx-auto mb-32 relative">
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 z-0" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-navy-dark border-2 border-cyan flex items-center justify-center text-cyan mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                  <Icon className="w-10 h-10" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Step {idx + 1}: {step.title}
                </h3>

                <p className="text-sm text-gray-400">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="px-4 max-w-3xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-white mb-10 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <GlassPanel
              key={idx}
              className="!p-0 overflow-hidden cursor-pointer"
            >
              <div
                className="p-6 flex justify-between items-center"
                onClick={() =>
                  setOpenFaq(openFaq === idx ? null : idx)
                }
              >
                <h4 className="text-lg font-semibold text-white">
                  {faq.q}
                </h4>

                <ChevronDown
                  className={`w-5 h-5 text-cyan transition-transform ${openFaq === idx ? "rotate-180" : ""
                    }`}
                />
              </div>

              <div
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx
                  ? "max-h-40 pb-6 opacity-100"
                  : "max-h-0 opacity-0"
                  }`}
              >
                <p className="text-gray-400">{faq.a}</p>
              </div>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center px-4 pb-20">
        <Link href="/find-doctors">
          <AnimatedButton className="text-lg px-10 py-4">
            Start Your First Consultation
          </AnimatedButton>
        </Link>
      </div>
    </div>
  );
}