import React, { useState, useEffect } from "react";
import RealMapSelector from "./components/RealMapSelector";
import ProgressLoader from "./components/ProgressLoader";
import { 
  Sparkles, 
  Map, 
  Search, 
  FileText, 
  Video, 
  Lightbulb, 
  Compass, 
  Award, 
  CheckCircle2, 
  Download, 
  Send, 
  Layers, 
  Activity, 
  Smartphone, 
  Mail, 
  Sliders, 
  TrendingUp, 
  AlertTriangle, 
  PlusCircle, 
  Briefcase, 
  DollarSign, 
  Users, 
  Globe, 
  ShieldCheck, 
  Target, 
  Cpu, 
  HelpCircle,
  Clock,
  Wifi,
  BatteryCharging,
  User,
  LogOut,
  Share2,
  Camera,
  Check,
  Edit,
  Lock,
  Play,
  Menu,
  UserPlus
} from "lucide-react";
import { type UserProfile, loadUser, saveUser, clearUser } from "./utils/userStorage";
import { getPercentageColor, getMetricColor, getScoreBadgeClass } from "./utils/scoreColors";
import { postJson } from "./utils/api";
import { useAsyncOperation } from "./hooks/useAsyncOperation";

export default function App() {
  const [time, setTime] = useState("");

  // ====== AUTH & USER STATE ======
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(loadUser);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loginPromptReason, setLoginPromptReason] = useState("");
  const [authStep, setAuthStep] = useState<"platformSelection" | "credentialsForm">("platformSelection");
  const [authMethod, setAuthMethod] = useState<"email" | "google" | "tiktok">("email");

  const [authRole, setAuthRole] = useState<"Emprendedor" | "Empresario/Patrocinador">("Emprendedor");
  const [editRole, setEditRole] = useState<"Emprendedor" | "Empresario/Patrocinador">("Emprendedor");

  // Form states for login/signup
  const [authUsername, setAuthUsername] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authAvatar, setAuthAvatar] = useState("");
  const [authProjectName, setAuthProjectName] = useState("");
  const [authSector, setAuthSector] = useState("");

  // Edit profile states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editProjectName, setEditProjectName] = useState("");
  const [editSector, setEditSector] = useState("");

  // Limit / Upgrade suggestions modal state
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [inviteFriendName, setInviteFriendName] = useState("");
  const [inviteFriendEmail, setInviteFriendEmail] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // 1. Company Data State
  const [estado, setEstado] = useState("");
  const [sectorSel, setSectorSel] = useState("");
  const [sectorCustom, setSectorCustom] = useState("");
  const [modelo, setModelo] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [publico, setPublico] = useState("");
  const [diferenciacion, setDiferenciacion] = useState("");
  const [desc, setDesc] = useState("");
  const [inst, setInst] = useState("");
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [logoName, setLogoName] = useState("");

  const persistUser = (user: UserProfile) => {
    setCurrentUser(user);
    saveUser(user);
  };

  // Analysis result states
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analysisOp, analysisActions] = useAsyncOperation({
    initialProgress: 10,
    initialRemaining: 30,
    progressStep: 5,
    progressMax: 95,
    progressIntervalMs: 1500,
    remainingStep: 2,
    remainingMin: 2,
    initialLogs: [
      "Estableciendo conexión segura con servidor central de Innovaclub...",
      "Inyectando parámetros empresariales de análisis continuo...",
    ],
    scheduledLogs: [
      { afterCount: 2, message: "Evaluando matriz de competencia y posicionamiento corporativo..." },
      { afterCount: 3, message: "Optimizando modelo de ingresos frente a inversión disponible..." },
      { afterCount: 4, message: "Generando informe analítico DAFO estructurado..." },
    ],
    logIntervalMs: 4000,
  });

  // HISTORIAL DE ANÁLISIS REALIZADOS (MODULO DESLIZANTE CON RANKING/SCORE)
  const [recentAnalyses, setRecentAnalyses] = useState([
    { id: 1, name: "AgroTrace Coffee Co.", type: "Empresa", idea: "Trazabilidad de calidad en microlotes de café usando blockchain y sensores inteligentes", score: 94, sector: "AgroTecnología" },
    { id: 2, name: "EcoPack Solutions", type: "Empresa", idea: "Sustitución de poliestireno por empaques compostables cultivados a base de micelio de hongo", score: 91, sector: "Empaques Sostenibles" },
    { id: 3, name: "SaaS Lumina Optimizer", type: "Proyecto", idea: "Automatización de presupuesto de pauta online con IA predictiva para reducir pérdidas en PYMEs", score: 87, sector: "Software / Marketing" },
    { id: 4, name: "FitPulse AI Trainer", type: "Proyecto", idea: "Tutor inteligente móvil interactivo que calibra rutinas mediante audio y análisis de postura en vivo", score: 84, sector: "Salud / Fitness" },
    { id: 5, name: "RestoQr Fast", type: "Idea", idea: "Unificación móvil de pedidos y pasarela de cobro inmediato en mesas evitando retardos de meseros", score: 79, sector: "Gastronomía / FinTech" },
    { id: 6, name: "EduGenie", type: "Idea", idea: "Generador dinámico autónomo de guías escolares y corporativas interactivas adaptadas al usuario", score: 76, sector: "Educación / EdTech" },
    { id: 7, name: "Grooming Express", type: "Idea", idea: "Servicio de furgonetas de peluquería de mascotas premium geolocalizadas según flujo de llamadas en vivo", score: 81, sector: "Servicios Locales" }
  ]);
  const [activeAnalysisDetail, setActiveAnalysisDetail] = useState<any>(null);
  const [searchHistoryTerm, setSearchHistoryTerm] = useState("");
  const [activeToolSimulated, setActiveToolSimulated] = useState<any>(null);
  const [isToolProcessing, setIsToolProcessing] = useState(false);

  // Estados para selector de mapa interactivo
  const [mapOpen, setMapOpen] = useState(true);
  const [selectedMapNode, setSelectedMapNode] = useState<number | null>(null);

  // Estados para negociaciones de patrocinio de admisión destacados
  const [activeNegotiationProject, setActiveNegotiationProject] = useState<any>(null);
  const [negoSponsorAmount, setNegoSponsorAmount] = useState("$15,000 USD");
  const [negoEquityWanted, setNegoEquityWanted] = useState("8");
  const [negoSponsorType, setNegoSponsorType] = useState("Patrocinio + Co-Escalamiento");
  const [negoSponsorName, setNegoSponsorName] = useState("");
  const [negoSponsorPhone, setNegoSponsorPhone] = useState("");

  // Estados para el motor de avalúo y "Empresas y Negocios en venta"
  const [valVentasAnuales, setValVentasAnuales] = useState(120000); 
  const [valEbitdaMargin, setValEbitdaMargin] = useState(18); 
  const [valInventario, setValInventario] = useState(24000); 
  const [valAntiguedad, setValAntiguedad] = useState(3); 
  const [valEscalabilidad, setValEscalabilidad] = useState(2.2); 
  const [valPrestigio, setValPrestigio] = useState(0.15); 
  const [isCalculatedVal, setIsCalculatedVal] = useState(false);
  const [calculatedValuation, setCalculatedValuation] = useState(0);
  const [calculatedCommission, setCalculatedCommission] = useState(0);
  const [isValOptimized, setIsValOptimized] = useState(false);

  const interactiveMapNodes = [
    { id: 1, name: "Parque de la 93, Bogotá", coords: "4.6768° N, 74.0483° W", type: "Zona Comercial Sólida (Startups & Gastronomía)" },
    { id: 2, name: "El Poblado, Medellín", coords: "6.2084° N, 75.5674° W", type: "Hub Innovador de Tecnología & Co-Working" },
    { id: 3, name: "Chapinero Alto, Bogotá", coords: "4.6460° N, 74.0620° W", type: "Distrito Tecnológico & Industrias Creativas" },
    { id: 4, name: "Polanco Reforma, CDMX", coords: "19.4326° N, 99.1932° W", type: "Centro Corporativo Global & Capital Semilla" },
    { id: 5, name: "Las Condes, Santiago", coords: "33.4135° S, 70.5702° W", type: "Sanhattan - Mercados Corporativos Premium" },
    { id: 6, name: "Miraflores, Lima", coords: "12.1225° S, 77.0286° W", type: "Sector Turístico & Hub de Retail Masivo" },
    { id: 7, name: "Paseo de la Reforma, CDMX", coords: "19.4265° N, 99.1677° W", type: "Finanzas Internacionales & Corporativos" },
    { id: 8, name: "San Victorino, Bogotá", coords: "4.6015° N, 74.0761° W", type: "Comercio de Alta Rotación & Canal Mayorista" }
  ];

  // 2. Radar Geo State inside same box
  const [ubi, setUbi] = useState("Bogotá, Colombia");
  const [geoStatus, setGeoStatus] = useState("");
  const [geoStatusColor, setGeoStatusColor] = useState("");
  const [range, setRange] = useState("500m");
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanOp, scanActions] = useAsyncOperation({
    initialProgress: 15,
    initialRemaining: 15,
    progressStep: 8,
    progressMax: 95,
    progressIntervalMs: 1000,
    remainingStep: 1,
    remainingMin: 1,
    initialLogs: [],
    logIntervalMs: undefined,
  });

  // 3. Postulación Innovatorio State (12 parameters)
  const [pjNombreFundador, setPjNombreFundador] = useState("");
  const [pjNombreProyecto, setPjNombreProyecto] = useState("");
  const [pjDescripcion, setPjDescripcion] = useState("");
  
  const [pInovacion, setPInovacion] = useState("10"); // Defaults to top scores
  const [pTecnologia, setPTecnologia] = useState("10");
  const [pEscalabilidad, setPEscalabilidad] = useState("10");
  const [pEquipo, setPEquipo] = useState("10");
  const [pPrototipo, setPPrototipo] = useState("10");
  const [pMercado, setPMercado] = useState("10");
  const [pIngresos, setPIngresos] = useState("10");
  const [pPropiedad, setPPropiedad] = useState("10");
  const [pESG, setPESG] = useState("10");
  const [pTraccion, setPTraccion] = useState("10");
  const [pAdquisicion, setPAdquisicion] = useState("10");
  const [pFinanciamiento, setPFinanciamiento] = useState("10");

  const [projectResult, setProjectResult] = useState<any>(null);
  const [evalOp, evalActions] = useAsyncOperation({
    initialProgress: 10,
    initialRemaining: 35,
    progressStep: 6,
    progressMax: 95,
    progressIntervalMs: 2000,
    remainingStep: 2,
    remainingMin: 1,
    initialLogs: [
      "Buzón de postulación de Innovatorio aberto...",
      "Enviando postulación integral al Comité Evaluador Científico...",
      "Estructurando rúbrica de admisión de 12 parámetros de alta complejidad tecnológica...",
    ],
    scheduledLogs: [
      { afterCount: 3, message: "Generando simulación ponderada de tracción y escalado..." },
      { afterCount: 4, message: "Sintetizando paquete de automatización INNOVACLUB AI de tu plataforma..." },
    ],
    logIntervalMs: 5000,
  });

  // 4. Planes & Checkout states
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [currency, setCurrency] = useState("USD");
  const [payMethod, setPayMethod] = useState("");
  const [activeTab, setActiveTab] = useState("datos");
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

  // ====== ADMIN & USERS CONTROL DATABASE ======
  const [adminUserList, setAdminUserList] = useState([
    { id: 1, username: "Socio Fundador", email: "innovaclub.socio@gmail.com", phone: "+57 304 460 1667", plan: "elite", role: "Dueño/Admin", status: "Activo", projectName: "InnovaClub S.A.S.", sector: "LegalTech / FinTech", dateReg: "2023-01-10", dailyLimit: 99, usedToday: 4 },
    { id: 2, username: "Carlos Andrés Mendoza", email: "carlos.mendoza@agrotech.co", phone: "+57 311 445 2881", plan: "pro", role: "Emprendedor", status: "Activo", projectName: "AgroTrace Coffee Co.", sector: "AgroTecnología", dateReg: "2024-11-20", dailyLimit: 3, usedToday: 1 },
    { id: 3, username: "Diana Carolina Ruiz", email: "diana.ruiz@ecopack.co", phone: "+57 300 220 9015", plan: "elite", role: "Emprendedor", status: "Activo", projectName: "EcoPack Solutions", sector: "Empaques Sostenibles", dateReg: "2025-05-14", dailyLimit: 9, usedToday: 7 },
    { id: 4, username: "Mariana Estela Gómez", email: "mariana.gomez@lumina.io", phone: "+57 315 789 4432", plan: "basico", role: "Emprendedor", status: "Activo", projectName: "SaaS Lumina Optimizer", sector: "Software / Marketing", dateReg: "2026-02-02", dailyLimit: 1, usedToday: 0 },
    { id: 5, username: "Juan Camilo Castro", email: "juan.castro@fitpulse.ai", phone: "+57 318 905 1243", plan: "basico", role: "Emprendedor", status: "Pendiente", projectName: "FitPulse AI Trainer", sector: "Salud / Fitness", dateReg: "2026-03-31", dailyLimit: 1, usedToday: 1 },
    { id: 6, username: "Santiago Cabrera", email: "santiago@restoqr.com", phone: "+57 316 444 0988", plan: "basico", role: "Simulado", status: "Suspendido", projectName: "RestoQr Fast", sector: "Gastronomía / FinTech", dateReg: "2026-05-12", dailyLimit: 0, usedToday: 0 },
  ]);

  const [searchAdminQuery, setSearchAdminQuery] = useState("");
  const [selectedAdminUser, setSelectedAdminUser] = useState<any>(null);
  const [isAdminFormNewOpen, setIsAdminFormNewOpen] = useState(false);
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPhone, setNewAdminPhone] = useState("");
  const [newAdminProject, setNewAdminProject] = useState("");
  const [newAdminSector, setNewAdminSector] = useState("");
  const [newAdminPlan, setNewAdminPlan] = useState<"basico" | "pro" | "elite">("basico");
  const [newAdminRole, setNewAdminRole] = useState("Emprendedor");

  // Welcome Toast banner state
  const [welcomeToast, setWelcomeToast] = useState<string | null>(null);

  const planPrices = {
    basico: { name: "Básico", usd: 0, cop: 0, desc: "1 análisis de marca diario — 1 dispositivo" },
    pro: { name: "Pro", usd: 9.99, cop: 42000, desc: "3 análisis de marca diarios — hasta 2 dispositivos" },
    elite: { name: "Élite", usd: 24.99, cop: 105000, desc: "9 análisis de marca diarios — hasta 3 dispositivos" }
  };

  const selectPlan = (plan: string) => {
    setSelectedPlan(plan);
    if (currentUser) {
      persistUser({ ...currentUser, plan: plan as "basico" | "pro" | "elite" });
    }
    setTimeout(() => {
      document.getElementById("pasarela-pago")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleDetectGeo = () => {
    setGeoStatusColor("text-[#2E8BFF]");
    setGeoStatus("⏳ Detectando tu ubicación en tiempo real...");
    if (!navigator.geolocation) {
      setGeoStatusColor("text-[#FF2EFB]");
      setGeoStatus("❌ Geolocation no es compatible con tu navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const lon = position.coords.longitude.toFixed(4);
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
          .then((res) => res.json())
          .then((data) => {
            const addr = data.address;
            const fullLoc = [
              addr.city || addr.town || addr.village || addr.county || "",
              addr.state || "",
              addr.country || ""
            ].filter(Boolean).join(", ");
            setUbi(fullLoc);
            setGeoStatusColor("text-[#9D00FF]");
            setGeoStatus(`✅ Ubicación detectada y fijada automáticamente: ${fullLoc}`);
          })
          .catch(() => {
            setUbi(`${lat}, ${lon}`);
            setGeoStatusColor("text-[#2E8BFF]");
            setGeoStatus(`✅ Coordenadas obtenidas automáticamente: ${lat}, ${lon}`);
          });
      },
      (error) => {
        setGeoStatusColor("text-[#FF2EFB]");
        setGeoStatus(`❌ Error de detección automática: ${error.message}. Usa el buscardor del mapa para situarte.`);
      }
    );
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoName(file.name);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setLogoBase64(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);

    // SOLICITAR PERMISOS DE UBICACIÓN AUTOMÁTICAMENTE AL INICIO
    handleDetectGeo();

    // SALUDO PERSONALIZADO DE BIENVENIDA SI YA EXISTE UN PERFIL CREADO
    const savedUser = loadUser();
    if (savedUser?.username) {
      setWelcomeToast(`✨ ¡Bienvenido de nuevo, ${savedUser.username}! 👋 Nos alegra tenerte de regreso en la Plataforma InnovaClubAI. La mesa de control e inteligencia estratégica están listas.`);
    }

    return () => clearInterval(interval);
  }, []);

  // ====== HELPER METHODS FOR ACCOUNT & PROFILE ======
  const openAuthModal = (reason = "") => {
    setLoginPromptReason(reason);
    setAuthStep("platformSelection");
    setAuthUsername("");
    setAuthEmail("");
    setAuthPhone("");
    setAuthAvatar("");
    setAuthProjectName(pjNombreProyecto || "");
    setAuthSector(sectorSel || "");
    setAuthRole("Emprendedor");
    setIsAuthModalOpen(true);
  };

  const handleMockAuth = (method: "google" | "tiktok" | "email") => {
    setAuthMethod(method);
    if (method === "google" || method === "tiktok") {
      // Simulate OAuth Login visual flow with top tier design aesthetics
      const randomId = Math.floor(100 + Math.random() * 900);
      const name = method === "google" ? `Google User ${randomId}` : `TikTok Partner ${randomId}`;
      const email = `${method === "google" ? "google" : "tiktok"}_user${randomId}@innovaclubai.com`;
      
      const simulatedUser: UserProfile = {
        username: name,
        email: email,
        phone: "+57 304 460 1667",
        avatar: method === "google" 
          ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
          : "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
        projectName: pjNombreProyecto || "InnovaProyecto AI",
        sector: sectorSel || "Tecnología / Software",
        analysesCount: 0,
        lastAnalysisDate: "",
        referredFriends: 0,
        plan: "basico",
        role: "Emprendedor"
      };
      
      persistUser(simulatedUser);
      setWelcomeToast(`🎉 ¡Ingresaste con éxito! 👋 Qué gusto tenerte aquí, ${simulatedUser.username}. Tu panel de control estratégico está completamente habilitado y listo.`);
      setIsAuthModalOpen(false);
    } else {
      setAuthStep("credentialsForm");
    }
  };

  const handleEmailRegisterOrLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUsername.trim() || !authEmail.trim() || !authPhone.trim()) {
      alert("Por favor rellena todos los campos obligatorios (*).");
      return;
    }

    const newUser: UserProfile = {
      username: authUsername,
      email: authEmail,
      phone: authPhone,
      avatar: authAvatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      projectName: authProjectName || "InnovaClub Idea",
      sector: authSector || "Consultoría",
      analysesCount: 0,
      lastAnalysisDate: "",
      referredFriends: 0,
      plan: "basico",
      role: authRole
    };

    persistUser(newUser);
    setWelcomeToast(`🎉 ¡Perfil creado exitosamente! 🚀 Te damos la bienvenida oficial, ${newUser.username}. Descubre el poder de la Inteligencia Artificial Empresarial en tu zona.`);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    clearUser();
    setAnalysisResult(null);
  };

  const openEditProfile = () => {
    if (!currentUser) return;
    setEditUsername(currentUser.username);
    setEditEmail(currentUser.email);
    setEditPhone(currentUser.phone);
    setEditAvatar(currentUser.avatar || "");
    setEditProjectName(currentUser.projectName || "");
    setEditSector(currentUser.sector || "");
    setEditRole(currentUser.role || "Emprendedor");
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUsername.trim() || !editEmail.trim() || !editPhone.trim()) {
      alert("Por favor rellena todos los campos obligatorios.");
      return;
    }
    if (!currentUser) return;

    persistUser({
      ...currentUser,
      username: editUsername,
      email: editEmail,
      phone: editPhone,
      avatar: editAvatar,
      projectName: editProjectName,
      sector: editSector,
      role: editRole
    });
    setIsEditProfileOpen(false);
  };

  const handleInviteFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteFriendName.trim() || !inviteFriendEmail.trim()) {
      alert("Por favor aporta el nombre y el correo electrónico de tu amigo/a.");
      return;
    }
    if (!currentUser) return;

    persistUser({
      ...currentUser,
      referredFriends: currentUser.referredFriends + 1
    });
    setInviteSuccess(true);
    setTimeout(() => {
      setInviteSuccess(false);
      setInviteFriendName("");
      setInviteFriendEmail("");
      setIsLimitModalOpen(false);
    }, 2800);
  };

  // Execution: Business Analysis
  const runBusinessAnalysis = async () => {
    if (!currentUser) {
      openAuthModal("Para realizar un Análisis en vivo GRATIS con INNOVACLUBAI, primero debes ingresar o crear una cuenta.");
      return;
    }
    if (!desc.trim()) {
      alert("Por favor introduce la descripción del negocio.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const isSameDay = currentUser.lastAnalysisDate === today;
    let maxAllowed = 1;
    if (currentUser.plan === "pro") maxAllowed = 3;
    else if (currentUser.plan === "elite") maxAllowed = 9;
    else maxAllowed = currentUser.referredFriends > 0 ? 2 : 1;

    if ((isSameDay ? currentUser.analysesCount : 0) >= maxAllowed) {
      setIsLimitModalOpen(true);
      return;
    }

    const finalSector = sectorSel === "otro" ? sectorCustom || "Otro" : sectorSel;
    const { data, error } = await analysisActions.run(() =>
      postJson("/api/analyze", { estado, sector: finalSector, modelo, presupuesto, publico, diferenciacion, desc, inst })
    );

    if (data) {
      analysisActions.appendLog("✅ Análisis estratega en vivo completado con éxito.");
      setAnalysisResult(data);

      const calculatedScore = (data as any).score || Math.floor(78 + Math.random() * 20);
      const nameToUse = currentUser?.projectName || authProjectName || pjNombreProyecto || "Proyecto Innovador";
      setRecentAnalyses(prev => [
        { id: Date.now(), name: nameToUse, type: "Empresa", idea: desc || "Idea o análisis estratégico en tiempo real", score: calculatedScore, sector: finalSector || "Sector General" },
        ...prev
      ]);

      persistUser({
        ...currentUser,
        analysesCount: isSameDay ? (currentUser.analysesCount || 0) + 1 : 1,
        lastAnalysisDate: today
      });
    } else if (error) {
      alert(error);
    }
  };

  // Execution: Geolocation Scanner inside Box
  const runGeoScanner = async () => {
    const finalSector = sectorSel === "otro" ? sectorCustom || "Otro" : sectorSel;
    const { data, error } = await scanActions.run(async () => {
      scanActions.appendLog(`Iniciando escáner geográfico en sector: ${sectorSel || "General"}`);
      scanActions.appendLog(`Estableciendo espectro de barrido local con radio de ${range}...`);
      return postJson("/api/scan", { sector: finalSector, ubi, range });
    });

    if (data) {
      scanActions.appendLog("✅ Escaneo radar de área finalizado.");
      setScanResult(data);
    } else if (error) {
      alert(error);
    }
  };

  // Execution: Postulación Innovatorio
  const runProjectEvaluation = async () => {
    if (!pjDescripcion.trim()) {
      alert("Por favor ingresa la descripción del proyecto a postular.");
      return;
    }

    const { data, error } = await evalActions.run(() =>
      postJson("/api/evaluate-project", {
        pInovacion, pTecnologia, pEscalabilidad, pEquipo, pPrototipo,
        pMercado, pIngresos, pPropiedad, pESG, pTraccion, pAdquisicion,
        pFinanciamiento, pNombre: pjNombreFundador, pNombreProyecto: pjNombreProyecto,
        pDescripcion: pjDescripcion
      })
    );

    if (data) {
      evalActions.appendLog("✅ Postulación evaluada y calificada por el comité de ingreso.");
      setProjectResult(data);
    } else if (error) {
      alert(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#000] text-gray-100 font-sans pb-24 selection:bg-fuchsia-500 selection:text-white">
      
      {/* Dynamic Welcome Greeting Toast */}
      {welcomeToast && (
        <div className="fixed top-20 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[200] p-4 rounded-2xl bg-gradient-to-r from-purple-950 via-[#0d0d1a] to-blue-950 border-2 border-purple-500/60 shadow-[0_0_25px_rgba(157,0,255,0.4)] text-white space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-[10px] bg-purple-500/20 text-[#FF2EFB] border border-purple-500/35 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
              Mesa de Control
            </span>
            <button 
              onClick={() => setWelcomeToast(null)}
              className="text-gray-400 hover:text-white font-bold text-xs"
            >
              ✕
            </button>
          </div>
          <p className="text-xs font-black leading-relaxed">
            {welcomeToast}
          </p>
        </div>
      )}
      
      {/* ================= HEADER TOPBAR ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/95 backdrop-blur-md border-b border-purple-500/40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Eliminados íconos de wifi, reloj y batería */}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-sm sm:text-xl font-extrabold tracking-tight text-white">InnovaClub<span className="text-[#FF2EFB]">AI</span></span>
            <span className="text-[9px] bg-purple-500/20 border border-purple-500/40 text-[#FF2EFB] font-black uppercase px-2 py-0.5 rounded-full">v2.0</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button 
                onClick={openEditProfile}
                className="flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/25 transition duration-200"
                title="Modificar Perfil"
              >
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="Perfil" className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover border border-[#FF2EFB]" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-3.5 h-3.5 text-purple-300" />
                )}
                <span className="hidden sm:inline text-[10px] font-black text-purple-200">{currentUser.username}</span>
              </button>

              <button 
                onClick={handleLogout}
                className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-lg transition duration-200"
                title="Cerrar Sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => openAuthModal()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border-2 border-[#FF2EFB] bg-transparent text-[#FF2EFB] text-[10px] sm:text-xs font-black uppercase tracking-wider hover:bg-[#FF2EFB]/10 active:scale-95 transition cursor-pointer shadow-[0_0_12px_rgba(255,46,251,0.35)]"
              title="Ingresar o Crear Cuenta"
            >
              <User className="w-3.5 h-3.5 text-[#FF2EFB]" />
              <span>Ingresar</span>
            </button>
          )}

          {/* BOTÓN DE MENÚ DE NAVEGACIÓN RÁPIDA */}
          <div className="relative">
            <button 
              onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
              className="flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg border-2 border-[#FF2EFB] bg-transparent text-[#FF2EFB] text-[10px] sm:text-xs font-black uppercase tracking-wider hover:bg-[#FF2EFB]/10 transition duration-200 cursor-pointer active:scale-95 shadow-[0_0_12px_rgba(255,46,251,0.35)]"
              title="Menú"
            >
              <Menu className="w-4 h-4 text-[#FF2EFB]" />
              <span className="hidden sm:inline text-[#FF2EFB]">Menú</span>
            </button>

            {isHeaderMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setIsHeaderMenuOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0b0b14]/95 backdrop-blur-xl border border-purple-500/40 shadow-2xl p-2 z-50 space-y-1">
                  <div className="px-3 py-1.5 text-[9px] font-black uppercase text-purple-400 tracking-wider border-b border-purple-950/80">
                    Ir a Sección
                  </div>
                  
                  <button
                    onClick={() => {
                      setActiveTab("formulas");
                      document.getElementById("formulas-herramientas")?.scrollIntoView({ behavior: 'smooth' });
                      setIsHeaderMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:bg-purple-950/55 transition flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-sm select-none">📌</span> Fórmulas & Herramientas IA
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("radar");
                      document.getElementById("radar-seccion")?.scrollIntoView({ behavior: 'smooth' });
                      setIsHeaderMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:bg-purple-950/55 transition flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-sm select-none">🗺️</span> Radar Empresarial IA
                  </button>

                  <button
                    onClick={() => {
                      const el = document.getElementById("diagnostico");
                      if (el) {
                        setActiveTab("diagnostico");
                        el.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        alert("Primero ejecuta un Análisis en la columna izquierda para ver los resultados.");
                      }
                      setIsHeaderMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:bg-purple-950/55 transition flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-sm select-none">📊</span> Resultados del Análisis
                  </button>

                  <button
                    onClick={() => {
                      const el = document.getElementById("resultado-postulacion");
                      if (el) {
                        setActiveTab("postula");
                        el.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        alert("Primero postula tu proyecto en el formulario de admisiones.");
                      }
                      setIsHeaderMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:bg-purple-950/55 transition flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-sm select-none">🏆</span> Admisión a Innovatorio
                  </button>

                  <button
                    onClick={() => {
                      document.getElementById("negocios-venta")?.scrollIntoView({ behavior: 'smooth' });
                      setIsHeaderMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-gray-300 hover:text-[#FF2EFB] hover:bg-purple-950/55 transition flex items-center gap-2 cursor-pointer shadow-[0_0_10px_rgba(255,46,251,0.15)]"
                  >
                    <span className="text-sm select-none">🏢</span> Negocios en Venta &amp; M&amp;A
                  </button>

                  <button
                    onClick={() => {
                      document.getElementById("planes")?.scrollIntoView({ behavior: 'smooth' });
                      setIsHeaderMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:bg-purple-950/55 transition flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-sm select-none">💎</span> Planes Premium
                  </button>

                  <button
                    onClick={() => {
                      document.getElementById("pauta-seccion")?.scrollIntoView({ behavior: 'smooth' });
                      setIsHeaderMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:bg-purple-950/55 transition flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-sm select-none">📢</span> Pautar en InnovaClub
                  </button>

                  <button
                    onClick={() => {
                      document.getElementById("contacto")?.scrollIntoView({ behavior: 'smooth' });
                      setIsHeaderMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:bg-purple-950/55 transition flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-sm select-none">✉️</span> Soporte & Asesoría
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("admin");
                      document.getElementById("admin-seccion")?.scrollIntoView({ behavior: 'smooth' });
                      setIsHeaderMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-black text-rose-450 hover:text-rose-450 hover:bg-red-950/20 transition flex items-center gap-2 cursor-pointer border border-red-500/10"
                  >
                    <span className="text-sm select-none">🔒</span> Mesa de Control (Dueño)
                  </button>
                </div>
              </>
            )}
          </div>

          <button 
            onClick={() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border-2 border-[#FF2EFB] bg-transparent text-[#FF2EFB] text-xs font-black uppercase tracking-wider hover:bg-[#FF2EFB]/10 transition duration-200 shadow-[0_0_10px_rgba(255,46,251,0.25)]"
            title="Soporte y Contacto"
          >
            <Mail className="w-3.5 h-3.5 text-[#FF2EFB]" />
            <span className="hidden md:inline">Contacto</span>
          </button>
          
          <a 
            href="/api/download-html" 
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border-2 border-[#2E8BFF] bg-transparent text-[#2E8BFF] text-xs font-black uppercase tracking-wider hover:bg-[#2E8BFF]/10 transition duration-200 shadow-[0_0_10px_rgba(46,139,255,0.25)]"
            title="Descargar HTML"
          >
            <Download className="w-3.5 h-3.5 text-[#2E8BFF]" />
            <span className="hidden md:inline">HTML</span>
          </a>
        </div>
      </header>

      {/* ================= HERO INICIO ================= */}
      <div className="max-w-5xl mx-auto pt-24 px-4">
        <div className="text-center py-8 space-y-3">
          <div className="w-44 h-44 mx-auto rounded-full border-2 border-purple-500/40 flex items-center justify-center shadow-lg shadow-purple-500/10 animate-pulse relative overflow-hidden bg-[#0d0d1a]">
            {/* Inner neon graphic */}
            <div className="absolute inset-0 bg-radial-gradient from-purple-500/10 to-transparent"></div>
            <Sparkles className="w-24 h-24 text-fuchsia-500 relative z-10 spin" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none uppercase">
            InnovaClub<span className="text-[#FF2EFB]">AI</span>
          </h2>
          <p className="text-xs sm:text-sm tracking-widest text-[#2E8BFF] font-black uppercase">
            Expertos en soluciones con Inteligencia Artificial Empresarial
          </p>
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-gray-300 leading-relaxed font-semibold">
            Innovaclub analiza tu empresa, proyecto o idea y las potencia con estrategias comprobadas y herramientas especializadas de IA empresarial.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mx-auto rounded-full mt-4"></div>
        </div>

        {/* ================= USER BANNER & TRIAL TRACKER ================= */}
        <div className="my-6">
          {currentUser ? (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0d0d1a]/90 to-[#140e2d]/90 backdrop-blur-xl border border-purple-500/30 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.username} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-500 shadow-md"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center">
                      <User className="w-6 h-6 text-purple-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-base font-black text-white flex items-center gap-2">
                      ¡Hola, {currentUser.username}! 👋
                      <span className="text-[9px] bg-purple-500/20 border border-purple-500 px-2 py-0.5 rounded-full text-purple-300 uppercase font-bold tracking-widest">
                        {currentUser.plan === "basico" ? "Prueba Gratis" : currentUser.plan === "pro" ? "Plan Pro" : "Plan Elite"}
                      </span>
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      Empresa/Idea: <strong>{currentUser.projectName || "No ingresado"}</strong> &mdash; Sector: <strong>{currentUser.sector || "No ingresado"}</strong>
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Email: {currentUser.email} &mdash; Tel: {currentUser.phone}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    onClick={openEditProfile}
                    className="px-3 py-1.5 rounded-lg border-2 border-[#FF2EFB] bg-transparent text-[#FF2EFB] text-xs font-black uppercase tracking-wider hover:bg-[#FF2EFB]/10 transition duration-200 shadow-[0_0_10px_rgba(255,46,251,0.25)]"
                  >
                    Editar Perfil
                  </button>
                  <button 
                    onClick={() => setIsLimitModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg border-2 border-[#FF2EFB] bg-transparent text-[#FF2EFB] text-xs font-black uppercase tracking-wider hover:bg-[#FF2EFB]/10 transition duration-200 shadow-[0_0_10px_rgba(255,46,251,0.25)]"
                  >
                    Invitar Amigo (+1 Análisis)
                  </button>
                </div>
              </div>

              {/* Status Daily Limitation Progress bar */}
              <div className="p-3 bg-black/40 border border-purple-500/20 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-300 font-bold uppercase tracking-wider text-[10px]">
                    Límite de Consumo Diario Completo:
                  </span>
                  <span className="text-white font-black">
                    {currentUser.lastAnalysisDate === new Date().toISOString().split("T")[0] ? currentUser.analysesCount : 0} / {
                      currentUser.plan === "pro" ? 3 : currentUser.plan === "elite" ? 9 : currentUser.referredFriends > 0 ? 2 : 1
                    } Análisis Utilizados Hoy
                  </span>
                </div>
                <div className="w-full h-2 bg-purple-950/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{ 
                      width: `${Math.min(100, ((currentUser.lastAnalysisDate === new Date().toISOString().split("T")[0] ? currentUser.analysesCount : 0) / (
                        currentUser.plan === "pro" ? 3 : currentUser.plan === "elite" ? 9 : currentUser.referredFriends > 0 ? 2 : 1
                      )) * 100)}%` 
                    }}
                  ></div>
                </div>
                <div className="text-[10px] text-gray-400 flex flex-wrap justify-between items-center gap-1">
                  <span>
                    {currentUser.plan === "basico" 
                      ? (currentUser.referredFriends > 0 ? "🎁 ¡Bono de amigo activado! Tienes 2 análisis diarios completos gratis." : "💡 Tienes 1 análisis diario en tu prueba. ¡Invita un amigo para desbloquear otro gratis!")
                      : `Suscripción ${currentUser.plan.toUpperCase()} activa. Acceso extendido.`
                    }
                  </span>
                  {currentUser.referredFriends > 0 && (
                    <span className="text-[#FF2EFB] font-extrabold">
                      👥 Amigos invitados hoy: {currentUser.referredFriends}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-[#0d0d1a]/85 border border-[#FF2EFB]/30 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FF2EFB]/10 text-[#FF2EFB] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-[#FF2EFB]/20">
                      Prueba Gratis
                    </span>
                  </div>
                  <h4 className="text-lg md:text-xl font-black text-white leading-snug">
                    Obten el análisis estratégico completo GRATIS de INNOVACLUBAI.
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
                    <strong className="text-[#FF2EFB]">Regístrate en menos de 10 segundos</strong> y potencia hoy mismo tu empresa.
                  </p>
                </div>
                <button 
                  onClick={() => openAuthModal("Regístrate en menos de 10 segundos y potencia hoy mismo tu empresa.")}
                  className="w-full md:w-auto px-5 py-3 rounded-xl border-2 border-[#FF2EFB] bg-transparent text-[#FF2EFB] text-xs font-black uppercase tracking-widest shadow-lg shadow-purple-500/20 hover:bg-[#FF2EFB]/10 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-[#FF2EFB]" />
                  <span>Iniciar análisis gratis</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= APP LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8">
          
          {/* LEFT SIDE: CONTROLS & FORMS (Lg: 5 columns) */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* CARD 1: DATOS DE LA EMPRESA (At least 6 parameters) */}
            <div className="relative p-6 rounded-2xl bg-[#0d0d1a]/80 backdrop-blur-xl border border-purple-500/30 shadow-2xl space-y-6">
              <div className="absolute inset-0 rounded-2xl pointer-events-none border border-gradient-to-r from-purple-500 via-pink-400 to-blue-500 opacity-20"></div>
              
              <div className="flex items-center gap-2 pb-2 border-b border-purple-500/20">
                <FileText className="w-5 h-5 text-purple-500" />
                <h3 className="text-sm font-black text-[#9D00FF] uppercase tracking-wider">
                  Cuentanos tú idea/proyecto/empresa
                </h3>
              </div>

              {/* Compromiso estricto de confidencialidad */}
              <div className="p-3 bg-purple-950/30 border border-purple-500/25 rounded-xl flex items-start gap-2.5 text-xs text-purple-200">
                <span className="text-base select-none">🛡️</span>
                <p className="leading-relaxed">
                  InnovaClubAI se compromete a guardar total secreto y confidencialidad absolutamente estricta de las ideas registradas de todas las empresas o proyectos en esta plataforma.
                </p>
              </div>

              <div className="space-y-4">
                {/* Param 1: Estado del negocio */}
                <div>
                  <label className="block text-[11px] font-extrabold text-[#2E8BFF] uppercase tracking-wider mb-1.5">
                    1. Estado del negocio
                  </label>
                  <select 
                    value={estado} 
                    onChange={e => setEstado(e.target.value)} 
                    className="w-full bg-black/60 border border-purple-500/30 rounded-xl p-3 text-sm text-white focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition duration-200"
                  >
                    <option value="">Selecciona estado...</option>
                    <option value="idea">💡 Idea Conceptualmente Definida</option>
                    <option value="mvp">⚙️ MVP / Prototipo Funcional Cerrado</option>
                    <option value="proyecto">🚀 Proyecto en Desarrollo Activo</option>
                    <option value="lanzamiento">🔥 Recién Lanzado (Menos de 6 meses)</option>
                    <option value="empresa">🏢 Empresa Estable en Operación</option>
                    <option value="escalando">📈 Empresa en fase de Escalado</option>
                  </select>
                </div>

                {/* Param 2: Sector */}
                <div>
                  <label className="block text-[11px] font-extrabold text-[#2E8BFF] uppercase tracking-wider mb-1.5">
                    2. Sector / Industria
                  </label>
                  <select 
                    value={sectorSel} 
                    onChange={e => {
                      setSectorSel(e.target.value);
                      if(e.target.value !== "otro") setSectorCustom(e.target.value);
                    }} 
                    className="w-full bg-black/60 border border-purple-500/30 rounded-xl p-3 text-sm text-white focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition duration-200"
                  >
                    <option value="">Selecciona sector...</option>
                    <option value="Restaurante / Alimentación">🍳 Restaurante / Alimentación</option>
                    <option value="Tecnología / Software">💻 Tecnología / Software (SaaS)</option>
                    <option value="Moda / Ropa / Accesorios">👗 Moda / Ropa / Accesorios</option>
                    <option value="Salud / Bienestar">🏥 Salud / Bienestar</option>
                    <option value="Educación / Formación">🏫 Educación / Formación</option>
                    <option value="Comercio / Retail">🛒 Comercio / Retail / E-commerce</option>
                    <option value="Agro / Sostenibilidad">🌱 Agro / Sostenibilidad</option>
                    <option value="Finanzas / Fintech">💰 Finanzas / Fintech</option>
                    <option value="otro">✍️ Otro (Especificar abajo)</option>
                  </select>
                  {sectorSel === "otro" && (
                    <input 
                      type="text" 
                      value={sectorCustom} 
                      onChange={e => setSectorCustom(e.target.value)} 
                      placeholder="Escribe tu sector específico..." 
                      className="w-full bg-black/60 border border-purple-500/30 rounded-xl p-3 text-sm text-white mt-2 focus:border-fuchsia-500 outline-none transition duration-200"
                    />
                  )}
                </div>

                {/* Param 3: Modelo de Negocio */}
                <div>
                  <label className="block text-[11px] font-extrabold text-[#2E8BFF] uppercase tracking-wider mb-1.5">
                    3. Modelo de negocio
                  </label>
                  <select 
                    value={modelo} 
                    onChange={e => setModelo(e.target.value)} 
                    className="w-full bg-black/60 border border-purple-500/30 rounded-xl p-3 text-sm text-white focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition duration-200"
                  >
                    <option value="">Selecciona modelo...</option>
                    <option value="B2C">👥 B2C — Venta Directa al Consumidor</option>
                    <option value="B2B">🏢 B2B — Venta Directa a Empresas</option>
                    <option value="B2B2C">🔗 B2B2C — Modelo Híbrido</option>
                    <option value="SaaS / Suscripción">💻 SaaS / Suscripción Digital</option>
                    <option value="Marketplace">🛍️ Marketplace / Plataforma de Intercambio</option>
                    <option value="E-commerce">📦 Comercio Electrónico Directo</option>
                    <option value="Servicios Profesionales">💼 Servicios Profesionales / Agencia</option>
                  </select>
                </div>

                {/* Param 4: Presupuesto */}
                <div>
                  <label className="block text-[11px] font-extrabold text-[#2E8BFF] uppercase tracking-wider mb-1.5">
                    4. Presupuesto disponible
                  </label>
                  <select 
                    value={presupuesto} 
                    onChange={e => setPresupuesto(e.target.value)} 
                    className="w-full bg-black/60 border border-purple-500/30 rounded-xl p-3 text-sm text-white focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition duration-200"
                  >
                    <option value="">Selecciona rango...</option>
                    <option value="bootstrapping">👉 Sin presupuesto operativo inmediato</option>
                    <option value="bajo">💰 Menos de $500 USD</option>
                    <option value="medio">💵 $500 — $2,000 USD</option>
                    <option value="medio-alto">💸 $2,000 — $10,000 USD</option>
                    <option value="alto">💳 Más de $10,000 USD</option>
                  </select>
                </div>

                {/* Param 5: Público Objetivo */}
                <div>
                  <label className="block text-[11px] font-extrabold text-[#2E8BFF] uppercase tracking-wider mb-1.5">
                    5. Público objetivo primordial
                  </label>
                  <select 
                    value={publico} 
                    onChange={e => setPublico(e.target.value)} 
                    className="w-full bg-black/60 border border-purple-500/30 rounded-xl p-3 text-sm text-white focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition duration-200"
                  >
                    <option value="">Selecciona perfil...</option>
                    <option value="Gen Z">📱 Generación Z (16—25 años)</option>
                    <option value="Millennials">👔 Millennials (26—40 años)</option>
                    <option value="Población General">🌍 Todo tipo de público amplio</option>
                    <option value="Pymes">🏢 Pymes / Pequeñas y Medianas Empresas</option>
                    <option value="Corporaciones">🏛️ Grandes Corporaciones o Instituciones</option>
                  </select>
                </div>

                {/* Param 6: Diferenciación */}
                <div>
                  <label className="block text-[11px] font-extrabold text-[#2E8BFF] uppercase tracking-wider mb-1.5">
                    6. Diferenciación vs Competencia
                  </label>
                  <select 
                    value={diferenciacion} 
                    onChange={e => setDiferenciacion(e.target.value)} 
                    className="w-full bg-black/60 border border-purple-500/30 rounded-xl p-3 text-sm text-white focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition duration-200"
                  >
                    <option value="">Selecciona diferenciación...</option>
                    <option value="Precio económico">💰 Liderazgo en Costos / Precio más bajo</option>
                    <option value="Calidad Premium">⭐ Calidad Superior / Ingredientes Premium</option>
                    <option value="Tecnología e IA">🤖 Innovación Tecnológica / IA / Automatización</option>
                    <option value="Experiencia de Usuario">🎯 Interfaz y Experiencia Excepcionales</option>
                    <option value="Sostenibilidad">🌱 Sostenibilidad / Impacto Social Positivo</option>
                    <option value="Sin diferenciación clara">❓ Sin ventaja competitiva evidente aún</option>
                  </select>
                </div>

                {/* Descripción Detallada */}
                <div>
                  <label className="block text-[11px] font-extrabold text-[#2E8BFF] uppercase tracking-wider mb-1.5">
                    Descripción Integral del Negocio
                  </label>
                  <textarea 
                    value={desc} 
                    onChange={e => setDesc(e.target.value)} 
                    placeholder="Describe de qué trata tu negocio, propuesta de valor, objetivos o retos principales, lo que mejor te ayude a detallar..." 
                    className="w-full h-32 bg-black/60 border border-purple-500/30 rounded-xl p-3 text-sm text-white focus:border-fuchsia-500 outline-none resize-none transition duration-200"
                  />
                </div>

                {/* Logotipo */}
                <div>
                  <label className="block text-[11px] font-extrabold text-[#2E8BFF] uppercase tracking-wider mb-1.5">
                    Logotipo (Opcional)
                  </label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-purple-500/30 rounded-xl p-4 cursor-pointer hover:bg-purple-900/10 transition duration-200">
                    <span className="text-2xl mb-1">🖼️</span>
                    <span className="text-xs text-purple-300 font-bold">
                      {logoName ? `Cargado: ${logoName}` : "Haz clic para subir un logo de marca"}
                    </span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  {logoBase64 && (
                    <img src={logoBase64} alt="Previsualización Logo" className="mt-3 max-h-16 rounded-lg pointer-events-none mx-auto border border-purple-500/20" />
                  )}
                </div>

                {/* Instrucciones Especiales */}
                <div>
                  <label className="block text-[11px] font-extrabold text-[#2E8BFF] uppercase tracking-wider mb-1.5">
                    Instrucciones Especiales de Análisis
                  </label>
                  <textarea 
                    value={inst} 
                    onChange={e => setInst(e.target.value)} 
                    placeholder="Instrucciones adicionales para enfocar el análisis del consultor de IA..." 
                    className="w-full h-16 bg-black/60 border border-purple-500/30 rounded-xl p-3 text-sm text-white focus:border-fuchsia-500 outline-none resize-none transition duration-200"
                  />
                </div>
              </div>

              {/* Botón de envío análisis de marca */}
              <div className="space-y-1.5 text-center">
                <button 
                  onClick={runBusinessAnalysis}
                  disabled={analysisOp.isRunning}
                  className="w-full py-4 rounded-xl font-extrabold text-xs tracking-wider uppercase border-2 border-[#FF2EFB] bg-transparent text-[#FF2EFB] disabled:opacity-45 cursor-pointer active:scale-95 transition-transform duration-150 flex items-center justify-center gap-2 hover:bg-[#FF2EFB]/10 shadow-[0_0_15px_rgba(255,46,251,0.25)]"
                >
                  <Sparkles className="w-4 h-4 text-[#FF2EFB]" />
                  <span>{analysisOp.isRunning ? "Analizando marcas..." : "Iniciar análisis gratis"}</span>
                </button>
                <div className="text-[10px] text-purple-400 font-extrabold uppercase tracking-widest mt-1">
                  Análisis en vivo GRATIS con INNOVACLUBAI &mdash; <span className="text-[#FF2EFB]">Prueba Gratis</span>
                </div>
              </div>

              {/* Loader de Análisis en Vivo */}
              {analysisOp.isRunning && (
                <ProgressLoader
                  title="Procesamiento Completo en Vivo"
                  remainingLabel="Restante aproximado"
                  remaining={analysisOp.remaining}
                  progress={analysisOp.progress}
                  logs={analysisOp.logs}
                />
              )}
            </div>

            {/* CARD 2: RADAR GEOGRÁFICO DE COMPETENCIA CON INTEGRACIÓN DE MAPA EN UN MISMO CUADRO */}
            <div id="radar-seccion" className="relative p-6 rounded-2xl bg-[#0d0d1a]/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-blue-500/20">
                <div className="flex items-center gap-2">
                  <Map className="w-5 h-5 text-blue-500" />
                  <h3 className="text-sm font-black text-[#2E8BFF] uppercase tracking-wider">
                    radar empresarial InnovaclubIA
                  </h3>
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-pink-400 bg-pink-500/10 px-2.5 py-0.5 rounded-full border border-pink-500/25 uppercase tracking-wider">
                  ¡Detecta y analiza tú competencia!
                </div>
              </div>

              {/* Descripciones solicitadas */}
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-semibold">
                  Analiza los negocios similares y las estrategias comerciales y de crecimiento empresarial. Descubre las estrategias y espía a tu competencia mediante un sofisticado estudio de mercado geolocalizado.
                </p>

                {/* Lo que va a lograr con el análisis geográfico */}
                <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-950/10 space-y-2.5">
                  <div className="text-[10px] font-black uppercase text-blue-400 tracking-wider flex items-center gap-1">
                    <span>🎯 ¿QUÉ LOGRARÁS CON EL ANÁLISIS GEOGRÁFICO?</span>
                  </div>
                  <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                    <li><strong className="text-white">Espiar a tu competencia:</strong> Conecta con ubicaciones reales de competidores para identificar sus debilidades y fortalezas comerciales en tiempo real.</li>
                    <li><strong className="text-white">Crecimiento Inteligente:</strong> Detecta zonas de alta rentabilidad comercial con vacíos de mercado ideales para expandir tu negocio.</li>
                    <li><strong className="text-white">Estudio de Mercado Express:</strong> Analiza de forma inmediata la saturación local y las oportunidades de éxito de tu sector sin altos costos.</li>
                  </ul>
                </div>

                {/* Fuentes de Datos para resultados reales y exactos */}
                <div className="p-3.5 rounded-xl border border-purple-500/20 bg-purple-950/10 space-y-2">
                  <div className="text-[10px] font-black uppercase text-purple-400 tracking-wider flex items-center gap-1">
                    <span>📊 FUENTES INTEGRADAS PARA UN ESTUDIO DE MERCADO EXACTO</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">🌍</span>
                      <span>Google Places & OpenStreetMap</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">🏛️</span>
                      <span>Bases de Cámaras de Comercio</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">📈</span>
                      <span>Censos Geodemográficos Locales</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">🤖</span>
                      <span>Patrones Predictivos InnovaclubAI</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* LOCALIZADOR & UBICACIÓN DENTRO DEL RECUADRO DEL RADAR */}
              <div className="p-4 rounded-xl bg-black/40 border border-blue-500/20 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-[11px] font-extrabold text-blue-400 uppercase tracking-widest">
                    Ubicación del Escaneo
                  </label>
                  <div className="flex gap-1.5 flex-wrap">
                    <button 
                      onClick={handleDetectGeo}
                      className="text-[10px] bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold px-3 py-1 rounded-full transition duration-150 cursor-pointer"
                    >
                      📍 Detectar Geo
                    </button>
                    <button 
                      onClick={() => setMapOpen(!mapOpen)}
                      className={`text-[10px] font-bold px-3 py-1 rounded-full transition duration-150 cursor-pointer flex items-center gap-1 ${
                        mapOpen 
                          ? "bg-purple-500/25 text-[#FF2EFB] border border-[#FF2EFB]" 
                          : "bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300"
                      }`}
                    >
                      🗺️ Seleccionar en Mapa
                    </button>
                  </div>
                </div>
                
                <input 
                  type="text" 
                  value={ubi} 
                  onChange={e => setUbi(e.target.value)} 
                  placeholder="Dirección, Barrio, Ciudad o Coordenadas..." 
                  className="w-full bg-black/60 border border-blue-500/30 rounded-xl p-3 text-sm text-white focus:border-blue-400 outline-none transition duration-200"
                />
                
                {geoStatus && (
                  <div className={`text-xs font-semibold ${geoStatusColor} flex items-center gap-1`}>
                    <span>{geoStatus}</span>
                  </div>
                )}

                {/* VISUAL & INTERACTIVE INTEGRATED REAL MAP */}
                {mapOpen && (
                  <div className="p-4 rounded-xl border border-purple-500/30 bg-[#070714] space-y-3 mt-2 animate-fadeIn">
                    <div className="flex items-center justify-between pb-1 border-b border-purple-900/30">
                      <span className="text-[10px] font-black uppercase text-[#FF2EFB] flex items-center gap-1">
                        🗺️ Mapa Satelital Interactivo Real
                      </span>
                      <button 
                        type="button"
                        onClick={() => setMapOpen(false)}
                        className="text-[10px] text-gray-400 hover:text-white uppercase font-bold cursor-pointer"
                      >
                        [Ocultar mapa ✕]
                      </button>
                    </div>
                    
                    <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                      Haz clic en cualquier parte de este mapa interactivo o busca un lugar para geolocalizar y analizar el entorno comercial en tiempo real:
                    </p>

                    <RealMapSelector 
                      currentUbi={ubi}
                      onLocationSelected={(address, coordsStr) => {
                        setUbi(`${address} (${coordsStr})`);
                        setGeoStatus(`🎯 Ubicación fijada: ${address.split(',')[0]} (${coordsStr})`);
                        setGeoStatusColor("text-[#FF2EFB]");
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Rango de Análisis / Distancia */}
              <div className="space-y-2">
                <label className="block text-[11px] font-extrabold text-[#2E8BFF] uppercase tracking-wider">
                  Alcance Máximo de Escaneo
                </label>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["200m", "500m", "1km", "3km", "5km"].map((dist) => (
                    <button
                      key={dist}
                      onClick={() => setRange(dist)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold font-mono transition duration-200 cursor-pointer bg-transparent ${
                        range === dist 
                          ? "border border-[#2E8BFF] text-[#2E8BFF] shadow-[0_0_12px_rgba(46,139,255,0.4)]" 
                          : "border border-[#2E8BFF]/45 text-gray-400 hover:bg-[#2E8BFF]/10 hover:text-white"
                      }`}
                    >
                      {dist.replace("km", " km").replace("m", " m")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Radar Circular de Giro */}
              <div className="flex flex-col justify-center items-center py-8 bg-[#070710]/90 border border-purple-500/30 rounded-xl relative overflow-hidden h-80 shadow-[0_0_20px_rgba(255,46,251,0.08)]">
                <svg className="w-64 h-64 sm:w-72 sm:h-72" viewBox="0 0 240 240">
                  <defs>
                    <filter id="radar-blur-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="6" result="blur1" />
                      <feGaussianBlur stdDeviation="3" result="blur2" />
                      <feMerge>
                        <feMergeNode in="blur1" />
                        <feMergeNode in="blur2" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <radialGradient id="radar-glow-bg" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(157,0,255,0.12)" />
                      <stop offset="70%" stopColor="rgba(46,139,255,0.04)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                    </radialGradient>
                  </defs>

                  <style>{`
                    @keyframes radar-sweep-spin {
                      from { transform: rotate(0deg); }
                      to { transform: rotate(360deg); }
                    }
                    .radar-anim-needle {
                      animation: radar-sweep-spin 3.5s linear infinite;
                      transform-origin: 120px 120px;
                    }
                  `}</style>

                  {/* Radar Glow Background */}
                  <circle cx="120" cy="120" r="110" fill="url(#radar-glow-bg)" />

                  {/* Target Concentric Rings */}
                  <circle cx="120" cy="120" r="110" fill="none" stroke="rgba(46,139,255,.25)" strokeWidth="1.5" />
                  <circle cx="120" cy="120" r="85" fill="none" stroke="rgba(157,0,255,.18)" strokeWidth="1" />
                  <circle cx="120" cy="120" r="60" fill="none" stroke="rgba(46,139,255,.12)" strokeWidth="1" strokeDasharray="4 3" />
                  <circle cx="120" cy="120" r="35" fill="none" stroke="rgba(46,139,255,.08)" strokeWidth="1" />

                  {/* Radar Grid Lines */}
                  <line x1="120" y1="10" x2="120" y2="230" stroke="rgba(46,139,255,.1)" strokeWidth="1" />
                  <line x1="10" y1="120" x2="230" y2="120" stroke="rgba(46,139,255,.1)" strokeWidth="1" />
                  <line x1="42" y1="42" x2="198" y2="198" stroke="rgba(46,139,255,.05)" strokeWidth="0.8" strokeDasharray="2 2" />
                  <line x1="42" y1="198" x2="198" y2="42" stroke="rgba(46,139,255,.05)" strokeWidth="0.8" strokeDasharray="2 2" />

                  {/* Sweep rotate line (Aguja) with blurred trail (rastro en transparencia difuminado) */}
                  <g className="radar-anim-needle">
                    {/* Trail segments overlapping for a gorgeous fading trailing wedge */}
                    <path d="M120,120 L120,10 A110,110 0 0,1 198,42 Z" fill="rgba(157,0,255,0.22)" filter="url(#radar-blur-glow)" />
                    <path d="M120,120 L198,42 A110,110 0 0,1 230,120 Z" fill="rgba(46,139,255,0.12)" filter="url(#radar-blur-glow)" />
                    <path d="M120,120 L230,120 A110,110 0 0,1 198,198 Z" fill="rgba(0,100,255,0.06)" filter="url(#radar-blur-glow)" />
                    
                    {/* The main glowing neon rotating needle (Aguja) */}
                    <line x1="120" y1="120" x2="120" y2="10" stroke="#FF2EFB" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="120" cy="10" r="3" fill="#FF2EFB" />
                  </g>

                  {/* Mock live pulsing target detections */}
                  <g>
                    <circle cx="165" cy="65" r="5" fill="#FF2EFB" className="animate-pulse" />
                    <circle cx="165" cy="65" r="10" fill="none" stroke="#FF2EFB" strokeWidth="1" className="animate-ping" style={{ animationDuration: "2s" }} />
                    <text x="175" y="68" fill="#FF2EFB" fontSize="8" fontWeight="bold" fontFamily="monospace" opacity="0.8">TARGET A</text>

                    <circle cx="75" cy="95" r="4" fill="#2E8BFF" className="animate-pulse" />
                    <circle cx="75" cy="95" r="8" fill="none" stroke="#2E8BFF" strokeWidth="1" className="animate-ping" style={{ animationDuration: "2.8s" }} />
                    <text x="50" y="90" fill="#2E8BFF" fontSize="8" fontWeight="bold" fontFamily="monospace" opacity="0.8">LOCAL AD</text>

                    <circle cx="180" cy="155" r="5" fill="#9D00FF" className="animate-pulse" />
                    <circle cx="180" cy="155" r="12" fill="none" stroke="#9D00FF" strokeWidth="1" className="animate-ping" style={{ animationDuration: "2.4s" }} />
                    <text x="150" y="172" fill="#9D00FF" fontSize="8" fontWeight="bold" fontFamily="monospace" opacity="0.8">SPONSOR</text>
                  </g>

                  {/* Center Hub */}
                  <circle cx="120" cy="120" r="6" fill="#000" stroke="#FF2EFB" strokeWidth="1.5" />
                  <circle cx="120" cy="120" r="2" fill="#FF2EFB" />
                </svg>
                <div className="absolute bottom-3 text-[11px] text-blue-400 font-mono font-black uppercase tracking-wider bg-black/75 px-3 py-1 rounded-full border border-blue-500/20">
                  RANGO RADAR EN VIVO: {range}
                </div>
              </div>

              {/* Botón de escaneo geográfico */}
              <button 
                onClick={runGeoScanner}
                disabled={scanOp.isRunning}
                className="w-full py-3 rounded-xl font-bold text-xs tracking-wider uppercase border-2 border-[#2E8BFF] bg-transparent text-[#2E8BFF] hover:bg-[#2E8BFF]/10 disabled:opacity-40 cursor-pointer active:scale-95 transition-transform duration-150 flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(46,139,255,0.25)]"
              >
                <Search className="w-4 h-4" />
                <span>{scanOp.isRunning ? "Escaneando entorno..." : "Escanear Radar Local en Vivo"}</span>
              </button>

              {/* Loader de Escaneo */}
              {scanOp.isRunning && (
                <ProgressLoader
                  title="Mapeo Geodemográfico Local"
                  remainingLabel="Faltan"
                  remaining={scanOp.remaining}
                  progress={scanOp.progress}
                  logs={scanOp.logs}
                  barBgClass="bg-blue-950"
                  barFillClass="bg-gradient-to-r from-blue-500 to-indigo-500"
                  titleClass="text-blue-400"
                  logAccentClass="text-blue-400"
                />
              )}

              {/* Render local scan radar output */}
              {scanResult && (
                <div className="p-5 rounded-xl border border-blue-500/20 bg-black/30 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#2E8BFF]">
                    Establecimientos Detectados en un Radio de {range}
                  </h4>
                  <div className="space-y-4 divide-y divide-blue-900/40">
                    {(scanResult.negocios || []).map((neg: any, i: number) => (
                      <div key={i} className="pt-3 first:pt-0 space-y-1.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-extrabold text-sm text-white">{neg.nombre}</div>
                            <div className="text-[10px] font-bold text-blue-400 uppercase">{neg.tipo}</div>
                          </div>
                          <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${getScoreBadgeClass(neg.score)}`}>
                            Puntaje: {neg.score}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[10px] bg-purple-500/10 text-[#FF2EFB] border border-purple-500/20 px-2 py-0.5 rounded-full font-bold">
                            💪 {neg.fortaleza}
                          </span>
                          <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold">
                            🎯 Oportunidad: {neg.op}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {scanResult.resumen && (
                    <p className="text-xs text-gray-300 leading-relaxed border-t border-blue-900/40 pt-3">
                      {scanResult.resumen}
                    </p>
                  )}
                  {scanResult.recomendacion && (
                    <div className="p-3 bg-blue-950/20 border border-blue-500/30 rounded-lg">
                      <div className="text-[10px] font-black uppercase text-[#2E8BFF] mb-1">Estrategia Geográfica Recomendada</div>
                      <p className="text-xs text-gray-200 leading-relaxed">{scanResult.recomendacion}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDE: ADVANCED EVALUATION & STARTUP ADMISSION (Lg: 7 columns) */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* CARD 3: POSTULA TU PROYECTO GRATIS EN EL INNOVATORIO (12 parameters + admission engine) */}
            <div className="relative p-6 rounded-2xl bg-[#0d0d1a]/80 backdrop-blur-xl border border-pink-500/30 shadow-2xl space-y-6">
              <div className="absolute inset-0 rounded-2xl pointer-events-none border border-gradient-to-r from-pink-500 with-purple-500 to-pink-500 opacity-20"></div>

              <div className="flex items-center gap-2 pb-2 border-b border-pink-500/20">
                <Award className="w-5 h-5 text-pink-500" />
                <h3 className="text-sm font-black text-[#FF2EFB] uppercase tracking-wider">
                  Postula tu Proyecto GRATIS al Innovatorio
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                El nuevo programa de aceleración de <strong>Innovaclub</strong> selecciona y financia proyectos con viabilidad real. Define los 12 criterios de admisión que utilizaremos para calibrar el avance metodológico del proyecto:
              </p>

              {/* Fundador & Nombre Proyecto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-pink-400 uppercase mb-1">
                    Nombre del Fundador Principal
                  </label>
                  <input 
                    type="text" 
                    value={pjNombreFundador} 
                    onChange={e => setPjNombreFundador(e.target.value)} 
                    placeholder="Ej. Andrés Pérez" 
                    className="w-full bg-black/60 border border-pink-500/30 rounded-xl p-3 text-sm text-white focus:border-pink-400 outline-none transition duration-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-pink-400 uppercase mb-1">
                    Nombre de la Idea / Proyecto
                  </label>
                  <input 
                    type="text" 
                    value={pjNombreProyecto} 
                    onChange={e => setPjNombreProyecto(e.target.value)} 
                    placeholder="Ej. FoodDelivery AI" 
                    className="w-full bg-black/60 border border-pink-500/30 rounded-xl p-3 text-sm text-white focus:border-pink-400 outline-none transition duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-pink-400 uppercase mb-1">
                  Descripción Detallada del Proyecto a Evaluar
                </label>
                <textarea 
                  value={pjDescripcion} 
                  onChange={e => setPjDescripcion(e.target.value)} 
                  placeholder="Propuesta de innovación, necesidad identificada, por qué tu modelo es exitoso y qué tipo de financiamiento esperas..." 
                  className="w-full h-24 bg-black/60 border border-pink-500/30 rounded-xl p-3 text-sm text-white focus:border-pink-400 outline-none resize-none transition duration-200"
                />
              </div>

              {/* 12 Parameters grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Nivel de Innovación */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#9D00FF] uppercase mb-1">
                    1. Nivel de Innovación
                  </label>
                  <select value={pInovacion} onChange={e => setPInovacion(e.target.value)} className="w-full bg-black/65 border border-pink-500/20 rounded-lg p-2.5 text-xs text-white">
                    <option value="10">Altamente Disruptiva / Radical de categoría</option>
                    <option value="8">Incremental sustancial con ventajas fuertes</option>
                    <option value="5">Mejora de un servicio existente</option>
                    <option value="3">Sin diferenciación inicial alta</option>
                  </select>
                </div>

                {/* 2. Tecnología Utilizada */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#9D00FF] uppercase mb-1">
                    2. Tecnología Utilizada
                  </label>
                  <select value={pTecnologia} onChange={e => setPTecnologia(e.target.value)} className="w-full bg-black/65 border border-pink-500/20 rounded-lg p-2.5 text-xs text-white">
                    <option value="10">Inteligencia Artificial Propia / Algoritmos av.</option>
                    <option value="8">IA mediante Integración de APIs de terceros</option>
                    <option value="6">Desarrollo Web / App a medida sin IA</option>
                    <option value="3">Sin base tecnológica sólida / Tradicional</option>
                  </select>
                </div>

                {/* 3. Escalabilidad */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#9D00FF] uppercase mb-1">
                    3. Escalabilidad
                  </label>
                  <select value={pEscalabilidad} onChange={e => setPEscalabilidad(e.target.value)} className="w-full bg-black/65 border border-pink-500/20 rounded-lg p-2.5 text-xs text-white">
                    <option value="10">Global / Exponencial sin límites físicos</option>
                    <option value="8">Regional con baja infraestructura física</option>
                    <option value="5">Estatal con requerimiento de sedes físicas</option>
                    <option value="3">Baja / Negocio local lineal estático</option>
                  </select>
                </div>

                {/* 4. Equipo Fundador */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#9D00FF] uppercase mb-1">
                    4. Equipo Fundador
                  </label>
                  <select value={pEquipo} onChange={e => setPEquipo(e.target.value)} className="w-full bg-black/65 border border-pink-500/20 rounded-lg p-2.5 text-xs text-white">
                    <option value="10">Equipo estructurado (Comercial, Técnico, Op)</option>
                    <option value="8">Dos cofundadores con roles complementarios</option>
                    <option value="5">Solo fundador con soporte externo free</option>
                    <option value="3">Solo fundador manejando todas las áreas</option>
                  </select>
                </div>

                {/* 5. Avance de Prototipo */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#9D00FF] uppercase mb-1">
                    5. Avance de Prototipo
                  </label>
                  <select value={pPrototipo} onChange={e => setPPrototipo(e.target.value)} className="w-full bg-black/65 border border-pink-500/20 rounded-lg p-2.5 text-xs text-white">
                    <option value="10">MVP probado con transacciones reales</option>
                    <option value="8">MVP funcional cerrado / Versión Alpha</option>
                    <option value="5">Maqueta interactiva / Wireframes detallados</option>
                    <option value="3">Solo Idea esquematizada en papel / Diapositivas</option>
                  </select>
                </div>

                {/* 6. Tamaño del Mercado */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#9D00FF] uppercase mb-1">
                    6. Tamaño del Mercado
                  </label>
                  <select value={pMercado} onChange={e => setPMercado(e.target.value)} className="w-full bg-black/65 border border-pink-500/20 rounded-lg p-2.5 text-xs text-white">
                    <option value="10">Gigante (Billones de USD potenciales)</option>
                    <option value="8">Grande y en crecimiento exponencial rápido</option>
                    <option value="5">Mercado nacional moderado</option>
                    <option value="3">Nicho local específico de baja demanda</option>
                  </select>
                </div>

                {/* 7. Modelo de Ingresos */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#9D00FF] uppercase mb-1">
                    7. Modelo de Ingresos
                  </label>
                  <select value={pIngresos} onChange={e => setPIngresos(e.target.value)} className="w-full bg-black/65 border border-pink-500/20 rounded-lg p-2.5 text-xs text-white">
                    <option value="10">Suscripción SaaS / Recurrente mensual</option>
                    <option value="8">Ventas Transaccionales de alto valor promedio</option>
                    <option value="5">Publicidad o intermediación de bajas comisiones</option>
                    <option value="3">No definido / Modelo en evaluación</option>
                  </select>
                </div>

                {/* 8. Propiedad Intelectual */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#9D00FF] uppercase mb-1">
                    8. Propiedad Intelectual
                  </label>
                  <select value={pPropiedad} onChange={e => setPPropiedad(e.target.value)} className="w-full bg-black/65 border border-pink-500/20 rounded-lg p-2.5 text-xs text-white">
                    <option value="10">Patente concedida o secreto industrial sólido</option>
                    <option value="8">Marca registrada y código con derechos protegidos</option>
                    <option value="5">Marca en proceso de registro / Enfoque defensivo</option>
                    <option value="3">Ninguna protección / Fácil replicabilidad</option>
                  </select>
                </div>

                {/* 9. Sostenibilidad / ESG */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#9D00FF] uppercase mb-1">
                    9. Sostenibilidad / ESG
                  </label>
                  <select value={pESG} onChange={e => setPESG(e.target.value)} className="w-full bg-black/65 border border-pink-500/20 rounded-lg p-2.5 text-xs text-white">
                    <option value="10">Core del negocio con impacto medible positivo</option>
                    <option value="8">Criterios verdes en la producción y logística</option>
                    <option value="6">Enfoque social o medioambiental menor</option>
                    <option value="3">Sin enfoque de sustentabilidad / Neutro</option>
                  </select>
                </div>

                {/* 10. Tracción de Ventas */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#9D00FF] uppercase mb-1">
                    10. Tracción de Ventas
                  </label>
                  <select value={pTraccion} onChange={e => setPTraccion(e.target.value)} className="w-full bg-black/65 border border-pink-500/20 rounded-lg p-2.5 text-xs text-white">
                    <option value="10">Ventas mensuales consistentes con crecimiento</option>
                    <option value="8">Ventas iniciales de prueba alentadoras</option>
                    <option value="5">Usuarios registrados gratis de forma constante</option>
                    <option value="3">Ninguna venta o tracción visible todavía</option>
                  </select>
                </div>

                {/* 11. Estrategia de Adquisición */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#9D00FF] uppercase mb-1">
                    11. Estrategia de Adquisición
                  </label>
                  <select value={pAdquisicion} onChange={e => setPAdquisicion(e.target.value)} className="w-full bg-black/65 border border-pink-500/20 rounded-lg p-2.5 text-xs text-white">
                    <option value="10">Costo de adquisición de clientes extremadamente bajo</option>
                    <option value="8">Canales orgánicos / Virales apalancados</option>
                    <option value="5">Fuerte inversión de pauta publicitaria</option>
                    <option value="3">Ninguna estrategia de mercadeo definida</option>
                  </select>
                </div>

                {/* 12. Financiamiento Necesario */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#9D00FF] uppercase mb-1">
                    12. Financiamiento Requerido
                  </label>
                  <select value={pFinanciamiento} onChange={e => setPFinanciamiento(e.target.value)} className="w-full bg-black/65 border border-pink-500/20 rounded-lg p-2.5 text-xs text-white">
                    <option value="10">Suficiente con recursos propios actualmente</option>
                    <option value="8">Requiere aporte menor (Aceleradoras/Semilla)</option>
                    <option value="6">Requiere Capital Ángel de forma crítica</option>
                    <option value="3">Requiere rescate financiero inmediato</option>
                  </select>
                </div>
              </div>

              {/* Botón enviar evaluación */}
              <button 
                onClick={runProjectEvaluation}
                disabled={evalOp.isRunning}
                className="w-full py-4 rounded-xl font-extrabold text-xs tracking-wider uppercase border-2 border-[#FF2EFB] bg-transparent text-[#FF2EFB] disabled:opacity-40 cursor-pointer active:scale-95 transition-transform duration-150 flex items-center justify-center gap-2 hover:bg-[#FF2EFB]/10 shadow-[0_0_15px_rgba(255,46,251,0.25)]"
              >
                <Award className="w-4 h-4" />
                <span>{evalOp.isRunning ? "Evaluando postulación..." : "Enviar Postulación Completa al Innovatorio"}</span>
              </button>

              {/* Loader de Postulación */}
              {evalOp.isRunning && (
                <ProgressLoader
                  title="Evaluación de Admisión en Línea"
                  remainingLabel="Progreso"
                  remaining={evalOp.remaining}
                  progress={evalOp.progress}
                  logs={evalOp.logs}
                  barBgClass="bg-pink-950"
                  barFillClass="bg-gradient-to-r from-pink-500 to-red-500"
                  titleClass="text-pink-400"
                  logAccentClass="text-pink-400"
                />
              )}
            </div>

            {/* SECCIÓN SOBRESALIENTES: PROYECTOS ADMITIDOS DESTACADOS (>90%) EN PROCESO */}
            <div className="relative p-6 rounded-2xl bg-[#0d0d1a]/80 backdrop-blur-xl border border-pink-500/30 shadow-2xl space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-pink-500/20">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  🏆 Proyectos Sobresalientes de Admisión &gt;90%
                </h3>
              </div>

              <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                Startups de alto impacto que superaron el 90% en la calificación global de InnovaClubAI y se encuentran actualmente en proceso de aceleración. Puedes contactarlas a través de InnovaClubAI para negociar patrocinios, apoyo financiero o capital semilla a cambio de un porcentaje de participación.
              </p>

              <div className="space-y-4">
                {[
                  { name: "AgroTrace Coffee Co.", score: 94, sector: "AgroTecnología", desc: "Trazabilidad completa de café premium en origen utilizando blockchain y sensores inteligentes de humedad.", equitySim: "5% - 15%" },
                  { name: "EcoPack Solutions", score: 91, sector: "Materiales Sostenibles", desc: "Embalaje ecológico biodegradable de base compostable micro-fúngica cultivado con desechos agrícolas locales.", equitySim: "8% - 20%" },
                  { name: "SaaS Lumina Optimizer", score: 92, sector: "Software / Inteligencia Artificial", desc: "Automatización dinámica con IA predictiva del presupuesto para anuncios móviles en PyMes reduciendo sobregastos.", equitySim: "4% - 12%" }
                ].map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-pink-500/25 bg-black/50 hover:border-[#FF2EFB] transition duration-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-extrabold text-white">{proj.name}</h4>
                        <span className="text-[10px] text-blue-400 font-bold uppercase">{proj.sector}</span>
                      </div>
                      <span className="text-xs font-black text-[#FF2EFB] bg-pink-500/10 border border-[#FF2EFB]/30 px-2.5 py-0.5 rounded-full">
                        {proj.score}% Score
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-350 leading-relaxed font-medium pb-2">
                      {proj.desc}
                    </p>

                    <div className="flex justify-between items-center pt-2.5 border-t border-purple-900/40 text-[10px]">
                      <span className="text-gray-400">
                        Participación disponible: <strong className="text-white font-black">{proj.equitySim}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveNegotiationProject(proj);
                          setNegoSponsorAmount("$15,000 USD");
                          setNegoEquityWanted("10");
                        }}
                        className="py-1 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider bg-transparent border border-[#FF2EFB] text-[#FF2EFB] hover:bg-[#FF2EFB]/15 cursor-pointer active:scale-95 transition"
                      >
                        🤝 Negociar Apoyo
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* NEGOTIATION WORKPLACE PANEL */}
              {activeNegotiationProject && (
                <div className="p-5 rounded-2xl border-2 border-purple-500/40 bg-[#070715]/95 space-y-4 animate-scaleUp mt-4">
                  <div className="flex justify-between items-center pb-2 border-b border-purple-500/20">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#FF2EFB]">
                      <span>💼 Propuesta de Patrocinio &amp; Inversión</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveNegotiationProject(null)}
                      className="text-gray-400 hover:text-white text-xs font-bold uppercase cursor-pointer"
                    >
                      [✕]
                    </button>
                  </div>

                  <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl space-y-1">
                    <div className="text-[10px] uppercase font-black text-gray-400">Startup elegida para apoyo</div>
                    <div className="text-xs font-black text-white">{activeNegotiationProject.name} — Calificación: <span className="text-amber-300 font-mono">{activeNegotiationProject.score}%</span></div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-black text-[#2E8BFF] uppercase mb-1">
                        Monto de Apoyo Propuesto (Financiamiento)
                      </label>
                      <select 
                        value={negoSponsorAmount} 
                        onChange={(e) => setNegoSponsorAmount(e.target.value)}
                        className="w-full bg-black/60 border border-blue-500/30 rounded-xl p-2.5 text-white outline-none"
                      >
                        <option value="$5,000 USD">$5,000 USD (COP $21.000.000)</option>
                        <option value="$10,000 USD">$10,000 USD (COP $42.000.000)</option>
                        <option value="$25,000 USD">$25,000 USD (COP $105.000.000)</option>
                        <option value="$50,000 USD">$50,000 USD (COP $210.000.000)</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-black text-[#2E8BFF] uppercase mb-1">
                        <span>Porcentaje de Participación Solicitado</span>
                        <span className="text-[#FF2EFB]">{negoEquityWanted}% Equity</span>
                      </div>
                      <input 
                        type="range" 
                        min="2" 
                        max="25" 
                        value={negoEquityWanted} 
                        onChange={(e) => {
                          setNegoEquityWanted(e.target.value);
                        }}
                        className="w-full accent-[#FF2EFB] cursor-pointer bg-black"
                      />
                      <div className="flex justify-between text-[9px] text-gray-500 font-bold mt-1">
                        <span>Mínimo 2%</span>
                        <span>Máximo 25%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-[#2E8BFF] uppercase mb-1">
                        Estructura de la Alianza adecuada
                      </label>
                      <select 
                        value={negoSponsorType} 
                        onChange={(e) => setNegoSponsorType(e.target.value)}
                        className="w-full bg-black/60 border border-blue-500/30 rounded-xl p-2.5 text-white outline-none"
                      >
                        <option value="Patrocinio Corporativo con Retorno">Patrocinio Corporativo con Retorno Comercial</option>
                        <option value="Inversión Directa (Equity)">Inversión Directa por porcentaje de participación</option>
                        <option value="Nota Convertible (Semilla)">Nota Convertible (Deuda de conversión futura)</option>
                        <option value="Apoyo Técnico + Licenciamiento">Apoyo Tecnológico Co-Branded</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-black text-gray-300 uppercase mb-1">Tu Nombre o Corporación</label>
                        <input 
                          type="text" 
                          value={negoSponsorName} 
                          onChange={(e) => setNegoSponsorName(e.target.value)} 
                          placeholder="Ej. Inversiones Globales"
                          className="w-full bg-black/60 border border-purple-500/30 rounded-xl p-2.5 text-white outline-none cursor-text"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-gray-300 uppercase mb-1">Tu Teléfono de WhatsApp</label>
                        <input 
                          type="text" 
                          value={negoSponsorPhone} 
                          onChange={(e) => setNegoSponsorPhone(e.target.value)} 
                          placeholder="Ej. +573044601667"
                          className="w-full bg-black/60 border border-purple-500/30 rounded-xl p-2.5 text-white outline-none cursor-text"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!negoSponsorName.trim() || !negoSponsorPhone.trim()) {
                        alert("Por favor completa tu nombre de patrocinador/inversionista y número de contacto para continuar.");
                        return;
                      }
                      const text = `Hola InnovaClubAI, mi nombre es ${negoSponsorName} (${negoSponsorPhone}), y deseo proponer formalmente un apoyo de ${negoSponsorAmount} para el proyecto admitido sobresaliente ${activeNegotiationProject.name} (calificación ${activeNegotiationProject.score}%) a cambio de un ${negoEquityWanted}% de participación accionaria (Bajo la modalidad de: ${negoSponsorType}). Quedo atento a intermediar legalmente la propuesta.`;
                      window.open(`https://wa.me/573044601667?text=${encodeURIComponent(text)}`, "_blank");
                    }}
                    className="w-full py-3 rounded-xl text-center font-black text-xs uppercase tracking-wider bg-gradient-to-r from-purple-600 to-pink-500 text-white cursor-pointer active:scale-95 transition"
                  >
                    🚀 Enviar Propuesta Oficial de Participación
                  </button>
                  <p className="text-[10px] text-gray-400 text-center">
                    Al pulsar, se abrirá un canal directo de Whatsapp con la mesa de brokerage de Innovaclub para proceder con la valoración y depósito fiduciario.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* ================= NUEVOS MÓDULOS DE HISTORIAL, FÓRMULAS Y ACCESO EMPRESARIAL VIP ================= */}
        
        {/* 1. MÓDULO DESLIZANTE CON HISTORIAL DE ANÁLISIS REALIZADOS */}
        <div className="my-12 p-6 rounded-3xl bg-[#070715]/85 backdrop-blur-xl border border-purple-500/20 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-purple-950/40">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#FF2EFB] animate-pulse" />
                <h3 className="text-base font-black text-white uppercase tracking-wider">
                  Historial de Análisis en Vivo y Rankings
                </h3>
              </div>
              <p className="text-xs text-gray-400 mt-1 font-semibold">
                Escaner continuo en vivo de ideas, proyectos y empresas evaluadas por InnovaClubAI.
              </p>
            </div>
            {/* Buscador Integrado */}
            <div className="relative w-full md:w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-4 h-4 text-gray-405" />
              </span>
              <input 
                type="text"
                placeholder="Buscar por proyecto, idea o sector..."
                value={searchHistoryTerm}
                onChange={e => setSearchHistoryTerm(e.target.value)}
                className="w-full bg-black/60 border border-purple-500/30 rounded-xl py-2 pl-9 pr-4 text-xs text-white outline-none focus:border-[#FF2EFB] transition font-semibold"
              />
            </div>
          </div>

          {/* Slider Horizontal Deslizante */}
          <div className="overflow-x-auto pb-4 gap-4 flex scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent snap-x snap-mandatory">
            {recentAnalyses.filter(item => {
              const term = searchHistoryTerm.toLowerCase();
              return item.name.toLowerCase().includes(term) || 
                     item.idea.toLowerCase().includes(term) || 
                     item.sector.toLowerCase().includes(term);
            }).map((analysis) => (
              <div 
                key={analysis.id}
                className="min-w-[280px] md:min-w-[320px] bg-[#0c0c20]/90 border border-purple-500/20 hover:border-[#FF2EFB]/40 p-5 rounded-2xl flex flex-col justify-between space-y-4 snap-start hover:shadow-[0_0_15px_rgba(255,46,251,0.15)] transition duration-300"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-[#FF2EFB]/10 text-[#FF2EFB] border border-[#FF2EFB]/25 px-2.5 py-0.5 rounded-full font-bold">
                      {analysis.type}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 font-bold">{analysis.sector}</span>
                  </div>
                  <h4 className="font-extrabold text-[#2E8BFF] text-sm truncate uppercase tracking-tight">{analysis.name}</h4>
                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed font-semibold">{analysis.idea}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-purple-900/30">
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-[#FF2EFB]" />
                    <span className="text-[11px] font-black text-gray-300 uppercase tracking-wide">Puntaje IA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-900 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#2E8BFF] to-[#FF2EFB] h-full" style={{ width: `${analysis.score}%` }}></div>
                    </div>
                    <span className="text-xs font-black text-white bg-[#FF2EFB]/10 px-2 py-0.5 rounded border border-[#FF2EFB]/25">
                      {analysis.score}%
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveAnalysisDetail(analysis)}
                  className="w-full mt-1.5 py-1.5 text-[10px] font-extrabold uppercase text-gray-300 bg-transparent border border-gray-650 hover:border-[#FF2EFB] hover:text-[#FF2EFB] rounded-xl tracking-wider hover:shadow-[0_0_10px_rgba(255,46,251,0.2)] transition duration-150 active:scale-95 cursor-pointer text-center"
                >
                  Ver Diagnóstico Completo
                </button>
              </div>
            ))}
            {recentAnalyses.filter(item => {
              const term = searchHistoryTerm.toLowerCase();
              return item.name.toLowerCase().includes(term) || 
                     item.idea.toLowerCase().includes(term) || 
                     item.sector.toLowerCase().includes(term);
            }).length === 0 && (
              <div className="w-full py-8 text-center text-xs text-gray-400 border border-dashed border-purple-900/40 rounded-xl">
                Ninguna idea o análisis coincide con tu búsqueda.
              </div>
            )}
          </div>
        </div>

        {/* 2. MÓDULO FÓRMULAS: LISTADO DE HERRAMIENTAS EMPRESARIALES Y DE IA */}
        <div id="formulas-herramientas" className="my-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#090919] to-[#04040d] border border-blue-500/20 shadow-2xl space-y-6 scroll-mt-20">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400 animate-pulse" />
              <h3 className="text-base font-black text-[#2E8BFF] uppercase tracking-wider">
                Fórmulas de Admisión & Herramientas de IA Empresariales
              </h3>
            </div>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed font-semibold">
              Ejecuta utilidades de inteligencia de negocios para optimizar tu propuesta y pulir tus métricas de mercado.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Generador FODA Inteligente",
                desc: "Crea una matriz cruzada de FODA específica basada en tu idea de negocio en 1 clic.",
                metric: "Precisión FODA: 98%",
                icon: "📊"
              },
              {
                title: "Prompt Copys Virales",
                desc: "Prompts listos para copiar con ganchos persuasivos para TikTok, Google y Facebook Ads.",
                metric: "Conversión Estimada +45%",
                icon: "💡"
              },
              {
                title: "Viabilidad Financiera & ROI",
                desc: "Simula costos iniciales, capital semilla básico y retorno aproximado en meses de operación.",
                metric: "Automatización de Hoja",
                icon: "💰"
              },
              {
                title: "Estrategias de Growth Hacking",
                desc: "Estrategias no convencionales de captación de usuarios con cero presupuesto inicial.",
                metric: "Eficiencia de Tráfico: Alta",
                icon: "🚀"
              },
              {
                title: "Feedback Predictivo de Clientes",
                desc: "Analiza posibles objeciones que tendrán tus clientes potenciales antes del lanzamiento.",
                metric: "Evita Pérdidas Pre-Lanzamiento",
                icon: "🤝"
              },
              {
                title: "Guiones de Elevador (Pitch)",
                desc: "Redacta ganchos de elevador de 15s, 30s y 60s ideales para convencer a inversionistas.",
                metric: "Compuesto en 3 Versiones",
                icon: "🧠"
              },
              {
                title: "Diseñador Business Canvas",
                desc: "Propuesta de valor, canales clave y estructura de costes ordenados en lienzo clásico.",
                metric: "Estructuración Completa",
                icon: "👁️"
              },
              {
                title: "Analizador de Alianzas Clave",
                desc: "Detecta posibles aliados (proveedores, gremios) que acelerarán tu negocio.",
                metric: "Ahorro de Tiempo de Negociación",
                icon: "🏆"
              }
            ].map((tool, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-[#090919] border border-blue-900/50 hover:border-blue-500/40 hover:shadow-[0_0_15px_rgba(46,139,255,0.1)] transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-1.5">
                  <div className="text-2xl">{tool.icon}</div>
                  <h4 className="text-xs font-black uppercase text-white tracking-wider">{tool.title}</h4>
                  <p className="text-[11px] text-gray-350 leading-relaxed font-semibold">{tool.desc}</p>
                </div>

                <div className="pt-3 border-t border-blue-950 flex flex-col gap-2.5">
                  <span className="text-[9px] font-mono font-bold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded self-start border border-blue-500/20 uppercase">
                    {tool.metric}
                  </span>
                  
                  <button 
                    onClick={() => {
                      setIsToolProcessing(true);
                      setTimeout(() => {
                        setIsToolProcessing(false);
                        const defaultProj = currentUser?.projectName || "InnovaIdea";
                        const defaultSec = currentUser?.sector || "General / No Definido";
                        
                        let simulationOutput = "";
                        if (idx === 0) {
                          simulationOutput = `==================================================\n\tMATRIZ FODA GENERADA POR IA PARA: ${defaultProj.toUpperCase()}\n==================================================\n\n💪 FORTALEZAS:\n- Integración innovadora en el sector: ${defaultSec}.\n- Rapidez de despliegue operacional con tecnología ágil.\n- Propuesta de diferenciación clara sustentada por InnovaClubAI.\n\n🎯 OPORTUNIDADES:\n- Crecimiento acelerado por adopción móvil en mercados locales.\n- Vacíos de competencia detectados a través del radar geográfico.\n- Posibilidad de alianzas clave mediante pauta patrocinada.\n\n⚠️ DEBILIDADES:\n- Presupuesto de marketing inicial acotado.\n- Dependencia de canales de captación orgánicos en etapa semilla.\n- Falta de personalización profunda pre-analizada.\n\n🔥 AMENAZAS:\n- Competencia de corporaciones consolidadas con mayor músculo publicitario.\n- Cambios imprevistos en costos de adquisición regulatorios locales.`;
                        } else if (idx === 1) {
                          simulationOutput = `==================================================\n\tCOPIES PERSUASIVOS PARA REDES SOCIALES: ${defaultProj.toUpperCase()}\n==================================================\n\n📌 TikTok (Gancho a la Acción - Duración: 25s):\n"¿Alguna vez te has preguntado por qué el 90% de los negocios en el sector de ${defaultSec} fallan en su primer año? No es falta de dinero, es falta de planeación inteligente. Descubre cómo estamos transformando este mercado con ${defaultProj}..."\n\n📌 Google/Facebook Ads (Conversión Directa):\n"Deja de adivinar y empieza a crecer. ${defaultProj} ofrece la máxima eficiencia estratégica adaptada a tus necesidades en el rubro de ${defaultSec}. Registra tu cuenta gratis hoy."`;
                        } else if (idx === 2) {
                          simulationOutput = `==================================================\n\tCORRIDA DE VIABILIDAD FINANCIERA & ROI\n==================================================\n\n🏢 PROYECTO: ${defaultProj}\n📈 SECTOR: ${defaultSec}\n\n📊 PROYECCIONES SEMILLA:\n- Costos de Arranque Estimados: $2,500 USD (Software, Registro, Marca)\n- Costo Adquisición Cliente (CAC) Sugerido: $5 USD\n- Valor de Vida del Cliente (LTV): $65 USD\n- Punto de Equilibrio Operativo: Mes 3\n- Retorno de Inversión (ROI) Estimado a 12 meses: 210%\n\n💡 RECOMENDACIÓN IA:\nOptimiza costes utilizando herramientas no-code en tu etapa inicial para expandir tu margen operacional de inmediato.`;
                        } else {
                          simulationOutput = `==================================================\n\tINFORME CORPORATIVO AVANZADO: ${tool.title.toUpperCase()}\n==================================================\n\n🚀 PROYECTO: ${defaultProj} / SECTOR: ${defaultSec}\n\n📋 PUNTOS INMEDIATOS DE EJECUCIÓN:\n1. Aplica un test con 15 clientes de confianza usando la herramienta.\n2. Diseña un embudo de conversión enfocado en resolver el dolor prioritario comercial analizado.\n3. Monitorea semanalmente la tracción local geolocalizada usando nuestro radar de competencia.`;
                        }
                        
                        setActiveToolSimulated({
                          title: tool.title,
                          icon: tool.icon,
                          output: simulationOutput
                        });
                      }, 1200);
                    }}
                    className="w-full py-1.5 rounded-xl border border-blue-500/40 bg-transparent text-blue-300 hover:text-[#2E8BFF] font-bold text-[10px] uppercase tracking-wide transition-all active:scale-95 hover:bg-blue-500/10 cursor-pointer text-center"
                  >
                    Simular Herramienta
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. MÓDULO EMPRESARIAL EXCLUSIVO (EMPRESARIO / PATROCINADOR) */}
        <div id="modulo-exclusivo-patrocinador" className="my-12 scroll-mt-20">
          {currentUser && currentUser.role === "Empresario/Patrocinador" ? (
            /* ZONA DESBLOQUEADA */
            <div className="p-6 sm:p-8 rounded-3xl bg-[#090919]/90 border-2 border-[#2E8BFF] relative overflow-hidden space-y-8 shadow-[0_0_25px_rgba(46,139,255,0.15)]">
              <div className="absolute top-0 right-0 bg-[#2E8BFF]/20 text-[#2E8BFF] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl border-l border-b border-blue-500/40">
                🔒 PANELES VIP ACTIVOS
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                  <h3 className="text-lg font-black text-[#2E8BFF] uppercase tracking-wider">
                    Panel Empresarial de Inversiones & Patrocinios
                  </h3>
                </div>
                <p className="text-xs text-gray-400 mt-1 font-semibold">
                  Bienvenido, <strong className="text-white">{currentUser.username}</strong>. Como Empresario/Patrocinador tienes acceso prioritario al listado inteligente de InnovaClubAI.
                </p>
              </div>

              {/* A. NEGOCIOS DETECTADOS CON ALTO CRECIMIENTO */}
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-blue-900/40">
                  <h4 className="text-xs font-black uppercase tracking-wider text-blue-300">
                    📈 Negocios Recomendados para Inversión (Máximo Rendimiento IA)
                  </h4>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Actualizado cada 24 horas</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      name: "AgroTrace Coffee Co.",
                      sector: "AgroTecnología / Blockchain",
                      score: "94/100",
                      funding: "$15,000 USD",
                      detail: "Trazabilidad de café premium directo de origen para exportación certificada por sustentabilidad.",
                      potential: "Alto (3.4x retorno proyectado)"
                    },
                    {
                      name: "EcoPack Sostenibles",
                      sector: "Empaques Sostenibles / Micelio",
                      score: "91/100",
                      funding: "$25,000 USD",
                      detail: "Planta de cultivo biológico de sustituto de poliestireno para empaque industrial.",
                      potential: "Media-Alta (Reemplazo urgente en retail)"
                    },
                    {
                      name: "SaaS Lumina Optimizer",
                      sector: "Software AI / Marketing",
                      score: "87/100",
                      funding: "$10,000 USD",
                      detail: "Predicciones de audiencia y optimización en vivo de pauta corporativa multiplataforma.",
                      potential: "Inmediata (Modelo recurrente SaaS activo)"
                    }
                  ].map((inv, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-[#060613] border border-blue-500/20 hover:border-blue-500/50 space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-1">
                          <h5 className="font-extrabold text-[#2E8BFF] text-sm uppercase">{inv.name}</h5>
                          <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">{inv.score}</span>
                        </div>
                        <div className="text-[10px] font-mono text-gray-400 font-bold">{inv.sector}</div>
                        <p className="text-xs text-gray-300 leading-relaxed font-semibold">{inv.detail}</p>
                      </div>

                      <div className="pt-3 border-t border-blue-950/40 space-y-3">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-gray-400 font-bold">Inversión Solicitada:</span>
                          <strong className="text-white font-black">{inv.funding}</strong>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-gray-400 font-bold">Potencial de Crecimiento:</span>
                          <strong className="text-emerald-400 font-black">{inv.potential}</strong>
                        </div>

                        <button
                          onClick={() => {
                            const linkText = `Hola, soy Empresario/Patrocinador registrado en InnovaClubAI. Me interesa analizar el plan completo y los detalles financieros de inversión para el proyecto: ${inv.name}`;
                            window.open(`https://wa.me/573044601667?text=${encodeURIComponent(linkText)}`, "_blank");
                          }}
                          className="w-full mt-2 py-2 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-transparent border border-emerald-500/30 hover:bg-emerald-500/10 rounded-xl transition duration-200 active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Conocer Más & Contactar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* B. PROYECTOS PAGANDO PAUTA EN NUESTRA HERRAMIENTA */}
              <div className="space-y-4 pt-4 border-t border-blue-900/40">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase tracking-wider text-purple-300">
                    📢 Patrocinadores Oficiales (Anunciantes de Alto Impacto)
                  </h4>
                  <button 
                    onClick={() => {
                      document.getElementById("pauta-seccion")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-[10px] text-purple-400 hover:text-[#FF2EFB] font-bold uppercase transition hover:underline"
                  >
                    Anunciarme Aquí ➔
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      sponsor: "InnovaStudio AI",
                      tier: "Patrocinador Gold",
                      description: "Boutique especializada en flujos autómatas corporativos, integración de CRM y automatización robótica de procesos en LATAM.",
                      badge: "Foco Corporativo"
                    },
                    {
                      sponsor: "Plataforma EdTech Pro",
                      tier: "Patrocinador Platinum",
                      description: "Formación especializada en ingeniería de interfaces y frameworks de vanguardia. Cupos de becas corporativos abiertos.",
                      badge: "Formación de Talento"
                    },
                    {
                      sponsor: "FinTech Créditos Al Costo",
                      tier: "Anunciante Oficial",
                      description: "Estructuras financieras no bancarias con líneas adaptativas para startups tecnológicas y capital de trabajo flexible.",
                      badge: "Financiamiento Ágil"
                    }
                  ].map((pauta, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-gradient-to-br from-[#0c0c20] to-[#04040d] border border-purple-500/20 relative space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black bg-purple-500/10 text-[#FF2EFB] border border-purple-500/30 px-2 py-0.5 rounded uppercase font-bold">
                            {pauta.tier}
                          </span>
                          <span className="text-[9px] font-bold text-gray-500 uppercase">Patrocinado</span>
                        </div>
                        <h5 className="font-extrabold text-white text-sm uppercase tracking-tight">{pauta.sponsor}</h5>
                        <p className="text-xs text-gray-300 leading-relaxed font-semibold">{pauta.description}</p>
                      </div>

                      <div className="pt-3 border-t border-purple-950 flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20">{pauta.badge}</span>
                        <button 
                          onClick={() => {
                            const pautaTxt = `Hola InnovaClub, vi el patrocinio de "${pauta.sponsor}" (${pauta.tier}) en el panel VIP y me gustaría ponerme en contacto directo con ellos o conocer más de sus soluciones como Empresario.`;
                            window.open(`https://wa.me/573044601667?text=${encodeURIComponent(pautaTxt)}`, "_blank");
                          }}
                          className="text-[10px] text-[#FF2EFB] hover:underline font-extrabold uppercase flex items-center gap-1 cursor-pointer"
                        >
                          <span>Visitar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ZONA BLOQUEADA (PREVIEW CON EFECTO BLUR Y BOTÓN FÁCIL DE ACTIVACIÓN) */
            <div className="relative p-6 sm:p-8 rounded-3xl bg-[#090919]/60 border border-blue-500/20 overflow-hidden shadow-xl">
              {/* Contenido Visualmente Borroso de Fondo */}
              <div className="filter blur-md select-none pointer-events-none opacity-20 space-y-6">
                <div className="h-6 w-1/3 bg-blue-500 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-500 rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-32 bg-gray-950 border border-blue-500/20 p-4 rounded-xl"></div>
                  <div className="h-32 bg-gray-950 border border-blue-500/20 p-4 rounded-xl"></div>
                </div>
              </div>

              {/* Capa de Bloqueo Flotante */}
              <div className="absolute inset-0 bg-[#060613]/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(46,139,255,0.25)]">
                  <Lock className="w-6 h-6 text-blue-400 animate-bounce" />
                </div>
                
                <div className="space-y-1.5 max-w-lg">
                  <span className="text-[9.5px] font-black tracking-widest text-[#2E8BFF] uppercase bg-blue-500/10 border border-blue-500/25 px-3 py-1 rounded-full">
                    MODULO EXCLUSIVO DE INVERSIÓN
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider pt-2">
                    Módulo de Empresarios & Patrocinadores VIP
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed font-semibold">
                    Descubre el listado exclusivo de startups analizadas por IA con el más alto puntaje de rentabilidad y los patrocinadores Gold/Platinum oficiales.
                  </p>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center">
                  <button 
                    onClick={() => {
                      if (!currentUser) {
                        openAuthModal("Para acceder a la zona VIP, regístrate de forma gratuita seleccionando la modalidad Empresario/Patrocinador.");
                      } else {
                        persistUser({ ...currentUser, role: "Empresario/Patrocinador" });
                        alert("¡Felicidades! Tu cuenta se ha configurado en modalidad Empresario/Patrocinador. El módulo exclusivo ha sido desbloqueado con éxito.");
                      }
                    }}
                    className="py-3 px-6 rounded-xl border-2 border-[#2E8BFF] bg-transparent text-blue-300 hover:text-white hover:bg-blue-500/15 font-black text-[11px] uppercase tracking-wider transition-all duration-150 active:scale-95 shadow-[0_0_15px_rgba(46,139,255,0.2)] cursor-pointer"
                  >
                    {currentUser 
                      ? "⚡ Desbloquear Módulo Gratis" 
                      : "Regístrate de inmediato como Empresario"}
                  </button>
                  
                  {!currentUser && (
                    <button 
                      onClick={() => openAuthModal()}
                      className="py-3 px-5 rounded-xl border border-gray-700 bg-transparent text-gray-400 hover:text-white text-[11px] font-black uppercase tracking-wider hover:bg-white/5 active:scale-95 transition"
                    >
                      Iniciar Sesión Ordinaria
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= SECCIÓN DE RESULTADOS DINÁMICOS ================= */}
        {/* RESULTADO 1: ANÁLISIS ESTRATÉGICO DE LA EMPRESA */}
        {analysisResult && (
          <div id="diagnostico" className="my-8 scroll-mt-20">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-black text-[#9D00FF] uppercase tracking-widest">
                Dashboard de Resultados de la Empresa
              </h3>
              <p className="text-xs text-gray-400">Estadísticas, competidores y diagnóstico FODA</p>
            </div>

            {/* Banner de Información de Análisis Restantes para Plan Básico */}
            {(!currentUser || currentUser.plan === "basico") && (
              <div className="mb-6 p-4 rounded-2xl bg-[#090915] border border-[#FF2EFB]/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <span className="bg-[#FF2EFB]/15 text-[#FF2EFB] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-[#FF2EFB]/35">
                      Prueba Gratis activa
                    </span>
                    <span className="text-xs">🎉</span>
                  </div>
                  <h4 className="text-sm font-black text-white leading-snug">
                    ¡Primer análisis completado con éxito!
                  </h4>
                  <p className="text-xs text-gray-300">
                    Te quedan <strong className="text-[#FF2EFB]">2 análisis gratis adicionales</strong> para gastar en el transcurso de 1 semana. ¡Aprovéchala!
                  </p>
                </div>
                <button 
                  onClick={() => document.getElementById("planes")?.scrollIntoView({ behavior: "smooth" })}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl border-2 border-[#FF2EFB] bg-transparent text-[#FF2EFB] text-[10px] font-black uppercase tracking-wider hover:bg-[#FF2EFB]/10 active:scale-95 transition shadow-[0_0_10px_rgba(255,46,251,0.25)]"
                >
                  Ver Planes Premium
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card principal de viabilidad */}
              <div className="p-6 rounded-2xl bg-[#0d0d1a]/80 backdrop-blur-xl border border-purple-500/20 space-y-5">
                <div className="flex justify-between items-center bg-black/40 p-5 rounded-2xl">
                  <div>
                    <div className="text-[11px] font-black uppercase text-purple-400">Calificación de Viabilidad</div>
                    <div className="text-xs text-gray-400">{analysisResult.madurez?.nivel} - {analysisResult.madurez?.desc}</div>
                  </div>
                  <div className={`text-4xl font-extrabold ${getPercentageColor(analysisResult.score || 75)}`}>
                    {analysisResult.score}%
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed bg-black/10 p-3 rounded-lg border border-purple-900/20">
                  {analysisResult.resumen}
                </p>

                {/* Métricas de análisis */}
                <div className="space-y-4">
                  <div className="text-[11px] font-black uppercase text-blue-400">Métricas Ponderadas</div>
                  {(analysisResult.metricas || []).map((m: any, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-gray-200">
                        <span>{m.n} \u2014 <span className="text-gray-400">{m.v}</span></span>
                        <span>{m.p}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-purple-950 rounded-full overflow-hidden">
                        <div className={`h-full ${getMetricColor(m.p)} rounded-full`} style={{ width: `${m.p}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Posicionamiento */}
              <div className="p-6 rounded-2xl bg-[#0d0d1a]/80 backdrop-blur-xl border border-purple-500/20 space-y-5">
                <div className="text-xs font-black uppercase tracking-widest text-[#FF2EFB] border-b border-purple-900/40 pb-2">
                  Estructura de Posicionamiento Competitivo
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] font-black text-purple-400 uppercase mb-1">Propuesta de Valor Única</div>
                    <div className="p-3 bg-black/40 border border-purple-900/40 rounded-xl text-xs text-gray-200 leading-relaxed font-semibold">
                      {analysisResult.posicion?.valor}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-blue-400 uppercase mb-1">Ventaja Competitiva Sostenible</div>
                    <div className="p-3 bg-black/40 border border-blue-900/40 rounded-xl text-xs text-gray-200 leading-relaxed font-semibold">
                      {analysisResult.posicion?.ventaja}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-pink-400 uppercase mb-1">Nicho de Mercado Monopolizable</div>
                    <div className="p-3 bg-black/40 border border-pink-900/40 rounded-xl text-xs text-gray-200 leading-relaxed font-semibold">
                      {analysisResult.posicion?.nicho}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DAFO Grid */}
            {analysisResult.dafo && (
              <div className="my-8 p-6 rounded-2xl bg-[#0d0d1a]/80 backdrop-blur-xl border border-purple-500/20 space-y-4">
                <div className="text-xs font-black uppercase tracking-widest text-[#9D00FF]">Matriz FODA / DAFO Estratégica</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-900/5">
                    <div className="text-xs font-black text-purple-400 uppercase mb-2">💪 Fortalezas</div>
                    <ul className="text-xs text-gray-300 space-y-1.5 leading-relaxed list-disc list-inside">
                      {(analysisResult.dafo.F || []).map((x: string, i: number) => <li key={i}>{x}</li>)}
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl border border-pink-500/20 bg-pink-900/5">
                    <div className="text-xs font-black text-[#FF2EFB] uppercase mb-2">⚠ Debilidades</div>
                    <ul className="text-xs text-gray-300 space-y-1.5 leading-relaxed list-disc list-inside">
                      {(analysisResult.dafo.D || []).map((x: string, i: number) => <li key={i}>{x}</li>)}
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-900/5">
                    <div className="text-xs font-black text-blue-400 uppercase mb-2">🚀 Oportunidades</div>
                    <ul className="text-xs text-gray-300 space-y-1.5 leading-relaxed list-disc list-inside">
                      {(analysisResult.dafo.O || []).map((x: string, i: number) => <li key={i}>{x}</li>)}
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl border-orange-500/20 bg-orange-950/5">
                    <div className="text-xs font-black text-orange-400 uppercase mb-2">🔥 Amenazas</div>
                    <ul className="text-xs text-gray-300 space-y-1.5 leading-relaxed list-disc list-inside">
                      {(analysisResult.dafo.A || []).map((x: string, i: number) => <li key={i}>{x}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Target Client segment */}
            {analysisResult.publico && (
              <div className="p-6 rounded-2xl bg-[#0d0d1a]/80 backdrop-blur-xl border border-purple-500/20 my-8 space-y-4">
                <div className="text-xs font-black uppercase tracking-widest text-[#FF2EFB]">Público Objetivo Perfecto (Buyer Persona)</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-black/40 rounded-xl space-y-3">
                    <div>
                      <div className="text-[10px] font-black text-blue-400 uppercase">Demografía y Rango de Edad</div>
                      <div className="text-xs font-bold text-gray-150">{analysisResult.publico.edades}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-purple-400 uppercase">Perfil Psicográfico del Buyer Persona</div>
                      <div className="text-xs text-gray-300 leading-relaxed">{analysisResult.publico.perfil}</div>
                    </div>
                  </div>
                  <div className="p-4 bg-black/40 rounded-xl space-y-3">
                    <div>
                      <div className="text-[10px] font-black text-pink-400 uppercase">Comportamiento o Patrón de Consumo</div>
                      <div className="text-xs text-gray-300 leading-relaxed">{analysisResult.publico.comportamiento}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-emerald-400 uppercase">Canales de Adquisición Digital idóneos</div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {(analysisResult.publico.canales || []).map((c: string, idx: number) => (
                          <span key={idx} className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-0.5 px-2 rounded-full font-bold">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Videoclips Profesionales de Obsequio */}
            {analysisResult.videos && analysisResult.videos.length > 0 && (
              <div className="p-6 rounded-2xl bg-[#0d0d1a]/80 backdrop-blur-xl border border-purple-500/20 my-8 space-y-6">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-900/40 pb-3">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wider text-[#FF2EFB]">
                        🎥 Vídeoclips Profesionales de Obsequio — INNOVACLUB AI
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Guiones paso a paso, audios estratégicos y pautas visuales creadas a la medida de tu público objetivo.
                      </p>
                    </div>
                    <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-950/40 border border-purple-500/30 px-3 py-1 rounded-full w-fit">
                      {(!currentUser || currentUser.plan === "basico") ? "Prueba Gratis: 1 Vídeo de Obsequio" : `Plan ${currentUser.plan?.toUpperCase()}: 3 Vídeos Incluidos`}
                    </span>
                  </div>
                </div>

                {/* Pestañas de Selección de Vídeo */}
                <div className="flex gap-2 border-b border-purple-900/20 pb-1 overflow-x-auto">
                  {analysisResult.videos.map((v: any, idx: number) => {
                    const isLocked = (!currentUser || currentUser.plan === "basico") && idx > 0;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (!isLocked) {
                            setSelectedVideoIdx(idx);
                          } else {
                            alert("¡Este es un recurso PRO & ÉLITE! El plan de prueba básica incluye únicamente 1 vídeoclip profesional de obsequio. ¡Mejora tu plan hoy mismo para acceder a las 3 variantes de vídeos!");
                            document.getElementById("planes")?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className={`px-4 py-2 rounded-t-xl font-bold text-xs flex items-center gap-1.5 transition whitespace-nowrap ${
                          selectedVideoIdx === idx && !isLocked
                            ? "bg-purple-500/20 text-[#FF2EFB] border-b-2 border-[#FF2EFB]"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {isLocked ? <Lock className="w-3.5 h-3.5 text-red-400" /> : <Video className="w-4 h-4 text-[#FF2EFB]" />}
                        <span>Vídeo {idx + 1}: {v.titulo ? (v.titulo.substring(0, 20) + "...") : "Propuesta"}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Mostrar el video seleccionado */}
                {(() => {
                  const currentVideo = analysisResult.videos[selectedVideoIdx] || analysisResult.videos[0];
                  if (!currentVideo) return null;
                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                      {/* Detalles técnicos y Guión */}
                      <div className="lg:col-span-7 space-y-4">
                        <div className="p-4 bg-purple-950/10 rounded-xl border border-purple-500/10 space-y-3">
                          <div>
                            <span className="text-[10px] font-black uppercase text-[#2E8BFF] block">Enfoque del Clip</span>
                            <span className="text-sm font-extrabold text-white">{currentVideo.titulo}</span>
                            <span className="ml-2 text-[9px] bg-sky-500/15 text-sky-400 py-0.5 px-2 rounded-full border border-sky-500/20 font-bold uppercase inline-block font-mono">
                              {currentVideo.tipo}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-purple-900/20 pt-3">
                            <div>
                              <span className="text-[9px] font-black uppercase text-gray-400 block font-mono">⏱️ Duración Recomendada</span>
                              <span className="text-gray-200 font-bold">{currentVideo.duracion || "30 segundos"}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-black uppercase text-gray-400 block font-mono">🎵 Edición de Audio</span>
                              <span className="text-gray-200 font-bold">{currentVideo.audio}</span>
                            </div>
                          </div>
                        </div>

                        {/* Guión Paso a Paso */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-black uppercase text-[#FF2EFB] tracking-wider block">🎬 Guión & Cronograma de Escenas</span>
                          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                            {(currentVideo.guion || []).map((step: any, sIdx: number) => (
                              <div key={sIdx} className="p-3 bg-black/40 rounded-xl border border-purple-950/40 relative flex gap-3">
                                <div className="text-[10px] font-mono font-black text-purple-400 bg-purple-950/80 border border-purple-500/30 w-12 h-6 flex items-center justify-center rounded-md shrink-0">
                                  {step.segundos}
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-300">
                                    <strong className="text-gray-400 block text-[9px] uppercase tracking-wide">Pauta de grabación (Visual):</strong>
                                    {step.visual}
                                  </div>
                                  <div className="text-xs text-purple-200 bg-purple-900/10 p-2 rounded-md border border-purple-500/5 mt-1">
                                    <strong className="text-purple-400 block text-[9px] uppercase tracking-wide">Voz en Off / Locución:</strong>
                                    "{step.narracion}"
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Consejos Adicionales */}
                        {currentVideo.consejo && (
                          <div className="p-3 bg-emerald-950/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
                            <strong>💡 Consejo del Experto:</strong> {currentVideo.consejo}
                          </div>
                        )}
                      </div>

                      {/* Simulador de Reproducción / Grabadora Móvil */}
                      <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-black border border-purple-500/15 relative overflow-hidden h-full min-h-[360px]">
                        <div className="absolute top-3 left-4 flex items-center gap-1.5 text-[9px] font-black text-red-500 font-mono tracking-widest animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                          <span>PRODUCCIÓN DE CLIPS</span>
                        </div>
                        
                        <div className="my-auto text-center space-y-4 py-8">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-[#FF2EFB] flex items-center justify-center mx-auto shadow-lg shadow-[#FF2EFB]/20 animate-bounce">
                            <Video className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-white">{currentVideo.titulo}</h5>
                            <p className="text-[10px] text-gray-400 mt-1">Planificador Audiovisual InnovaClub</p>
                          </div>
                          <div className="text-[11px] text-gray-300 bg-purple-950/20 p-3 rounded-xl border border-purple-500/15">
                            Tu primer videoclip premium está <strong>completamente redactado y listo</strong> para ser grabado con tu celular. ¡Haz clic abajo para exportar tu guión estratega!
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const details = `TITULO: ${currentVideo.titulo}\nTIPO: ${currentVideo.tipo}\nDURACIÓN: ${currentVideo.duracion}\nAUDIO: ${currentVideo.audio}\nCONSEJO: ${currentVideo.consejo}\n\nGUIÓN:\n` + 
                              (currentVideo.guion || []).map((step: any) => `[${step.segundos}] Visual: ${step.visual}\nNarrador: "${step.narracion}"\n`).join("\n");
                            const blob = new Blob([details], { type: "text/plain;charset=utf-8" });
                            const link = document.createElement("a");
                            link.href = URL.createObjectURL(blob);
                            link.download = `Guion_Video_${selectedVideoIdx + 1}_InnovaClub.txt`;
                            link.click();
                          }}
                          className="w-full py-2.5 rounded-xl border-2 border-[#FF2EFB] bg-transparent text-[#FF2EFB] text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#FF2EFB]/10 transition active:scale-95 cursor-pointer mt-4 shadow-[0_0_10px_rgba(255,46,251,0.25)]"
                        >
                          <Download className="w-3.5 h-3.5 text-[#FF2EFB]" />
                          <span>Descargar Guión Completo</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* RESULTADO 2: POSTULACIÓN AL INNOVATORIO (12 parameters + Accompañamiento de Innovaclub + Pack Soluciones AI) */}
        {projectResult && (
          <div id="resultado-postulacion" className="my-8 scroll-mt-20">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-black text-[#FF2EFB] uppercase tracking-widest">
                Resultados de Postulación al Innovatorio
              </h3>
              <p className="text-xs text-gray-400">Veredicto del comité evaluador de Innovaclub</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Score real de avance y veredicto (Lg: 5 col) */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0d0d1a]/80 backdrop-blur-xl border border-pink-500/20 space-y-5">
                <div className="flex justify-between items-center bg-black/40 p-5 rounded-2xl">
                  <div>
                    <div className="text-[10px] font-black uppercase text-pink-400">Porcentaje de Avance Real</div>
                    <div className="text-[9px] text-gray-400">Mínimo requerido para ingreso: 80%</div>
                  </div>
                  <div className={`text-4xl font-black ${getPercentageColor(projectResult.porcentajeAvance)}`}>
                    {projectResult.porcentajeAvance}%
                  </div>
                </div>

                <div className={`p-4 rounded-xl border text-xs font-extrabold text-center leading-relaxed ${
                  projectResult.aprobado 
                    ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-400" 
                    : "border-pink-500/40 bg-pink-500/5 text-pink-400"
                }`}>
                  {projectResult.aprobado 
                    ? "🎉 ¡PROYECTO ADMITIDO! Cumples con el avance mínimo de Innovatorio. Recibes acceso inmediato al programa de Innovaclub." 
                    : "⚠️ ESTADO CON MENTORÍA: Tu avance es menor al 80%. Para ser aprobado, debes implementar el plan estratégico con Innovaclub a continuación."
                  }
                </div>

                <div className="p-4 bg-black/50 rounded-xl space-y-2">
                  <div className="text-[10px] font-black uppercase text-sky-400">Diagnóstico Oficial del Comité</div>
                  <p className="text-xs text-gray-300 leading-relaxed italic">
                    "{projectResult.diagnosticoComite}"
                  </p>
                </div>
              </div>

              {/* Rúbrica de 12 parámetros (Lg: 7 col) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0d0d1a]/80 backdrop-blur-xl border border-pink-500/20 space-y-4">
                <div className="text-xs font-black uppercase tracking-widest text-[#FF2EFB] border-b border-pink-900/40 pb-2">
                  Rúbrica de Admisión Detallada (12 Parámetros)
                </div>

                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-2">
                  {(projectResult.analisisPorParametro || []).map((p: any, idx: number) => (
                    <div key={idx} className="p-3 bg-black/40 rounded-xl border border-pink-950 hover:border-pink-500/20 transition duration-150">
                      <div className="flex justify-between items-center text-xs font-black mb-1">
                        <span className="text-[#FF2EFB]">{idx + 1}. {p.parametro}</span>
                        <span className="text-blue-400 font-mono text-xs">{p.calificacion}</span>
                      </div>
                      <p className="text-[11px] text-gray-300 leading-relaxed">{p.comentario}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Estrategia y acompañamiento permanente de Innovaclub */}
            <div className="p-6 rounded-2xl bg-[#0d0d1a]/80 backdrop-blur-xl border border-pink-500/20 my-8 space-y-4">
              <div className="text-xs font-black uppercase tracking-widest text-[#9D00FF]">
                Plan de Acompañamiento Permanente Innovaclucb
              </div>
              <div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-lg text-xs font-bold text-purple-200">
                🚀 {projectResult.estrategiaAcompaniamiento?.objetivoParaMinimo}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {(projectResult.estrategiaAcompaniamiento?.fases || []).map((f: any, idx: number) => (
                  <div key={idx} className="p-4 bg-black/40 rounded-xl border border-purple-900/40 space-y-2">
                    <div className="text-xs font-black text-[#FF2EFB]">Fase {idx + 1}: {f.fase}</div>
                    <p className="text-xs text-gray-300 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Paquete de Soluciones Estratégicas INNOVACLUB AI (AI Tool recommendation) */}
            <div className="p-6 rounded-2xl bg-[#0d0d1a]/80 backdrop-blur-xl border border-pink-500/20 my-8 space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-pink-900/40">
                <Cpu className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wider">
                    {projectResult.paqueteSolucionesAI?.titulo || "Paquete de Soluciones Estratégicas INNOVACLUB AI"}
                  </h4>
                  <div className="text-[10px] text-gray-400">Habilitación y optimización de herramientas tecnológicas para tu plataforma</div>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                {projectResult.paqueteSolucionesAI?.descripcion}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(projectResult.paqueteSolucionesAI?.herramientasRecomendadas || []).map((t: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-3 hover:border-emerald-500/40 transition duration-200">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-black text-white">{t.nombre}</span>
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">
                        {t.tipo}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      <strong>Uso en plataforma:</strong> {t.paraQueSirve}
                    </p>
                    <div className="text-[11px] font-bold text-blue-300 bg-blue-900/10 p-2 rounded border border-blue-900/30">
                      📈 Beneficio Estimado: {t.beneficioEstimado}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= SECCIÓN: FUSIONES & ADQUISICIONES - EMPRESAS Y NEGOCIOS EN VENTA ================= */}
        <div id="negocios-venta" className="my-12 p-6 rounded-3xl bg-[#070715]/90 backdrop-blur-xl border border-purple-500/30 shadow-2xl space-y-8 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
            <div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#FF2EFB]" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">
                  🏢 Portal de Fusiones &amp; Adquisiciones: Empresas y Negocios en Venta
                </h3>
              </div>
              <p className="text-[11px] text-gray-400 mt-1 font-semibold leading-relaxed">
                Intermediación de compraventa de empresas auditadas y valoradas científicamente por la tecnología y consultores de InnovaClubAI.
              </p>
            </div>
            <div className="text-[10px] uppercase font-black text-[#2E8BFF] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30">
              📊 MOTOR DE COMISIÓN &amp; BROKERAGE VIP
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Lg: 6 Columns - INTERACTIVE CALCULATOR (MOTOR DE AVALÚO) */}
            <div className="lg:col-span-6 space-y-5 p-5 rounded-2xl bg-black/40 border border-blue-500/15">
              <div className="flex items-center gap-1.5 pb-2 border-b border-blue-900/30">
                <Sliders className="w-4 h-4 text-[#2E8BFF]" />
                <h4 className="text-xs font-black uppercase text-[#2E8BFF]">Calculadora de Avalúo Comercial por IA</h4>
              </div>

              <div className="space-y-4 text-xs">
                {/* Ventas o Ingresos */}
                <div>
                  <label className="flex justify-between font-bold text-gray-300 mb-1">
                    <span>Ventas / Ingresos Brutos Anuales</span>
                    <span className="text-white font-mono font-black">USD ${valVentasAnuales.toLocaleString()}</span>
                  </label>
                  <input 
                    type="range" 
                    min="10000" 
                    max="1000000" 
                    step="5000"
                    value={valVentasAnuales} 
                    onChange={(e) => setValVentasAnuales(parseInt(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer bg-black/50"
                  />
                  <div className="flex justify-between text-[9px] text-gray-500 mt-1 font-bold">
                    <span>$10,000 USD</span>
                    <span>$100,000 USD</span>
                    <span>$1,000,000 USD max</span>
                  </div>
                </div>

                {/* Margen de Utilidad EBITDA */}
                <div>
                  <label className="flex justify-between font-bold text-gray-300 mb-1">
                    <span>Margen Comercial / Operativo EBITDA (%)</span>
                    <span className="text-white font-mono font-black">{valEbitdaMargin}% Margen</span>
                  </label>
                  <input 
                    type="range" 
                    min="5" 
                    max="50" 
                    step="1"
                    value={valEbitdaMargin} 
                    onChange={(e) => setValEbitdaMargin(parseInt(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer bg-black/50"
                  />
                  <div className="flex justify-between text-[9px] text-gray-500 mt-1 font-bold">
                    <span>5% Operación</span>
                    <span>30% Consolidado</span>
                    <span>50% Súper Rentable</span>
                  </div>
                </div>

                {/* Capital de Trabajo e Activos/Inventarios */}
                <div>
                  <label className="flex justify-between font-bold text-gray-300 mb-1">
                    <span>Inventario Físico, Maquinaria &amp; Activos Líquidos</span>
                    <span className="text-white font-mono font-black">USD ${valInventario.toLocaleString()}</span>
                  </label>
                  <input 
                    type="range" 
                    min="1000" 
                    max="200000" 
                    step="1000"
                    value={valInventario} 
                    onChange={(e) => setValInventario(parseInt(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer bg-black/50"
                  />
                  <div className="flex justify-between text-[9px] text-gray-500 mt-1 font-bold">
                    <span>$1,000 USD (Digital)</span>
                    <span>$50,000 USD</span>
                    <span>$200,000 USD (Masivo)</span>
                  </div>
                </div>

                {/* Antiguedad */}
                <div>
                  <div className="flex justify-between font-bold text-gray-300 mb-1">
                    <span>Antigüedad Efectiva del Negocio (Años)</span>
                    <span className="text-white font-mono font-black">{valAntiguedad} Año{(valAntiguedad > 1) && "s"}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    step="1"
                    value={valAntiguedad} 
                    onChange={(e) => setValAntiguedad(parseInt(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer bg-black/50"
                  />
                  <div className="flex justify-between text-[9px] text-gray-500 mt-1 font-bold">
                    <span>1 Año (Poco residual)</span>
                    <span>5 Años (Estable)</span>
                    <span>10 Años (Consolidado)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {/* MULTIPLIER DE ESCALABILIDAD */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Escalabilidad &amp; Sector</label>
                    <select
                      value={valEscalabilidad}
                      onChange={(e) => setValEscalabilidad(parseFloat(e.target.value))}
                      className="w-full bg-black/60 border border-blue-500/25 rounded-lg p-2.5 outline-none font-bold text-gray-200"
                    >
                      <option value="1.2">Bajo / Comercio Tradicional (1.2x)</option>
                      <option value="2.2">Medio / Franquiciable (2.2x)</option>
                      <option value="3.8">Alto / Tecnología &amp; SaaS (3.8x)</option>
                      <option value="5.5">Exponencial / Algorítmico AI (5.5x)</option>
                    </select>
                  </div>

                  {/* PRESTIGIO Y REPUTACION */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Prestigio de Marca &amp; IP</label>
                    <select
                      value={valPrestigio}
                      onChange={(e) => setValPrestigio(parseFloat(e.target.value))}
                      className="w-full bg-black/60 border border-blue-500/25 rounded-lg p-2.5 outline-none font-bold text-gray-200"
                    >
                      <option value="0.0">Bajo (Sin canales propios)</option>
                      <option value="0.15">Local Consolidado (+15% Prima)</option>
                      <option value="0.30">Líder Regional Registrado (+30% Prima)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* METODOLOGÍA EXPLICADA */}
              <div className="p-3.5 rounded-xl bg-[#090916] border border-blue-500/10 space-y-1 text-[10px] text-gray-400 font-semibold leading-relaxed">
                <span className="text-[#2E8BFF] font-bold block">🧠 FÓRMULA DE AVALÚO EXTRAPOLADO (PRESTRE-FINANCE):</span>
                <span>Calculado matemáticamente con fuentes estándar ajustadas a LATAM: EBITDA Anual × Multiplicador de Escalabilidad + Inventario Físico + Prima de Antigüedad y Prestigio Registrado.</span>
              </div>
            </div>

            {/* Lg: 6 Columns - VALUATION REPORT Y DE COMISION (EL GANCHO DE INGRESOS EN VIVO) */}
            <div className="lg:col-span-6 space-y-5 p-5 rounded-2xl bg-[#0d0d1a] border border-pink-500/30 flex flex-col justify-between">
              
              {(() => {
                const ebitdaVal = valVentasAnuales * (valEbitdaMargin / 100);
                const baseVal = ebitdaVal * valEscalabilidad;
                const ageBonusVal = baseVal * (Math.min(valAntiguedad, 10) * 0.035);
                const prestigeBonusVal = baseVal * valPrestigio;
                const initialVal = baseVal + ageBonusVal + prestigeBonusVal + valInventario;
                
                const finalOptimizedVal = initialVal * 1.35;
                const activeVal = isValOptimized ? finalOptimizedVal : initialVal;
                
                const successFeeRate = 0.04; // 4% de comisión justa
                const standardCommission = Math.round(activeVal * successFeeRate);
                
                return (
                  <>
                    <div className="space-y-4">
                      <div className="text-center bg-black/40 p-5 rounded-2xl border border-pink-500/20 relative overflow-hidden">
                        <div className="absolute top-1 left-2 text-[8px] font-black uppercase text-pink-500 tracking-wider">Avalúo Oficial Estimado</div>
                        
                        <div className="text-4xl font-extrabold text-white mt-1 drop-shadow-[0_0_15px_rgba(255,46,251,0.25)] select-all">
                          USD ${Math.round(activeVal).toLocaleString()}
                        </div>
                        <div className="text-[11px] font-black uppercase text-gray-400 mt-1">
                          Equivale a aprox: <span className="text-white">COP ${(Math.round(activeVal * 4200)).toLocaleString()}</span>
                        </div>

                        {isValOptimized && (
                          <div className="inline-block mt-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase px-3 py-0.5 rounded-full border border-emerald-500/30 tracking-wider">
                            🚀 ¡Optimizado +35% por InnovaClub!
                          </div>
                        )}
                      </div>

                      {/* Comisión de Intermediación Transparente de InnovaClub (Para monetización real) */}
                      <div className="p-4 rounded-xl bg-[#2e8bff]/10 border border-blue-500/30 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-extrabold uppercase text-gray-300 flex items-center gap-1">
                            💼 Comisión Fiduciaria por Venta (4%)
                          </span>
                          <span className="text-[11px] font-black text-[#2E8BFF] bg-blue-500/15 border border-blue-500/35 px-2 rounded-md">Transparente</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-1">
                          <span className="text-xs text-gray-450 font-bold">Retorno para el Broker en Venta:</span>
                          <strong className="text-white text-base font-black">USD ${standardCommission.toLocaleString()}</strong>
                        </div>
                        <span className="text-[9px] text-gray-450 block italic">
                          (InnovaClubAI intermedia contractualmente el 4% success fee por debida diligencia legal, contratos de escrow, y listado priorizado de inversionistas).
                        </span>
                      </div>

                      {/* Motor para la generación de ingresos extra con auditoría completa de Innovaclub */}
                      <div className={`p-4 rounded-xl border transition-all duration-300 space-y-3 relative overflow-hidden bg-black/40 ${
                        isValOptimized 
                          ? "border-emerald-500 bg-emerald-950/10" 
                          : "border-purple-500/30 hover:border-purple-500 bg-transparent"
                      }`}>
                        <div className="absolute top-1.5 right-2 text-[8px] font-black tracking-widest uppercase bg-[#FF2EFB]/15 border border-[#FF2EFB]/30 text-[#FF2EFB] px-2 rounded">
                          Servicio Recomendado
                        </div>

                        <div className="flex items-start gap-2.5">
                          <input 
                            id="optimize-check"
                            type="checkbox" 
                            checked={isValOptimized}
                            onChange={(e) => setIsValOptimized(e.target.checked)}
                            className="w-4.5 h-4.5 text-[#FF2EFB] bg-black border-purple-500/40 rounded focus:ring-0 mt-0.5 cursor-pointer"
                          />
                          <label htmlFor="optimize-check" className="block text-xs font-bold leading-relaxed cursor-pointer text-gray-200">
                            <span className="text-sm font-black text-white block">🚀 Aumentar avalúo un +35% mediante Asesoría Completa</span>
                            Implementa embudos automatizados, CRM estructurado y manuales de operaciones SOPs para aumentar dramáticamente la escalabilidad.
                          </label>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-purple-900/30 pt-2.5 text-[11px]">
                          <div>
                            <span className="text-gray-400">Incremento en Avalúo: </span>
                            <strong className="text-emerald-400 font-black">+USD ${(Math.round(initialVal * 0.35)).toLocaleString()}</strong>
                          </div>
                          <div className="text-[11px] font-black text-purple-300">
                            Costo Justo Regulado: <span className="text-white font-black bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/35">$490 USD <span className="text-xs text-gray-400 font-normal">($1'990.000 COP)</span></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const message = `Hola InnovaClubAI, deseo listar y vender mi empresa con un avalúo comercial inicial de USD $${Math.round(initialVal).toLocaleString()} vía intermediación fiduciaria (Brokerage de Éxito 4%). También me interesa ${isValOptimized ? "ACTIVAR LA ASESORÍA COMPLETA para optimizar el valor en +35%" : "conocer sobre la asesoría completa de valorización"}. Quedo atento a las instrucciones.`;
                        window.open(`https://wa.me/573044601667?text=${encodeURIComponent(message)}`, "_blank");
                      }}
                      className="w-full py-4.5 rounded-xl font-black text-xs uppercase tracking-wider bg-[#FF2EFB] text-white cursor-pointer active:scale-95 transition text-center"
                    >
                      🤝 Registrar y Listar Negocio para Venta
                    </button>
                  </>
                );
              })()}
            </div>
          </div>

          {/* LISTADO DE COMPRA DISPONIBLE ACTUALMENTE */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 pb-2 border-b border-purple-950/40">
              <span className="text-xs">💼</span>
              <h4 className="text-xs font-black uppercase tracking-widest text-[#FF2EFB]">
                Catálogo de Empresas &amp; Negocios en Venta Actualmente
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Gastro-Bar & Terraza 'Ámbar'", city: "Chapinero Alto, Bogotá", age: 3.5, inv: 15000, growth: "Alta / Comercial", valuation: 48000, commission: "USD $1.920 (4%)", desc: "Sofisticado bar con terraza climatizada, licencia de licores vigente, patente de marca y facturación estable de $4.5M COP/semana.", icon: "🍹" },
                { name: "Distribuidora Industrial 'AgroNutri'", city: "Yumbo, Valle del Cauca", age: 5, inv: 45000, growth: "Estable / Corporativo", valuation: 125000, commission: "USD $5.000 (4%)", desc: "Distribuidora mayorista de agro insumos del Valle con contratos vigentes con 12 haciendas latifundistas y furgoneta propia included.", icon: "🌾" },
                { name: "SaaS de Logística Local 'ProntoPack'", city: "Las Condes, Santiago", age: 2, inv: 5000, growth: "Exponencial / Algorítmico", valuation: 76000, commission: "USD $3.040 (4%)", desc: "Plataforma SaaS automatizada de entrega de última milla operando en 3 ciudades con más de $3,500 USD de ingresos mensuales recurrentes (MRR).", icon: "📦" }
              ].map((biz, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-purple-500/15 bg-[#0d0d1a]/60 hover:bg-[#0d0d1a] hover:border-purple-500/40 transition duration-200 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl bg-black/50 p-2 rounded-xl">{biz.icon}</span>
                        <div>
                          <h5 className="text-xs font-extrabold text-white">{biz.name}</h5>
                          <span className="text-[9px] text-[#2E8BFF] font-black">{biz.city}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-350 leading-relaxed font-semibold">
                      {biz.desc}
                    </p>

                    <div className="grid grid-cols-3 gap-1 text-[9px] text-center bg-black/45 p-2 rounded-xl text-gray-300 font-bold">
                      <div>
                        <span className="block text-gray-500">Antigüedad</span>
                        <strong className="text-white">{biz.age} Años</strong>
                      </div>
                      <div>
                        <span className="block text-gray-500">Inventario</span>
                        <strong className="text-white">USD ${biz.inv.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="block text-gray-500">Escala</span>
                        <strong className="text-white text-[8px]">{biz.growth}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3.5 mt-3.5 border-t border-purple-950/60 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] text-gray-500 uppercase font-black block">Precio de Negociación</span>
                      <strong className="text-[#FF2EFB] text-sm font-black">USD ${biz.valuation.toLocaleString()}</strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const msg = `Hola InnovaClubAI, estoy firmemente interesado en el catalogado de compraventa de negocios para adquirir: ${biz.name} (${biz.city}) con un avalúo comercial de USD $${biz.valuation.toLocaleString()}. Quisiera agendar una debida diligencia legal con sus consultores comerciales.`;
                        window.open(`https://wa.me/573044601667?text=${encodeURIComponent(msg)}`, "_blank");
                      }}
                      className="py-1.5 px-3 rounded-lg text-[9px] font-black bg-gradient-to-r from-purple-600 to-pink-500 text-white cursor-pointer active:scale-95 transition"
                    >
                      🤝 Comprar / Adquirir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= PLANES DE INVERSIÓN & PASARELA DE PAGO ================= */}
        <div id="planes" className="my-8 scroll-mt-20">
          <div className="mb-6 text-center">
            <h3 className="text-lg font-black text-[#9D00FF] uppercase tracking-widest">
              Planes de Suscripción InnovaClubAI
            </h3>
            <p className="text-xs text-gray-400">Elige el plan ideal para desbloquear análisis sin límites diarios</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* PLAN BÁSICO (Gratuito) */}
            <div className="p-5 rounded-2xl border border-blue-500/20 bg-blue-950/5 relative">
              <div className="absolute -top-3.5 left-4 bg-black border border-blue-500/30 text-blue-400 text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Básico
              </div>
              <div className="text-2xl font-black mt-3">Gratis</div>
              <div className="text-xs text-gray-400 mb-4">Para explorar funciones iniciales</div>
              
              <ul className="text-xs text-gray-300 space-y-2 mb-6">
                <li>✓ 1 análisis de marca diario</li>
                <li>✓ 1 dispositivo activo</li>
                <li>✓ Radar geográfico estándar</li>
                <li>✓ Acceso a postulación</li>
              </ul>
              
              <button 
                onClick={() => selectPlan("basico")}
                className="w-full py-2 rounded-xl text-xs font-bold border-2 border-[#2E8BFF] bg-transparent text-[#2E8BFF] hover:bg-[#2E8BFF]/10 transition cursor-pointer active:scale-95 shadow-[0_0_10px_rgba(46,139,255,0.25)]"
              >
                Elegir Plan Básico
              </button>
            </div>

            {/* PLAN PRO (Most popular) */}
            <div className="p-5 rounded-2xl border-2 border-purple-500/50 bg-purple-950/10 relative">
              <div className="absolute -top-3.5 left-4 bg-black border border-purple-500/60 text-[#FF2EFB] text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Pro ⭐
              </div>
              <div className="absolute -top-3.5 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                MÁS POPULAR
              </div>
              <div className="text-2xl font-black mt-3 text-white">USD $9.99<span className="text-xs text-gray-400 font-normal"> / mes</span></div>
              <div className="text-[10px] font-bold text-purple-400 mb-4">COP $42.000 / mes</div>
              
              <ul className="text-xs text-gray-300 space-y-2 mb-6">
                <li>✓ 3 análisis de marca diarios</li>
                <li>✓ Hasta 2 dispositivos simultáneos</li>
                <li>✓ Diagnósticos DAFO ilimitados</li>
                <li>✓ Pack de herramientas recomendadas</li>
                <li>✓ Propuestas de video avanzadas</li>
              </ul>
              
              <button 
                onClick={() => selectPlan("pro")}
                className="w-full py-2.5 rounded-xl text-xs font-black tracking-wider uppercase border-2 border-[#FF2EFB] bg-transparent text-[#FF2EFB] hover:bg-[#FF2EFB]/10 cursor-pointer active:scale-95 transition shadow-[0_0_15px_rgba(255,46,251,0.35)]"
              >
                Activar Plan Pro
              </button>
            </div>

            {/* PLAN ÉLITE */}
            <div className="p-5 rounded-2xl border-2 border-pink-500/40 bg-pink-950/5 relative">
              <div className="absolute -top-3.5 left-4 bg-black border border-pink-500/40 text-pink-400 text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Élite 👑
              </div>
              <div className="text-2xl font-black mt-3">USD $24.99<span className="text-xs text-gray-400 font-normal"> / mes</span></div>
              <div className="text-[10px] font-bold text-pink-400 mb-4">COP $105.000 / mes</div>
              
              <ul className="text-xs text-gray-300 space-y-2 mb-6">
                <li>✓ 9 análisis de marca diarios</li>
                <li>✓ Hasta 3 dispositivos corporativos</li>
                <li>✓ Todo lo del plan PRO incorporado</li>
                <li>✓ Estrategias de escalado avanzadas</li>
                <li>✓ Soporte técnico prioritario</li>
              </ul>
              
              <button 
                onClick={() => selectPlan("elite")}
                className="w-full py-2.5 rounded-xl text-xs font-black tracking-wider uppercase border-2 border-[#FF2EFB] bg-transparent text-[#FF2EFB] hover:bg-[#FF2EFB]/10 transition cursor-pointer active:scale-95 shadow-[0_0_15px_rgba(255,46,251,0.35)]"
              >
                Activar Plan Élite
              </button>
            </div>
          </div>

          {/* PASARELA DE PAGO ADAPTATIVA */}
          {selectedPlan && (
            <div id="pasarela-pago" className="my-8 p-6 rounded-2xl bg-[#0d0d1a]/80 backdrop-blur-xl border border-purple-500/30 space-y-5 scroll-mt-20">
              <div className="flex items-center gap-2 pb-2 border-b border-purple-500/20">
                <DollarSign className="w-5 h-5 text-[#FF2EFB]" />
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  Pasarela de Pago Segura InnovaClub
                </h4>
              </div>

              <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-xl text-xs text-gray-300">
                Suscripción Electiva: <strong className="text-white">{planPrices[selectedPlan as keyof typeof planPrices].name}</strong> &mdash; <span>{planPrices[selectedPlan as keyof typeof planPrices].desc}</span>
              </div>

              {/* Moneda selector */}
              <div className="space-y-2">
                <label className="block text-[11px] font-extrabold text-[#2E8BFF] uppercase">Moneda de Pago</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrency("USD")}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs transition duration-150 bg-transparent ${
                      currency === "USD" 
                        ? "border-2 border-[#FF2EFB] text-[#FF2EFB] shadow-[0_0_10px_rgba(255,46,251,0.35)]" 
                        : "border border-purple-500/20 text-gray-400 hover:bg-[#FF2EFB]/5"
                    }`}
                  >
                    🇺🇸 USD
                  </button>
                  <button 
                    onClick={() => setCurrency("COP")}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs transition duration-150 bg-transparent ${
                      currency === "COP" 
                        ? "border-2 border-[#FF2EFB] text-[#FF2EFB] shadow-[0_0_10px_rgba(255,46,251,0.35)]" 
                        : "border border-purple-500/20 text-gray-400 hover:bg-[#FF2EFB]/5"
                    }`}
                  >
                    🇨🇴 COP
                  </button>
                </div>
                <div className="text-[11px] text-blue-400 font-bold text-center mt-1">
                  Monto final a transferir: <strong className="text-white text-sm">{
                    currency === "USD" 
                      ? `USD $${planPrices[selectedPlan as keyof typeof planPrices].usd}` 
                      : `COP $${planPrices[selectedPlan as keyof typeof planPrices].cop.toLocaleString()}`
                  }</strong>
                </div>
              </div>

              {/* Botón de método de pago */}
              <div className="space-y-2">
                <label className="block text-[11px] font-extrabold text-[#2E8BFF] uppercase">Selecciona el Canal para el Comprobante</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["Nequi", "Daviplata", "PSE", "PayPal", "Skrill", "Bolt", "Llaves Cripto", "Transferencia"].map((method) => (
                    <button
                      key={method}
                      onClick={() => {
                        setPayMethod(method);
                        // Open direct WhatsApp with chosen details
                        const text = `Hola, deseo pagar el plan ${selectedPlan?.toUpperCase()} vía ${method}. Quedo atento a las instrucciones.`;
                        window.open(`https://wa.me/573044601667?text=${encodeURIComponent(text)}`, "_blank");
                      }}
                      className="py-2 rounded-xl bg-transparent border border-purple-500/35 text-xs font-bold text-gray-300 hover:border-[#FF2EFB] hover:text-[#FF2EFB] hover:shadow-[0_0_10px_rgba(255,46,251,0.25)] transition duration-200 active:scale-95"
                    >
                      {method}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 text-center col-span-full pt-1">
                  Al pulsar, se abrirá un canal de soporte directo de Innovaclub por WhatsApp para brindarte las instrucciones de tu medio preferido.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ================= PAUTA EN INNOVACLUBAI ================= */}
        <div id="pauta-seccion" className="my-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#070712] via-[#0d0d1a] to-[#12071a] border-2 border-purple-500/30 relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-purple-950/40">
            <div>
              <span className="bg-[#FF2EFB]/15 text-[#FF2EFB] text-[9.5px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#FF2EFB]/35">
                Oportunidad Comercial Única
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-2">
                Pauta en InnovaClubAI 🚀
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Lleva tus empresas a un nuevo nivel gracias al entorno empresarial de InnovaClubAI
              </p>
            </div>
            <button
              onClick={() => {
                const text = "Hola. Me interesa pautar en el entorno empresarial de InnovaClubAI. Quisiera conocer más sobre el alcance, formatos disponibles y tarifas para posicionar mi marca.";
                window.open(`https://wa.me/573044601667?text=${encodeURIComponent(text)}`, "_blank");
              }}
              className="py-2.5 px-5 border-2 border-[#FF2EFB] bg-transparent text-[#FF2EFB] text-xs font-black uppercase tracking-wider rounded-xl transition-all hover:bg-[#FF2EFB]/10 active:scale-95 shrink-0 shadow-[0_0_15px_rgba(255,46,251,0.3)]"
            >
              Comenzar a Pautar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-black/40 border border-purple-500/10 hover:border-purple-500/30 transition duration-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-950/40 border border-purple-500/40 flex items-center justify-center">
                <Globe className="w-4 h-4 text-[#FF2EFB]" />
              </div>
              <h4 className="text-xs font-black text-gray-150 uppercase tracking-wider">Audiencia 100% Calificada</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Nuestra plataforma es utilizada exclusivamente por fundadores activos, emprendedores seriales, decisores de compras (CEOs, CTOs) e inversionistas en la región.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-purple-500/10 hover:border-purple-500/30 transition duration-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-pink-950/40 border border-pink-500/40 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#FF2EFB]" />
              </div>
              <h4 className="text-xs font-black text-gray-150 uppercase tracking-wider">Formatos de Alto Impacto</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Banners interactivos, menciones en boletines automáticos de análisis empresarial, colocación de enlaces recomendados de IA y patrocinio oficial en el programa Innovatorio.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-purple-500/10 hover:border-purple-500/30 transition duration-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-950/40 border border-blue-500/40 flex items-center justify-center">
                <Target className="w-4 h-4 text-[#2E8BFF]" />
              </div>
              <h4 className="text-xs font-black text-gray-150 uppercase tracking-wider">Crecimiento y Escalamiento</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Asigna tu presupuesto a leads reales. Multiplica tu tasa de conversión posicionándote en la base del ecosistema financiero y tecnológico líder de Latinoamérica.
              </p>
            </div>
          </div>
        </div>

        {/* ================= SECCIÓN DE ADMINISTRACIÓN & MESA DE CONTROL ================= */}
        <div id="admin-seccion" className="my-12 p-6 rounded-2xl bg-gradient-to-br from-[#0c0c16] to-[#04040a] border-2 border-purple-500/40 shadow-[0_0_30px_rgba(157,0,255,0.15)] space-y-6 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-500/20 pb-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-black leading-none">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-[9px] uppercase tracking-wider text-red-400 bg-red-950/40 border border-red-500/35 px-2.5 py-0.5 rounded-full">
                  Área Reservada del Propietario / Admin
                </span>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                <Lock className="w-5 h-5 text-purple-400" />
                Mesa de Control &amp; Administración de Usuarios
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                Audita y gestiona el ecosistema de InnovaClubAI, controla consumos diarios, roles y categorías de suscripción corporativa en vivo.
              </p>
            </div>
            
            <button
              onClick={() => {
                setIsAdminFormNewOpen(true);
                // Reset form values
                setNewAdminUsername("");
                setNewAdminEmail("");
                setNewAdminPhone("");
                setNewAdminProject("");
                setNewAdminSector("");
                setNewAdminPlan("basico");
                setNewAdminRole("Emprendedor");
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:brightness-110 text-white cursor-pointer transition active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,46,251,0.3)]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Nuevo Usuario</span>
            </button>
          </div>

          {/* ESTADÍSTICAS DEL PROPIETARIO */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-black/45 border border-purple-500/20 rounded-xl space-y-1">
              <div className="text-[9px] text-purple-400 font-black uppercase tracking-widest">SOCIOS ACTIVOS</div>
              <div className="text-2xl font-black text-white">{adminUserList.length}</div>
              <p className="text-[10px] text-emerald-400 font-semibold">● 100% Auditados en Escrow fiduciario</p>
            </div>
            <div className="p-4 bg-black/45 border border-purple-500/20 rounded-xl space-y-1">
              <div className="text-[9px] text-purple-400 font-black uppercase tracking-widest">CONSUMO IA REAL DE HOY</div>
              <div className="text-2xl font-black text-fuchsia-400">
                {adminUserList.reduce((acc, current) => acc + (current.usedToday || 0), 0)} Análisis
              </div>
              <p className="text-[10px] text-purple-300 font-semibold">★ Calibración Algorítmica Estable</p>
            </div>
            <div className="p-4 bg-black/45 border border-purple-500/20 rounded-xl space-y-1">
              <div className="text-[9px] text-purple-400 font-black uppercase tracking-widest">INGRESOS RECURRENTES (MRR)</div>
              <div className="text-2xl font-black text-blue-400">
                ${adminUserList.filter(u => u.plan !== "basico").length * 9.99} USD
              </div>
              <p className="text-[10px] text-blue-400 font-semibold">★ Planes Premium Pro / Élite valorados</p>
            </div>
          </div>

          {/* BUSCADOR Y FLTRO DE CONTROL */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-3.5 bg-black/35 rounded-xl border border-purple-500/15">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-purple-400" />
              <input
                type="text"
                placeholder="Buscar por usuario, email o proyecto..."
                value={searchAdminQuery}
                onChange={(e) => setSearchAdminQuery(e.target.value)}
                className="w-full bg-black/60 pl-9 pr-4 py-1.5 rounded-lg text-xs font-semibold text-white border border-purple-500/20 focus:outline-none focus:border-purple-500/50"
              />
            </div>
            <div className="text-[10px] text-purple-300 font-mono font-bold">
              Filtrado: <span className="text-[#FF2EFB]">{adminUserList.filter(u => {
                const term = searchAdminQuery.toLowerCase();
                return u.username.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || (u.projectName || "").toLowerCase().includes(term);
              }).length}</span> de <span className="text-white">{adminUserList.length}</span> usuarios
            </div>
          </div>

          {/* LISTADO DE USUARIOS SPREADSHEET CARD */}
          <div className="overflow-x-auto rounded-xl border border-purple-500/20 bg-black/55 shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-purple-950/20 border-b border-purple-500/20 text-purple-300 font-black uppercase tracking-wider text-[9px]">
                  <th className="p-3">ID / Usuario</th>
                  <th className="p-3">Proyecto / Sector</th>
                  <th className="p-3">Suscripción</th>
                  <th className="p-3">Rol</th>
                  <th className="p-3">Consumo de IA Hoy</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acciones de Control Directo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-950/30 text-xs">
                {adminUserList
                  .filter((u) => {
                    const term = searchAdminQuery.toLowerCase();
                    return (
                      u.username.toLowerCase().includes(term) ||
                      u.email.toLowerCase().includes(term) ||
                      (u.projectName || "").toLowerCase().includes(term)
                    );
                  })
                  .map((u) => {
                    const isSelf = currentUser && currentUser.email === u.email;
                    return (
                      <tr key={u.id} className={`hover:bg-[#FF2EFB]/3 duration-100 ${isSelf ? "bg-purple-950/20" : ""}`}>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-[11px] uppercase shadow-inner">
                              {u.username.charAt(0)}
                            </div>
                            <div>
                              <div className="font-extrabold text-white flex items-center gap-1.5">
                                {u.username}
                                {isSelf && (
                                  <span className="bg-fuchsia-950 text-[#FF2EFB] border border-[#FF2EFB]/40 text-[8px] font-black uppercase px-2 py-0.2 rounded-full">
                                    TÚ (Sesión)
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-gray-400 font-mono">{u.email}</div>
                              <div className="text-[9px] text-gray-500 font-mono">{u.phone}</div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="p-3">
                          <div className="font-extrabold text-gray-200">{u.projectName || "Sin Proyecto"}</div>
                          <div className="text-[10px] text-purple-400 font-bold uppercase">{u.sector || "General"}</div>
                          <div className="text-[9px] text-gray-500 font-mono">Reg: {u.dateReg}</div>
                        </td>

                        <td className="p-3">
                          <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                            u.plan === "elite"
                              ? "bg-pink-500/10 text-pink-400 border-pink-500/40"
                              : u.plan === "pro"
                              ? "bg-purple-500/10 text-[#FF2EFB] border-[#FF2EFB]/40"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}>
                            {u.plan.toUpperCase()}
                          </span>
                        </td>

                        <td className="p-3">
                          <span className="text-gray-300 font-extrabold">{u.role}</span>
                        </td>

                        <td className="p-3 font-mono text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-white font-bold">{u.usedToday}</span>
                            <span className="text-gray-500">/</span>
                            <span className="text-purple-300 font-bold">{u.dailyLimit}</span>
                          </div>
                          <div className="w-16 h-1 bg-purple-950 rounded-full mt-1.5 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
                              style={{ width: `${Math.min(100, (u.usedToday / u.dailyLimit) * 100)}%` }}
                            ></div>
                          </div>
                        </td>

                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase ${
                            u.status === "Activo"
                              ? "text-emerald-400 bg-emerald-950/30 border border-emerald-500/30"
                              : u.status === "Pendiente"
                              ? "text-amber-400 bg-amber-950/30 border border-amber-500/30"
                              : "text-rose-400 bg-rose-950/30 border border-rose-500/30"
                          } px-2.5 py-0.5 rounded-full`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {u.status}
                          </span>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Btn Plan cycle toggle */}
                            <button
                              onClick={() => {
                                const plansArr: ("basico" | "pro" | "elite")[] = ["basico", "pro", "elite"];
                                const currentIdx = plansArr.indexOf(u.plan as any);
                                const nextPlan = plansArr[(currentIdx + 1) % plansArr.length];
                                const limitMap = { basico: 1, pro: 3, elite: 9 };
                                
                                const updatedList = adminUserList.map((usr) => {
                                  if (usr.id === u.id) {
                                    return { ...usr, plan: nextPlan, dailyLimit: limitMap[nextPlan] };
                                  }
                                  return usr;
                                });
                                setAdminUserList(updatedList);

                                // If editing logged-in user, synchronize!
                                if (isSelf) {
                                  persistUser({ ...currentUser!, plan: nextPlan });
                                  setWelcomeToast(`⚡ Plan de tu sesión elevado administrativamente a: ${nextPlan.toUpperCase()}`);
                                }
                              }}
                              className="px-2 py-1 rounded bg-[#0a0a14] border border-fuchsia-500/30 hover:border-[#FF2EFB] text-[10px] font-black text-[#FF2EFB] cursor-pointer hover:bg-[#FF2EFB]/5 transition"
                              title="Ciclar Plan de Suscripción"
                            >
                              Plan 🔁
                            </button>

                            {/* Btn Status toggle */}
                            <button
                              onClick={() => {
                                const statusArr = ["Activo", "Pendiente", "Suspendido"];
                                const currentIdx = statusArr.indexOf(u.status);
                                const nextStatus = statusArr[(currentIdx + 1) % statusArr.length];
                                
                                const updatedList = adminUserList.map((usr) => {
                                  if (usr.id === u.id) {
                                    return { ...usr, status: nextStatus };
                                  }
                                  return usr;
                                });
                                setAdminUserList(updatedList);
                              }}
                              className="px-2 py-1 rounded bg-[#0a0a14] border border-blue-500/30 hover:border-blue-400 text-[10px] font-black text-blue-400 cursor-pointer hover:bg-blue-500/5 transition"
                              title="Ciclar Estado de Cuenta"
                            >
                              Estado 🎛️
                            </button>

                            {/* Btn Editar Drawer */}
                            <button
                              onClick={() => setSelectedAdminUser(u)}
                              className="px-2.5 py-1 rounded bg-purple-950/40 border border-purple-500/35 hover:bg-purple-900/50 hover:border-purple-400 text-[10px] font-black text-purple-200 cursor-pointer transition"
                              title="Editar Perfil"
                            >
                              Editar
                            </button>

                            {/* Btn Eliminar */}
                            <button
                              disabled={isSelf}
                              onClick={() => {
                                if (confirm(`¿Estás completamente seguro de dar de baja y eliminar a ${u.username}?`)) {
                                  const filtered = adminUserList.filter(usr => usr.id !== u.id);
                                  setAdminUserList(filtered);
                                }
                              }}
                              className="px-2.5 py-1 rounded border border-rose-500/30 hover:border-rose-500 text-[10px] font-black text-rose-450 cursor-pointer disabled:opacity-20 hover:bg-rose-500/5 transition"
                              title="Dar de baja"
                            >
                              Borrar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* DIALOG EDITAR USUARIO */}
        {selectedAdminUser && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-md p-6 rounded-2xl bg-[#0b0b14] border border-purple-500/40 shadow-2xl space-y-4 relative text-left">
              <button
                onClick={() => setSelectedAdminUser(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold"
              >
                ✕
              </button>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/40">
                  <User className="w-5 h-5 text-purple-450" />
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider mt-2">
                  Modificar Parámetros de Socio
                </h4>
                <p className="text-[10px] text-gray-450 font-bold">Modificando: {selectedAdminUser.username}</p>
              </div>

              <div className="space-y-3 text-xs leading-relaxed max-h-96 overflow-y-auto pr-1">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-purple-400">Nombre de Usuario</label>
                  <input 
                    type="text" 
                    value={selectedAdminUser.username}
                    onChange={(e) => setSelectedAdminUser({ ...selectedAdminUser, username: e.target.value })}
                    className="w-full bg-black/50 p-2.5 rounded-lg border border-purple-500/25 text-white text-xs font-semibold focus:outline-none focus:border-purple-500/55"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-purple-400">Correo Electrónico</label>
                  <input 
                    type="email" 
                    value={selectedAdminUser.email}
                    onChange={(e) => setSelectedAdminUser({ ...selectedAdminUser, email: e.target.value })}
                    className="w-full bg-black/50 p-2.5 rounded-lg border border-purple-500/25 text-white text-xs font-mono focus:outline-none focus:border-purple-500/55"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-purple-400">Teléfono Corporativo</label>
                  <input 
                    type="text" 
                    value={selectedAdminUser.phone}
                    onChange={(e) => setSelectedAdminUser({ ...selectedAdminUser, phone: e.target.value })}
                    className="w-full bg-black/50 p-2.5 rounded-lg border border-purple-500/25 text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-purple-400">Nombre del Proyecto o Empresa</label>
                  <input 
                    type="text" 
                    value={selectedAdminUser.projectName || ""}
                    onChange={(e) => setSelectedAdminUser({ ...selectedAdminUser, projectName: e.target.value })}
                    className="w-full bg-black/50 p-2.5 rounded-lg border border-purple-500/25 text-white text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase text-purple-400">Suscripción</label>
                    <select
                      value={selectedAdminUser.plan}
                      onChange={(e) => {
                        const nextPlan = e.target.value;
                        const limits = { basico: 1, pro: 3, elite: 9 };
                        setSelectedAdminUser({ 
                          ...selectedAdminUser, 
                          plan: nextPlan, 
                          dailyLimit: limits[nextPlan as keyof typeof limits] || 1 
                        });
                      }}
                      className="w-full bg-black/60 p-2.5 rounded-lg border border-purple-500/25 text-white text-xs font-bold focus:outline-none"
                    >
                      <option value="basico">Básico</option>
                      <option value="pro">Pro</option>
                      <option value="elite">Élite</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase text-purple-400">Rol</label>
                    <select
                      value={selectedAdminUser.role}
                      onChange={(e) => setSelectedAdminUser({ ...selectedAdminUser, role: e.target.value })}
                      className="w-full bg-black/60 p-2.5 rounded-lg border border-purple-500/25 text-white text-xs font-bold focus:outline-none"
                    >
                      <option value="Emprendedor">Emprendedor</option>
                      <option value="Empresario/Patrocinador">Empresario/Patrocinador</option>
                      <option value="Dueño/Admin">Dueño/Admin</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase text-purple-400">Límite Diario</label>
                    <input 
                      type="number" 
                      value={selectedAdminUser.dailyLimit}
                      onChange={(e) => setSelectedAdminUser({ ...selectedAdminUser, dailyLimit: parseInt(e.target.value) || 0 })}
                      className="w-full bg-black/50 p-2.5 rounded-lg border border-purple-500/25 text-white font-mono text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase text-purple-400">Consumido Hoy</label>
                    <input 
                      type="number" 
                      value={selectedAdminUser.usedToday}
                      onChange={(e) => setSelectedAdminUser({ ...selectedAdminUser, usedToday: parseInt(e.target.value) || 0 })}
                      className="w-full bg-black/50 p-2.5 rounded-lg border border-purple-500/25 text-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    const updated = adminUserList.map((item) => item.id === selectedAdminUser.id ? selectedAdminUser : item);
                    setAdminUserList(updated);

                    // If editing logged in user, apply state changes globally so UI responds instantly!
                    const isSelf = currentUser && currentUser.email === selectedAdminUser.email;
                    if (isSelf) {
                      persistUser({
                        username: selectedAdminUser.username,
                        email: selectedAdminUser.email,
                        phone: selectedAdminUser.phone,
                        avatar: currentUser?.avatar || "",
                        projectName: selectedAdminUser.projectName,
                        sector: selectedAdminUser.sector,
                        analysesCount: selectedAdminUser.usedToday,
                        lastAnalysisDate: currentUser?.lastAnalysisDate || "",
                        referredFriends: currentUser?.referredFriends || 0,
                        plan: selectedAdminUser.plan,
                        role: selectedAdminUser.role
                      });
                      setWelcomeToast(`🔒 ¡Tu perfil administrativo de sesión ha sido guardado exitosamente!`);
                    } else {
                      setWelcomeToast(`📋 Se guardaron los cambios del socio: ${selectedAdminUser.username}`);
                    }

                    setSelectedAdminUser(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-purple-600 hover:bg-purple-700 text-white cursor-pointer active:scale-95 transition"
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={() => setSelectedAdminUser(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border border-purple-500/20 bg-transparent text-gray-400 hover:text-white cursor-pointer active:scale-95 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DIALOG NUEVO USUARIO */}
        {isAdminFormNewOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="w-full max-w-md p-6 rounded-2xl bg-[#0b0b14] border border-purple-500/40 shadow-2xl space-y-4 relative text-left">
              <button
                onClick={() => setIsAdminFormNewOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold"
              >
                ✕
              </button>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/40">
                  <UserPlus className="w-5 h-5 text-purple-400" />
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider mt-2">
                  Registrar Nuevo Socio o Negocio
                </h4>
                <p className="text-[10px] text-gray-405 font-bold">Agrega un usuario a la base de control de manera simplificada</p>
              </div>

              <div className="space-y-3 text-xs max-h-96 overflow-y-auto pr-1">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-purple-400">Nombre de Usuario *</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Andrés Felipe Restrepo"
                    value={newAdminUsername}
                    onChange={(e) => setNewAdminUsername(e.target.value)}
                    className="w-full bg-black/50 p-2.5 rounded-lg border border-purple-500/25 text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-purple-400">Correo Electrónico *</label>
                  <input 
                    type="email" 
                    placeholder="Ej. andres@empresa.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="w-full bg-black/50 p-2.5 rounded-lg border border-purple-500/25 text-white font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-purple-400">Teléfono *</label>
                  <input 
                    type="text" 
                    placeholder="Ej. +57 322 990 1234"
                    value={newAdminPhone}
                    onChange={(e) => setNewAdminPhone(e.target.value)}
                    className="w-full bg-black/50 p-2.5 rounded-lg border border-purple-500/25 text-white font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-purple-400">Nombre del Proyecto</label>
                  <input 
                    type="text" 
                    placeholder="Nombre de la Startup o Idea"
                    value={newAdminProject}
                    onChange={(e) => setNewAdminProject(e.target.value)}
                    className="w-full bg-black/50 p-2.5 rounded-lg border border-purple-500/25 text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-purple-400">Sector de Negocio</label>
                  <input 
                    type="text" 
                    placeholder="Ej. FinTech, E-commerce, Logística"
                    value={newAdminSector}
                    onChange={(e) => setNewAdminSector(e.target.value)}
                    className="w-full bg-black/50 p-2.5 rounded-lg border border-purple-500/25 text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase text-purple-400">Suscripción</label>
                    <select
                      value={newAdminPlan}
                      onChange={(e) => setNewAdminPlan(e.target.value as any)}
                      className="w-full bg-[#0b0b14] p-2.5 rounded-lg border border-purple-500/25 text-white text-xs font-bold focus:outline-none"
                    >
                      <option value="basico">Básico</option>
                      <option value="pro">Pro</option>
                      <option value="elite">Élite</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase text-purple-400">Rol</label>
                    <select
                      value={newAdminRole}
                      onChange={(e) => setNewAdminRole(e.target.value)}
                      className="w-full bg-[#0b0b14] p-2.5 rounded-lg border border-purple-500/25 text-white text-xs font-bold focus:outline-none"
                    >
                      <option value="Emprendedor">Emprendedor</option>
                      <option value="Empresario/Patrocinador">Empresario/Patrocinador</option>
                      <option value="Dueño/Admin">Dueño/Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    if (!newAdminUsername.trim() || !newAdminEmail.trim() || !newAdminPhone.trim()) {
                      alert("Por favor rellene todos los campos marcados con (*) para registrar el usuario.");
                      return;
                    }
                    
                    const limits = { basico: 1, pro: 3, elite: 9 };
                    const createdUser = {
                      id: adminUserList.length + 1,
                      username: newAdminUsername,
                      email: newAdminEmail,
                      phone: newAdminPhone,
                      plan: newAdminPlan,
                      role: newAdminRole,
                      status: "Activo",
                      projectName: newAdminProject || "Simulada Co.",
                      sector: newAdminSector || "Tecnología",
                      dateReg: new Date().toISOString().split("T")[0],
                      dailyLimit: limits[newAdminPlan],
                      usedToday: 0
                    };
                    
                    setAdminUserList([...adminUserList, createdUser]);
                    setWelcomeToast(`👥 ¡Nuevo socio ${newAdminUsername} registrado en mesa de control con éxito!`);
                    setIsAdminFormNewOpen(false);
                  }}
                  className="flex-1 py-1 px-4 h-11 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 text-white cursor-pointer active:scale-95 transition"
                >
                  Registrar Usuario
                </button>
                <button
                  onClick={() => setIsAdminFormNewOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border border-purple-500/20 bg-transparent text-gray-400 hover:text-white cursor-pointer active:scale-95 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= CONTACTOS DETALLADOS ================= */}
        <div id="contacto" className="my-12 p-6 rounded-2xl bg-[#0d0d1a]/80 backdrop-blur-xl border border-purple-500/20 space-y-4">
          <div className="text-xs font-black uppercase tracking-widest text-purple-400 pb-2 border-b border-purple-900/40">Soporte & Asesoría Directa</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a 
              href="mailto:innovaclub.socio@gmail.com" 
              className="flex items-center gap-4 p-4 rounded-xl border border-blue-500/20 bg-blue-900/5 hover:bg-blue-950/20 transition duration-200"
            >
              <Mail className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-[10px] font-black uppercase text-blue-400">Correo de Contacto</div>
                <div className="text-sm font-black text-white">innovaclub.socio@gmail.com</div>
              </div>
            </a>
            <a 
              href="https://wa.me/573044601667" 
              className="flex items-center gap-4 p-4 rounded-xl border border-emerald-500/20 bg-emerald-900/5 hover:bg-emerald-950/20 transition duration-200"
            >
              <Smartphone className="w-8 h-8 text-emerald-400" />
              <div>
                <div className="text-[10px] font-black uppercase text-emerald-400">Canal de WhatsApp</div>
                <div className="text-sm font-black text-white">+57 304 460 1667</div>
              </div>
            </a>
          </div>
        </div>

        {/* ================= REGISTRO CORPORATIVO Y COPYRIGHT FOOTER ================= */}
        <footer className="mt-16 mb-24 pt-8 pb-4 border-t border-purple-950/60 text-center space-y-4">
          <div className="max-w-3xl mx-auto space-y-2.5">
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black bg-purple-950 text-purple-400 px-2.5 py-0.5 rounded border border-purple-900/40 uppercase tracking-widest">
                INNOVACLUB S.A.S.
              </span>
              <span className="text-[10px] text-gray-500 font-bold">•</span>
              <span className="text-[10px] font-bold text-gray-400">NIT: 901.482.359-2</span>
              <span className="text-[10px] text-gray-500 font-bold">•</span>
              <span className="text-[10px] font-bold text-gray-400">Matrícula Mercantil No. 2021004128</span>
            </div>
            
            <p className="text-[10.5px] text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto">
              InnovaClubAI® es una marca comercial y tecnológica registrada. Autorizados para intermediación fiduciaria, valorización y brokerage de fusiones &amp; adquisiciones empresariales bajo regulaciones comerciales de la Superintendencia de Sociedades en Colombia y lineamientos internacionales de la debida diligencia corporativa.
            </p>
          </div>

          <p className="text-[9.5px] text-gray-500 font-mono font-semibold pt-2">
            © 2023 - 2026 InnovaClubAI. Todos los derechos reservados. Modelos de análisis algorítmico entrenados y actualizados.
          </p>
        </footer>

      </div>

      {/* ================= OVERLAY 1: AUTHENTICATION / SIGN IN ("INGRESAR") ================= */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0b0b14] border border-purple-500/40 shadow-2xl space-y-6 relative">
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center">
                <User className="w-6 h-6 text-[#FF2EFB]" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider">
                Ingresar a InnovaClubAI
              </h3>
              {loginPromptReason ? (
                <p className="text-xs text-purple-400 font-semibold bg-purple-950/25 p-2 rounded border border-purple-500/20 leading-relaxed">
                  {loginPromptReason}
                </p>
              ) : (
                <p className="text-xs text-gray-400">
                  Desbloquea diagnósticos avanzados y lleva un control estricto de tu progreso.
                </p>
              )}
            </div>

            {authStep === "platformSelection" ? (
              <div className="space-y-3">
                {/* Google Button */}
                <button 
                  onClick={() => handleMockAuth("google")}
                  className="w-full py-3 px-4 rounded-xl bg-white text-black font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-3 active:scale-95 transition hover:bg-gray-100"
                >
                  {/* Google Custom colored icon representation */}
                  <span className="text-base font-black">G</span>
                  <span>Continuar con Google</span>
                </button>

                {/* TikTok Button */}
                <button 
                  onClick={() => handleMockAuth("tiktok")}
                  className="w-full py-3 px-4 rounded-xl bg-[#00f7ef]/15 hover:bg-[#00f7ef]/25 border border-[#00f7ef]/40 text-[#00f7ef] font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-3 active:scale-95 transition"
                >
                  <span className="text-base font-black text-rose-500">🎵</span>
                  <span>Continuar con TikTok</span>
                </button>

                {/* Separador */}
                <div className="flex items-center justify-center gap-2 py-1 text-gray-500 text-[10px] uppercase font-black">
                  <div className="flex-1 h-px bg-purple-500/10"></div>
                  <span>O CONTINUAR CON</span>
                  <div className="flex-1 h-px bg-purple-500/10"></div>
                </div>

                {/* Email Button */}
                <button 
                  onClick={() => handleMockAuth("email")}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-600 hover:to-pink-500 text-white font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 active:scale-95 transition"
                >
                  <Mail className="w-4 h-4" />
                  <span>Correo Electrónico (Tradicional)</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleEmailRegisterOrLogin} className="space-y-4">
                <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-1">
                  
                  {/* Username */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-purple-400 mb-1">
                      Nombre de Usuario *
                    </label>
                    <input 
                      type="text"
                      required
                      value={authUsername}
                      onChange={e => setAuthUsername(e.target.value)}
                      placeholder="Ej: InnovadorDigital"
                      className="w-full bg-black border border-purple-500/30 rounded-xl p-2.5 text-xs text-white focus:border-fuchsia-500 outline-none"
                    />
                  </div>

                  {/* Correo */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-purple-400 mb-1">
                      Correo Electrónico *
                    </label>
                    <input 
                      type="email"
                      required
                      value={authEmail}
                      onChange={e => setAuthEmail(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      className="w-full bg-black border border-purple-500/30 rounded-xl p-2.5 text-xs text-white focus:border-fuchsia-500 outline-none"
                    />
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-purple-400 mb-1">
                      Número de Contacto *
                    </label>
                    <input 
                      type="tel"
                      required
                      value={authPhone}
                      onChange={e => setAuthPhone(e.target.value)}
                      placeholder="Ej: +57 300 123 4567"
                      className="w-full bg-black border border-purple-500/30 rounded-xl p-2.5 text-xs text-white focus:border-fuchsia-500 outline-none"
                    />
                  </div>

                  {/* Nombre de idea */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-purple-400 mb-1">
                      Nombre de Idea/Proyecto o Empresa
                    </label>
                    <input 
                      type="text"
                      value={authProjectName}
                      onChange={e => setAuthProjectName(e.target.value)}
                      placeholder="Ej: NeoSaaS Solutions"
                      className="w-full bg-black border border-purple-500/30 rounded-xl p-2.5 text-xs text-white focus:border-fuchsia-500 outline-none"
                    />
                  </div>

                  {/* Sector */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-purple-400 mb-1">
                      Sector / Industria
                    </label>
                    <input 
                      type="text"
                      value={authSector}
                      onChange={e => setAuthSector(e.target.value)}
                      placeholder="Ej: Tecnología alimentaria"
                      className="w-full bg-black border border-purple-500/30 rounded-xl p-2.5 text-xs text-white focus:border-fuchsia-500 outline-none"
                    />
                  </div>

                  {/* Modalidad de Cuenta - Empresario o Emprendedor */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-[#FF2EFB] mb-1">
                      Modalidad de Cuenta *
                    </label>
                    <select 
                      value={authRole}
                      onChange={e => setAuthRole(e.target.value as any)}
                      className="w-full bg-black border border-purple-500/30 rounded-xl p-2.5 text-xs text-white focus:border-fuchsia-500 outline-none cursor-pointer"
                    >
                      <option value="Emprendedor">Emprendedor / Empresa</option>
                      <option value="Empresario/Patrocinador">Empresario / Patrocinador (Inversionista VIP)</option>
                    </select>
                    <p className="text-[9px] text-[#2E8BFF] mt-1 font-bold uppercase tracking-wide">
                      * El perfil de Empresario desbloquea el radar exclusivo de negocios recomendados para inversión.
                    </p>
                  </div>

                  {/* Foto de perfil (opcional) */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-purple-400 mb-1">
                      Enlace de Foto de Perfil (Opcional)
                    </label>
                    <input 
                      type="url"
                      value={authAvatar}
                      onChange={e => setAuthAvatar(e.target.value)}
                      placeholder="https://enlace-imagen.png"
                      className="w-full bg-black border border-purple-500/30 rounded-xl p-2.5 text-xs text-white focus:border-fuchsia-500 outline-none"
                    />
                    <p className="text-[9px] text-gray-500 mt-0.5">Puedes ingresar una URL de imagen o dejar vacío para fallback.</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setAuthStep("platformSelection")}
                    className="flex-1 py-2.5 rounded-xl border border-purple-500/30 text-[10px] font-black uppercase hover:bg-purple-950/20 text-gray-400"
                  >
                    Atrás
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[10px] font-black uppercase hover:opacity-90 transition"
                  >
                    Crear Cuenta Gratis
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= OVERLAY 2: MODIFY PROFILE ("OPCIÓN DE MODIFICAR PERFIL") ================= */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0b0b14] border border-blue-500/40 shadow-2xl space-y-5 relative">
            <button 
              onClick={() => setIsEditProfileOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <div className="w-10 h-10 mx-auto rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center">
                <Edit className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                Modificar Perfil de Usuario
              </h3>
              <p className="text-[11px] text-gray-400">Edita tus datos empresariales en tiempo real.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-1">
                
                {/* Username */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-blue-400 mb-1">
                    Nombre de Usuario *
                  </label>
                  <input 
                    type="text"
                    required
                    value={editUsername}
                    onChange={e => setEditUsername(e.target.value)}
                    className="w-full bg-black border border-blue-500/30 rounded-xl p-2.5 text-xs text-white focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-blue-400 mb-1">
                    Correo Electrónico *
                  </label>
                  <input 
                    type="email"
                    required
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    className="w-full bg-black border border-blue-500/30 rounded-xl p-2.5 text-xs text-white focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-blue-400 mb-1">
                    Número de Contacto *
                  </label>
                  <input 
                    type="tel"
                    required
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    className="w-full bg-black border border-blue-500/30 rounded-xl p-2.5 text-xs text-white focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Project */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-blue-400 mb-1">
                    Nombre de Idea o Empresa
                  </label>
                  <input 
                    type="text"
                    value={editProjectName}
                    onChange={e => setEditProjectName(e.target.value)}
                    className="w-full bg-black border border-blue-500/30 rounded-xl p-2.5 text-xs text-white focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Sector */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-blue-400 mb-1">
                    Sector / Industria
                  </label>
                  <input 
                    type="text"
                    value={editSector}
                    onChange={e => setEditSector(e.target.value)}
                    className="w-full bg-black border border-blue-500/30 rounded-xl p-2.5 text-xs text-white focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Modalidad de Cuenta - Profiler */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-[#FF2EFB] mb-1">
                    Modalidad de Cuenta *
                  </label>
                  <select 
                    value={editRole}
                    onChange={e => setEditRole(e.target.value as any)}
                    className="w-full bg-black border border-[#FF2EFB]/30 rounded-xl p-2.5 text-xs text-white focus:border-[#FF2EFB] outline-none cursor-pointer"
                  >
                    <option value="Emprendedor">Emprendedor / Empresa</option>
                    <option value="Empresario/Patrocinador">Empresario / Patrocinador (Inversionista VIP)</option>
                  </select>
                </div>

                {/* Avatar URL */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-blue-400 mb-1">
                    Foto de Perfil (URL de imagen)
                  </label>
                  <input 
                    type="url"
                    value={editAvatar}
                    onChange={e => setEditAvatar(e.target.value)}
                    className="w-full bg-black border border-blue-500/30 rounded-xl p-2.5 text-xs text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditProfileOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border-2 border-blue-500/40 bg-transparent text-blue-350 text-[10px] font-black uppercase hover:bg-blue-950/20 active:scale-95 transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl border-2 border-[#2E8BFF] bg-transparent text-[#2E8BFF] text-[10px] font-black uppercase hover:bg-[#2E8BFF]/10 transition active:scale-95 shadow-[0_0_12px_rgba(46,139,255,0.35)]"
                >
                  Guardar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= OVERLAY 3: TRIAL CONSTRAINT EXCEEDED & SHARE PROMPT ================= */}
      {isLimitModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0e0a1f] border border-[#FF2EFB]/50 shadow-2xl space-y-5 relative">
            <button 
              onClick={() => setIsLimitModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-pink-500/20 border border-[#FF2EFB] flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#FF2EFB]" />
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                Límite de Prueba Superado 🚨
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                El plan Básico (Prueba Gratis de Innovatorio) tiene únicamente <strong>1 Análisis diario completo</strong>. Puedes actualizar para continuar de inmediato o invitar a un amigo totalmente gratis.
              </p>
            </div>

            {inviteSuccess ? (
              <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-center space-y-2 animate-bounce">
                <div className="text-lg font-black uppercase">¡Invitación Enviada! 🎁</div>
                <div className="text-xs">Hemos liberado exitosamente tu <strong>segundo análisis de cortesía para hoy</strong>. ¡Disfrútalo!</div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Opción A: Invitar amigo */}
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3">
                  <div className="text-xs font-black text-purple-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-[#FF2EFB]" />
                    <span>Opción 1: Recomienda a un Amigo y Obtén +1 Análisis</span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Ingresa el nombre de un amigo que desee potenciar su idea con IA Empresarial. Al pulsar enviar, se desbloqueará de inmediato tu segundo análisis gratis de hoy.
                  </p>
                  
                  <form onSubmit={handleInviteFriend} className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text"
                        required
                        placeholder="Nombre de amigo"
                        value={inviteFriendName}
                        onChange={e => setInviteFriendName(e.target.value)}
                        className="bg-black border border-purple-500/20 rounded-xl p-2 text-xs text-white outline-none w-full"
                      />
                      <input 
                        type="email"
                        required
                        placeholder="Email de amigo"
                        value={inviteFriendEmail}
                        onChange={e => setInviteFriendEmail(e.target.value)}
                        className="bg-black border border-purple-500/20 rounded-xl p-2 text-xs text-white outline-none w-full"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-2 border-2 border-[#FF2EFB] bg-transparent text-[#FF2EFB] font-extrabold text-[10px] uppercase tracking-wider rounded-xl hover:bg-[#FF2EFB]/10 active:scale-95 transition duration-150 shadow-[0_0_10px_rgba(255,46,251,0.25)]"
                    >
                      Enviar Invitación y Liberar Análisis
                    </button>
                  </form>
                </div>

                {/* Separador */}
                <div className="flex items-center text-gray-650 justify-center gap-2 text-[9px] uppercase font-bold">
                  <div className="flex-1 h-px bg-purple-500/15"></div>
                  <span>ó preferiblemente</span>
                  <div className="flex-1 h-px bg-purple-500/15"></div>
                </div>

                {/* Opción B: Upgrade button */}
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      setIsLimitModalOpen(false);
                      document.getElementById("planes")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full py-3 rounded-xl border-2 border-[#FF2EFB] bg-transparent text-[#FF2EFB] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#FF2EFB]/10 active:scale-95 transition shadow-[0_0_15px_rgba(255,46,251,0.3)]"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                    <span>Actualizar Plan a Pro o Élite</span>
                  </button>
                  <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                    Suscripción Pro (3 analyses/día) o Élite (9 analyses/dispositivo ilimitados) con informes de automatización completos de IA empresarial.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= LOADER FUTURISTA DE SIMULACIÓN DE FÓRMULA ================= */}
      {isToolProcessing && (
        <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/10 border-2 border-blue-500 border-t-transparent animate-spin flex items-center justify-center shadow-[0_0_20px_rgba(46,139,255,0.3)]">
              <Cpu className="w-6 h-6 text-blue-400 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#2E8BFF]">Fórmula Inteligente en Proceso</h4>
              <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-wider">
                Procesando parámetros corporativos con la red neural de InnovaClubAI...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL OVERLAY: RESULTADO SIMULADO DE IA (HERRAMIENTAS/FÓRMULAS) ================= */}
      {activeToolSimulated && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-[#0b0b14] border border-blue-500/40 shadow-2xl relative space-y-6">
            <button 
              onClick={() => setActiveToolSimulated(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 pb-4 border-b border-blue-950/40">
              <span className="text-3xl">{activeToolSimulated.icon}</span>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Fórmula Ejecutada: {activeToolSimulated.title}
                </h3>
                <p className="text-[10px] text-blue-400 uppercase font-bold tracking-wider">InnovaClubAI &mdash; Reporte Dinámico Corporativo</p>
              </div>
            </div>

            <pre className="text-xs font-mono bg-black/80 text-[#2E8BFF] p-5 rounded-2xl border border-blue-500/20 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto shadow-inner">
              {activeToolSimulated.output}
            </pre>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={() => {
                  const blob = new Blob([activeToolSimulated.output], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `InnovaClubAI_${activeToolSimulated.title.replace(/\s+/g, "_")}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex-1 py-3 rounded-xl border border-blue-500/35 text-blue-300 hover:text-white bg-transparent hover:bg-blue-500/10 text-[10px] uppercase font-black tracking-wider transition active:scale-95 text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Reporte (.txt)</span>
              </button>
              <button 
                onClick={() => setActiveToolSimulated(null)}
                className="flex-1 py-3 rounded-xl border border-gray-700 bg-transparent text-gray-400 hover:text-white text-[10px] uppercase font-black tracking-wider hover:bg-white/5 transition active:scale-95 text-center cursor-pointer"
              >
                Cerrar Reporte
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL OVERLAY: DETALLE DE HISTORIAL RECIENTE ================= */}
      {activeAnalysisDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-[#0b0b14] border border-[#FF2EFB]/40 shadow-2xl relative space-y-6">
            <button 
              onClick={() => setActiveAnalysisDetail(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center justify-between pb-4 border-b border-purple-950/40">
              <div className="flex items-center gap-1.5">
                <Activity className="w-5 h-5 text-[#FF2EFB] animate-pulse" />
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    {activeAnalysisDetail.name}
                  </h3>
                  <p className="text-[10px] text-[#FF2EFB] uppercase font-bold tracking-wider">Sectores: {activeAnalysisDetail.sector} &mdash; {activeAnalysisDetail.type}</p>
                </div>
              </div>
              <span className="text-[10px] font-black tracking-widest text-[#FF2EFB] bg-[#FF2EFB]/10 border border-[#FF2EFB]/30 px-3 py-1 rounded-full uppercase">
                Puntaje: {activeAnalysisDetail.score}
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-black/55 border border-purple-500/10 space-y-2">
                <div className="text-[10px] font-black uppercase text-purple-400">Descripción o Idea Estratégica Analizada:</div>
                <p className="text-xs text-gray-200 leading-relaxed font-semibold">{activeAnalysisDetail.idea}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-purple-950/10 border border-purple-500/15 space-y-2">
                  <div className="text-[10px] font-black uppercase text-[#FF2EFB] flex items-center gap-1">
                    <span>💪 Ventaja IA Recomendada</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-medium">
                    Su nicho en <strong className="text-white">{activeAnalysisDetail.sector}</strong> le entrega una velocidad de conversión óptima. El puntaje de <strong>{activeAnalysisDetail.score}/100</strong> indica un alto nivel de adquisición tecnológica inicial para captar flujos comerciales desatendidos.
                  </p>
                </div>
                
                <div className="p-4 rounded-xl bg-blue-950/10 border border-blue-500/15 space-y-2">
                  <div className="text-[10px] font-black uppercase text-[#2E8BFF] flex items-center gap-1">
                    <span>🚀 Siguiente Paso de Tracción</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-medium">
                    Ejecutar un estudio de barrido en el <strong className="text-white">Radar de Competencia Geográfico</strong> en zonas de alta rentabilidad para precisar debilidades mercantiles de tus competidores locales primarios.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={() => {
                  const wpText = `Hola InnovaClub, deseo recibir el informe estratégico consolidado para la idea analizada de: ${activeAnalysisDetail.name}`;
                  window.open(`https://wa.me/573044601667?text=${encodeURIComponent(wpText)}`, "_blank");
                }}
                className="flex-1 py-3 rounded-xl border-2 border-[#FF2EFB] bg-transparent text-[#FF2EFB] hover:text-white hover:bg-[#FF2EFB]/10 text-[10px] uppercase font-black tracking-wider transition active:scale-95 text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(255,46,251,0.25)]"
              >
                <span>Asesoría Estratégica Directa (WhatsApp)</span>
              </button>
              <button 
                onClick={() => setActiveAnalysisDetail(null)}
                className="flex-1 py-3 rounded-xl border border-gray-700 bg-transparent text-gray-400 hover:text-white text-[10px] uppercase font-black tracking-wider hover:bg-white/5 transition active:scale-95 text-center cursor-pointer"
              >
                Cerrar Diagnóstico
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= BOTTOM BAR NAVIGATION ================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-black/92 backdrop-blur-md border-t border-purple-500/45 flex items-center justify-around px-2">
        <button 
          onClick={() => { setActiveTab("formulas"); document.getElementById("formulas-herramientas")?.scrollIntoView({ behavior: 'smooth' }); }}
          className={`flex flex-col items-center gap-1 text-[10px] font-black uppercase duration-200 ${
            activeTab === "formulas" ? "text-[#FF2EFB]" : "text-gray-400 hover:text-white"
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Fórmulas</span>
        </button>
        <button 
          onClick={() => { setActiveTab("radar"); document.getElementById("radar-seccion")?.scrollIntoView({ behavior: 'smooth' }); }}
          className={`flex flex-col items-center gap-1 text-[10px] font-black uppercase duration-200 ${
            activeTab === "radar" ? "text-[#FF2EFB]" : "text-gray-400 hover:text-white"
          }`}
        >
          <Map className="w-5 h-5" />
          <span>Radar</span>
        </button>
        <button 
          onClick={() => { 
            setActiveTab("diagnostico"); 
            const el = document.getElementById("diagnostico");
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            else alert("Primero ejecuta un Análisis en la columna izquierda para ver los resultados.");
          }}
          className="flex flex-col items-center gap-1 text-[10px] font-black uppercase duration-200 text-gray-400 hover:text-white"
        >
          <Activity className="w-5 h-5" />
          <span>Análisis</span>
        </button>
        <button 
          onClick={() => { 
            setActiveTab("postula"); 
            const el = document.getElementById("resultado-postulacion");
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            else alert("Primero postula tu proyecto en el formulario de admisiones.");
          }}
          className="flex flex-col items-center gap-1 text-[10px] font-black uppercase duration-200 text-gray-400 hover:text-white"
        >
          <Award className="w-5 h-5" />
          <span>Admisión</span>
        </button>
        <button 
          onClick={() => { 
            setActiveTab("negocios"); 
            document.getElementById("negocios-venta")?.scrollIntoView({ behavior: 'smooth' }); 
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-black uppercase duration-200 ${
            activeTab === "negocios" ? "text-[#FF2EFB]" : "text-gray-400 hover:text-white"
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span>Negocios</span>
        </button>
        <button 
          onClick={() => { setActiveTab("planes"); document.getElementById("planes")?.scrollIntoView({ behavior: 'smooth' }); }}
          className="flex flex-col items-center gap-1 text-[10px] font-black uppercase duration-200 text-gray-400 hover:text-white"
        >
          <DollarSign className="w-5 h-5" />
          <span>Planes</span>
        </button>
        <button 
          onClick={() => { setActiveTab("admin"); document.getElementById("admin-seccion")?.scrollIntoView({ behavior: 'smooth' }); }}
          className={`flex flex-col items-center gap-1 text-[10px] font-black uppercase duration-200 ${
            activeTab === "admin" ? "text-red-500 font-black" : "text-red-400 hover:text-white"
          }`}
        >
          <Lock className="w-5 h-5" />
          <span>Control</span>
        </button>
      </nav>

    </div>
  );
}
