"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-200 font-sans transition-colors duration-300">
      <Navbar />
      
      <main className="max-w-4xl mx-auto pt-32 pb-20 px-6">
        <h1 className="text-4xl font-bold mb-8 text-neutral-900 dark:text-white">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
            Last updated: January 12, 2026
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Welcome to GhostPost. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you as to how we look after your personal data when you visit our website 
              and tell you about your privacy rights.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">2. The Data We Collect</h2>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">
              <li><strong>Identity Data:</strong> includes first name, last name, and profile picture (via Google Auth).</li>
              <li><strong>Contact Data:</strong> includes email address.</li>
              <li><strong>Content Data:</strong> includes the encrypted messages and media you upload for future delivery.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Content</h2>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <strong>Encryption:</strong> All messages (capsules) are encrypted using AES-256 standards before being stored in our database. 
              We do not have the technical ability to decrypt or read your messages. They are only decrypted upon delivery to the recipient.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">4. Data Retention</h2>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We retain your encrypted messages until the scheduled delivery date. Once delivered, you may choose to archive or permanently delete them. 
              If you delete your account, all associated data is permanently removed from our servers immediately.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">5. Contact Us</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              If you have any questions about this privacy policy, please contact us at: <br/>
              <a href="mailto:support@ghostpost.com" className="text-purple-600 hover:underline">support@ghostpost.com</a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}