import React, { useState, useRef, useEffect } from 'react';
import { 
  Clapperboard, Camera, Aperture, Palette, Wind, Clock, 
  MonitorPlay, Zap, XCircle, Wand2, Copy, Check, User, ToggleLeft, ToggleRight,
  Plus, Trash2, Film, Image as ImageIcon, Upload, Loader2, PlaySquare, Globe,
  Lightbulb, Save, RefreshCw, ChevronDown, ChevronUp, ExternalLink, Sparkles, Code,
  Edit2, RotateCcw, BoxSelect, ArrowDown, AlertCircle
} from 'lucide-react';
import { 
  PromptState, GeneratedResult, ShotPlan, TrailerResult, Language, DropdownOption, MarketingIdea, IdeaPart 
} from './types';
import { 
  ENGINES, GENRES, SHOT_SIZES, CAMERA_ANGLES, COMPOSITIONS, CAMERA_MOVEMENTS, 
  LENSES, DEPTH_OF_FIELD, LIGHTING, COLOR_GRADING, ATMOSPHERE, 
  PACE, QUALITY, AVOID_OPTIONS, ASPECT_RATIOS, DURATIONS, DEFAULT_SHOT 
} from './constants';
import { translations } from './translations';
import { Dropdown, MultiSelect } from './components/Dropdown';
import { generatePromptsWithGemini, generateMarketingPart } from './services/geminiService';

const INITIAL_STATE: PromptState = {
  language: 'es',
  engine: ENGINES[1].value, // Nano Banana Pro
  genre: GENRES[0].value,
  shotSize: SHOT_SIZES[0].value,
  cameraAngle: CAMERA_ANGLES[0].value,
  composition: COMPOSITIONS[0].value,
  cameraMovement: CAMERA_MOVEMENTS[0].value,
  lens: LENSES[0].value,
  depthOfField: DEPTH_OF_FIELD[0].value,
  lighting: LIGHTING[0].value,
  colorGrading: COLOR_GRADING[0].value,
  atmosphere: ATMOSPHERE[0].value,
  pace: PACE[0].value,
  quality: QUALITY[0].value,
  avoid: [],
  aspectRatio: ASPECT_RATIOS[0].value,
  duration: DURATIONS[0].value,
  sceneDescription: '',
  isPortraitPreset: false,
  activeTab: 'builder',
  isMultiShotMode: false,
  multiShotPlan: [],
  trailerImage: null,
  marketingGoal: '',
  savedIdeas: [] // Saved projects
};

const PORTRAIT_TEMPLATE_ES = "Retrato editorial de estudio, sujeto masculino, [POSE], vistiendo [VESTIMENTA], con [ACCESORIOS], [EXPRESION], [PEINADO]. Fondo: [FONDO]. Iluminación: [ILUMINACION]. 85mm portrait lens, shallow depth of field, soft bokeh, clean neutral background, warm neutral color grade, soft shadows, high realism, natural skin tones, crisp details, subtle vignette.";
const PORTRAIT_TEMPLATE_EN = "Editorial studio portrait, male subject, [POSE], wearing [VESTIMENTA], with [ACCESORIOS], [EXPRESION], [PEINADO]. Background: [FONDO]. Lighting: [ILUMINACION]. 85mm portrait lens, shallow depth of field, soft bokeh, clean neutral background, warm neutral color grade, soft shadows, high realism, natural skin tones, crisp details, subtle vignette.";

// --- Helper for safe i18n data access ---
const getI18nData = (obj: any, lang: Language): string[] => {
    if (!obj) return [];
    const val = obj[lang] || obj['es'] || obj['en'];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return [val]; 
    return [];
};

// --- Helper Components ---
const TrailerShotCard: React.FC<{ shot: any; index: number; partStart: number; shotLabel: string }> = ({ shot, index, partStart, shotLabel }) => {
    const [copiedEn, setCopiedEn] = useState(false);
    const [copiedEs, setCopiedEs] = useState(false);
    const [copiedNegEn, setCopiedNegEn] = useState(false);
    const [copiedNegEs, setCopiedNegEs] = useState(false);
    
    const promptEn = shot.prompt_en || "";
    const promptEs = shot.prompt_es || "";
    const negativeEn = shot.negative_en || "";
    const negativeEs = shot.negative_es || "";
    
    const copy = (text: string, setFn: (b: boolean) => void) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setFn(true);
        setTimeout(() => setFn(false), 2000);
    };

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-indigo-400 text-sm flex items-center gap-2">
                         <span className="bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded text-xs">#{index + 1}</span>
                         {shotLabel} {index + 1} — {shot.title_es} <span className="text-gray-500 font-normal">({shot.duration_s}s)</span>
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 italic pl-10">{shot.action_es}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Prompt ES */}
                <div className="space-y-1">
                    <span className="text-[10px] font-bold text-orange-400/80 uppercase tracking-wider flex items-center gap-1">
                        <Globe size={10} /> Prompt (ES)
                    </span>
                    <div className="bg-gray-900/80 p-3 rounded text-xs font-mono text-gray-300 relative group min-h-[60px] border border-gray-800">
                        {promptEs || <span className="text-gray-600 italic">No prompt generated</span>}
                        {promptEs && (
                            <button 
                                onClick={() => copy(promptEs, setCopiedEs)}
                                className="absolute top-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Copiar ES"
                            >
                                {copiedEs ? <Check size={12}/> : <Copy size={12}/>}
                            </button>
                        )}
                    </div>
                    {/* Negative ES (Optional) */}
                    {negativeEs && (
                        <div className="mt-1">
                            <span className="text-[9px] font-bold text-red-400/60 uppercase tracking-wider">Negativo (ES)</span>
                            <div className="bg-red-900/10 border border-red-900/20 p-2 rounded text-[10px] font-mono text-red-300/80 relative group">
                                {negativeEs}
                                <button 
                                    onClick={() => copy(negativeEs, setCopiedNegEs)}
                                    className="absolute top-1 right-1 p-1 bg-red-900/40 hover:bg-red-900/60 rounded text-red-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    {copiedNegEs ? <Check size={10}/> : <Copy size={10}/>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Prompt EN */}
                <div className="space-y-1">
                     <span className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-wider flex items-center gap-1">
                        <Globe size={10} /> Prompt (EN)
                    </span>
                    <div className="bg-gray-900/80 p-3 rounded text-xs font-mono text-gray-300 relative group min-h-[60px] border border-gray-800">
                        {promptEn || <span className="text-gray-600 italic">No prompt generated</span>}
                        {promptEn && (
                            <button 
                                onClick={() => copy(promptEn, setCopiedEn)}
                                className="absolute top-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Copy EN"
                            >
                                {copiedEn ? <Check size={12}/> : <Copy size={12}/>}
                            </button>
                        )}
                    </div>
                    {/* Negative EN (Optional) */}
                    {negativeEn && (
                        <div className="mt-1">
                            <span className="text-[9px] font-bold text-red-400/60 uppercase tracking-wider">Negative (EN)</span>
                            <div className="bg-red-900/10 border border-red-900/20 p-2 rounded text-[10px] font-mono text-red-300/80 relative group">
                                {negativeEn}
                                <button 
                                    onClick={() => copy(negativeEn, setCopiedNegEn)}
                                    className="absolute top-1 right-1 p-1 bg-red-900/40 hover:bg-red-900/60 rounded text-red-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    {copiedNegEn ? <Check size={10}/> : <Copy size={10}/>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const SavedIdeaCard: React.FC<{ idea: MarketingIdea; onDelete: (id: string) => void; t: any }> = ({ idea, onDelete, t }) => {
    const [expanded, setExpanded] = useState(false);
    const labels = t?.buttons || {};

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden transition-all hover:border-gray-600">
            <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-750" onClick={() => setExpanded(!expanded)}>
                <div>
                    <h4 className="font-bold text-gray-200 text-sm flex items-center gap-2">
                        {idea.idea_title_es}
                        <span className="text-[10px] bg-indigo-900 px-2 rounded text-indigo-300">
                             {idea.parts.length} Parts ({idea.parts.length * 15}s)
                        </span>
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{idea.logline_es}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(idea.id); }}
                        className="p-1.5 text-red-400 hover:bg-red-900/30 rounded"
                        title={labels.deleteIdea}
                    >
                        <Trash2 size={14}/>
                    </button>
                    {expanded ? <ChevronUp size={16} className="text-gray-500"/> : <ChevronDown size={16} className="text-gray-500"/>}
                </div>
            </div>
            {expanded && (
                <div className="p-4 pt-0 border-t border-gray-700/50 bg-gray-900/30">
                    <div className="text-xs space-y-4 mt-2">
                        {idea.parts.map((part, idx) => (
                             <div key={idx} className="space-y-2">
                                 <div className="text-indigo-400 font-bold border-b border-gray-700 pb-1">
                                     Part {part.part_index} ({part.part_label_es})
                                 </div>
                                 <div className="pl-2 border-l border-gray-700 space-y-4">
                                     {part.shots.map((s, i) => (
                                         <div key={i} className="space-y-1">
                                             <div className="text-gray-300 font-bold text-[11px]">#{i+1} {s.title_es}</div>
                                             <div className="grid grid-cols-1 gap-1">
                                                 {s.prompt_es && (
                                                     <div className="text-gray-400 font-mono bg-gray-800/50 p-1.5 rounded border border-gray-700/50">
                                                        <span className="text-orange-400 font-bold text-[9px] mr-1">ES:</span> {s.prompt_es}
                                                     </div>
                                                 )}
                                                 {s.prompt_en && (
                                                     <div className="text-gray-400 font-mono bg-gray-800/50 p-1.5 rounded border border-gray-700/50">
                                                        <span className="text-indigo-400 font-bold text-[9px] mr-1">EN:</span> {s.prompt_en}
                                                     </div>
                                                 )}
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function App() {
  const [state, setState] = useState<PromptState>(INITIAL_STATE);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  
  // New State for Marketing Project
  const [activeProject, setActiveProject] = useState<MarketingIdea | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // States
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [variationCount, setVariationCount] = useState(0);
  
  const [isDragging, setIsDragging] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [editableTitle, setEditableTitle] = useState("");

  const previousStateRef = useRef<PromptState | null>(null);

  // Safe translation object with deep fallback to ES
  const t = React.useMemo(() => {
    const current = translations[state.language];
    const fallback = translations.es;
    return {
        ...fallback,
        ...current,
        tabs: { ...fallback.tabs, ...(current?.tabs || {}) },
        buttons: { ...fallback.buttons, ...(current?.buttons || {}) },
        trailer: { ...fallback.trailer, ...(current?.trailer || {}) },
        results: { ...fallback.results, ...(current?.results || {}) },
        labels: { ...fallback.labels, ...(current?.labels || {}) },
        multiShot: { ...fallback.multiShot, ...(current?.multiShot || {}) },
        sections: { ...fallback.sections, ...(current?.sections || {}) },
        placeholders: { ...fallback.placeholders, ...(current?.placeholders || {}) },
        preset: { ...fallback.preset, ...(current?.preset || {}) },
    };
  }, [state.language]);

  const selectedEngineObj = ENGINES.find(e => e.value === state.engine);
  const isVideo = selectedEngineObj?.type === 'video';
  const isPhoto = selectedEngineObj?.type === 'image';
  const isKling = state.engine === 'Kling 3';

  // Transform Options for Language with Fallback
  const getOptions = (opts: DropdownOption[]) => opts.map(o => ({
      ...o,
      label: state.language === 'en' ? (o.labelEn || o.label || o.value) : (o.label || o.value),
      description: state.language === 'en' ? (o.descriptionEn || o.description || "") : (o.description || "")
  }));

  // Auto-logic for Engine Switching
  useEffect(() => {
    if (isPhoto) {
        setState(prev => ({ ...prev, isMultiShotMode: false }));
    }
    if (isKling) {
        setState(prev => ({ 
            ...prev, 
            isMultiShotMode: true,
            multiShotPlan: prev.multiShotPlan.length === 0 ? [{...DEFAULT_SHOT, id: '1'}] : prev.multiShotPlan
        }));
    } else if (isVideo && !isKling) {
        if (state.isMultiShotMode && state.multiShotPlan.length === 0) {
            setState(prev => ({ ...prev, multiShotPlan: [{...DEFAULT_SHOT, id: '1'}] }));
        }
    }
  }, [state.engine, isPhoto, isVideo, isKling]);

  const updateState = (key: keyof PromptState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handlePresetToggle = () => {
    if (!state.isPortraitPreset) {
      previousStateRef.current = { ...state };
      setState(prev => ({
        ...prev,
        isPortraitPreset: true,
        isMultiShotMode: false,
        shotSize: 'Medium Shot', 
        cameraAngle: 'Eye Level',
        cameraMovement: 'none',
        lens: '85mm Portrait',
        depthOfField: 'Shallow', 
        lighting: 'Cinematic Studio',
        colorGrading: 'Neutral', 
        atmosphere: 'none', 
        quality: 'High Fidelity', 
        avoid: ['warping', 'bad anatomy', 'blurry', 'text', 'low resolution', 'glitches'],
        aspectRatio: '9:16', 
        composition: 'none', 
      }));
    } else {
      if (previousStateRef.current) {
        setState({
            ...previousStateRef.current,
            isPortraitPreset: false,
            sceneDescription: state.sceneDescription,
            language: state.language 
        });
      } else {
        setState(prev => ({ ...prev, isPortraitPreset: false }));
      }
    }
  };

  // --- Multi-Shot Handlers ---
  const addShot = () => {
      setState(prev => ({
          ...prev,
          multiShotPlan: [...prev.multiShotPlan, { ...DEFAULT_SHOT, id: Date.now().toString() }]
      }));
  };

  const removeShot = (id: string) => {
      setState(prev => ({
          ...prev,
          multiShotPlan: prev.multiShotPlan.filter(s => s.id !== id)
      }));
  };

  const updateShot = (id: string, key: keyof ShotPlan, value: string) => {
      setState(prev => ({
          ...prev,
          multiShotPlan: prev.multiShotPlan.map(s => s.id === id ? { ...s, [key]: value } : s)
      }));
  };

  // --- CORE BUILDER GENERATION ---
  const handleGenerate = async () => {
    if (!state.sceneDescription.trim()) {
        alert(state.language === 'es' ? "Describe tu escena primero." : "Describe your scene first.");
        return;
    }
    setError(null);
    setIsGenerating(true);
    setLoadingText(t.buttons.generating);
    try {
      const generated = await generatePromptsWithGemini(state);
      setResult(generated);
    } catch (err) {
      console.error(err);
      setError("Error generando prompts. Verifica tu conexión.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- TRAILER ASSISTANT: GENERATE PART 1 OR REFRESH ---
  const handleMarketingGenerate = async (isRefresh = false) => {
      if (!state.marketingGoal.trim()) {
          alert("Please enter a marketing goal.");
          return;
      }
      
      const nextVar = isRefresh ? variationCount + 1 : 0;
      setVariationCount(nextVar);
      setError(null);
      setIsGenerating(true);
      setLoadingText(t.buttons.analyzing);
      
      try {
          // Generate Part 1
          const part1 = await generateMarketingPart(state, state.trailerImage, [], nextVar);
          
          // Initialize Project
          const newProject: MarketingIdea = {
              id: Date.now().toString(),
              idea_title_es: part1.idea_title_es || "Nuevo Proyecto",
              logline_es: part1.logline_es || "",
              platform: part1.platform || "Social Media",
              recommended_engine_id: part1.recommended_engine_id || state.engine,
              recommended_engine_label: part1.recommended_engine_label || state.engine,
              parts: [part1]
          };

          setActiveProject(newProject);
          setEditableTitle(newProject.idea_title_es);
      } catch (e: any) {
          console.error(e);
          const msg = e.message || "Error al generar la idea.";
          setError(`No se pudo generar la idea. ${msg} Inténtalo de nuevo.`);
      } finally {
          setIsGenerating(false);
      }
  };

  // --- TRAILER ASSISTANT: CONTINUE IDEA ---
  const handleContinueIdea = async () => {
      if (!activeProject) return;

      setError(null);
      setIsGenerating(true);
      setLoadingText(t.buttons.analyzing);

      try {
          const nextPart = await generateMarketingPart(
              state, 
              state.trailerImage, // Keep reference image for style consistency
              activeProject.parts, 
              variationCount
          );

          setActiveProject(prev => prev ? {
              ...prev,
              parts: [...prev.parts, nextPart]
          } : null);

      } catch (e: any) {
          console.error(e);
          const msg = e.message || "Error al continuar la idea.";
          setError(`No se pudo continuar. ${msg}`);
      } finally {
          setIsGenerating(false);
      }
  };

  // --- TRAILER ASSISTANT: REFRESH PART X ---
  const handleRefreshPart = async (partIndex: number) => {
    if (!activeProject || activeProject.parts.length < partIndex) return;
    
    // We are refreshing part at partIndex (1-based).
    // Context is everything BEFORE this part.
    // Index in array is partIndex - 1.
    
    setError(null);
    setIsGenerating(true);
    setLoadingText(t.buttons.analyzing);
    
    try {
        const nextVar = variationCount + 1;
        setVariationCount(nextVar);

        // Slice parts from 0 to (partIndex - 1) as context
        const previousParts = activeProject.parts.slice(0, partIndex - 1);
        
        const refreshedPart = await generateMarketingPart(
            state,
            state.trailerImage,
            previousParts,
            nextVar
        );
        
        // Force the index to remain consistent
        refreshedPart.part_index = partIndex;

        setActiveProject(prev => {
            if (!prev) return null;
            const newParts = [...prev.parts];
            // Replace the part at specific index
            newParts[partIndex - 1] = refreshedPart;
            return {
                ...prev,
                parts: newParts
            };
        });

    } catch(e: any) {
        console.error(e);
        const msg = e.message || "Error al refrescar la parte.";
        setError(`No se pudo refrescar. ${msg}`);
    } finally {
        setIsGenerating(false);
    }
  };

  // --- Drag & Drop Handlers (Image) ---
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => updateState('trailerImage', reader.result as string);
        reader.readAsDataURL(file);
    }
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => updateState('trailerImage', reader.result as string);
          reader.readAsDataURL(file);
      }
  };

  const saveCurrentProject = () => {
      if (activeProject) {
          const projectToSave = { ...activeProject, idea_title_es: editableTitle };
          setState(prev => ({
              ...prev,
              savedIdeas: [projectToSave, ...prev.savedIdeas]
          }));
      }
  };

  const deleteSavedIdea = (id: string) => {
      setState(prev => ({
          ...prev,
          savedIdeas: prev.savedIdeas.filter(i => i.id !== id)
      }));
  };

  const copyToClipboard = (text: string, setFn?: (b: boolean) => void) => {
      navigator.clipboard.writeText(text);
      if (setFn) {
          setFn(true);
          setTimeout(() => setFn(false), 2000);
      }
  };

  // Copy states
  const [copiedEs, setCopiedEs] = useState(false);
  const [copiedEn, setCopiedEn] = useState(false);
  const [copiedTemplateEs, setCopiedTemplateEs] = useState(false);
  const [copiedTemplateEn, setCopiedTemplateEn] = useState(false);

  // Determine if placeholder should be shown
  const showPlaceholder = !isGenerating && !error && (
      (state.activeTab === 'builder' && !result) ||
      (state.activeTab === 'trailer' && !activeProject)
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col md:flex-row font-sans selection:bg-indigo-500/30">
      
      {/* LEFT PANEL: INPUTS (FIXED LAYOUT) */}
      <div className="w-full md:w-[450px] lg:w-[500px] flex-shrink-0 bg-gray-900 border-r border-gray-800 h-screen flex flex-col">
        
        {/* Header (Fixed Top) */}
        <div className="flex-none bg-gray-900/95 backdrop-blur z-20 border-b border-gray-800 relative">
            {/* Language Toggle */}
            <div className="absolute top-4 right-4 z-30">
                <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
                    <button 
                        onClick={() => updateState('language', 'es')}
                        className={`px-2 py-1 text-xs font-bold rounded ${state.language === 'es' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >ES</button>
                    <button 
                        onClick={() => updateState('language', 'en')}
                        className={`px-2 py-1 text-xs font-bold rounded ${state.language === 'en' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >EN</button>
                </div>
            </div>

            <div className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-indigo-600 rounded-lg">
                        <Clapperboard size={24} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white">{t.appTitle}</h1>
                </div>
                <p className="text-sm text-gray-400 pl-1">{t.appSubtitle}</p>
            </div>
            
            {/* Tabs */}
            <div className="flex px-6 gap-6">
                <button 
                    onClick={() => updateState('activeTab', 'builder')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${state.activeTab === 'builder' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                    {t.tabs.builder}
                </button>
                <button 
                     onClick={() => updateState('activeTab', 'trailer')}
                     className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${state.activeTab === 'trailer' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                    <Upload size={14}/> {t.tabs.trailer}
                </button>
            </div>
        </div>

        {/* Scrollable Middle Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative">
        
        {/* --- TAB CONTENT: BUILDER --- */}
        {state.activeTab === 'builder' && (
            <>
            {/* Preset Toggle */}
            <div 
                onClick={handlePresetToggle}
                className={`cursor-pointer border rounded-xl p-4 transition-all duration-200 select-none ${
                    state.isPortraitPreset 
                    ? 'bg-indigo-900/20 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <User size={20} className={state.isPortraitPreset ? "text-indigo-400" : "text-gray-500"} />
                        <div>
                            <h3 className={`text-sm font-bold ${state.isPortraitPreset ? 'text-indigo-400' : 'text-gray-300'}`}>
                                {t.preset.label}
                            </h3>
                            <p className="text-xs text-gray-500">{t.preset.desc}</p>
                        </div>
                    </div>
                    {state.isPortraitPreset ? <ToggleRight className="text-indigo-400"/> : <ToggleLeft className="text-gray-500"/>}
                </div>
                {state.isPortraitPreset && (
                    <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                        <div className="text-xs font-mono text-gray-400 bg-gray-900/50 p-3 rounded border border-gray-700/50 relative group">
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={(e) => { e.stopPropagation(); copyToClipboard(PORTRAIT_TEMPLATE_ES, setCopiedTemplateEs); }} className="p-1 hover:bg-gray-700 rounded text-gray-300">
                                    {copiedTemplateEs ? <Check size={12} className="text-green-400"/> : <Copy size={12}/>}
                                </button>
                            </div>
                            <span className="text-indigo-400 font-bold block mb-1">{t.preset.templateEs}</span>
                            {PORTRAIT_TEMPLATE_ES}
                        </div>
                        <div className="text-xs font-mono text-gray-400 bg-gray-900/50 p-3 rounded border border-gray-700/50 relative group">
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={(e) => { e.stopPropagation(); copyToClipboard(PORTRAIT_TEMPLATE_EN, setCopiedTemplateEn); }} className="p-1 hover:bg-gray-700 rounded text-gray-300">
                                    {copiedTemplateEn ? <Check size={12} className="text-green-400"/> : <Copy size={12}/>}
                                </button>
                            </div>
                            <span className="text-indigo-400 font-bold block mb-1">{t.preset.templateEn}</span>
                            {PORTRAIT_TEMPLATE_EN}
                        </div>
                    </div>
                )}
            </div>

            {/* Core Settings */}
            <div className="space-y-4">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{t.sections.engine}</h2>
                <Dropdown label={t.labels.engine} options={getOptions(ENGINES)} value={state.engine} onChange={(v) => updateState('engine', v)} icon={<MonitorPlay size={14} />} />
                
                {/* Multi-shot Toggle (Video only) */}
                {isVideo && !state.isPortraitPreset && (
                    <div className={`flex items-center justify-between p-3 rounded-lg border ${isKling ? 'bg-indigo-900/10 border-indigo-500/30' : 'bg-gray-800/50 border-gray-700'}`}>
                        <span className="text-sm text-gray-300 flex items-center gap-2">
                            <Film size={16} className={isKling || state.isMultiShotMode ? "text-indigo-400" : "text-gray-500"}/> 
                            {isKling ? t.multiShot.klingMode : t.multiShot.optionalMode}
                        </span>
                        {!isKling && (
                            <button 
                                onClick={() => {
                                    const newVal = !state.isMultiShotMode;
                                    updateState('isMultiShotMode', newVal);
                                    if (newVal && state.multiShotPlan.length === 0) {
                                        updateState('multiShotPlan', [{...DEFAULT_SHOT, id: '1'}]);
                                    }
                                }} 
                                className={`${state.isMultiShotMode ? 'text-indigo-400' : 'text-gray-500'}`}
                            >
                                {state.isMultiShotMode ? <ToggleRight size={28}/> : <ToggleLeft size={28}/>}
                            </button>
                        )}
                        {isKling && <span className="text-xs text-indigo-400 font-bold px-2">ON</span>}
                    </div>
                )}

                {!state.isMultiShotMode && (
                    <div className="col-span-1">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                            <Wand2 size={14} className="text-indigo-400"/> {t.sections.sceneDesc} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={state.sceneDescription}
                            onChange={(e) => updateState('sceneDescription', e.target.value)}
                            className="w-full h-24 bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none placeholder-gray-500"
                            placeholder={state.isPortraitPreset ? t.placeholders.scenePreset : t.placeholders.scene}
                        />
                    </div>
                )}

                <Dropdown label={t.labels.genre} options={getOptions(GENRES)} value={state.genre} onChange={(v) => updateState('genre', v)} icon={<Palette size={14} />} />
            </div>
            
            <div className="h-px bg-gray-800" />

            {/* MULTI-SHOT BUILDER UI */}
            {state.isMultiShotMode && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{t.multiShot.planHeader} ({state.multiShotPlan.length}/{isKling ? 6 : 4})</h2>
                        <button onClick={addShot} disabled={state.multiShotPlan.length >= (isKling ? 6 : 4)} className="text-xs flex items-center gap-1 bg-indigo-600 px-2 py-1 rounded hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold">
                            <Plus size={12}/> {t.buttons.addShot}
                        </button>
                    </div>

                    <div className="space-y-3">
                        {state.multiShotPlan.map((shot, index) => (
                            <div key={shot.id} className="bg-gray-800 border border-gray-700 p-4 rounded-xl space-y-3 relative group">
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => removeShot(shot.id)} 
                                        disabled={state.multiShotPlan.length <= 1}
                                        className="text-red-400 hover:text-red-300 disabled:opacity-30"
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-indigo-900/50 text-indigo-300 text-xs px-2 py-0.5 rounded font-mono font-bold">{t.multiShot.shot} #{index+1}</span>
                                    {isKling && (
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <Clock size={12}/>
                                            <input 
                                                type="number" 
                                                value={shot.duration} 
                                                onChange={(e) => updateShot(shot.id, 'duration', e.target.value)}
                                                className="w-12 bg-gray-900 border border-gray-700 rounded px-1 text-center focus:border-indigo-500 outline-none"
                                            />s
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    placeholder={t.placeholders.shotAction}
                                    value={shot.action}
                                    onChange={(e) => updateShot(shot.id, 'action', e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm focus:ring-1 focus:ring-indigo-500 placeholder-gray-600 outline-none"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <Dropdown label={t.labels.shotSize} options={getOptions(SHOT_SIZES)} value={shot.shotSize} onChange={(v) => updateShot(shot.id, 'shotSize', v)} />
                                    <Dropdown label={t.labels.cameraAngle} options={getOptions(CAMERA_ANGLES)} value={shot.cameraAngle} onChange={(v) => updateShot(shot.id, 'cameraAngle', v)} />
                                    <Dropdown label={t.labels.composition} options={getOptions(COMPOSITIONS)} value={shot.composition} onChange={(v) => updateShot(shot.id, 'composition', v)} />
                                    <Dropdown label={t.labels.movement} options={getOptions(CAMERA_MOVEMENTS)} value={shot.cameraMovement} onChange={(v) => updateShot(shot.id, 'cameraMovement', v)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Standard Camera & Lens (Global or Single Shot) */}
            {!state.isMultiShotMode && (
                <>
                    <div className="space-y-4">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{t.sections.camera}</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Dropdown label={t.labels.shotSize} options={getOptions(SHOT_SIZES)} value={state.shotSize} onChange={(v) => updateState('shotSize', v)} icon={<Camera size={14}/>} />
                            <Dropdown label={t.labels.cameraAngle} options={getOptions(CAMERA_ANGLES)} value={state.cameraAngle} onChange={(v) => updateState('cameraAngle', v)} icon={<Camera size={14}/>} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Dropdown label={t.labels.composition} options={getOptions(COMPOSITIONS)} value={state.composition} onChange={(v) => updateState('composition', v)} icon={<Camera size={14}/>} />
                            <Dropdown label={t.labels.movement} options={getOptions(CAMERA_MOVEMENTS)} value={state.cameraMovement} onChange={(v) => updateState('cameraMovement', v)} icon={<Wind size={14}/>} />
                        </div>
                    </div>
                    <div className="h-px bg-gray-800" />
                </>
            )}

            {/* Global Settings */}
            <div className="space-y-4">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{t.sections.atmosphere}</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Dropdown label={t.labels.lens} options={getOptions(LENSES)} value={state.lens} onChange={(v) => updateState('lens', v)} icon={<Aperture size={14}/>} />
                    <Dropdown label={t.labels.depth} options={getOptions(DEPTH_OF_FIELD)} value={state.depthOfField} onChange={(v) => updateState('depthOfField', v)} icon={<Aperture size={14}/>} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Dropdown label={t.labels.lighting} options={getOptions(LIGHTING)} value={state.lighting} onChange={(v) => updateState('lighting', v)} icon={<Zap size={14}/>} />
                    <Dropdown label={t.labels.color} options={getOptions(COLOR_GRADING)} value={state.colorGrading} onChange={(v) => updateState('colorGrading', v)} icon={<Palette size={14}/>} />
                </div>
                <Dropdown label={t.labels.atmosphere} options={getOptions(ATMOSPHERE)} value={state.atmosphere} onChange={(v) => updateState('atmosphere', v)} icon={<Wind size={14}/>} />
            </div>

            <div className="h-px bg-gray-800" />

            {/* Technical */}
            <div className="space-y-4">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{t.sections.technical}</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Dropdown label={t.labels.quality} options={getOptions(QUALITY)} value={state.quality} onChange={(v) => updateState('quality', v)} icon={<MonitorPlay size={14}/>} />
                    <Dropdown label={t.labels.aspectRatio} options={getOptions(ASPECT_RATIOS)} value={state.aspectRatio} onChange={(v) => updateState('aspectRatio', v)} icon={<MonitorPlay size={14}/>} />
                </div>
                
                {isVideo && !state.isMultiShotMode && (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                        <Dropdown label={t.labels.pace} options={getOptions(PACE)} value={state.pace} onChange={(v) => updateState('pace', v)} icon={<Clock size={14}/>} />
                        <Dropdown label={t.labels.duration} options={getOptions(DURATIONS)} value={state.duration} onChange={(v) => updateState('duration', v)} icon={<Clock size={14}/>} />
                    </div>
                )}
                
                <MultiSelect 
                    label={t.labels.avoid} 
                    options={getOptions(AVOID_OPTIONS)} 
                    selectedValues={state.avoid} 
                    onChange={(v) => updateState('avoid', v)} 
                    icon={<XCircle size={14}/>}
                />
            </div>
            </>
        )}

        {/* --- TAB CONTENT: TRAILER / MARKETING ASSISTANT --- */}
        {state.activeTab === 'trailer' && (
             <div className="space-y-6 flex flex-col">
                 
                 {/* 1. Image Upload */}
                 <div 
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    className={`border border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all group relative ${
                        isDragging ? 'bg-indigo-900/30 border-indigo-400' : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-indigo-500/50'
                    }`}
                 >
                    <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="trailer-upload"
                    />
                    {!state.trailerImage ? (
                        <label htmlFor="trailer-upload" className="cursor-pointer w-full flex flex-col items-center">
                            <ImageIcon size={28} className="text-gray-500 group-hover:text-indigo-400 mb-2"/>
                            <h3 className="font-bold text-gray-300 text-sm">
                                {t.buttons.uploadImage}
                            </h3>
                            <p className="text-[10px] text-gray-500 mt-1 max-w-xs">
                                {t.trailer.uploadDesc}
                            </p>
                        </label>
                    ) : (
                        <div className="relative group/preview w-full flex justify-center">
                             <img src={state.trailerImage} alt="Preview" className="h-32 object-contain rounded-lg shadow-lg"/>
                             <button 
                                onClick={(e) => { e.preventDefault(); updateState('trailerImage', null); }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover/preview:opacity-100 transition-opacity"
                                title={t.buttons.removeImage}
                             >
                                 <XCircle size={16}/>
                             </button>
                        </div>
                    )}
                 </div>

                 <div className="space-y-4">
                     <div>
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                            <Lightbulb size={14} className="text-indigo-400"/> {t.trailer.marketingLabel}
                        </label>
                        <textarea
                            value={state.marketingGoal}
                            onChange={(e) => updateState('marketingGoal', e.target.value)}
                            className="w-full h-24 bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none placeholder-gray-500"
                            placeholder={t.placeholders.marketingGoal}
                        />
                     </div>
                     <Dropdown label={t.trailer.targetEngine} options={getOptions(ENGINES)} value={state.engine} onChange={(v) => updateState('engine', v)} />
                     <Dropdown label={t.trailer.targetGenre} options={getOptions(GENRES)} value={state.genre} onChange={(v) => updateState('genre', v)} />
                 </div>

                 {/* Marketing Buttons */}
                 <div className="grid grid-cols-2 gap-3">
                     <button
                        onClick={() => handleMarketingGenerate(false)}
                        disabled={isGenerating}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                     >
                        {isGenerating ? <Loader2 size={16} className="animate-spin"/> : <Zap size={16}/>}
                        {t.buttons.genConcept}
                     </button>
                     <button
                        onClick={() => handleMarketingGenerate(true)}
                        disabled={isGenerating}
                        className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                     >
                        <RefreshCw size={16} className={isGenerating ? 'animate-spin' : ''}/>
                        {t.buttons.refreshConcept}
                     </button>
                 </div>
                 
                 {/* Continuation Buttons */}
                 {activeProject && activeProject.parts.length > 0 && (
                     <div className="flex gap-2 mt-1">
                        <button
                            onClick={handleContinueIdea}
                            disabled={isGenerating}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <ArrowDown size={16}/> {t.buttons.continueConcept}
                        </button>
                        
                        {/* Only show refresh part 2 if we have at least 2 parts */}
                        {activeProject.parts.length >= 2 && (
                             <button
                                onClick={() => handleRefreshPart(2)}
                                disabled={isGenerating}
                                className="flex-1 bg-indigo-500/80 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <RefreshCw size={16} className={isGenerating ? "animate-spin" : ""}/> 
                                {t.buttons.refreshPart2}
                            </button>
                        )}
                     </div>
                 )}

                 {/* Saved Ideas List */}
                 {state.savedIdeas.length > 0 && (
                     <div className="space-y-3 pt-6 border-t border-gray-800">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.trailer.savedIdeas}</h3>
                        {state.savedIdeas.map(idea => (
                            <SavedIdeaCard key={idea.id} idea={idea} onDelete={deleteSavedIdea} t={t} />
                        ))}
                     </div>
                 )}
                 <div className="h-10"></div>
             </div>
        )}
        </div>

        {/* FOOTER (FIXED OUTSIDE SCROLL) */}
        {state.activeTab === 'builder' && (
            <div className="flex-none bg-gray-900 pt-4 pb-6 px-6 border-t border-gray-800 z-20">
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg shadow-lg transition-all ${
                        isGenerating ? 'bg-gray-800 text-gray-500' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                >
                    {isGenerating ? <Loader2 className="animate-spin"/> : <Wand2 size={20}/>}
                    {isGenerating ? loadingText : t.buttons.generate}
                </button>
            </div>
        )}

      </div>

      {/* RIGHT PANEL: PREVIEW */}
      <div className="flex-1 bg-black/50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] h-screen overflow-y-auto p-6 md:p-12 flex flex-col items-center relative">
         <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900/20 -z-10" />
         
         {/* WELCOME STATE (PLACEHOLDER) */}
         {showPlaceholder && (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 max-w-md">
                <div className="w-24 h-24 bg-gray-800/50 rounded-full mb-6 flex items-center justify-center">
                    <Clapperboard size={40} className="text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-300 mb-2">{t.appTitle}</h3>
                <p className="text-gray-500">{t.results.readyDesc}</p>
            </div>
         )}

         {/* ERROR STATE */}
         {!isGenerating && error && (
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle size={32} className="text-red-400"/>
                </div>
                <h3 className="text-xl font-bold text-gray-200">Error</h3>
                <p className="text-gray-400 mt-2">{error}</p>
                <button 
                    onClick={() => setError(null)}
                    className="mt-6 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm border border-gray-700"
                >
                    Cerrar
                </button>
            </div>
         )}
         
         {/* LOADING STATE FOR TRAILER */}
         {isGenerating && state.activeTab === 'trailer' && (
             <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 bg-indigo-900/30 rounded-full flex items-center justify-center mb-6">
                    <Loader2 size={32} className="text-indigo-400 animate-spin"/>
                </div>
                <h3 className="text-xl font-bold text-gray-200">{loadingText}</h3>
                <p className="text-gray-500 mt-2 text-sm">Gemini 3 Flash Pro • JSON Mode</p>
             </div>
         )}

         {/* BUILDER RESULTS */}
         {state.activeTab === 'builder' && result && !isGenerating && !error && (
            <div className="w-full max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-10">
                {/* ... (Existing Builder UI) ... */}
                {/* 1. Multi Shot Details */}
                {state.isMultiShotMode && result.multiShotResults && (
                    <div className="space-y-6">
                         <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-widest text-sm border-b border-indigo-900/50 pb-2">
                            <Film size={16}/> {t.multiShot.planHeader}
                         </div>
                        {result.multiShotResults.map((shot, idx) => (
                             <div key={idx} className="bg-gray-800/80 border border-gray-700 rounded-xl overflow-hidden">
                                <div className="px-4 py-2 bg-gray-900/50 border-b border-gray-700 flex justify-between">
                                    <span className="text-xs font-bold text-gray-400">{t.multiShot.shot} #{idx+1}</span>
                                    <button onClick={() => copyToClipboard(shot.promptEn)}><Copy size={14} className="text-gray-500 hover:text-white"/></button>
                                </div>
                                <div className="p-4 text-xs font-mono text-gray-300">{shot.promptEn}</div>
                             </div>
                        ))}
                    </div>
                )}
                
                {/* 2. Negatives */}
                <div className="grid grid-cols-2 gap-4">
                     <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-4">
                        <h4 className="text-red-400 text-xs font-bold mb-2 uppercase">{t.results.negative} (EN)</h4>
                        <div className="flex justify-between items-start">
                            <p className="text-xs text-red-300/80 font-mono flex-1">{result.negativePromptEn}</p>
                            <button onClick={() => copyToClipboard(result.negativePromptEn)} className="text-red-400 hover:text-red-200 ml-2"><Copy size={14}/></button>
                        </div>
                     </div>
                     <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-4">
                        <h4 className="text-red-400 text-xs font-bold mb-2 uppercase">{t.results.negative} (ES)</h4>
                         <div className="flex justify-between items-start">
                            <p className="text-xs text-red-300/80 font-mono flex-1">{result.negativePromptEs}</p>
                            <button onClick={() => copyToClipboard(result.negativePromptEs)} className="text-red-400 hover:text-red-200 ml-2"><Copy size={14}/></button>
                        </div>
                     </div>
                </div>

                {/* 3. FINAL PROMPTS */}
                <div className="space-y-6 border-t border-gray-700/50 pt-6">
                    <h3 className="text-lg font-bold text-gray-200 mb-2 flex items-center gap-2">
                        <Wand2 size={18} className="text-indigo-400"/> 
                        {state.isMultiShotMode ? t.results.master : "Prompts Finales"}
                    </h3>

                    {/* Final EN */}
                    <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
                         <div className="bg-gray-900/50 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                            <span className="font-semibold text-gray-200 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-500"/> 
                                {state.isMultiShotMode ? t.results.master + ' (EN)' : t.results.finalEn}
                            </span>
                            <button 
                                onClick={() => copyToClipboard(result.promptEn, setCopiedEn)} 
                                className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                {copiedEn ? <Check size={14} className="text-green-400"/> : <Copy size={14}/>}
                                {t.buttons.copy}
                            </button>
                        </div>
                        <div className="p-6 font-mono text-sm text-gray-300 leading-relaxed">{result.promptEn}</div>
                    </div>

                    {/* Final ES */}
                    <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
                         <div className="bg-gray-900/50 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                            <span className="font-semibold text-gray-200 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-orange-500"/> 
                                {state.isMultiShotMode ? t.results.master + ' (ES)' : t.results.finalEs}
                            </span>
                            <button 
                                onClick={() => copyToClipboard(result.promptEs, setCopiedEs)} 
                                className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                {copiedEs ? <Check size={14} className="text-green-400"/> : <Copy size={14}/>}
                                {t.buttons.copy}
                            </button>
                        </div>
                        <div className="p-6 font-mono text-sm text-gray-300 leading-relaxed">{result.promptEs}</div>
                    </div>
                </div>

            </div>
         )}

         {/* TRAILER / MARKETING RESULTS */}
         {state.activeTab === 'trailer' && activeProject && !isGenerating && !error && (
             <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-10 pb-20">
                 
                 {/* Main Idea Card (Part 1 Info) */}
                 <div className="bg-indigo-900/10 border border-indigo-500/30 rounded-2xl p-8 relative overflow-hidden">
                     <div className="absolute top-4 right-4 z-10">
                         <button 
                            onClick={saveCurrentProject}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                         >
                             <Save size={16}/> {t.buttons.saveIdea}
                         </button>
                     </div>
                     <div className="text-center space-y-4 relative z-0">
                         <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                             {activeProject.platform}
                         </span>
                         
                         {/* Editable Title */}
                         <div className="flex items-center justify-center gap-2 group/title relative max-w-2xl mx-auto">
                            <input 
                                value={editableTitle}
                                onChange={(e) => setEditableTitle(e.target.value)}
                                className="text-4xl font-bold text-white tracking-tight leading-tight bg-transparent border-b border-transparent hover:border-gray-500 focus:border-indigo-500 focus:outline-none text-center w-full transition-colors pb-1"
                            />
                            <div className="absolute -right-8 opacity-0 group-hover/title:opacity-100 transition-opacity">
                                <Edit2 size={16} className="text-gray-500"/>
                            </div>
                            {editableTitle !== activeProject.idea_title_es && (
                                <button 
                                    onClick={() => setEditableTitle(activeProject.idea_title_es)}
                                    className="absolute -left-8 p-1 text-gray-500 hover:text-white"
                                    title="Reset title"
                                >
                                    <RotateCcw size={16}/>
                                </button>
                            )}
                         </div>

                         <p className="text-xl text-gray-300 italic font-light">"{activeProject.logline_es}"</p>
                         
                         {/* Engine Recommendation */}
                         {activeProject.recommended_engine_label && (
                             <div className="inline-flex items-center gap-2 bg-emerald-900/30 border border-emerald-500/30 rounded-full px-4 py-1.5 text-xs text-emerald-300 mt-2">
                                 <Sparkles size={12}/>
                                 <span>{t.trailer.recommendation}: <b>{activeProject.recommended_engine_label}</b></span>
                             </div>
                         )}
                     </div>
                 </div>

                 {/* PART BY PART LISTING */}
                 {activeProject.parts.map((part, partIdx) => (
                     <div key={partIdx} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                         <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                             <h3 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
                                 <div className="bg-indigo-600 w-6 h-6 rounded flex items-center justify-center text-xs text-white">
                                     {part.part_index}
                                 </div>
                                 {part.part_label_es} 
                                 <span className="text-gray-500 text-sm font-normal">
                                     ({(part.part_index - 1) * 15}s - {part.part_index * 15}s)
                                 </span>
                             </h3>
                         </div>
                         <div className="grid grid-cols-1 gap-4">
                             {part.shots?.map((shot, idx) => (
                                 <TrailerShotCard 
                                    key={idx} 
                                    shot={shot} 
                                    index={idx} 
                                    partStart={(part.part_index-1)*15} 
                                    shotLabel={t.trailer.shotPrefix}
                                 />
                             ))}
                         </div>
                         {/* Captions for this part if available */}
                         {part.caption_suggestions_es && part.caption_suggestions_es.length > 0 && (
                            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
                                <span className="text-xs font-bold text-gray-500 uppercase">Captions:</span>
                                <p className="text-sm text-gray-300 mt-1">{part.caption_suggestions_es.join(' | ')}</p>
                            </div>
                         )}
                     </div>
                 ))}
                 
                 {/* Continuation & Refresh Buttons */}
                 <div className="flex gap-2 justify-center py-6">
                     <button
                        onClick={handleContinueIdea}
                        disabled={isGenerating}
                        className="flex-1 max-w-xs bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full font-bold shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                     >
                        {isGenerating ? <Loader2 size={18} className="animate-spin"/> : <ArrowDown size={18}/>}
                        {t.buttons.continueConcept}
                     </button>

                     {/* Only show refresh part 2 if we have at least 2 parts */}
                     {activeProject.parts.length >= 2 && (
                         <button
                            onClick={() => handleRefreshPart(2)}
                            disabled={isGenerating}
                            className="flex-1 max-w-xs bg-indigo-500/80 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-bold shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <RefreshCw size={18} className={isGenerating ? "animate-spin" : ""}/> 
                            {t.buttons.refreshPart2}
                        </button>
                    )}
                 </div>

                 {/* Debug JSON Toggle */}
                 <div className="flex justify-center pt-4 opacity-50 hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => setShowJson(!showJson)}
                        className="text-[10px] uppercase tracking-widest text-gray-500 flex items-center gap-2 hover:text-indigo-400"
                    >
                        <Code size={12}/> {showJson ? "Ocultar JSON" : "Ver JSON (Debug)"}
                    </button>
                 </div>
                 {showJson && (
                     <div className="bg-black/50 p-4 rounded-lg font-mono text-[10px] text-gray-500 overflow-x-auto whitespace-pre-wrap border border-gray-800">
                         {JSON.stringify(activeProject, null, 2)}
                     </div>
                 )}
             </div>
         )}

      </div>
    </div>
  );
}