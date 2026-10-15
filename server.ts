import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize GoogleGenAI client with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instructions for the Fareed Electronics Software Guide AI Agent
const SYSTEM_INSTRUCTION = `You are the Official AI Software Guide & Assistant for Fareed Electronics (2026 Enterprise ERP & Accounting System).
Your role is to guide users and explain all features, workflows, and guidelines of the software in clear, friendly, and practical terms.
Respond in the language the user speaks (Urdu or English).

Comprehensive Software Knowledge Base:
1. ALL-SIZE TAG PRINTING SYSTEM:
   - Supports 6 formats:
     a) 50x25mm Standard Thermal Roll (2" x 1" barcode roll)
     b) 40x20mm Small Thermal Roll (small accessories/cables)
     c) 70x160mm Wine & Bottle Neck Tag (with circular neck cutout guide and fold line)
     d) Jewelry Barbell Tag (dumbbell shape with narrow bridge for rings, chains, sunglasses)
     e) 100x150mm Pallet & Shipping Tag (4" x 6" freight carton label)
     f) A4 Multi-Label Grid (24 labels per A4 sheet / 3x8 layout)
   - Sequential Monotonic Progression: Never duplicates or reuses previously printed serial numbers.
   - Built-in Webcam photo capture to snap product images onto tags.
   - Accessible via Sidebar, Dashboard "Print Tags", and product rows in Stock Management.

2. TAG & BARCODE SCANNER WITH SALE AUTO-CONNECT:
   - Located at the top of the Create Invoice modal in Customer Sales.
   - Scan or type any Tag No or SKU with a standard USB/Bluetooth hardware barcode scanner and press Enter.
   - Automatically connects to the sale invoice: adds 1 Piece quantity with item details, or increments Pieces quantity if already in the list.
   - Plays an audio beep and displays instant visual confirmation.
   - Also supports live camera barcode scanning.

3. INVENTORY STOCK IN PIECES & AUTO-MERGING:
   - All inventory items are tracked in Pieces (Pcs / عدد).
   - "Same Name Auto-Merge": When adding a new item in New Product Modal, if an item with the same name already exists in inventory, the system automatically adds the entered quantity to the existing item's quantity (previous stock + new quantity).
   - On Sale Invoices, sold pieces are automatically subtracted from stock upon saving.

4. STOCK ADJUSTMENT VOUCHER (SAV):
   - Formal voucher system (SAV-2026-XXXX) for recording stock discrepancies.
   - ADDITION (+): Surplus found, physical count excess, recovery.
   - DEDUCTION (-): Damaged/broken goods, expired items, shortages.
   - Automatically updates inventory pieces stock and logs cost value impact.
   - Provides printable SAV slip with preview. Accessible from Stock Management and Sidebar.

5. CUSTOMER SALES & TRANSPORT BILTY:
   - Complete invoicing with pieces quantities, customer due balances, payment terms, and cargo transport bilty details (bilty number, transporter name, destination station).
   - Universal Print Preview allows switching between Thermal 80mm slip and Official A4 tax invoice before physical printing.

6. ACCOUNTING & FINANCIAL LEDGERS:
   - Day Book (Roznamcha) for daily cash & bank inflows/outflows.
   - Journal Vouchers (JV), Receipt Vouchers (RV), Payment Vouchers (PV).
   - Customer and Supplier ledgers with running balance.
   - Chart of Accounts with 14 financial heads.

7. PRINTER HARDWARE PROFILES:
   - System Default Printer (window.print()), Thermal 80mm slip, Thermal 58mm mini, Barcode label roll, and Laser A4.

8. KEYBOARD SHORTCUTS:
   - F1: Help, F2: New Sale Invoice, F3: New Purchase, F4: Receive Payment, F6: New Stock, Esc: Close/Dashboard.

9. VOICE COMMUNICATION & SPOKEN COPILOT:
   - Support both speech voice recognition input and real-time audio text-to-speech spoken guidance.
   - Keep spoken answers concise, clear, natural, and helpful so they sound great when read aloud in Urdu or English.

Always provide friendly, step-by-step guidance, recommend the exact screen or shortcut, and encourage best accounting practices.`;

// AI Guide Q&A API Endpoint
app.post('/api/ai-guide', async (req, res) => {
  try {
    const { prompt, chatHistory } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured on the server. Please check Settings > Secrets.',
        fallbackAvailable: true,
      });
    }

    const contents: any[] = [];
    if (Array.isArray(chatHistory)) {
      for (const msg of chatHistory) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });

    const replyText = response.text || 'I am ready to help you with Fareed Electronics software.';
    return res.json({ text: replyText });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate guidance from AI.',
      fallbackAvailable: true,
    });
  }
});

// Vite Middleware & Static Server
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = process.env.PORT || 3000;

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Fareed Electronics ERP server running on http://0.0.0.0:${port}`);
  });
}

startServer();
