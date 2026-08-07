import React from "react";
import Link from "next/link";
import { Activity, Mail, Phone, MapPin } from "lucide-react";
import AnimatedButton from "./widgets/AnimatedButton";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-dark pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="text-cyan w-6 h-6" />
              <span className="text-xl font-bold text-white">MediConnect</span>
            </div>
            <p className="text-sm text-gray-400">
              Transforming healthcare accessibility across India with state-of-the-art telemedicine technology.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/find-doctors" className="hover:text-cyan transition-colors">Find a Doctor</Link></li>
              <li><Link href="/features" className="hover:text-cyan transition-colors">Features</Link></li>
              <li><Link href="/how-it-works" className="hover:text-cyan transition-colors">How it Works</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-cyan" /> 1800-123-4567</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-cyan" /> support@mediconnect.in</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan" /> Tech Park, Bangalore</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">Stay updated with our latest health tips.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter email" 
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cyan w-full"
              />
              <AnimatedButton className="!px-4 !py-2">Join</AnimatedButton>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>© 2026 MediConnect. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
