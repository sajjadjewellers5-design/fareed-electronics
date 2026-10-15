import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  X,
  BookOpen,
  HelpCircle,
  Tag,
  Barcode,
  Boxes,
  Sliders,
  Receipt,
  FileText,
  Printer,
  Keyboard,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Search,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Headphones,
  Play,
  Square,
  Languages,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SOFTWARE_GUIDELINES, GuidelineSection } from '../data/softwareGuidelines';
import { FareedElectronicsBadge } from './BrandLogo';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  actionModal?: 'TAG_PRINT' | 'STOCK_ADJUST' | 'CREATE_SALE' | 'NEW_PRODUCT' | 'ACCOUNT_INFO';
  actionTab?: string;
  actionLabel?: string;
  timestamp: string;
}

export const AIAgentGuideModal: React.FC = () => {
  const {
    isAIGuideModalOpen,
    setIsAIGuideModalOpen,
    setIsTagPrintingModalOpen,
    setIsStockAdjustmentModalOpen,
    setIsNewProductModalOpen,
    setIsCreateInvoiceModalOpen,
    setIsAccountInfoModalOpen,
    setActiveTab,
    language,
  } = useApp();

  const [activeTab, setActiveGuideTab] = useState<'CHAT' | 'VOICE' | 'MANUAL'>('CHAT');
  const [searchManualQuery, setSearchManualQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<GuidelineSection | null>(
    SOFTWARE_GUIDELINES[0]
  );

  // Chat conversation state
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text:
        language === 'ur'
          ? 'السلام علیکم! میں فرید الیکٹرانکس کا آفیشل AI اسسٹنٹ ہوں۔ سافٹ ویئر کے تمام سسٹمز جیسے کہ تمام سائز کے ٹیگ پرنٹنگ، ٹیگ اسکینر سے خودکار سیل انٹری، اسٹاک پیسز آٹو مرج، اسٹاک ایڈجسٹمنٹ واؤچر، روزنامچہ، اور پرنٹر سیٹنگز کے بارے میں کچھ بھی پوچھیں۔ آپ مائیکروفون کے ذریعے بول کر صوتی گفتگو بھی کر سکتے ہیں!'
          : 'Hello! I am your Official Fareed Electronics AI Guide & Assistant. Ask me anything about the All-Size Tag Printing System, Tag Scanner with Auto-Connect Sales, Pieces Stock Auto-Merge, Stock Adjustment Vouchers, Ledgers, or Printer settings. You can also talk to me directly using full voice communication!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Voice Communication States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [autoVoiceMode, setAutoVoiceMode] = useState(true);
  const [voiceLanguage, setVoiceLanguage] = useState<'ur-PK' | 'en-US'>(() =>
    language === 'ur' ? 'ur-PK' : 'en-US'
  );
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [lastUserVoiceTranscript, setLastUserVoiceTranscript] = useState('');

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Listen for external open-voice-mode triggers (e.g. from Floating button)
  useEffect(() => {
    const handleOpenVoice = () => {
      setActiveGuideTab('VOICE');
      setTimeout(() => {
        startListeningVoice();
      }, 350);
    };

    window.addEventListener('erp-open-voice-mode', handleOpenVoice);
    return () => {
      window.removeEventListener('erp-open-voice-mode', handleOpenVoice);
    };
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = voiceLanguage;

        recognition.onstart = () => {
          setIsListening(true);
          setVoiceNotice(
            voiceLanguage.startsWith('ur')
              ? 'مائیکروفون آن ہے، فرمائیے...'
              : 'Microphone active, speak now...'
          );
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            setInputMessage(currentTranscript);
            setLastUserVoiceTranscript(currentTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setVoiceNotice(
              voiceLanguage.startsWith('ur')
                ? 'براہ کرم براؤزر میں مائیکروفون کی اجازت دیں'
                : 'Microphone permission blocked. Please allow mic in browser settings.'
            );
          } else if (event.error === 'no-speech') {
            setVoiceNotice(null);
          } else {
            setVoiceNotice(`Mic status: ${event.error}`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          // If in Voice Mode and user spoke something, send it automatically
          setInputMessage((latest) => {
            const spoken = latest.trim();
            if (spoken && activeTab === 'VOICE') {
              handleSendMessage(spoken);
              return '';
            }
            return latest;
          });
          setTimeout(() => setVoiceNotice(null), 3000);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('SpeechRecognition initialization error:', err);
      }
    }

    return () => {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } catch (e) {}
    };
  }, [voiceLanguage, activeTab]);

  // Voice Synthesis (TTS) Helper
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingMessageId(null);
  };

  const speakMessage = (text: string, msgId?: string) => {
    if (!('speechSynthesis' in window)) {
      setVoiceNotice('Text-to-speech not supported in this browser.');
      return;
    }

    if (isSpeaking && speakingMessageId === msgId) {
      stopSpeaking();
      return;
    }

    window.speechSynthesis.cancel();

    // Clean formatting for natural speech pronunciation
    const cleanText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/•/g, ', ')
      .replace(/→/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechSpeed;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const isUrduText = voiceLanguage.startsWith('ur') || /[\u0600-\u06FF]/.test(cleanText);

    if (isUrduText) {
      const urduVoice = voices.find(
        (v) =>
          v.lang.startsWith('ur') ||
          v.name.toLowerCase().includes('urdu') ||
          v.lang.startsWith('ar')
      );
      if (urduVoice) utterance.voice = urduVoice;
      utterance.lang = 'ur-PK';
    } else {
      const engVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('US') ||
            v.name.includes('UK'))
      );
      if (engVoice) utterance.voice = engVoice;
      utterance.lang = 'en-US';
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      if (msgId) setSpeakingMessageId(msgId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      // If auto-voice mode is active in the Voice tab, listen again for follow-up!
      if (activeTab === 'VOICE' && autoVoiceMode) {
        setTimeout(() => startListeningVoice(), 500);
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const startListeningVoice = () => {
    stopSpeaking();
    if (!recognitionRef.current) {
      setVoiceNotice('Speech recognition not available. Please type your message.');
      return;
    }
    try {
      recognitionRef.current.abort();
      recognitionRef.current.lang = voiceLanguage;
      recognitionRef.current.start();
    } catch (err: any) {
      console.warn('Speech recognition start:', err);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      startListeningVoice();
    }
  };

  // Suggested Quick Prompts
  const quickPrompts = [
    {
      label: '🏷️ All-Size Tag Printing Guide',
      prompt: 'How do I use the All-Size Tag Printing System for 50x25mm, Wine tags, and Jewelry barbells?',
    },
    {
      label: '⚡ Tag Scanner Sale Auto-Connect',
      prompt: 'How does the Tag Scanner automatically connect and add items to Sale Invoices in Pieces?',
    },
    {
      label: '📦 Stock Pieces & Same-Name Auto-Merge',
      prompt: 'Explain how entering items with the same name automatically merges and adds to previous stock quantity.',
    },
    {
      label: '📝 Stock Adjustment Voucher (SAV)',
      prompt: 'How do I create a Stock Adjustment Voucher for damaged goods, physical audit differences, or surplus intake?',
    },
    {
      label: '🖨️ Printer Setup (Thermal 80mm vs A4)',
      prompt: 'How do I select between Thermal 80mm slip printer and Laser A4 page printer?',
    },
    {
      label: '⌨️ All Keyboard Shortcuts',
      prompt: 'List all keyboard shortcuts in Fareed Electronics ERP and how to use them without mouse.',
    },
  ];

  // Action launcher
  const handleLaunchFeature = (
    modal?: 'TAG_PRINT' | 'STOCK_ADJUST' | 'CREATE_SALE' | 'NEW_PRODUCT' | 'ACCOUNT_INFO',
    tab?: string
  ) => {
    stopSpeaking();
    setIsAIGuideModalOpen(false);
    if (tab) setActiveTab(tab);
    if (modal === 'TAG_PRINT') setIsTagPrintingModalOpen(true);
    if (modal === 'STOCK_ADJUST') setIsStockAdjustmentModalOpen(true);
    if (modal === 'CREATE_SALE') setIsCreateInvoiceModalOpen(true);
    if (modal === 'NEW_PRODUCT') setIsNewProductModalOpen(true);
    if (modal === 'ACCOUNT_INFO') setIsAccountInfoModalOpen(true);
  };

  // Send message to Gemini server API with rich embedded fallback
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call server route /api/ai-guide
      const response = await fetch('/api/ai-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          chatHistory: messages.slice(-4).map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.text || 'Guidance received.';

        // Detect if reply mentions specific modules to attach interactive action buttons
        let actionModal: ChatMessage['actionModal'] = undefined;
        let actionLabel = undefined;

        const lower = (textToSend + ' ' + replyText).toLowerCase();
        if (
          lower.includes('tag print') ||
          lower.includes('ٹیگ پرنٹ') ||
          lower.includes('barbell') ||
          lower.includes('wine tag')
        ) {
          actionModal = 'TAG_PRINT';
          actionLabel = 'Launch All-Size Tag Printing Now →';
        } else if (
          lower.includes('adjustment') ||
          lower.includes('ایڈجسٹمنٹ') ||
          lower.includes('sav')
        ) {
          actionModal = 'STOCK_ADJUST';
          actionLabel = 'Open Stock Adjustment Voucher →';
        } else if (
          lower.includes('sale') ||
          lower.includes('invoice') ||
          lower.includes('بل') ||
          lower.includes('scanner') ||
          lower.includes('اسکینر')
        ) {
          actionModal = 'CREATE_SALE';
          actionLabel = 'Open Customer Sale & Scanner →';
        } else if (
          lower.includes('stock') ||
          lower.includes('new product') ||
          lower.includes('اسٹاک')
        ) {
          actionModal = 'NEW_PRODUCT';
          actionLabel = 'Open New Stock Entry →';
        }

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: replyText,
          actionModal,
          actionLabel,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);

        // If in Voice Mode, speak response aloud automatically!
        if (activeTab === 'VOICE' || autoVoiceMode) {
          speakMessage(replyText, botMsg.id);
        }
      } else {
        throw new Error('API offline, generating fallback');
      }
    } catch {
      // Embedded Intelligent Fallback Generator
      const lower = textToSend.toLowerCase();
      let fallbackText = '';
      let actionModal: ChatMessage['actionModal'] = undefined;
      let actionLabel = undefined;

      if (
        lower.includes('tag') ||
        lower.includes('ٹیگ') ||
        lower.includes('barcode') ||
        lower.includes('barbell')
      ) {
        fallbackText =
          language === 'ur'
            ? '🏷️ ٹیگ پرنٹنگ سسٹم کی تفصیل:\n1. سائیڈ بار یا ڈیش بورڈ سے "Print Tags" کھولیں۔\n2. مطلوبہ سائز منتخب کریں (50x25mm تھرمل، 40x20mm چھوٹا، 70x160mm بوتل نیک ٹیگ، جیولری باربیل، یا 100x150mm شپنگ)۔\n3. پروڈکٹ منتخب کریں یا نیا نام درج کریں۔\n4. سیریل نمبر خودکار طریقے سے اگلے نمبر پر جاتا ہے تاکہ کبھی ڈپلیکیٹ نہ ہو۔\n5. "Print Tags Now" پر کلک کر کے پرنٹ کریں۔'
            : '🏷️ All-Size Tag Printing System Guide:\n1. Open "Print Tags" from Sidebar, Dashboard, or any product row.\n2. Choose tag format: 50x25mm Standard Thermal, 40x20mm Small, 70x160mm Bottle Neck, Jewelry Barbell (rings/eyewear), 100x150mm Carton Label, or A4 24-Label Grid.\n3. Pick product from stock or enter custom details.\n4. Automatic monotonic progression ensures serial numbers never duplicate or repeat.\n5. Click "Print Tags Now" to print with zero-gap top margins.';
        actionModal = 'TAG_PRINT';
        actionLabel = 'Open Tag Printing Modal Now →';
      } else if (lower.includes('scan') || lower.includes('اسکین') || lower.includes('connect')) {
        fallbackText =
          language === 'ur'
            ? '⚡ ٹیگ اسکینر اور آٹو کنیکٹ سیل انٹری:\n1. F2 دبا کر نئی سیل انوائس کھولیں۔\n2. آئٹمز ٹیبل کے اوپر موجود "Tag & Barcode Fast Scanner" بار پر یو ایس بی اسکینر سے ٹیگ اسکین کریں۔\n3. سافٹ ویئر فوراً پروڈکٹ کو 1 عدد (Pieces) کے ساتھ شامل کر دے گا۔\n4. اگر وہی ٹیگ دوبارہ اسکین کریں تو تعداد خود بخود بڑھ (+1) جائے گی۔'
            : '⚡ Tag Scanner Auto-Connect Sales:\n1. Press F2 to open Create Sale Invoice.\n2. Use any USB/Bluetooth hardware barcode scanner or click Camera Scanner above the line items.\n3. Scan the tag or barcode: the product is instantly added with 1 Piece quantity.\n4. Scanning the same tag again automatically increments quantity (+1 Pcs).\n5. An audio beep confirms each scan without needing any mouse clicks!';
        actionModal = 'CREATE_SALE';
        actionLabel = 'Open Create Sale Invoice →';
      } else if (
        lower.includes('adjust') ||
        lower.includes('ایڈجسٹمنٹ') ||
        lower.includes('sav') ||
        lower.includes('damage')
      ) {
        fallbackText =
          language === 'ur'
            ? '📝 اسٹاک ایڈجسٹمنٹ واؤچر (SAV):\n1. "Stock Adjustment" واؤچر کھولیں۔\n2. ADDITION (+) منتخب کریں اگر اضافی مال برآمد ہوا ہو، یا DEDUCTION (-) اگر مال ٹوٹا یا کم ہو۔\n3. پروڈکٹ منتخب کر کے پیسز کی تعداد اور وجہ درج کریں۔\n4. محفوظ کرنے پر اسٹاک فوری اپڈیٹ ہو جائے گا اور پرنٹ سلپ بن جائے گی۔'
            : '📝 Stock Adjustment Voucher (SAV):\n1. Open "Stock Adjustment (SAV)" from Sidebar or Stock Management.\n2. Select ADDITION (+) for found surplus/recovery, or DEDUCTION (-) for damages, breakage, or expired goods.\n3. Select the product, enter pieces quantity, and reason category.\n4. Click "Save & Print" to atomically update inventory stock and generate the printable SAV slip.';
        actionModal = 'STOCK_ADJUST';
        actionLabel = 'Open Stock Adjustment Voucher →';
      } else if (
        lower.includes('stock') ||
        lower.includes('merge') ||
        lower.includes('اسٹاک') ||
        lower.includes('same name')
      ) {
        fallbackText =
          language === 'ur'
            ? '📦 اسٹاک پیسز اور آٹو مرج:\n1. جب آپ نیا اسٹاک پروڈکٹ داخل کرتے ہیں (F6)، اگر اسی نام کا پروڈکٹ پہلے سے موجود ہو تو سافٹ ویئر نئی تعداد پچھلے اسٹاک میں جمع کر دیتا ہے۔\n2. اس سے ڈپلیکیٹ آئٹم نہیں بنتا اور کل تعداد محفوظ رہتی ہے۔\n3. سیل انوائس بناتے وقت فروخت ہونے والے پیسز خود بخود اسٹاک سے مائنس ہو جاتے ہیں۔'
            : '📦 Pieces Stock & Same-Name Auto-Merge:\n1. All items are tracked in Pieces (Pcs).\n2. When adding a product in New Stock (F6), if a product with the same name already exists in inventory, the system automatically adds the new pieces to the previous item\'s stock.\n3. This keeps your inventory clean without duplicate rows.\n4. On sale invoices, sold pieces are auto-subtracted from inventory in real time.';
        actionModal = 'NEW_PRODUCT';
        actionLabel = 'Open New Stock Entry →';
      } else {
        fallbackText =
          language === 'ur'
            ? '💡 فرید الیکٹرانکس ای آر پی میں تمام ماڈیولز شامل ہیں:\n• ٹیگ پرنٹنگ سسٹم (تمام 6 سائز کے ٹیگ)\n• ٹیگ اسکینر خودکار سیل انٹری\n• اسٹاک ایڈجسٹمنٹ واؤچر (SAV)\n• کسٹمر سیلز و کارگو بلٹی ٹریکنگ\n• روزنامچہ (Day Book) اور کسٹمر و سپلائر لیجر\n• تھرمل 80mm اور A4 پرنٹر سلیکشن\n\nآپ بول کر کسی بھی فیچر کے بارے میں پوچھ سکتے ہیں!'
            : '💡 Fareed Electronics ERP includes complete features:\n• All-Size Tag Printing System (6 sizes)\n• Tag Scanner with Auto-Connect Sales\n• Stock Adjustment Voucher (SAV)\n• Customer Sales with Transport Bilty tracking\n• Day Book (Roznamcha) & Account Ledgers\n• Thermal 80mm & A4 Printer Selection\n\nSpeak or type any question for full step-by-step guidance!';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: fallbackText,
        actionModal,
        actionLabel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);

      if (activeTab === 'VOICE' || autoVoiceMode) {
        speakMessage(fallbackText, botMsg.id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAIGuideModalOpen) return null;

  const filteredManual = SOFTWARE_GUIDELINES.filter((g) => {
    const q = searchManualQuery.toLowerCase();
    return (
      g.title.toLowerCase().includes(q) ||
      g.titleUrdu.toLowerCase().includes(q) ||
      g.summary.toLowerCase().includes(q)
    );
  });

  const lastAssistantMessage = [...messages].reverse().find((m) => m.role === 'assistant');

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto no-print">
      <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl w-full max-w-5xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header with Voice Mode Tab Switcher */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-cyan-950/70 to-slate-900 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-300 relative">
              <Bot className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-ping" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Fareed AI Guide &amp; Voice Copilot</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono flex items-center gap-1">
                  <Mic className="w-3 h-3 text-cyan-400" />
                  <span>صوتی رابطہ و رہنمائی</span>
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                24/7 Voice &amp; text intelligent copilot for all ERP workflows, printing &amp; accounting
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* 3 Main Tabs: Chat, Voice Communication, and Full Manual */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setActiveGuideTab('CHAT');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'CHAT'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>AI Chat</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setActiveGuideTab('VOICE');
                  setTimeout(() => startListeningVoice(), 300);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
                  activeTab === 'VOICE'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/40 ring-1 ring-purple-400'
                    : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                <span>Voice Call (صوتی رابطہ)</span>
                {isListening && activeTab === 'VOICE' && (
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setActiveGuideTab('MANUAL');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'MANUAL'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Manual (گائیڈ)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                stopSpeaking();
                setIsAIGuideModalOpen(false);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden flex flex-col">
          
          {/* TAB 1: AI SMART ASSISTANT CHAT */}
          {activeTab === 'CHAT' && (
            <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-6 space-y-4">
              
              {/* Quick Prompts Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
                <span className="text-[11px] text-slate-400 shrink-0 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Quick Questions:</span>
                </span>
                {quickPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(q.prompt)}
                    className="shrink-0 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors cursor-pointer"
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              {/* Chat Conversation Scroll Area */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-3 ${
                      m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                        m.role === 'user'
                          ? 'bg-cyan-600 text-white shadow-md'
                          : 'bg-gradient-to-br from-indigo-600 to-cyan-600 text-white border border-cyan-400/30 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      }`}
                    >
                      {m.role === 'user' ? 'YOU' : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Speech Bubble */}
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 text-xs sm:text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-100 rounded-tr-none'
                          : 'bg-slate-900 border border-slate-700/80 text-slate-200 rounded-tl-none shadow-xl'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.text}</div>

                      {/* Interactive Feature Launcher Button */}
                      {m.actionModal && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => handleLaunchFeature(m.actionModal)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                          >
                            <span>{m.actionLabel || 'Launch Feature Now'}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Footer: Voice Speaker Button & Timestamp */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                        {m.role === 'assistant' ? (
                          <button
                            type="button"
                            onClick={() => speakMessage(m.text, m.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border transition-all cursor-pointer ${
                              isSpeaking && speakingMessageId === m.id
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                                : 'bg-slate-800/70 text-slate-300 border-slate-700/70 hover:text-white hover:bg-slate-700'
                            }`}
                            title={
                              isSpeaking && speakingMessageId === m.id
                                ? 'Stop Speaking'
                                : 'Listen to Answer aloud (آواز سنیں)'
                            }
                          >
                            {isSpeaking && speakingMessageId === m.id ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5 text-cyan-400" />
                                <span className="font-bold text-cyan-300">Stop Voice</span>
                                <div className="flex items-center gap-0.5 ml-1 h-3">
                                  <span className="w-0.5 h-full bg-cyan-400 voice-wave-bar-1" />
                                  <span className="w-0.5 h-full bg-cyan-400 voice-wave-bar-2" />
                                  <span className="w-0.5 h-full bg-cyan-400 voice-wave-bar-3" />
                                </div>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Listen (آواز سنیں)</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span />
                        )}
                        <span className="font-mono text-slate-500">{m.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-900 flex items-center justify-center text-cyan-300">
                      <Bot className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      <span>Fareed AI Guide is generating guidance...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Status Notice if listening */}
              {voiceNotice && (
                <div className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-xs text-cyan-300 flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>{voiceNotice}</span>
                  </div>
                  {isListening && (
                    <div className="flex items-center gap-1 h-3">
                      <span className="w-1 h-full bg-rose-400 voice-wave-bar-1" />
                      <span className="w-1 h-full bg-rose-400 voice-wave-bar-2" />
                      <span className="w-1 h-full bg-rose-400 voice-wave-bar-3" />
                      <span className="w-1 h-full bg-rose-400 voice-wave-bar-4" />
                    </div>
                  )}
                </div>
              )}

              {/* Chat Input Bar with Microphone Voice Dictation */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 focus-within:border-cyan-500/60 shadow-lg"
              >
                {/* Voice Input Mic Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isListening
                      ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-800'
                  }`}
                  title={isListening ? 'Stop Listening' : 'Voice Input / بول کر پوچھیں'}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 text-white" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>

                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    isListening
                      ? 'Listening to your voice... بولیں'
                      : 'Ask anything about ERP, tag printing, stock or ledgers in Urdu or English...'
                  }
                  className="flex-1 px-3 py-2 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                  disabled={isLoading}
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Ask AI</span>
                </button>
              </form>

            </div>
          )}

          {/* TAB 2: DEDICATED COPILOT VOICE COMMUNICATION SCREEN */}
          {activeTab === 'VOICE' && (
            <div className="flex-1 flex flex-col items-center justify-between p-6 sm:p-10 bg-gradient-to-b from-slate-950 via-[#071322] to-slate-950 overflow-y-auto space-y-6">
              
              {/* Voice Mode Header Status */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold shadow-lg">
                  <Headphones className="w-4 h-4 text-purple-400" />
                  <span>Real-Time Voice Communication (براہ راست صوتی رابطہ)</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {isListening ? (
                    <span className="text-rose-400 animate-pulse">
                      Listening to your voice... (آپ کی آواز سنی جا رہی ہے)
                    </span>
                  ) : isSpeaking ? (
                    <span className="text-cyan-400 animate-pulse">
                      Fareed Copilot is speaking aloud... (سنیں)
                    </span>
                  ) : isLoading ? (
                    <span className="text-amber-400 animate-pulse">
                      Processing guidance... (سوچ رہا ہے)
                    </span>
                  ) : (
                    <span>Ready to converse. Tap microphone or speak your question!</span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 max-w-lg mx-auto">
                  Ask any question about tag printing sizes, scanner auto-connect, stock pieces merge, SAV vouchers, or ledgers in natural Urdu or English.
                </p>
              </div>

              {/* Central Holographic Visualizer Orb */}
              <div className="relative flex items-center justify-center my-4">
                {/* Outer acoustic wave ripples */}
                <div
                  className={`absolute w-48 h-48 rounded-full border-2 transition-all duration-700 pointer-events-none ${
                    isListening
                      ? 'border-rose-500/40 scale-125 animate-ping'
                      : isSpeaking
                      ? 'border-cyan-500/50 scale-125 animate-ping'
                      : 'border-cyan-500/20 scale-100'
                  }`}
                  style={{ animationDuration: '2.5s' }}
                />
                <div
                  className={`absolute w-36 h-36 rounded-full border border-dashed transition-all duration-1000 pointer-events-none ${
                    isListening
                      ? 'border-rose-400/60 animate-spin'
                      : isSpeaking
                      ? 'border-cyan-400/60 animate-spin'
                      : 'border-slate-700'
                  }`}
                  style={{ animationDuration: '8s' }}
                />

                {/* Central Emblem Badge */}
                <div
                  onClick={toggleListening}
                  className={`relative z-10 p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer shadow-2xl flex flex-col items-center justify-center ${
                    isListening
                      ? 'bg-rose-950/80 border-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.6)] scale-110'
                      : isSpeaking
                      ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.6)] scale-105'
                      : 'bg-slate-900 border-slate-700 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                  }`}
                >
                  <FareedElectronicsBadge size={72} animated={isSpeaking || isListening} />
                  
                  {/* Equalizer Waveform Bars below badge */}
                  <div className="flex items-center gap-1.5 mt-3 h-6">
                    <span
                      className={`w-1 rounded-full ${
                        isListening
                          ? 'bg-rose-400 voice-wave-bar-1'
                          : isSpeaking
                          ? 'bg-cyan-400 voice-wave-bar-1'
                          : 'bg-slate-700 h-1.5'
                      }`}
                    />
                    <span
                      className={`w-1 rounded-full ${
                        isListening
                          ? 'bg-rose-400 voice-wave-bar-2'
                          : isSpeaking
                          ? 'bg-cyan-400 voice-wave-bar-2'
                          : 'bg-slate-700 h-1.5'
                      }`}
                    />
                    <span
                      className={`w-1 rounded-full ${
                        isListening
                          ? 'bg-rose-400 voice-wave-bar-3'
                          : isSpeaking
                          ? 'bg-cyan-400 voice-wave-bar-3'
                          : 'bg-slate-700 h-1.5'
                      }`}
                    />
                    <span
                      className={`w-1 rounded-full ${
                        isListening
                          ? 'bg-rose-400 voice-wave-bar-4'
                          : isSpeaking
                          ? 'bg-cyan-400 voice-wave-bar-4'
                          : 'bg-slate-700 h-1.5'
                      }`}
                    />
                    <span
                      className={`w-1 rounded-full ${
                        isListening
                          ? 'bg-rose-400 voice-wave-bar-5'
                          : isSpeaking
                          ? 'bg-cyan-400 voice-wave-bar-5'
                          : 'bg-slate-700 h-1.5'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Live Spoken Transcript Box */}
              <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
                {/* What user said */}
                {lastUserVoiceTranscript && (
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                      What you asked (آپ کا سوال):
                    </div>
                    <div className="text-white font-medium">{lastUserVoiceTranscript}</div>
                  </div>
                )}

                {/* Latest Spoken Response from Copilot */}
                {lastAssistantMessage && (
                  <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold uppercase font-mono">
                      <span className="flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5" />
                        <span>Copilot Voice Response (رہنمائی):</span>
                      </span>
                      {isSpeaking && (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Radio className="w-3 h-3 animate-pulse" />
                          <span>Playing audio...</span>
                        </span>
                      )}
                    </div>
                    <div className="whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {lastAssistantMessage.text}
                    </div>

                    {lastAssistantMessage.actionModal && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => handleLaunchFeature(lastAssistantMessage.actionModal)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-xs shadow-md cursor-pointer"
                        >
                          <span>{lastAssistantMessage.actionLabel || 'Open Feature'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Voice Control Toolbar */}
                <div className="flex items-center justify-between pt-2 flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    {/* Language Switch */}
                    <button
                      type="button"
                      onClick={() =>
                        setVoiceLanguage((l) => (l === 'ur-PK' ? 'en-US' : 'ur-PK'))
                      }
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                      title="Switch Speech Language"
                    >
                      <Languages className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{voiceLanguage === 'ur-PK' ? 'اردو (Urdu Voice)' : 'English Voice'}</span>
                    </button>

                    {/* Speech Speed Toggle */}
                    <button
                      type="button"
                      onClick={() => setSpeechSpeed((s) => (s === 1.0 ? 1.2 : 1.0))}
                      className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-mono text-[11px] cursor-pointer"
                      title="Voice Playback Speed"
                    >
                      {speechSpeed}x Speed
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSpeaking ? (
                      <button
                        type="button"
                        onClick={stopSpeaking}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-600/20 text-rose-300 border border-rose-500/40 hover:bg-rose-600/30 font-bold cursor-pointer"
                      >
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Stop Voice</span>
                      </button>
                    ) : (
                      lastAssistantMessage && (
                        <button
                          type="button"
                          onClick={() => speakMessage(lastAssistantMessage.text, lastAssistantMessage.id)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/30 font-bold cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Replay Audio</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Main Push-To-Talk Button */}
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`flex items-center gap-3 px-8 py-4 rounded-full font-black text-sm tracking-wide shadow-2xl transition-all transform hover:scale-105 cursor-pointer ${
                    isListening
                      ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white ring-4 ring-rose-400/50 shadow-rose-600/50 animate-pulse'
                      : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white ring-2 ring-cyan-300/40 shadow-cyan-500/30'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5 text-white animate-bounce" />
                      <span>Tap to Stop Listening (بات ختم کریں)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 text-white" />
                      <span>Tap to Speak (بولنے کے لیے دبائیں)</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <input
                    type="checkbox"
                    id="auto-voice"
                    checked={autoVoiceMode}
                    onChange={(e) => setAutoVoiceMode(e.target.checked)}
                    className="rounded border-slate-700 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                  />
                  <label htmlFor="auto-voice" className="cursor-pointer select-none">
                    Hands-Free Continuous Conversation (مسلسل صوتی گفتگو جاری رکھیں)
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: COMPLETE SOFTWARE MANUAL & GUIDELINES */}
          {activeTab === 'MANUAL' && (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
              
              {/* Left Column: Chapters Directory (4 cols) */}
              <div className="md:col-span-4 border-r border-slate-800 p-4 space-y-3 overflow-y-auto bg-slate-950/60">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchManualQuery}
                    onChange={(e) => setSearchManualQuery(e.target.value)}
                    placeholder="Search guidelines..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  {filteredManual.map((sec) => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setSelectedSection(sec)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        selectedSection?.id === sec.id
                          ? 'bg-cyan-950/80 border-cyan-500/50 text-white shadow-md'
                          : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs">{sec.title}</div>
                        <div className="text-[11px] text-cyan-400 font-mono">{sec.titleUrdu}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Guideline Content Details (8 cols) */}
              <div className="md:col-span-8 p-6 overflow-y-auto space-y-5 bg-slate-900/40">
                {selectedSection ? (
                  <div className="space-y-5">
                    
                    {/* Chapter Header */}
                    <div className="border-b border-slate-800 pb-4 flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                          {selectedSection.category}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1">
                          {selectedSection.title}
                        </h3>
                        <p className="text-xs text-cyan-400 font-medium">
                          {selectedSection.titleUrdu}
                        </p>
                      </div>

                      {/* Launch Action Shortcut Button */}
                      {selectedSection.actionModal && (
                        <button
                          type="button"
                          onClick={() =>
                            handleLaunchFeature(selectedSection.actionModal, selectedSection.actionTab)
                          }
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                        >
                          <span>Launch Feature Now</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Summary */}
                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1">
                      <div>{selectedSection.summary}</div>
                      <div className="text-cyan-400 font-semibold pt-1 border-t border-slate-800/80">
                        {selectedSection.summaryUrdu}
                      </div>
                    </div>

                    {/* Step-by-Step Instructions */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Step-by-Step Instructions (طریقہ کار)</span>
                      </h4>

                      <div className="space-y-2">
                        {selectedSection.steps.map((st, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-slate-200 leading-relaxed space-y-1"
                          >
                            <div>{st}</div>
                            {selectedSection.stepsUrdu[sIdx] && (
                              <div className="text-[11px] text-cyan-300/90 font-mono">
                                {selectedSection.stepsUrdu[sIdx]}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pro Tips */}
                    {selectedSection.tips.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-amber-300">
                          <AlertCircle className="w-4 h-4" />
                          <span>Pro-Tips &amp; Guidelines (اہم نکات):</span>
                        </div>
                        {selectedSection.tips.map((tip, tIdx) => (
                          <p key={tIdx} className="text-[11px] leading-relaxed">
                            • {tip}
                          </p>
                        ))}
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-500">
                    <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p>Select a chapter from the left to view complete guidelines.</p>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Fareed Electronics AI Voice Copilot &bull; Powered by Gemini 3.8 Flash</span>
          </div>
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              setIsAIGuideModalOpen(false);
            }}
            className="px-4 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};

/**
 * Floating AI Assistant Pill Button with 1-Click Voice Call Option
 * Fixed in bottom-right corner for 1-click access across all screens
 */
export const FloatingAIGuideButton: React.FC = () => {
  const { setIsAIGuideModalOpen, isAIGuideModalOpen } = useApp();

  if (isAIGuideModalOpen) return null;

  const handleOpenVoiceCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAIGuideModalOpen(true);
    window.dispatchEvent(new CustomEvent('erp-open-voice-mode'));
  };

  return (
    <aside
      aria-label="AI Guide"
      className="fixed bottom-5 right-5 z-40 no-print flex items-center gap-2 group"
    >
      {/* 1-Click Voice Communication Pill */}
      <button
        type="button"
        onClick={handleOpenVoiceCall}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 border-2 border-purple-500/60 hover:border-purple-400 text-purple-200 shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] transition-all duration-300 transform hover:scale-105 cursor-pointer"
        title="Start Voice Communication with Copilot (بول کر رہنمائی حاصل کریں)"
      >
        <div className="relative">
          <Mic className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-400 animate-ping" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[11px] font-black tracking-wide text-white">
            Voice Call
          </span>
          <span className="text-[8px] font-mono text-purple-300">
            صوتی رابطہ
          </span>
        </div>
        <div className="flex items-center gap-0.5 ml-0.5 h-3">
          <span className="w-0.5 h-full bg-purple-400 voice-wave-bar-1" />
          <span className="w-0.5 h-full bg-purple-400 voice-wave-bar-2" />
          <span className="w-0.5 h-full bg-purple-400 voice-wave-bar-3" />
        </div>
      </button>

      {/* Main Copilot Button */}
      <button
        type="button"
        onClick={() => setIsAIGuideModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border-2 border-cyan-500/60 hover:border-cyan-400 text-white shadow-[0_0_25px_rgba(6,182,212,0.5)] group-hover:shadow-[0_0_35px_rgba(6,182,212,0.8)] transition-all duration-300 transform group-hover:scale-105 cursor-pointer"
        title="Open AI Guide & Software Copilot"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-cyan-400 animate-bounce" style={{ animationDuration: '3s' }} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950 animate-ping" />
        </div>

        <div className="flex flex-col text-left">
          <span className="text-xs font-black tracking-wide bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
            AI Copilot
          </span>
          <span className="text-[9px] font-mono text-cyan-400">
            رہنمائی اسسٹنٹ
          </span>
        </div>

        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-mono font-bold">
          24/7
        </span>
      </button>
    </aside>
  );
};
