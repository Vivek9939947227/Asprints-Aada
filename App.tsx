
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Home, 
  User, 
  PlusCircle, 
  LayoutGrid, 
  Phone, 
  Star,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Filter,
  Video,
  Play,
  Briefcase,
  GraduationCap,
  ImageIcon,
  Trash2,
  CheckCircle2,
  ChevronRight,
  Heart,
  Share2,
  ArrowLeft,
  QrCode,
  CreditCard,
  Settings,
  Eye,
  EyeOff,
  Copy,
  Check,
  Zap,
  Bot,
  Info,
  ThumbsUp,
  AlertCircle,
  Globe,
  FileText,
  UserCheck,
  Wrench,
  TrendingUp,
  Languages,
  Download,
  ShieldCheck,
  MessageCircle,
  ShieldAlert,
  Compass,
  Store,
  LogOut,
  Mail,
  Camera,
  Send,
  Flag,
  Youtube,
  Globe2
} from 'lucide-react';
import { Property, AppMode, BookingCycle, User as UserType } from './types';
import { MOCK_PROPERTIES, CITIES, AMENITIES } from './constants';
import { 
  getSmartRecommendations, 
  generatePropertyDescription, 
  analyzePropertyPhotos,
  getPropertyAiSummary,
  translateText,
  extractIdDetails,
  draftLeaseAgreement,
  diagnoseComplaint,
  suggestRentPrice,
  getChatSuggestions,
  analyzeInquiry
} from './services/geminiService';

// --- Types Expansion ---
interface Inquiry {
  id: string;
  propertyId: string;
  propertyName: string;
  senderName: string;
  message: string;
  timestamp: number;
  aiAnalysis: {
    seriousness: number;
    tone: string;
    isSpam: boolean;
    reasoning: string;
  };
}

// Interface for property listing form to ensure consistent typing
interface PropertyForm {
  title: string;
  city: string;
  type: Property['type'];
  price: number;
  whatsapp: string;
  upi: string;
  description: string;
  amenities: string[];
  images: string[];
  videoUrl: string;
  lat: number;
  lng: number;
}

// --- Persistence Helpers ---
const STORAGE_KEY = 'asprints_aada_properties';
const USER_KEY = 'asprints_aada_user';
const INQUIRY_KEY = 'asprints_aada_inquiries';

const getInitialProperties = (): Property[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved properties", e);
    }
  }
  return MOCK_PROPERTIES;
};

const getInitialInquiries = (): Inquiry[] => {
  const saved = localStorage.getItem(INQUIRY_KEY);
  return saved ? JSON.parse(saved) : [];
};

// --- Sub-Components ---

const LoginScreen: React.FC<{ onLogin: (user: UserType) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0] || 'User',
      email,
      role: isOwner ? 'Owner' : 'User'
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-block bg-indigo-600 p-4 rounded-3xl shadow-2xl shadow-indigo-200">
            <Home className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Asprints<span className="text-indigo-600">Aada</span></h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Premium Stay Booking</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-50 rounded-2xl py-5 pl-14 pr-6 font-bold outline-none border border-slate-100 focus:border-indigo-600 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
             <div className="flex-1">
               <div className="text-xs font-black text-slate-900">Are you a Property Owner?</div>
               <div className="text-[10px] text-slate-400 font-bold">Switch on if you want to list hostels/rooms</div>
             </div>
             <button 
              type="button"
              onClick={() => setIsOwner(!isOwner)}
              className={`w-14 h-8 rounded-full relative transition-all ${isOwner ? 'bg-indigo-600' : 'bg-slate-200'}`}
             >
               <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isOwner ? 'left-7' : 'left-1'}`} />
             </button>
          </div>

          <button className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xl shadow-2xl hover:bg-indigo-600 transition-all">
            Enter Aada
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-300 font-black tracking-widest">Or social login</span></div>
        </div>

        <button 
          onClick={() => onLogin({ id: 'g1', name: 'Google User', email: 'google@gmail.com', role: 'User' })}
          className="w-full bg-white border border-slate-200 text-slate-600 py-5 rounded-2xl font-black flex items-center justify-center gap-4 hover:bg-slate-50 transition-all"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G" /> Continue with Google
        </button>
      </div>
    </div>
  );
};

const Navbar: React.FC<{ 
  mode: AppMode | 'Landing' | 'Admin', 
  setMode: (m: AppMode | 'Landing' | 'Admin') => void,
  user: UserType,
  onLogout: () => void
}> = ({ mode, setMode, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-slate-200/40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => setMode('Landing')}
        >
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-200/50 group-hover:scale-110 transition-transform duration-300">
            <Home className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">Asprints<span className="text-indigo-600">Aada</span></span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8 font-bold text-sm uppercase tracking-[0.15em]">
            <button 
              onClick={() => setMode('Find')}
              className={`transition-all relative py-1 ${mode === 'Find' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              Find
              {mode === 'Find' && <div className="absolute -bottom-1.5 left-0 w-full h-1 bg-indigo-600 rounded-full"></div>}
            </button>
            <button 
              onClick={() => setMode('List')}
              className={`transition-all relative py-1 ${mode === 'List' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              List Property
              {mode === 'List' && <div className="absolute -bottom-1.5 left-0 w-full h-1 bg-indigo-600 rounded-full"></div>}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/50 px-4 py-2 rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-600">
                <User className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-slate-700">{user.name}</span>
            </div>
            <button onClick={onLogout} className="text-slate-300 hover:text-red-500 transition-colors"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>

        <button className="md:hidden text-slate-900 p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl p-6 space-y-4 shadow-2xl animate-fade-in border-b">
          <button className="w-full text-left p-5 rounded-3xl font-black text-xl bg-slate-50" onClick={() => {setMode('Find'); setIsOpen(false);}}>Find</button>
          <button className="w-full text-left p-5 rounded-3xl font-black text-xl bg-slate-50" onClick={() => {setMode('List'); setIsOpen(false);}}>List Property</button>
          <button className="w-full text-left p-5 rounded-3xl font-black text-xl bg-red-50 text-red-500" onClick={onLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

const PropertyCard: React.FC<{ property: Property, onSelect: (p: Property) => void }> = ({ property, onSelect }) => {
  return (
    <div 
      className={`group bg-white rounded-[3rem] overflow-hidden shadow-2xl hover:shadow-indigo-100 transition-all duration-500 cursor-pointer border border-slate-100 hover:-translate-y-3 ${!property.isAvailable ? 'opacity-70 grayscale' : ''}`}
      onClick={() => onSelect(property)}
    >
      <div className="relative h-64 overflow-hidden">
        <img src={property.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-xl text-[9px] font-black text-indigo-600 uppercase tracking-widest">{property.type}</div>
        <div className="absolute bottom-4 left-4 text-white">
           <div className="text-[10px] font-black uppercase tracking-widest text-white/80">{property.city}</div>
           <h3 className="text-lg font-black leading-tight drop-shadow-md line-clamp-1">{property.title}</h3>
        </div>
      </div>
      <div className="p-8 space-y-6">
        <div className="flex gap-2 flex-wrap">
          {property.nearbyHubs.slice(0, 2).map(h => <span key={h} className="text-[8px] font-black uppercase bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg">Near {h}</span>)}
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Starts at</div>
            <div className="text-2xl font-black text-slate-900">₹{property.price.Month}<span className="text-sm font-bold text-slate-300">/mo</span></div>
          </div>
          <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors shadow-xl">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

const LandingView: React.FC<{ onPick: (m: AppMode) => void }> = ({ onPick }) => (
  <div className="min-h-[85vh] flex flex-col items-center justify-center px-6 py-20 animate-fade-in space-y-20">
    <div className="text-center space-y-8 max-w-4xl">
      <h1 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.85]">
        Stay <br/><span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Better.</span>
      </h1>
      <p className="text-xl md:text-2xl font-bold text-slate-400 max-w-2xl mx-auto">India's most intuitive stay booking platform for the new generation.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
       <button onClick={() => onPick('Find')} className="group bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl text-left hover:-translate-y-4 transition-all duration-500">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white mb-8 group-hover:rotate-12 transition-transform shadow-xl shadow-indigo-100">
             <Search className="w-10 h-10" />
          </div>
          <h2 className="text-5xl font-black text-slate-900 mb-4">Find a Place</h2>
          <p className="text-slate-400 font-bold">For students near coaching hubs, job seekers near office zones, and tourists.</p>
          <div className="pt-8 flex items-center gap-3 font-black text-indigo-600 uppercase text-xs tracking-widest">Explore Stays <ArrowRight /></div>
       </button>
       <button onClick={() => onPick('List')} className="group bg-slate-900 p-12 rounded-[4rem] shadow-2xl text-left hover:-translate-y-4 transition-all duration-500">
          <div className="w-20 h-20 bg-indigo-500 rounded-[2rem] flex items-center justify-center text-white mb-8 group-hover:rotate-12 transition-transform shadow-xl">
             <Store className="w-10 h-10" />
          </div>
          <h2 className="text-5xl font-black text-white mb-4">List Space</h2>
          <p className="text-slate-500 font-bold">Hostel, PG, and Flat owners — verify your listings with AI and get tenants instantly.</p>
          <div className="pt-8 flex items-center gap-3 font-black text-indigo-400 uppercase text-xs tracking-widest">Host Now <ArrowRight /></div>
       </button>
    </div>
  </div>
);

const PropertyDetailsModal: React.FC<{ 
  property: Property, 
  user: UserType, 
  onClose: () => void,
  onSendInquiry: (inquiry: Inquiry) => void 
}> = ({ property, user, onClose, onSendInquiry }) => {
  const [cycle, setCycle] = useState<BookingCycle>('Month');
  const [activeImg, setActiveImg] = useState(property.images[0]);
  const [showQr, setShowQr] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [chatSuggestions, setChatSuggestions] = useState<string[]>([]);
  const [isMessaging, setIsMessaging] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function init() {
      setAiSummary(await getPropertyAiSummary(property));
      setChatSuggestions(await getChatSuggestions(property));
    }
    init();
  }, [property]);

  const whatsapp = (msg?: string) => {
    const text = msg || `Hi! I'm interested in ${property.title}.`;
    window.open(`https://wa.me/${property.ownerWhatsApp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSendMessage = async () => {
    if (!message) return;
    setIsSending(true);
    const analysis = await analyzeInquiry(message);
    const newInquiry: Inquiry = {
      id: Math.random().toString(36).substr(2, 9),
      propertyId: property.id,
      propertyName: property.title,
      senderName: user.name,
      message,
      timestamp: Date.now(),
      aiAnalysis: analysis
    };
    onSendInquiry(newInquiry);
    setIsSending(false);
    setIsMessaging(false);
    setMessage('');
    alert("Inquiry sent to platform owner! AI has analyzed your tone to ensure a serious discussion.");
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-7xl h-[90vh] rounded-[4rem] overflow-hidden flex flex-col lg:flex-row relative">
        <button onClick={onClose} className="absolute top-8 right-8 z-50 p-3 bg-white/90 rounded-full shadow-2xl border"><X /></button>
        
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12">
          <div className="space-y-6">
            <div className="aspect-video rounded-[3rem] overflow-hidden bg-slate-100 shadow-2xl">
              {property.videoUrl && !isMessaging ? (
                 <iframe 
                   className="w-full h-full"
                   src={property.videoUrl.replace('watch?v=', 'embed/')} 
                   title="Property Video"
                   frameBorder="0"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen
                 />
              ) : (
                <img src={activeImg} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {property.images.map(img => (
                <button key={img} onClick={() => setActiveImg(img)} className={`w-24 h-24 rounded-2xl flex-shrink-0 overflow-hidden border-4 ${activeImg === img ? 'border-indigo-600' : 'border-transparent'}`}>
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-indigo-50/50 p-10 rounded-[3rem] border border-indigo-100 space-y-4">
             <h4 className="text-xl font-black text-indigo-600 flex items-center gap-3"><Zap className="fill-indigo-600" /> Gemini Insights</h4>
             <p className="text-slate-600 font-bold leading-relaxed">{aiSummary || "Generating summary..."}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t">
            <div className="space-y-6">
               <h4 className="text-2xl font-black">Amenities</h4>
               <div className="grid grid-cols-2 gap-4">
                  {property.amenities.map(a => <div key={a} className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl font-black text-xs"><CheckCircle2 className="w-4 h-4 text-indigo-600" />{a}</div>)}
               </div>
            </div>
            <div className="space-y-6">
               <h4 className="text-2xl font-black">Location</h4>
               <div className="aspect-video rounded-[2.5rem] overflow-hidden border">
                 <iframe 
                   width="100%" 
                   height="100%" 
                   frameBorder="0" 
                   src={`https://www.google.com/maps?q=${property.lat},${property.lng}&z=15&output=embed`}
                 ></iframe>
               </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[460px] bg-slate-50 p-10 flex flex-col justify-between border-l">
          <div className="space-y-10">
            <div className="space-y-4">
               <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase">{property.type}</span>
               <h2 className="text-4xl font-black leading-tight">{property.title}</h2>
               <div className="flex items-center gap-2 text-slate-400 font-bold"><MapPin className="w-4 h-4" /> {property.city}</div>
            </div>

            {isMessaging ? (
              <div className="space-y-6 animate-slide-up">
                 <h4 className="text-xl font-black text-slate-900 flex items-center gap-3"><MessageCircle className="text-indigo-600" /> Send AI-Analyzed Message</h4>
                 <textarea 
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full bg-white p-6 rounded-3xl min-h-[150px] outline-none border border-slate-200 font-bold text-sm shadow-inner"
                  placeholder="Ask about availability, rules, or food..."
                 />
                 <div className="flex gap-4">
                    <button onClick={() => setIsMessaging(false)} className="flex-1 bg-white border py-4 rounded-2xl font-black text-xs uppercase">Cancel</button>
                    <button onClick={handleSendMessage} disabled={isSending} className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-3">
                      {isSending ? <Zap className="animate-spin" /> : <Send />} {isSending ? 'Analyzing...' : 'Send Inquiry'}
                    </button>
                 </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  {(['Day', 'Week', 'Month', 'Year'] as BookingCycle[]).map(c => (
                    <button key={c} onClick={() => setCycle(c)} className={`p-5 rounded-3xl border-4 transition-all ${cycle === c ? 'border-indigo-600 bg-white shadow-xl' : 'bg-slate-100 text-slate-400 border-transparent'}`}>
                      <div className="text-[10px] font-black uppercase">{c}ly</div>
                      <div className="text-2xl font-black text-slate-900">₹{property.price[c]}</div>
                    </button>
                  ))}
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border space-y-4">
                  {!showQr ? (
                    <button onClick={() => setShowQr(true)} className="w-full bg-indigo-50 text-indigo-600 py-4 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-3"><QrCode /> UPI Booking</button>
                  ) : (
                    <div className="text-center space-y-4">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${property.upiId}`} className="w-32 h-32 mx-auto" alt="QR" />
                      <button onClick={() => setShowQr(false)} className="text-[10px] font-black text-slate-400 uppercase underline">Hide QR</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-10">
             {!isMessaging && (
               <>
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><Bot className="w-4 h-4 text-indigo-600" /> AI Suggestions</div>
                <div className="space-y-2">
                    {chatSuggestions.map(s => <button key={s} onClick={() => {setMessage(s); setIsMessaging(true);}} className="w-full text-left bg-white border p-4 rounded-2xl text-[10px] font-bold line-clamp-1 hover:border-indigo-600 transition-all">{s}</button>)}
                </div>
                <div className="flex flex-col gap-3">
                   <button onClick={() => setIsMessaging(true)} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-4 shadow-xl hover:bg-indigo-600 transition-all"><MessageCircle /> In-App Message</button>
                   <button onClick={() => whatsapp()} className="w-full bg-white border border-slate-200 text-slate-900 py-4 rounded-3xl font-black text-xs flex items-center justify-center gap-3">Direct WhatsApp <ArrowRight className="w-4 h-4" /></button>
                </div>
               </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ListView: React.FC<{ 
  onAdd: (p: Property) => void, 
  ownerProperties: Property[], 
  onToggle: (id: string) => void, 
  onDelete: (id: string) => void,
  inquiries: Inquiry[]
}> = ({ onAdd, ownerProperties, onToggle, onDelete, inquiries }) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'inquiries'>('listings');
  const [isAdding, setIsAdding] = useState(ownerProperties.length === 0);
  const [step, setStep] = useState(1);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // Explicitly typing the form state to ensure 'prev' is correctly inferred as PropertyForm in updaters
  const [form, setForm] = useState<PropertyForm>({
    title: '', city: 'Kota', type: 'PG', price: 8000, 
    whatsapp: '', upi: '', description: '', amenities: [] as string[], 
    images: [] as string[], videoUrl: '', lat: 25.0, lng: 75.0
  });

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const r = new FileReader();
        // Correctly casting result to string as images is string[]
        r.onloadend = () => setForm(prev => ({...prev, images: [...prev.images, r.result as string]}));
        r.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    // Explicit typing in useState prevents 'prev' from being 'unknown'
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleMagicWrite = async () => {
    if (!form.title) return alert("Property Name first!");
    setIsAiLoading(true);
    setForm({...form, description: await generatePropertyDescription(form.title, form.amenities)});
    setIsAiLoading(false);
  };

  const submit = () => {
    const p: Property = {
      id: Math.random().toString(36).substr(2, 9),
      title: form.title, type: form.type, location: 'Near Hub', city: form.city,
      price: { Day: Math.round(form.price/15), Week: Math.round(form.price/4), Month: form.price, Year: form.price*11 },
      description: form.description, amenities: form.amenities,
      ownerName: "Host", ownerWhatsApp: form.whatsapp, upiId: form.upi,
      images: form.images.length ? form.images : [MOCK_PROPERTIES[0].images[0]],
      videoUrl: form.videoUrl,
      lat: form.lat, lng: form.lng, 
      isAvailable: true, rating: 5, reviewsCount: 0, nearbyHubs: ['Hub']
    };
    onAdd(p);
    setIsAdding(false);
    setStep(1);
    // Reset form with valid type
    setForm({ title: '', city: 'Kota', type: 'PG', price: 8000, whatsapp: '', upi: '', description: '', amenities: [], images: [], videoUrl: '', lat: 25, lng: 75 });
  };

  if (isAdding) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 animate-fade-in">
        <div className="bg-white rounded-[5rem] shadow-2xl p-12 lg:p-24 border relative overflow-hidden">
          <button onClick={() => setIsAdding(false)} className="absolute top-12 left-12 text-slate-400"><ArrowLeft /></button>
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-6xl font-black text-slate-900 tracking-tighter">New Aada.</h2>
             <div className="flex justify-center gap-2">
               {[1, 2, 3].map(i => <div key={i} className={`h-1.5 w-12 rounded-full transition-all ${step >= i ? 'bg-indigo-600' : 'bg-slate-100'}`} />)}
             </div>
          </div>
  
          {step === 1 && (
            <div className="space-y-12 animate-fade-in">
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-slate-50 p-8 rounded-[2.5rem] font-black text-3xl outline-none shadow-inner" placeholder="Property Title" />
              <div className="grid grid-cols-2 gap-6">
                 <select value={form.type} onChange={e => setForm({...form, type: e.target.value as any})} className="p-6 bg-slate-50 rounded-[2rem] font-bold outline-none border">
                   {['PG', 'Hostel', 'Room', 'Flat', 'Stay'].map(t => <option key={t} value={t}>{t}</option>)}
                 </select>
                 <select value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="p-6 bg-slate-50 rounded-[2rem] font-bold outline-none border">
                   {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-slate-900 text-white py-8 rounded-[3.5rem] font-black text-2xl flex items-center justify-center gap-4">Next <ArrowRight /></button>
            </div>
          )}
  
          {step === 2 && (
            <div className="space-y-12 animate-fade-in">
              <div className="grid grid-cols-2 gap-6">
                <input type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} className="p-8 bg-slate-50 rounded-[2.5rem] font-black text-2xl outline-none shadow-inner" placeholder="Monthly Price" />
                <input value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className="p-8 bg-slate-50 rounded-[2.5rem] font-black text-2xl outline-none shadow-inner" placeholder="WhatsApp Number" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between px-2"><span className="text-xs font-black uppercase text-slate-400">Description</span><button onClick={handleMagicWrite} className="text-[10px] font-black uppercase text-indigo-600 flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI Generate</button></div>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-slate-50 p-8 rounded-[2.5rem] min-h-[200px] outline-none font-bold resize-none shadow-inner" placeholder="Tell us about the vibe..."></textarea>
              </div>
              <div className="flex gap-6"><button onClick={() => setStep(1)} className="flex-1 bg-slate-100 py-8 rounded-[3.5rem] font-black text-2xl">Back</button><button onClick={() => setStep(3)} className="flex-[2] bg-slate-900 text-white py-8 rounded-[3.5rem] font-black text-2xl">Final Step</button></div>
            </div>
          )}
  
          {step === 3 && (
            <div className="space-y-10 animate-fade-in">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Photos (Add Multiple)</label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                   {form.images.map((img, i) => (
                     <div key={i} className="relative aspect-square group">
                       <img src={img} className="w-full h-full object-cover rounded-2xl" />
                       <button onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                     </div>
                   ))}
                   <button onClick={() => fileInput.current?.click()} className="aspect-square border-4 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-300 hover:text-indigo-400 hover:bg-slate-50 transition-all">
                     <Camera className="w-8 h-8 mb-2" />
                     <span className="text-[8px] font-black uppercase">Add Photo</span>
                   </button>
                   <input ref={fileInput} type="file" multiple className="hidden" onChange={handleImage} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2"><Youtube className="w-3 h-3 text-red-500" /> Video Tour URL</label>
                  <input 
                    value={form.videoUrl} 
                    onChange={e => setForm({...form, videoUrl: e.target.value})} 
                    className="w-full bg-slate-50 p-6 rounded-2xl font-bold text-sm outline-none shadow-inner border border-transparent focus:border-indigo-600" 
                    placeholder="YouTube Link (e.g. watch?v=...)" 
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2"><Globe2 className="w-3 h-3 text-indigo-500" /> Map Coordinates</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      step="0.0001"
                      value={form.lat} 
                      onChange={e => setForm({...form, lat: parseFloat(e.target.value)})} 
                      className="flex-1 bg-slate-50 p-4 rounded-xl font-bold text-xs outline-none shadow-inner border" 
                      placeholder="Lat" 
                    />
                    <input 
                      type="number" 
                      step="0.0001"
                      value={form.lng} 
                      onChange={e => setForm({...form, lng: parseFloat(e.target.value)})} 
                      className="flex-1 bg-slate-50 p-4 rounded-xl font-bold text-xs outline-none shadow-inner border" 
                      placeholder="Lng" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2"><QrCode className="w-3 h-3 text-green-600" /> Payment Settings</label>
                <input value={form.upi} onChange={e => setForm({...form, upi: e.target.value})} className="w-full bg-slate-50 p-8 rounded-[2.5rem] font-black text-xl outline-none shadow-inner" placeholder="UPI ID for Booking (e.g. name@okaxis)" />
              </div>

              <div className="flex gap-6 pt-4"><button onClick={() => setStep(2)} className="flex-1 bg-slate-100 py-8 rounded-[3.5rem] font-black text-2xl">Back</button><button onClick={submit} className="flex-[2] bg-indigo-600 text-white py-8 rounded-[3.5rem] font-black text-2xl shadow-2xl shadow-indigo-100">Launch Aada</button></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Manager Dashboard</h2>
            <div className="flex gap-4 mt-6">
               <button onClick={() => setActiveTab('listings')} className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'listings' ? 'bg-indigo-600 text-white shadow-xl' : 'bg-slate-100 text-slate-400'}`}>Listings ({ownerProperties.length})</button>
               <button onClick={() => setActiveTab('inquiries')} className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'inquiries' ? 'bg-indigo-600 text-white shadow-xl' : 'bg-slate-100 text-slate-400'}`}>Inquiries ({inquiries.length})</button>
            </div>
         </div>
         <button onClick={() => setIsAdding(true)} className="bg-indigo-600 text-white px-10 py-5 rounded-[2.5rem] font-black text-lg flex items-center gap-3"><PlusCircle /> List New Aada</button>
      </div>

      {activeTab === 'listings' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {ownerProperties.map(p => (
             <div key={p.id} className="bg-white p-6 rounded-[3rem] border shadow-xl space-y-6 group animate-fade-in">
                <div className="relative aspect-video rounded-[2rem] overflow-hidden">
                  <img src={p.images[0]} className="w-full h-full object-cover" />
                  {p.videoUrl && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-xl shadow-lg">
                      <Youtube className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-black line-clamp-1">{p.title}</h3>
                <div className="flex gap-4 pt-6 border-t">
                  <button onClick={() => onToggle(p.id)} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase ${p.isAvailable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{p.isAvailable ? 'Available' : 'Booked'}</button>
                  <button onClick={() => onDelete(p.id)} className="p-4 text-slate-300 hover:text-red-500"><Trash2 /></button>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
           {inquiries.length > 0 ? inquiries.map(inq => (
             <div key={inq.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl flex flex-col lg:flex-row gap-8 relative overflow-hidden">
                {inq.aiAnalysis.isSpam && <div className="absolute top-4 right-8 bg-red-100 text-red-600 px-4 py-1 rounded-full text-[8px] font-black uppercase flex items-center gap-2"><Flag className="w-3 h-3" /> Potential Spam</div>}
                
                <div className="flex-1 space-y-4">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-indigo-600">{inq.senderName.charAt(0)}</div>
                      <div>
                         <div className="font-black text-slate-900">{inq.senderName}</div>
                         <div className="text-[10px] font-bold text-slate-400">Inquiry for: {inq.propertyName}</div>
                      </div>
                   </div>
                   <p className="font-bold text-slate-600 leading-relaxed italic border-l-4 border-slate-100 pl-4">"{inq.message}"</p>
                </div>

                <div className="w-full lg:w-72 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 space-y-4">
                   <div className="text-[9px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2"><Bot className="w-3 h-3" /> Inquiry Sentiment Analysis</div>
                   
                   <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase text-slate-400"><span>Seriousness</span><span>{inq.aiAnalysis.seriousness}%</span></div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                         <div className={`h-full transition-all ${inq.aiAnalysis.seriousness > 70 ? 'bg-green-500' : inq.aiAnalysis.seriousness > 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${inq.aiAnalysis.seriousness}%` }} />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white p-2 rounded-xl text-center">
                         <div className="text-[8px] font-black uppercase text-slate-400">Tone</div>
                         <div className="text-[10px] font-black text-slate-900">{inq.aiAnalysis.tone}</div>
                      </div>
                      <div className="bg-white p-2 rounded-xl text-center">
                         <div className="text-[8px] font-black uppercase text-slate-400">Spam Risk</div>
                         <div className={`text-[10px] font-black ${inq.aiAnalysis.isSpam ? 'text-red-500' : 'text-green-500'}`}>{inq.aiAnalysis.isSpam ? 'High' : 'Low'}</div>
                      </div>
                   </div>
                   
                   <p className="text-[9px] font-bold text-slate-500 line-clamp-2">{inq.aiAnalysis.reasoning}</p>
                </div>
             </div>
           )) : (
             <div className="py-40 text-center space-y-6 bg-white rounded-[4rem] border border-slate-100">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto"><MessageCircle className="text-slate-200" /></div>
                <div className="text-2xl font-black text-slate-900">No Inquiries Yet</div>
                <p className="text-slate-400 font-bold max-w-sm mx-auto">When potential tenants send messages through the platform, our AI will analyze them here for you.</p>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

const FindView: React.FC<{ properties: Property[], onSelect: (p: Property) => void }> = ({ properties, onSelect }) => {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All');
  const [isAi, setIsAi] = useState(false);
  const [results, setResults] = useState<string[] | null>(null);

  const filtered = useMemo(() => {
    let list = properties;
    if (results) list = list.filter(p => results.includes(p.id));
    else {
      if (city !== 'All') list = list.filter(p => p.city === city);
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(p => p.title.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.nearbyHubs.some(h => h.toLowerCase().includes(q)));
      }
    }
    return list;
  }, [properties, search, city, results]);

  const handleAiSearch = async () => {
    if (!search) return;
    setIsAi(true);
    setResults(await getSmartRecommendations(search, properties));
    setIsAi(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-20 animate-fade-in">
       <div className="text-center space-y-12">
          <h1 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.85]">Find <br/><span className="text-indigo-600 underline decoration-indigo-200 decoration-offset-4">The One.</span></h1>
          <div className="max-w-5xl mx-auto bg-white rounded-[4rem] p-5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] flex flex-col lg:flex-row items-center gap-4 border border-slate-100">
             <div className="flex-[2] flex items-center gap-5 px-8 w-full">
                <Search className="text-indigo-600 w-8 h-8" />
                <input value={search} onChange={e => {setSearch(e.target.value); setResults(null);}} onKeyDown={e => e.key === 'Enter' && handleAiSearch()} className="w-full py-6 outline-none font-bold text-2xl placeholder:text-slate-200" placeholder="Coaching, college, or area..." />
             </div>
             <div className="h-10 w-px bg-slate-100 hidden lg:block"></div>
             <select value={city} onChange={e => {setCity(e.target.value); setResults(null);}} className="flex-1 px-8 py-6 outline-none font-black text-slate-600 bg-transparent text-lg cursor-pointer">
                <option value="All">Across India</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
             </select>
             <button onClick={handleAiSearch} disabled={isAi} className="w-full lg:w-auto bg-slate-900 text-white px-12 py-6 rounded-[3rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-2xl hover:bg-indigo-600 transition-all">
               {isAi ? <Zap className="animate-spin" /> : <Sparkles />} {isAi ? 'Dreaming...' : 'AI Search'}
             </button>
          </div>
          {results && <div className="flex justify-center gap-4"><span className="text-[10px] font-black uppercase text-slate-400">AI Results</span><button onClick={() => setResults(null)} className="text-[10px] font-black uppercase text-indigo-600 underline">Clear</button></div>}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-40">
          {filtered.map(p => <PropertyCard key={p.id} property={p} onSelect={onSelect} />)}
       </div>
    </div>
  );
};

const AdminDashboard: React.FC<{ properties: Property[], onDelete: (id: string) => void }> = ({ properties, onDelete }) => (
  <div className="max-w-7xl mx-auto px-6 py-24 space-y-12 animate-fade-in">
    <div className="flex items-center gap-6">
      <div className="w-20 h-20 bg-red-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-red-100"><ShieldAlert className="w-10 h-10" /></div>
      <div><h1 className="text-5xl font-black">Central Control</h1><p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">AsprintsAada Management Portal</p></div>
    </div>
    <div className="bg-white rounded-[4rem] shadow-2xl border overflow-hidden">
       <table className="w-full text-left">
          <thead className="bg-slate-50 border-b"><tr><th className="p-8 font-black uppercase text-[10px] text-slate-400">Property</th><th className="p-8 font-black uppercase text-[10px] text-slate-400">Host</th><th className="p-8 font-black uppercase text-[10px] text-slate-400">Status</th><th className="p-8 font-black uppercase text-[10px] text-slate-400 text-right">Action</th></tr></thead>
          <tbody className="divide-y">
            {properties.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition-all">
                <td className="p-8"><div className="flex items-center gap-4"><img src={p.images[0]} className="w-14 h-14 rounded-2xl object-cover" /><span className="font-black">{p.title}</span></div></td>
                <td className="p-8 font-bold text-slate-400">{p.ownerName}</td>
                <td className="p-8"><span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${p.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{p.isAvailable ? 'Live' : 'Hidden'}</span></td>
                <td className="p-8 text-right"><button onClick={() => onDelete(p.id)} className="p-4 text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-6 h-6" /></button></td>
              </tr>
            ))}
          </tbody>
       </table>
    </div>
  </div>
);

export default function App() {
  const [user, setUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [mode, setMode] = useState<AppMode | 'Landing' | 'Admin'>('Landing');
  const [selected, setSelected] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>(getInitialProperties);
  const [inquiries, setInquiries] = useState<Inquiry[]>(getInitialInquiries);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(properties)); }, [properties]);
  useEffect(() => { if (user) localStorage.setItem(USER_KEY, JSON.stringify(user)); else localStorage.removeItem(USER_KEY); }, [user]);
  useEffect(() => { localStorage.setItem(INQUIRY_KEY, JSON.stringify(inquiries)); }, [inquiries]);

  if (!user) return <LoginScreen onLogin={setUser} />;

  const onAdd = (p: Property) => setProperties(prev => [p, ...prev]);
  const onToggle = (id: string) => setProperties(prev => prev.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p));
  const onDelete = (id: string) => setProperties(prev => prev.filter(p => p.id !== id));
  const onSendInquiry = (inq: Inquiry) => setInquiries(prev => [inq, ...prev]);
  
  const ownerStays = properties.filter(p => p.ownerName === "Host" || p.ownerName === user.name);
  const ownerInquiries = inquiries.filter(inq => {
    const prop = properties.find(p => p.id === inq.propertyId);
    return prop && (prop.ownerName === "Host" || prop.ownerName === user.name);
  });

  return (
    <div className="min-h-screen">
      <Navbar mode={mode} setMode={setMode} user={user} onLogout={() => setUser(null)} />
      
      {mode === 'Landing' && <LandingView onPick={setMode} />}
      {mode === 'Find' && <FindView properties={properties.filter(p => p.isAvailable)} onSelect={setSelected} />}
      {mode === 'List' && <ListView onAdd={onAdd} ownerProperties={ownerStays} onToggle={onToggle} onDelete={onDelete} inquiries={ownerInquiries} />}
      {mode === 'Admin' && <AdminDashboard properties={properties} onDelete={onDelete} />}
      
      {selected && (
        <PropertyDetailsModal 
          property={selected} 
          user={user} 
          onClose={() => setSelected(null)} 
          onSendInquiry={onSendInquiry}
        />
      )}

      <footer className="py-20 text-center select-none">
        <div 
          onClick={(e) => e.detail === 3 && setMode('Admin')}
          className="cursor-pointer font-black text-[10px] uppercase tracking-[0.5em] text-slate-200 hover:text-indigo-200 transition-colors"
        >
          AsprintsAada Premium Hub © 2025
        </div>
      </footer>

      {/* Persistent AI Helper Bubble */}
      <div className="fixed bottom-10 right-10 z-50">
        <button className="w-20 h-20 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-200 hover:scale-110 active:scale-95 transition-all group">
          <Bot className="w-10 h-10 group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-12 right-0 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">AI Support Live</div>
        </button>
      </div>
    </div>
  );
}
