"use client"
import React from 'react';
import { MessageSquare, Upload, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

const App = () => {
  const router = useRouter()
  const features = [
    { icon: <MessageSquare className="w-8 h-8 text-indigo-600" />, title: 'Real-Time Chat', desc: 'Instant messaging with zero delay, perfect for team or individual use.' },
    { icon: <Upload className="w-8 h-8 text-indigo-600" />, title: 'Fast File Transfers', desc: 'Send large files instantly — supports up to 5GB uploads.' },
    { icon: <Lock className="w-8 h-8 text-indigo-600" />, title: 'End-to-End Encryption', desc: 'Secure conversations and file sharing with full E2E encryption.' }
  ];

  const faqs = [
    { q: 'Is ChatWave free to use?', a: 'Yes, our basic plan is free and includes all major features.' },
    { q: 'Can I send large files?', a: 'Yes! Up to 5GB per file on our free plan.' },
    { q: 'Is my data secure?', a: 'Absolutely — we use modern encryption protocols end-to-end.' }
  ];

  return (
    <div className="font-inter text-gray-800 bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">ChatWave</h1>
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <a href="#features" className="hover:text-indigo-600 transition">Features</a>
            <a href="#faq" className="hover:text-indigo-600 transition">FAQ</a>
            <a href="#cta" className="hover:text-indigo-600 transition">Get Started</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-indigo-600 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Real-Time Chat & Secure File Sharing</h2>
          <p className="text-lg sm:text-xl mb-8">Lightning-fast messaging and encrypted file transfers — all in one sleek platform.</p>
          <a onClick={() => router.push("/login")} className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-md font-semibold cursor-pointer hover:bg-gray-100 transition">
            Try ChatWave Free
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-12">What Makes ChatWave Great</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 text-left">
            {features.map((f, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-xl border hover:shadow transition">
                <div className="mb-4">{f.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{f.title}</h4>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-gray-100 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">FAQs</h3>
          <div className="space-y-6">
            {faqs.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-lg font-semibold mb-2">{item.q}</h4>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="bg-indigo-600 text-white py-20 text-center px-6">
        <div className="max-w-xl mx-auto">
          <h3 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start?</h3>
          <p className="text-lg mb-6">Create your free account and start chatting securely now.</p>
          <a onClick={() => router.push("/login")} className="bg-white text-indigo-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 cursor-pointer transition">
            Get Started for Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-10 px-6 text-sm text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} ChatWave. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
