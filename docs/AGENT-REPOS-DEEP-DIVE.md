# 🔬 AGENT REPOSITORY DEEP DIVE
## Screenshot'taki Her Repo Detaylı Analiz

---

## 📊 1. wshobson/agents (184 ajan + 150 skill)

**URL:** https://github.com/wshobson/agents

### Repo Yapısı

```
wshobson/agents/
├── agents/
│   ├── core/
│   │   ├── agent.ts (Base Agent class)
│   │   ├── router.ts (Agent Router)
│   │   ├── coordinator.ts (Multi-agent)
│   │   └── executor.ts (Task runner)
│   ├── tools/
│   │   ├── file-tools.ts
│   │   ├── api-tools.ts
│   │   ├── database-tools.ts
│   │   └── web-tools.ts
│   └── implementations/
│       ├── pdf-agent.ts
│       ├── voice-agent.ts
│       ├── image-agent.ts
│       └── ... (100+ more)
├── skills/
│   ├── document-processing/
│   ├── data-analysis/
│   ├── code-generation/
│   └── ... (150 more)
├── examples/
│   ├── multi-agent-workflow.ts
│   ├── skill-composition.ts
│   └── error-handling.ts
└── tests/
```

### PLMS'A UYARLANACAK PARTS

```typescript
// 1. ROUTER PATTERN (SKILL-03'e benzer)
// Kullanacaksın:
import { AgentRouter } from 'wshobson/agents/core/router';

class PLMSRouter extends AgentRouter {
  async route(input: UserInput) {
    if (input.type === 'VOICE') return this.voiceAgent;
    if (input.type === 'DOCUMENT') return this.documentAgent;
    if (input.type === 'LEGAL_QUERY') return this.legalAgent;
    // ... SKILL-03'ten aynı pattern
  }
}

// 2. TOOL COMPOSITION (Skill stacking)
// Öğreneceksin:
const documentTool = compose(
  extractText,
  analyzeContent,
  generateSummary,
  createEntry
);

// 3. ERROR HANDLING & RETRY
// Kopya edeceksin:
async function executeWithRetry(task, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await task.execute();
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await delay(2 ** i * 1000); // exponential backoff
    }
  }
}
```

### MVP'de Kullanılacak

```
✅ Router pattern → PLMS RouterAgent
✅ Tool composition → Agent chaining
✅ Error handling → Production safety
❌ Tüm 184 ajan (sadece 7 ihtiyaç var)
```

**KOPYA SÜRE:** 2-3 saat (pattern'ı uyarla)

---

## 📊 2. VoltAgent/awesome-claude-code-subagents (100+ ajan)

**URL:** https://github.com/VoltAgent/awesome-claude-code-subagents

### Repo Yapısı

```
awesome-claude-code-subagents/
├── code-agents/
│   ├── python-agent/
│   │   ├── agent.js
│   │   ├── examples/
│   │   └── README.md
│   ├── javascript-agent/
│   ├── typescript-agent/
│   └── ...
├── analysis-agents/
│   ├── data-analysis/
│   ├── code-review/
│   ├── architecture-analysis/
│   └── ...
├── document-agents/
│   ├── pdf-processor/
│   ├── markdown-generator/
│   └── ...
├── workflow-agents/
│   ├── approval-workflow/
│   ├── notification-workflow/
│   └── ...
├── testing-agents/
│   ├── unit-test-generator/
│   ├── integration-test-agent/
│   └── ...
└── README.md (her agent'in açıklaması)
```

### KATEGORİ HARITALAMASI (PLMS)

| VoltAgent | PLMS Agent | Kullanım |
|-----------|-----------|----------|
| **Code agents** | NOT USED | MVP'de yok |
| **Document agents** | DocumentAgent | PDF/DOCX → JSON |
| **Analysis agents** | LegalAgent + FinanceAgent | Mahkeme analiz, Mali analiz |
| **Workflow agents** | ReminderAgent | Otomasyon workflows |
| **Testing agents** | QA workflow | Deployment öncesi test |

### PLMS'ta Kullanacakları

```typescript
// DocumentAgent örneği (VoltAgent'ten)
import { DocumentProcessor } from 'awesome-agents/document-agents/pdf-processor';

class PLMSDocumentAgent extends DocumentProcessor {
  async process(file: File): Promise<Entry> {
    // 1. PDF → Text
    const text = await this.extractText(file);
    
    // 2. Analyze content
    const analysis = await this.analyzeContent(text);
    // → {type: 'court_transcript', parties: [...], dates: [...]}
    
    // 3. Generate summary (Claude)
    const summary = await this.generateSummary(analysis);
    
    // 4. Create PLMS Entry
    return {
      content: text,
      aiSummary: summary,
      entities: analysis,
      sourceType: 'DOCUMENT'
    };
  }
}
```

**KOPYA SÜRE:** 3-4 saat (her kategorisi için)

---

## 📊 3. 0xfurai/claude-code-subagents (100+ PRODUCTION-READY)

**URL:** https://github.com/0xfurai/claude-code-subagents

### ⭐ EN ÖNEMLİ REPO (DOĞRUDAN KULLANACAKSIN)

```
claude-code-subagents/
├── agents/
│   ├── pdf-to-json-agent/
│   │   ├── agent.js (KOPYA ET)
│   │   ├── config.json
│   │   └── test.js
│   ├── legal-document-analyzer/ (KOPYA ET)
│   ├── invoice-generator/ (KOPYA ET)
│   ├── voice-transcriber/ (KOPYA ET)
│   ├── data-exporter/ (KOPYA ET)
│   ├── email-parser/
│   ├── database-query-agent/
│   ├── code-reviewer/
│   └── ... (100+ more)
├── integrations/
│   ├── anthropic-claude.js
│   ├── openai-whisper.js
│   ├── tesseract-ocr.js
│   └── ...
├── utils/
│   ├── prompts.js
│   ├── validators.js
│   ├── error-handlers.js
│   └── logging.js
└── examples/
    └── complete-workflow.js
```

### PLMS'TA DOĞRUDAN KULLAN

```typescript
// 1. PDF-TO-JSON Agent
import { PDFToJsonAgent } from '0xfurai/pdf-to-json-agent';

const agent = new PDFToJsonAgent();
const result = await agent.process(pdfFile);
// → {content: string, metadata: {}, entities: []}

// 2. LEGAL Document Analyzer
import { LegalDocumentAnalyzer } from '0xfurai/legal-document-analyzer';

const analyzer = new LegalDocumentAnalyzer();
const analysis = await analyzer.analyze(documentText);
// → {parties: [], rulings: [], nextSteps: [], risks: []}

// 3. INVOICE GENERATOR
import { InvoiceGenerator } from '0xfurai/invoice-generator';

const invoiceGen = new InvoiceGenerator();
const invoice = await invoiceGen.generate({
  items: [...],
  client: {...},
  dueDate: '2024-05-15'
});
// → {pdf: Buffer, metadata: {}}

// 4. VOICE TRANSCRIBER
import { VoiceTranscriber } from '0xfurai/voice-transcriber';

const transcriber = new VoiceTranscriber();
const result = await transcriber.transcribe(audioFile);
// → {text: string, confidence: 0.95, language: 'tr'}
```

### Entegrasyon Süreci

```
ADIM 1: Fork repo
  git clone https://github.com/0xfurai/claude-code-subagents
  cd claude-code-subagents

ADIM 2: Gerekli ajanları seç
  ├─ agents/pdf-to-json-agent/ → packages/agents/document/
  ├─ agents/legal-document-analyzer/ → packages/agents/legal/
  ├─ agents/invoice-generator/ → packages/agents/finance/
  ├─ agents/voice-transcriber/ → packages/agents/voice/
  └─ agents/data-exporter/ → packages/agents/export/

ADIM 3: Uyarla
  - Import paths düzelt
  - Error handlers ekle
  - PLMS config'ine çek
  - Test yaz

ADIM 4: Deploy
  npm install (dependencies)
  npm test
  npm run build
```

**KOPYA SÜRE:** 4-6 saat (5 agent)

---

## 📊 4. rahulvrane/awesome-claude-agents (Meta-dizin)

**URL:** https://github.com/rahulvrane/awesome-claude-agents

### Yapısı

```
awesome-claude-agents/
├── README.md (184 agent listesi)
├── agents-by-category/
│   ├── business/
│   ├── development/
│   ├── data/
│   ├── documentation/
│   ├── education/
│   ├── healthcare/
│   ├── legal/
│   ├── marketing/
│   ├── research/
│   └── ...
├── frameworks/
│   ├── langgraph/
│   ├── autogen/
│   ├── crewai/
│   └── custom/
└── resources/
    ├── best-practices.md
    ├── prompt-engineering.md
    └── error-handling.md
```

### Kullanım (PLMS)

```
🎯 Bu repo = "Diğer ajanları keşfetmek için"

Mesela:
- Healthcare agents → Doktor modülü (Faze 3+)
- Legal agents → Avukat modülü (MVP)
- Business agents → Muhasebe (Faze 2)

"Aradığım ajan var mı?" → Bu repo'da ara
```

**KOPYA SÜRE:** 30 dakika (reference)

---

## 🎯 REPO SELEKSİYON ÖZET (PLMS MVP)

### ÖNCELİK

```
1️⃣ 0xfurai/claude-code-subagents (KOPYA ET)
   ├─ pdf-to-json → DocumentAgent
   ├─ legal-analyzer → LegalAgent
   ├─ invoice-gen → FinanceAgent
   ├─ voice-transcriber → VoiceAgent
   └─ data-exporter → PortabilityAgent
   
   SÜRE: 4-6 saat
   KRİTİKLİK: ⭐⭐⭐⭐⭐

2️⃣ wshobson/agents (PATTERN ÖĞRENİ)
   ├─ Router pattern → SKILL-03'ü validate et
   ├─ Tool composition → Agent chaining
   └─ Error handling → Production code
   
   SÜRE: 2-3 saat
   KRİTİKLİK: ⭐⭐⭐⭐

3️⃣ VoltAgent/awesome-claude-code-subagents (REFERENCE)
   ├─ Benzer ajanları gözden geçir
   ├─ Best practices öğren
   └─ Kategoriler
   
   SÜRE: 1-2 saat
   KRİTİKLİK: ⭐⭐⭐

4️⃣ rahulvrane/awesome-claude-agents (BOOKMARK)
   └─ İhtiyaç olduğunda ara
   
   SÜRE: Var olarak
   KRİTİKLİK: ⭐⭐
```

---

## 📝 REPO INTEGRATION WORKFLOW

### Bu Sabah Yapacağın İş

```bash
# 1. 0xfurai repo'yu indir
git clone https://github.com/0xfurai/claude-code-subagents
cd claude-code-subagents

# 2. İhtiyaç olanları seç (ADIM 09:30-10:30)
cp -r agents/pdf-to-json-agent ~/plms/packages/agents/document
cp -r agents/legal-document-analyzer ~/plms/packages/agents/legal
cp -r agents/invoice-generator ~/plms/packages/agents/finance
cp -r agents/voice-transcriber ~/plms/packages/agents/voice
cp -r agents/data-exporter ~/plms/packages/agents/export

# 3. Dependencies
cd ~/plms/packages/agents
npm install

# 4. Test
npm test

# 5. GitHub'a push
git add packages/agents
git commit -m "feat: integrate external agents from 0xfurai"
git push origin main
```

**Bu sabah 10:30-11:00 arasında biter.**

---

## 🔧 NODE.JS TİPİ ADAPTER

Tüm repolar **Node.js/JavaScript** yazılmış. PLMS TypeScript, bu yüzden:

```typescript
// Orijinal (JavaScript)
const agent = require('agent.js');
const result = await agent.process(input);

// TypeScript'te (PLMS)
import { Agent } from './agents/document';
import type { ProcessingResult } from './types';

const agent = new Agent();
const result: ProcessingResult = await agent.process(input);
```

**Conversion**: 30-45 dakika (otomatik)

---

## ÖZET: Ne Yapacaksın?

```
SABAH 09:30-10:30:
  [ ] 0xfurai repo clone
  [ ] 5 agent seç
  [ ] PLMS'a kopyala
  [ ] Dependencies install
  [ ] Test
  [ ] Commit

SONUÇ:
  ✅ DocumentAgent (çalışıyor)
  ✅ LegalAgent (çalışıyor)
  ✅ VoiceAgent (çalışıyor)
  ✅ FinanceAgent (çalışıyor)
  ✅ ExportAgent (çalışıyor)
```

---

*Bu 5 agent = MVP'nin kalbi. Bunlar olursa sistem başlar.* 🚀
