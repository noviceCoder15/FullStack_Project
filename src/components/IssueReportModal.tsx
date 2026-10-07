import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  MapPin, 
  Camera, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  Loader2, 
  Clock, 
  DollarSign, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useCivic } from '../context/CivicContext.js';
import { CivicMap } from './CivicMap.js';
import { DepartmentCategory, SeverityLevel, AIClassificationResult } from '../types/civic.js';
import { DEFAULT_IMAGES, handleImageError } from '../utils/imageUtils.js';

const CIVIC_PRESETS = [
  {
    title: 'Severe Asphalt Pothole on 7th Ave & Elm',
    desc: 'Deep wheel-bending crater in the center lane. Vehicle hubcaps have shattered and braking cars are swerving into oncoming traffic.',
    category: 'Roads & Potholes' as DepartmentCategory,
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    lat: 37.7812,
    lng: -122.4110,
    address: '450 7th Ave & Elm St'
  },
  {
    title: 'Gushing Water Main Valve Rupture',
    desc: 'Municipal pipe valve fractured under pressure. Water is flooding the pedestrian pathway and entering storefront basements rapidly.',
    category: 'Water & Sanitation' as DepartmentCategory,
    image: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    lat: 37.7749,
    lng: -122.4194,
    address: '1120 Van Ness Ave'
  },
  {
    title: 'Exposed Live Wire on Damaged Streetlight',
    desc: 'Damaged electrical junction box at pedestrian crossing with hanging uninsulated copper cables. Sparks noted during evening dampness.',
    category: 'Electricity & Lighting' as DepartmentCategory,
    image: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=800&q=80',
    lat: 37.7650,
    lng: -122.4310,
    address: 'Mission St & 19th Ave'
  },
  {
    title: 'Illegal Hazardous Chemical & Commercial Waste Pile',
    desc: 'Multiple punctured drums and paint solvent containers abandoned on alley sidewalk behind supermarket. Chemical odor spreading.',
    category: 'Garbage & Waste' as DepartmentCategory,
    image: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
    lat: 37.8012,
    lng: -122.3988,
    address: 'Pier 28 Alleyway'
  }
];

export const IssueReportModal: React.FC = () => {
  const { 
    isReportModalOpen, 
    setIsReportModalOpen, 
    submitIssue, 
    classifyWithAI, 
    findPotentialDuplicate, 
    setSelectedIssue 
  } = useCivic();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
  ]);
  const [department, setDepartment] = useState<DepartmentCategory>('Roads & Potholes');
  const [severity, setSeverity] = useState<SeverityLevel>('Medium');
  const [location, setLocation] = useState({
    lat: 37.7790,
    lng: -122.4150,
    address: 'Civic Center Boulevard & Grove St',
    district: 'Downtown Central'
  });

  const [aiAnalysis, setAiAnalysis] = useState<AIClassificationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'details' | 'ai_review'>('details');

  const detectedDuplicate = findPotentialDuplicate(title, location);

  if (!isReportModalOpen) return null;

  const handleSelectPreset = (preset: typeof CIVIC_PRESETS[0]) => {
    setTitle(preset.title);
    setDescription(preset.desc);
    setDepartment(preset.category);
    setImages([preset.image]);
    setLocation({
      lat: preset.lat,
      lng: preset.lng,
      address: preset.address,
      district: 'Metro Central District'
    });
    setAiAnalysis(null);
  };

  const handleRunAIClassification = async () => {
    if (!title && !description) return;
    setIsAnalyzing(true);
    try {
      const primaryImage = images.length > 0 ? images[0] : undefined;
      const result = await classifyWithAI({
        title,
        description,
        imageBase64: primaryImage
      });
      setAiAnalysis(result);
      setDepartment(result.department);
      setSeverity(result.severity);
      setStep('ai_review');
    } catch (err) {
      console.error('Classification error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await submitIssue({
        title,
        description,
        images,
        department,
        severity,
        location,
        aiAnalysis,
        runAI: !aiAnalysis
      });
      setIsReportModalOpen(false);
      // If server or client flagged duplicate, open existing issue
      if (res.isDuplicate && res.issue) {
        setSelectedIssue(res.issue);
      }
      // Reset form
      setTitle('');
      setDescription('');
      setAiAnalysis(null);
      setStep('details');
    } catch (err) {
      console.error('Error submitting issue:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages(prev => [reader.result as string, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Report a Civic Issue
                <span className="text-[11px] bg-teal-500/20 text-teal-300 font-medium px-2 py-0.5 rounded-full border border-teal-500/30">
                  AI Triage Enabled
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Submit geotagged photos to notify municipality and qualified contractors.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsReportModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Test Presets Banner */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 whitespace-nowrap">
            Quick Demos:
          </span>
          {CIVIC_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 whitespace-nowrap text-xs transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              {preset.category}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Step tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <button
              type="button"
              onClick={() => setStep('details')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                step === 'details'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Issue Details & Geolocation
            </button>
            <button
              type="button"
              onClick={() => {
                if (aiAnalysis) setStep('ai_review');
                else handleRunAIClassification();
              }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                step === 'ai_review'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-teal-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              2. Gemini AI Classification {aiAnalysis ? '✓' : ''}
            </button>
          </div>

          {/* Real-time Duplicate Prevention Alert */}
          {detectedDuplicate && (
            <div className="bg-amber-950/40 border border-amber-500/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-200 animate-in fade-in duration-200">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-300">
                    Existing Report Detected Nearby ({detectedDuplicate.id})
                  </p>
                  <p className="text-slate-300 mt-0.5">
                    <strong>"{detectedDuplicate.title}"</strong> is active at {detectedDuplicate.location.address}.
                  </p>
                  <p className="text-[11px] text-amber-300/80 mt-0.5">
                    Submitting will automatically register your citizen upvote (+1) rather than creating a duplicate entry.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsReportModalOpen(false);
                  setSelectedIssue(detectedDuplicate);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shrink-0 shadow transition-all text-xs"
              >
                Inspect Existing
              </button>
            </div>
          )}

          {step === 'details' ? (
            <div className="space-y-5">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Issue Title <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hazardous Pothole near School Crosswalk"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Detailed Description <span className="text-orange-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleRunAIClassification}
                    disabled={isAnalyzing || (!title && !description)}
                    className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3" />
                    Auto-Fill via Gemini
                  </button>
                </div>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe what happened, any visible danger, safety hazard, or impact on neighborhood traffic..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
                />
              </div>

              {/* Image Upload Gallery */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Evidence Photos (Supporting Multi-Image Upload)
                </label>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 group">
                      <img 
                        src={img || DEFAULT_IMAGES.pothole} 
                        alt="Evidence" 
                        onError={(e) => handleImageError(e, DEFAULT_IMAGES.pothole)}
                        className="w-full h-full object-cover" 
                      />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        &times;
                      </button>
                    </div>
                  ))}

                  <label className="aspect-video rounded-xl border border-dashed border-slate-700 hover:border-teal-500 hover:bg-slate-800/40 flex flex-col items-center justify-center cursor-pointer transition-colors text-slate-400 hover:text-teal-400 p-2 text-center">
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-semibold">Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Interactive Location Picker Map */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                    Pinpoint Location on Map
                  </label>
                  <span className="text-xs text-slate-400 font-mono">
                    {location.address}
                  </span>
                </div>
                
                <CivicMap
                  mode="picker"
                  height="220px"
                  selectedLocation={{ lat: location.lat, lng: location.lng }}
                  onLocationSelect={(loc) => {
                    setLocation({
                      lat: loc.lat,
                      lng: loc.lng,
                      address: loc.address,
                      district: 'Downtown Metropolitan'
                    });
                  }}
                />
              </div>

            </div>
          ) : (
            /* Step 2: AI Review Screen */
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {isAnalyzing ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-teal-500/20 border-2 border-teal-500 animate-ping absolute inset-0"></div>
                    <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-teal-400 flex items-center justify-center relative">
                      <Sparkles className="w-8 h-8 text-teal-400 animate-spin" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mt-4">
                    Gemini 3.8 Flash Vision Triage in Progress...
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    Analyzing asphalt damage texture, pipe water volume, and danger radius to compute municipal SLA and severity.
                  </p>
                </div>
              ) : aiAnalysis ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-teal-950/60 to-slate-900 border border-teal-700/50 rounded-2xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-teal-400">
                            AI Classification Complete
                          </p>
                          <p className="text-sm font-bold text-white">
                            {aiAnalysis.department}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30">
                        {(aiAnalysis.confidenceScore * 100).toFixed(0)}% Confidence
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-teal-900/40 text-xs">
                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Severity</span>
                        <span className={`font-bold text-sm ${
                          aiAnalysis.severity === 'High' ? 'text-orange-400' :
                          aiAnalysis.severity === 'Medium' ? 'text-amber-400' : 'text-teal-400'
                        }`}>
                          {aiAnalysis.severity} Priority
                        </span>
                      </div>

                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Turnaround SLA</span>
                        <span className="font-bold text-sm text-slate-200 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-teal-400" />
                          {aiAnalysis.urgencyHours} Hours
                        </span>
                      </div>

                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Cost</span>
                        <span className="font-bold text-sm text-slate-200 flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-teal-400" />
                          {aiAnalysis.estimatedCost}
                        </span>
                      </div>

                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Safety Hazard</span>
                        <span className={`font-bold text-sm flex items-center gap-1 ${
                          aiAnalysis.safetyHazard ? 'text-red-400' : 'text-emerald-400'
                        }`}>
                          <ShieldAlert className="w-3.5 h-3.5" />
                          {aiAnalysis.safetyHazard ? 'Immediate' : 'Controlled'}
                        </span>
                      </div>
                    </div>

                    {/* AI Reasoning */}
                    <div className="mt-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                      <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Diagnostic Assessment:
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {aiAnalysis.severityReason}
                      </p>
                      <div className="mt-2 text-[11px] text-teal-300 font-medium">
                        Directive: {aiAnalysis.suggestedAction}
                      </div>
                    </div>

                    {/* Tags */}
                    {aiAnalysis.keywords && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {aiAnalysis.keywords.map((kw, i) => (
                          <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Manual Override controls */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Override Department
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value as DepartmentCategory)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                      >
                        <option value="Roads & Potholes">Roads & Potholes</option>
                        <option value="Water & Sanitation">Water & Sanitation</option>
                        <option value="Electricity & Lighting">Electricity & Lighting</option>
                        <option value="Garbage & Waste">Garbage & Waste</option>
                        <option value="Parks & Environment">Parks & Environment</option>
                        <option value="Traffic & Signals">Traffic & Signals</option>
                        <option value="Public Safety">Public Safety</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Override Severity
                      </label>
                      <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : null}

            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {step === 'details' ? (
              <button
                type="button"
                onClick={handleRunAIClassification}
                disabled={isAnalyzing || (!title && !description)}
                className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-teal-500/20 disabled:opacity-50 transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Image & Text...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Gemini AI Classification</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-xs text-slate-400 hover:text-white"
              >
                ← Back to Details
              </button>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || !title || !description}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-orange-500/25 disabled:opacity-50 transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting to City HQ...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm & Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
