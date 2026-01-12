"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-200 font-sans transition-colors duration-300">
      <Navbar />
      
      <main className="max-w-4xl mx-auto pt-32 pb-20 px-6">
        <h1 className="text-4xl font-bold mb-8 text-neutral-900 dark:text-white">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
            Effective Date: January 12, 2026
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              By accessing and using GhostPost ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
              In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              GhostPost provides a digital time capsule service that allows users to schedule messages ("Capsules") to be delivered via email 
              at a future date specified by the user.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">3. User Conduct</h2>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>Upload or transmit any content that is unlawful, harmful, threatening, abusive, or defamatory.</li>
              <li>Transmit any material that contains software viruses or any other computer code designed to interrupt or destroy software or hardware.</li>
              <li>Use the service for any illegal purposes or in violation of any local, state, national, or international law.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">4. Disclaimer of Warranties</h2>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. GhostPost makes no representations or warranties of any kind, 
              express or implied, as to the operation of their services, or the information, content, or materials included therein.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              GhostPost shall not be liable for any damages of any kind arising from the use of this service, including, but not limited to 
              direct, indirect, incidental, punitive, and consequential damages.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}