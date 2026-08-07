import React from "react";
import GlassPanel from "@/components/widgets/GlassPanel";
import AnimatedButton from "@/components/widgets/AnimatedButton";
import { Search, MapPin, Star, Filter } from "lucide-react";

const doctors = [
  { name: "Dr. Priya Sharma", spec: "Cardiologist", rating: 4.9, reviews: 124, location: "Bangalore", exp: "15 Years" },
  { name: "Dr. Rajesh Kumar", spec: "Dermatologist", rating: 4.8, reviews: 98, location: "Mumbai", exp: "12 Years" },
  { name: "Dr. Anitha Reddy", spec: "Pediatrician", rating: 5.0, reviews: 210, location: "Hyderabad", exp: "20 Years" },
  { name: "Dr. Suresh Patel", spec: "Orthopedic", rating: 4.7, reviews: 85, location: "Delhi", exp: "10 Years" },
  { name: "Dr. Vikram Singh", spec: "Neurologist", rating: 4.9, reviews: 156, location: "Pune", exp: "18 Years" },
  { name: "Dr. Meera Iyer", spec: "Gynecologist", rating: 4.8, reviews: 112, location: "Chennai", exp: "14 Years" },
];

export default function FindDoctors() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:flex gap-8">
      {/* Sidebar Filter */}
      <aside className="w-full md:w-1/4 mb-8 md:mb-0">
        <GlassPanel className="sticky top-28">
          <div className="flex items-center gap-2 mb-6 text-white font-bold text-lg">
            <Filter className="w-5 h-5 text-cyan" /> Filters
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-400 block mb-2 font-medium">Search Doctor</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Name or Specialty..." 
                  className="w-full bg-navy-dark border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-cyan"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-2 font-medium">Specialty</label>
              <select className="w-full bg-navy-dark border border-white/10 rounded-xl py-2 px-3 text-sm text-gray-300 focus:outline-none focus:border-cyan appearance-none">
                <option>All Specialties</option>
                <option>Cardiologist</option>
                <option>Dermatologist</option>
                <option>Pediatrician</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-2 font-medium">Location</label>
              <select className="w-full bg-navy-dark border border-white/10 rounded-xl py-2 px-3 text-sm text-gray-300 focus:outline-none focus:border-cyan appearance-none">
                <option>Any Location</option>
                <option>Bangalore</option>
                <option>Mumbai</option>
                <option>Delhi</option>
              </select>
            </div>

            <button className="w-full py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors">
              Reset Filters
            </button>
          </div>
        </GlassPanel>
      </aside>

      {/* Doctor Grid */}
      <main className="w-full md:w-3/4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Find a Specialist</h1>
            <p className="text-gray-400 text-sm">Showing {doctors.length} available doctors</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {doctors.map((doc, idx) => (
            <GlassPanel key={idx} className="flex flex-col h-full hover:border-cyan/50 transition-colors duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-electric to-cyan flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  {doc.name.split(" ")[1][0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{doc.name}</h3>
                  <p className="text-cyan text-sm font-medium">{doc.spec}</p>
                  <div className="flex items-center gap-1 mt-1 text-sm text-gray-400">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-semibold">{doc.rating}</span>
                    <span>({doc.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6 mt-auto border-t border-white/10 pt-4">
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm text-gray-300 flex items-center gap-1"><MapPin className="w-3 h-3 text-cyan" /> {doc.location}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Experience</p>
                  <p className="text-sm text-gray-300">{doc.exp}</p>
                </div>
              </div>
              
              <AnimatedButton className="w-full !py-2.5 text-sm">
                Book Consultation
              </AnimatedButton>
            </GlassPanel>
          ))}
        </div>
      </main>
    </div>
  );
}
