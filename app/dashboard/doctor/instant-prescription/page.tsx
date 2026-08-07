"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { GlassPanel } from "@/components/widgets/GlassPanel";
import { AnimatedButton } from "@/components/widgets/AnimatedButton";
import { Search, Plus, Trash2, CheckCircle, FileText, Loader2 } from "lucide-react";
import { BASIC_MEDICATIONS, BasicMedication } from "@/lib/constants/medications";

export default function InstantPrescriptionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const [diagnosis, setDiagnosis] = useState("");
  const [instructions, setInstructions] = useState("");
  const [medications, setMedications] = useState<{name: string, dosage: string, frequency: string, duration: string, instructions: string}[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<any>(null);

  // Group basic medications by category
  const groupedMeds = BASIC_MEDICATIONS.reduce((acc, med) => {
    if (!acc[med.category]) acc[med.category] = [];
    acc[med.category].push(med);
    return acc;
  }, {} as Record<string, BasicMedication[]>);

  // Search patients
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 3) {
        setIsSearching(true);
        fetch(`/api/doctor/patients/search?q=${searchQuery}`)
          .then(res => res.json())
          .then(data => {
            setPatients(Array.isArray(data) ? data : []);
            setIsSearching(false);
          })
          .catch(() => setIsSearching(false));
      } else {
        setPatients([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const addBasicMedication = (med: BasicMedication) => {
    setMedications([...medications, {
      name: med.name,
      dosage: med.defaultDosage,
      frequency: med.defaultFrequency,
      duration: med.defaultDuration,
      instructions: med.instructions
    }]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const addCustomMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "", instructions: "" }]);
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const newMeds = [...medications];
    newMeds[index] = { ...newMeds[index], [field]: value };
    setMedications(newMeds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !diagnosis || medications.length === 0) {
      alert("Please select a patient, enter a diagnosis, and add at least one medication.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/doctor/instant-prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          diagnosis,
          instructions,
          medications
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessResult(data.prescription);
      } else {
        alert(data.message || "Failed to create prescription");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successResult) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <GlassPanel className="max-w-md w-full text-center p-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Prescription Issued!</h2>
            <p className="text-gray-400 mb-8">The instant prescription has been successfully generated and saved.</p>
            
            <div className="flex gap-4 w-full">
              {successResult.pdfUrl && (
                <a href={successResult.pdfUrl} target="_blank" rel="noreferrer" className="flex-1">
                  <AnimatedButton variant="primary" className="w-full gap-2">
                    <FileText className="w-4 h-4" /> View PDF
                  </AnimatedButton>
                </a>
              )}
              <AnimatedButton variant="outline" className="flex-1" onClick={() => {
                setSuccessResult(null);
                setSelectedPatient(null);
                setSearchQuery("");
                setDiagnosis("");
                setInstructions("");
                setMedications([]);
              }}>
                Issue Another
              </AnimatedButton>
            </div>
          </GlassPanel>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-12">
        <h1 className="text-3xl font-black text-white tracking-tight mb-8">Instant Prescription</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Patient Selection */}
            <GlassPanel>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-cyan-500" /> 1. Select Patient
              </h3>
              
              {!selectedPatient ? (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or email (min 3 chars)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                  {isSearching && <Loader2 className="absolute right-4 top-3.5 w-5 h-5 text-cyan-500 animate-spin" />}
                  
                  {patients.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-gray-900 border border-white/10 rounded-xl overflow-hidden z-10 max-h-60 overflow-y-auto shadow-2xl">
                      {patients.map(p => (
                        <div 
                          key={p.id}
                          onClick={() => setSelectedPatient(p)}
                          className="p-4 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 flex justify-between items-center"
                        >
                          <div>
                            <p className="font-bold text-white">{p.fullName}</p>
                            <p className="text-sm text-gray-400">{p.email}</p>
                          </div>
                          <AnimatedButton size="sm" variant="outline">Select</AnimatedButton>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-white/5 border border-cyan-500/30 rounded-xl">
                  <div>
                    <p className="font-bold text-white text-lg">{selectedPatient.fullName}</p>
                    <p className="text-sm text-gray-400">{selectedPatient.email}</p>
                  </div>
                  <button type="button" onClick={() => setSelectedPatient(null)} className="text-red-400 text-sm hover:underline">Change</button>
                </div>
              )}
            </GlassPanel>

            {/* Diagnosis */}
            <GlassPanel>
              <h3 className="text-lg font-bold text-white mb-4">2. Diagnosis</h3>
              <input
                type="text"
                required
                placeholder="e.g. Viral Fever, Acid Reflux, General Checkup"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50"
              />
            </GlassPanel>

            {/* Selected Medications */}
            <GlassPanel>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">3. Prescribed Medications</h3>
                <AnimatedButton type="button" size="sm" variant="outline" onClick={addCustomMedication} className="gap-1">
                  <Plus className="w-4 h-4" /> Add Custom
                </AnimatedButton>
              </div>

              {medications.length === 0 ? (
                <div className="text-center p-8 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                  <p className="text-gray-400">No medications added yet.</p>
                  <p className="text-sm text-gray-500 mt-1">Select from basic medications on the right or add custom ones.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {medications.map((med, idx) => (
                    <div key={idx} className="p-4 border border-white/10 bg-white/5 rounded-xl space-y-4 relative group">
                      <button type="button" onClick={() => removeMedication(idx)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Medicine Name</label>
                          <input required type="text" value={med.name} onChange={(e) => updateMedication(idx, 'name', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500/50 outline-none" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Dosage</label>
                          <input required type="text" value={med.dosage} onChange={(e) => updateMedication(idx, 'dosage', e.target.value)} placeholder="e.g. 1 Tablet" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500/50 outline-none" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Frequency</label>
                          <input required type="text" value={med.frequency} onChange={(e) => updateMedication(idx, 'frequency', e.target.value)} placeholder="e.g. Twice a day" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500/50 outline-none" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Duration</label>
                          <input required type="text" value={med.duration} onChange={(e) => updateMedication(idx, 'duration', e.target.value)} placeholder="e.g. 5 Days" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500/50 outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Instructions</label>
                        <input type="text" value={med.instructions} onChange={(e) => updateMedication(idx, 'instructions', e.target.value)} placeholder="e.g. Take after food" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500/50 outline-none" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8">
                <label className="text-sm font-bold text-white mb-2 block">General Instructions / Notes</label>
                <textarea
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Any additional advice for the patient..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 resize-none"
                />
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                <AnimatedButton 
                  type="submit" 
                  disabled={isSubmitting || !selectedPatient || !diagnosis || medications.length === 0} 
                  variant="primary"
                  className="px-8"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Prescription"}
                </AnimatedButton>
              </div>

            </GlassPanel>

          </div>

          {/* Sidebar: Basic Medications */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <GlassPanel className="max-h-[calc(100vh-120px)] overflow-y-auto">
                <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">Basic Medications</h3>
                
                <div className="space-y-6">
                  {Object.entries(groupedMeds).map(([category, meds]) => (
                    <div key={category}>
                      <h4 className="text-cyan-400 font-bold text-sm uppercase tracking-wider mb-3">{category}</h4>
                      <div className="space-y-2">
                        {meds.map(med => (
                          <div 
                            key={med.id} 
                            onClick={() => addBasicMedication(med)}
                            className="p-3 bg-white/5 border border-white/5 hover:border-cyan-500/30 rounded-lg cursor-pointer group transition-all"
                          >
                            <div className="flex justify-between items-start">
                              <p className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">{med.name}</p>
                              <Plus className="w-4 h-4 text-gray-500 group-hover:text-cyan-400" />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1 truncate">{med.defaultDosage} | {med.defaultFrequency}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </div>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
}
