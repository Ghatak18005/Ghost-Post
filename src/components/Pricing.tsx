"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, X, Loader2 } from "lucide-react";
import UPIScanner from "./UPIScanner"; // Ensure this file exists in the same folder

// 1. Define Plan Details
const tiers = [
  {
    key: "TRAVELER", // Matches DB "FREE"
    name: "Traveler",
    price: "₹0",
    desc: "Perfect for testing the waters.",
    features: [
      { text: "3 Active Capsules", included: true },
      { text: "Text-only messages", included: true },
      { text: "Max 1 year into future", included: true },
      { text: "Attach Photos/Videos", included: false },
      { text: "Priority Delivery", included: false },
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    key: "TIME_KEEPER",
    name: "Time Keeper",
    price: "₹199",
    desc: "For those with memories to keep.",
    features: [
      { text: "10 Active Capsules", included: true },
      { text: "Attach Photos (5MB limit)", included: true },
      { text: "Max 10 years into future", included: true },
      { text: "Video Attachments", included: false },
      { text: "Priority Delivery", included: false },
    ],
    cta: "Get Standard",
    popular: true,
  },
  {
    key: "TIME_LORD",
    name: "Time Lord",
    price: "₹499",
    desc: "The ultimate legacy vault.",
    features: [
      { text: "Unlimited Capsules", included: true },
      { text: "4K Video Attachments", included: true },
      { text: "Max 50 years into future", included: true },
      { text: "Digital Will Templates", included: true },
      { text: "Priority Support", included: true },
    ],
    cta: "Go Premium",
    popular: false,
  },
];

export default function Pricing({ currentPlan = "FREE" }: { currentPlan?: string }) {
  const [selectedPlan, setSelectedPlan] = useState<{key: string, amount: number} | null>(null);
  const router = useRouter();

  // Normalize DB plan to match our keys
  const normalizedPlan = currentPlan === "FREE" ? "TRAVELER" : currentPlan;

  // Define numeric prices for the scanner
  const prices = {
    "TIME_KEEPER": 1,
    "TIME_LORD": 499
  };

  const handleCheckout = (tierKey: string) => {
    // If it's the free plan, just go to dashboard
    if (tierKey === "TRAVELER") {
      router.push("/dashboard");
      return;
    }

    // For paid plans, open the Scanner Modal
    setSelectedPlan({
      key: tierKey,
      amount: prices[tierKey as keyof typeof prices]
    });
  };

  return (
    <section className="py-24 bg-white dark:bg-neutral-950 transition-colors duration-300" id="pricing">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
            Choose your Timeline
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            One-time payments. No monthly subscriptions.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => {
            const isCurrent = normalizedPlan === tier.key;
            
            // Logic: Disable if I already have this plan OR a higher one
            const planOrder = ["TRAVELER", "TIME_KEEPER", "TIME_LORD"];
            const myRank = planOrder.indexOf(normalizedPlan);
            const tierRank = planOrder.indexOf(tier.key);
            const isOwnedOrLower = tierRank <= myRank;

            return (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className={`relative p-8 rounded-3xl border transition-all duration-300 flex flex-col
                  ${
                    tier.popular
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/10 shadow-xl shadow-purple-500/10"
                      : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50"
                  }
                `}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl rounded-tr-2xl">
                    MOST POPULAR
                  </div>
                )}

                <h3 className={`text-xl font-bold mb-2 ${tier.popular ? "text-purple-600 dark:text-purple-400" : "text-neutral-900 dark:text-white"}`}>
                  {tier.name}
                </h3>
                <div className="text-4xl font-bold mb-2 text-neutral-900 dark:text-white">
                  {tier.price} <span className="text-sm font-normal text-neutral-500">/ one-time</span>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
                  {tier.desc}
                </p>

                <ul className="space-y-4 mb-8 flex-grow">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex gap-3 items-center">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-neutral-300 dark:text-neutral-700" />
                      )}
                      <span className={`text-sm ${feature.included ? "text-neutral-700 dark:text-neutral-300" : "text-neutral-400 dark:text-neutral-600 line-through"}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCheckout(tier.key)}
                  disabled={isOwnedOrLower && tier.key !== "TRAVELER"} 
                  className={`block w-full py-4 rounded-xl text-center font-bold transition-all flex items-center justify-center
                    ${
                      isCurrent
                        ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 cursor-default"
                        : tier.popular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25"
                        : "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    }
                  `}
                >
                  {isCurrent ? "Current Plan" : tier.cta}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Modal Overlay for Scanner */}
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-sm">
              {/* Close Button */}
              <button 
                onClick={() => setSelectedPlan(null)}
                className="absolute -top-12 right-0 text-white hover:text-neutral-300 font-medium"
              >
                Close ✕
              </button>

              <UPIScanner 
                amount={selectedPlan.amount}
                planKey={selectedPlan.key}
                upiId="aumghodasara15@okhdfcbank" // 👈 🔴 REPLACE THIS WITH YOUR REAL UPI ID
                onSuccess={() => {
                  alert("Upgrade Successful! Welcome to your new timeline.");
                  setSelectedPlan(null);
                  window.location.reload(); // Refresh to update the UI button state
                }}
              />
            </div>
          </div>
        )}

      </div>
    </section>
  );
}