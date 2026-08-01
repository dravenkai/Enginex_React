"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  BadgeCheck,
  Camera,
  Info,
  Lock,
  Clock,
  UploadCloud,
  X,
  Check,
  CheckSquare,
  ShieldCheck,
} from "lucide-react";

type Step = 1 | 2 | 3;

const steps: { id: Step; label: string }[] = [
  { id: 1, label: "Identity Info" },
  { id: 2, label: "Document Upload" },
  { id: 3, label: "Selfie Check" },
];

function stepColor(step: Step, current: Step) {
  if (step < current) return "bg-[#86efac]";
  if (step === current) return "bg-[#93c5fd]";
  return "bg-white";
}

function stepTextColor(step: Step, current: Step) {
  return step > current ? "text-gray-400" : "text-black";
}

export default function VerifyIdentityPage() {
  const [step, setStep] = useState<Step>(1);
  const [captured, setCaptured] = useState(false);

  return (
    <main className="min-h-screen bg-white px-6 py-10 sm:px-10 lg:px-16 font-mono text-zinc-900">
      <div className="max-w-[1700px] mx-auto">
        <span className="inline-block bg-[#f4a261] border-2 border-black px-3 py-1 text-xs font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          ACCOUNT CREATED
        </span>

        <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black">
          Welcome to{" "}
          <span className="inline-block bg-[#93c5fd] border-2 border-black px-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Enginex
          </span>
        </h1>
        <h2 className="mt-2 text-2xl sm:text-3xl font-bold">Identity Verification</h2>

        <div className="relative mt-12 mb-10">
          <div className="absolute left-0 right-0 top-[26px] h-[3px] bg-black -z-0" />
          <div className="relative z-10 flex items-stretch justify-between gap-6">
            {steps.map((item) => (
              <div
                key={item.id}
                className={`flex-1 border-2 border-black ${stepColor(item.id, step)} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
              >
                <div className="flex items-center justify-center py-3 border-b-2 border-black">
                  <span className="w-7 h-7 rounded-full bg-black text-white grid place-items-center text-xs font-bold">
                    {String(item.id).padStart(2, "0")}
                  </span>
                </div>
                <div className={`text-center py-2 text-xs font-bold uppercase tracking-wide ${stepTextColor(item.id, step)}`}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[3fr_2fr] gap-8 items-start">
          <div className="border-2 border-black bg-[#f7f6f2] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {step === 1 && (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <BadgeCheck className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-bold">Step 01: Core Identity Data</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold mb-2" htmlFor="nrcName">
                      NRC Name
                    </label>
                    <input
                      id="nrcName"
                      className="w-full h-12 border-2 border-black bg-white px-3 text-sm outline-none focus:bg-blue-50"
                      placeholder="Enter your NRC Name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2" htmlFor="nrcNumber">
                      NRC Number / National ID
                    </label>
                    <input
                      id="nrcNumber"
                      className="w-full h-12 border-2 border-black bg-white px-3 text-sm outline-none focus:bg-blue-50"
                      placeholder="00-000000-A-00"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 border-2 border-black bg-[#7ba2f2] hover:bg-[#6994ed] px-5 py-3 text-xs font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                  >
                    Next Stage <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="text-2xl font-bold">Identity Verification</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Please upload high-resolution photos of your National Registration Card (NRC).
                </p>

                <div className="grid sm:grid-cols-2 gap-6 mt-6">
                  {["NRC Front", "NRC Back"].map((label) => (
                    <div key={label}>
                      <label className="block text-xs font-bold mb-2 uppercase">{label}</label>
                      <div className="grid place-items-center border-2 border-dashed border-black bg-white py-14 text-center cursor-pointer hover:bg-blue-50 transition-colors">
                        <UploadCloud className="w-6 h-6" />
                        <p className="mt-3 text-xs font-bold">Click to upload {label.split(" ")[1]}</p>
                        <p className="text-[11px] text-gray-500">PDF, JPG, or PNG (Max 5MB)</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2 border-2 border-black bg-[#fef08a] px-4 py-3 text-xs font-bold">
                  <Info className="w-4 h-4 shrink-0" />
                  Ensure all details are legible and the document is not expired.
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 border-2 border-black bg-white px-5 py-3 text-xs font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Previous
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 border-2 border-black bg-[#7ba2f2] hover:bg-[#6994ed] px-5 py-3 text-xs font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                  >
                    Next Stage <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h3 className="text-xl font-bold">Biometric Verification</h3>
                <p className="mt-2 text-sm text-gray-600 max-w-md">
                  Position your face within the frame and ensure good lighting for optimal recognition.
                </p>

                <div className="relative mt-6 border-2 border-black bg-gray-400 overflow-hidden aspect-[16/9] max-w-xl">
                  <Image
                    src="/profile.avif"
                    alt="Captured selfie preview"
                    fill
                    className={`object-cover transition-all ${captured ? "grayscale" : ""}`}
                  />
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="w-1/2 h-3/4 border-2 border-black rounded-full border-dashed" />
                  </div>
                  {["top-3 left-3", "top-3 right-3 scale-x-[-1]", "bottom-3 left-3 scale-y-[-1]", "bottom-3 right-3 scale-[-1]"].map(
                    (pos) => (
                      <svg
                        key={pos}
                        viewBox="0 0 24 24"
                        className={`absolute w-6 h-6 text-blue-600 ${pos}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path d="M2 8V2h6" />
                      </svg>
                    )
                  )}
                </div>

                <button
                  onClick={() => setCaptured(true)}
                  className="mt-5 flex items-center gap-2 border-2 border-black bg-[#fef08a] hover:bg-[#f5e35a] px-5 py-3 text-xs font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                >
                  <Camera className="w-4 h-4" /> {captured ? "Capture Again" : "Capture Photo"}
                </button>
              </>
            )}
          </div>

          {step === 1 && (
            <div className="grid gap-6">
              <div className="border-2 border-black bg-gray-100 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Lock className="w-4 h-4" /> Encryption Protocol
                </div>
                <p className="mt-2 text-xs text-gray-600 leading-5">
                  All data is AES-256 encrypted and compliant with global ISO/IEC 27001 engineering security standards.
                </p>
              </div>
              <div className="border-2 border-black bg-gray-100 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Clock className="w-4 h-4" /> Processing Estimate
                </div>
                <p className="mt-2 text-xs text-gray-600 leading-5">
                  Manual verification queue: 4-6 hours. Automated hashing: 15 minutes post-submission.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6">
              <div>
                <h4 className="font-bold text-sm border-b-2 border-black pb-2">Upload Standards</h4>
                <ul className="mt-3 space-y-2 text-xs text-gray-700">
                  <li className="flex items-center gap-2">
                    <X className="w-4 h-4 text-red-500 shrink-0" /> No glare or reflections on text
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="w-4 h-4 text-red-500 shrink-0" /> No cropped edges or corners
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" /> Color images only (No B&amp;W)
                  </li>
                </ul>
              </div>
              <div className="border-2 border-black bg-[#fbd9c8] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="font-bold text-sm">Need Help?</h4>
                <p className="mt-2 text-xs text-gray-700 leading-5">
                  Our support engineering team is available 24/7 to assist with verification issues.
                </p>
                <button className="mt-3 text-xs font-bold underline">Contact Support Cluster</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-6">
              <div className="border-2 border-black bg-gray-100 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Info className="w-4 h-4 text-orange-500" /> Checklist
                </div>
                <ul className="mt-3 space-y-2 text-xs text-gray-700">
                  {[
                    "Remove glasses or hats for clear visibility.",
                    "Face the camera directly (no side profiles).",
                    "Avoid busy backgrounds or direct sunlight.",
                    "Ensure your full face is within the guide.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckSquare className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-2 border-black bg-[#fbd9c8] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-xs font-bold">SYSTEM NOTE:</p>
                <p className="mt-1 text-xs text-gray-700 leading-5">
                  Verification is handled via localized AI processing. Images are encrypted end-to-end.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center justify-center gap-2 border-2 border-black bg-white px-4 py-3 text-xs font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous
                </button>
                <button
                  disabled={!captured}
                  className={`flex items-center justify-center gap-2 border-2 border-black px-4 py-3 text-xs font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                    captured
                      ? "bg-[#86efac] hover:bg-[#6ee7a3] active:translate-x-1 active:translate-y-1 active:shadow-none"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Complete Verification <ShieldCheck className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
