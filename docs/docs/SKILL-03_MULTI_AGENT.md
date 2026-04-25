# SKILL-03: MULTI-AGENT TASARIMI
## Profesyonel Yaşam Yönetim Sistemi (PLMS) - Agent Delegation

---

## 🤖 AGENT MİMARİSİ

### Temel Konsept
```
USER INPUT
    ↓
[ROUTER AGENT] - Görev sınıflandır
    ↓
    ├─ [VOICE AGENT]      → Ses işleme
    ├─ [DOCUMENT AGENT]   → Belge analiz
    ├─ [LEGAL AGENT]      → Yasal danışma
    ├─ [FINANCE AGENT]    → Mali analiz
    ├─ [REMINDER AGENT]   → Tarih takip
    ├─ [REPORT AGENT]     → Rapor oluştur
    └─ [LEARNING AGENT]   → Kişiye özel öğrenme
         ↓
    [INTEGRATION LAYER]
         ↓
    DATABASE + OUTPUTS
```

---

## 🔌 AGENT HARITASI

### 1. ROUTER AGENT (Kapıcı)
**Görev:** Gelen veriyi doğru agente yönlendir

```typescript
class RouterAgent {
  async route(input: UserInput): Promise<Agent> {
    if (input.type === 'VOICE') return voiceAgent;
    if (input.type === 'DOCUMENT') return documentAgent;
    if (input.query.includes('yasa')) return legalAgent;
    if (input.query.includes('fatura')) return financeAgent;
    if (input.dueDate) return reminderAgent;
    if (input.requestReport) return reportAgent;
    return learningAgent; // default
  }
}
```

---

### 2. VOICE AGENT
**Görev:** Ses → Metin → Analiz

```typescript
class VoiceAgent {
  async process(audioFile: File): Promise<Entry> {
    // Step 1: Transcription (Whisper v3)
    const transcript = await whisper.transcribe(audioFile);
    
    // Step 2: NER (Named Entity Recognition)
    const entities = await ner.extract(transcript);
    // → {dates: [...], parties: [...], amounts: [...]}
    
    // Step 3: Summarization
    const summary = await claude.summarize(transcript);
    
    // Step 4: Confidence check
    const confidence = await validateHallucination(summary);
    
    return {
      content: transcript,
      entities: entities,
      aiSummary: summary,
      confidence: confidence,
      sourceType: 'VOICE'
    };
  }
}
```

---

### 3. DOCUMENT AGENT
**Görev:** Belge → OCR → Analiz

```typescript
class DocumentAgent {
  async process(document: File): Promise<Entry> {
    // Step 1: OCR (Tesseract + Textract)
    let text = await ocr.extract(document);
    
    // Step 2: Structure detection
    const structure = await detectStructure(text);
    // → {title, sections, tables, signatures}
    
    // Step 3: Entity extraction
    const entities = await ner.extract(text);
    
    // Step 4: Type detection (tutanak, fatura, etc.)
    const docType = await classifyDocument(text);
    
    // Step 5: Full analysis
    const analysis = await claude.analyze(text, {
      instructions: LEGAL_ANALYSIS_PROMPT, // No hallucination
      context: userCaseData
    });
    
    return {
      content: text,
      entities: entities,
      docType: docType,
      aiSummary: analysis,
      sourceType: 'DOCUMENT'
    };
  }
}
```

---

### 4. LEGAL AGENT
**Görev:** Yasal danışma (halüsinasyon-free)

```typescript
class LegalAgent {
  async analyze(caseData: Case, question: string): Promise<LegalAdvice> {
    // Step 1: Case context extraction
    const caseContext = await extractContext(caseData);
    // → {court, judge, parties, precedents}
    
    // Step 2: Law database search (mevzuat.gov.tr)
    const relevantLaws = await lawDb.search(question);
    // → [Article 123, Article 456, ...]
    
    // Step 3: Precedent search
    const precedents = await jurisprudenceDb.search(caseContext);
    // → Benzeri davalar + sonuçları
    
    // Step 4: Claude analysis (only with sources)
    const advice = await claude.analyze(question, {
      instructions: `
        ONLY answer based on:
        1. Turkish law: ${relevantLaws}
        2. Precedents: ${precedents}
        3. Case context: ${caseContext}
        
        Format: Statement [SOURCE: Article X or Precedent Y]
        If uncertain: "Mevzuatta açık cevap yok"
      `
    });
    
    return {
      question: question,
      advice: advice,
      sources: [relevantLaws, precedents],
      confidence: await validateSources(advice)
    };
  }
}
```

---

### 5. FINANCE AGENT
**Görev:** Mali işler (fatura, vergi, muhasebe)

```typescript
class FinanceAgent {
  async process(financeEvent: FinanceEvent): Promise<FinanceEntry> {
    // Türü belirle
    if (event.type === 'INVOICE') return await handleInvoice(event);
    if (event.type === 'EXPENSE') return await handleExpense(event);
    if (event.type === 'PAYMENT') return await handlePayment(event);
    if (event.type === 'TAX_PLANNING') return await handleTaxPlanning(event);
  }
  
  async handleInvoice(invoice: Invoice): Promise<void> {
    // E-Fatura uyumluluğu kontrol
    const isCompliant = await checkEInvoiceCompliance(invoice);
    
    // Kategori otomatik atama
    const category = await categorizeIncome(invoice);
    
    // KDV hesaplaması
    const vat = calculateVAT(invoice.amount, invoice.category);
    
    // Kaydı
    await db.invoice.create({
      ...invoice,
      category,
      vat,
      eInvoiceCompliant: isCompliant
    });
  }
  
  async handleTaxPlanning(data: TaxData): Promise<TaxAdvice> {
    // Türk vergi kanunu (KVK, GVK)
    const taxLaws = await taxDb.get('2024');
    
    // Avantajlı seçenekler ara
    const options = await analyzeTaxOptions(data, taxLaws);
    // → Örnek: "Madde 89 uyarınca donate edersen %5 indirim"
    
    return {
      currentObligation: calculateTaxObligation(data),
      potentialSavings: options,
      recommendations: options.filter(o => o.legalRisk < 0.05),
      disclaimer: "Vergi müşaviriyle danış"
    };
  }
}
```

---

### 6. REMINDER AGENT
**Görev:** Terminler, uyarılar, otomasyonu

```typescript
class ReminderAgent {
  // Cron job: Her gün çalış
  async checkReminders(): Promise<void> {
    const users = await db.user.findAll();
    
    for (const user of users) {
      // 1. Mahkeme tarihleri
      const hearings = await this.extractHearingDates(user);
      for (const hearing of hearings) {
        const daysUntil = daysBetween(today(), hearing.date);
        if ([7, 3, 1].includes(daysUntil)) {
          await sendReminder(user, `${hearing.case} - ${daysUntil} gün`);
        }
      }
      
      // 2. Vergi deadline'ları (T.C. takvimi)
      const taxDeadlines = getTaxDeadlines(user.profession);
      for (const deadline of taxDeadlines) {
        const daysUntil = daysBetween(today(), deadline.date);
        if (daysUntil <= 14 && daysUntil > 0) {
          await sendReminder(user, `Vergi: ${deadline.name} - ${daysUntil} gün`);
        }
      }
      
      // 3. Takip-up (7 gün hiç update yoksa)
      const staleCases = await findCasesWithoutUpdate(user, 7);
      for (const c of staleCases) {
        await sendReminder(user, `${c.title} - son 7 günde update yok`);
      }
      
      // 4. Hafta özeti (Pazartesi sabahı)
      if (today().day === 'Monday') {
        const summary = await generateWeeklyDigest(user);
        await sendEmail(user.email, 'Hafta Özeti', summary);
      }
    }
  }
}
```

---

### 7. REPORT AGENT
**Görev:** Otomatik raporlar

```typescript
class ReportAgent {
  async generateReport(
    userId: string, 
    reportType: ReportType
  ): Promise<Report> {
    switch (reportType) {
      case 'CASE_SUMMARY':
        return await this.caseSummary(userId);
      case 'MONTHLY_PROGRESS':
        return await this.monthlyProgress(userId);
      case 'TAX_REPORT':
        return await this.taxReport(userId);
      case 'INVOICE_SUMMARY':
        return await this.invoiceSummary(userId);
      case 'CLIENT_REPORT':
        return await this.clientReport(userId);
    }
  }
  
  async caseSummary(caseId: string): Promise<string> {
    const c = await db.case.get(caseId);
    const entries = await db.entry.findByCaseId(caseId);
    
    // Markdown rapor oluştur
    const report = `
# Dava Özeti - ${c.title}

## Durumu
${entries[entries.length-1]?.aiSummary || ''}

## Son İşlemler
${entries.map(e => `- ${e.createdAt}: ${e.title}`).join('\n')}

## Sonraki Adımlar
- Mahkeme tarihi: ${c.nextHearing}
- Hazırlanacak: ${c.pendingDocuments}

## Finansal Özet
- Gelire kaydedilecek: ${c.totalFee} ₺
- KDV: ${c.totalFee * 0.18} ₺

Hazırladı: AI Assistant
Onaylayan: [İnsan - Avukat]
    `;
    
    return report;
  }
}
```

---

### 8. LEARNING AGENT
**Görev:** Kişiye özel öğrenme

```typescript
class LearningAgent {
  // İzle: Kullanıcının davranışını, tercihlerini
  async learnUserPreferences(userId: string): Promise<UserProfile> {
    const history = await db.auditLog.findByUserId(userId);
    const cases = await db.case.findByUserId(userId);
    const reports = await db.report.findByUserId(userId);
    
    // Analiz et
    const profile = {
      // Davranış analizi
      preferredReportType: getMostUsedReport(reports),
      preferredCaseType: getMostCommonCaseType(cases),
      workingHours: analyzeActivityHours(history),
      
      // İletişim tercihleri
      preferredLanguage: history.mostFrequentLanguage,
      preferredNotificationTime: history.mostOpenedTime,
      
      // Yasal tercihler
      favoriteCourtType: getMostUsedCourt(cases),
      commonAdvocates: getMostCitedLawyers(history),
      
      // Finansal profil
      averageCaseValue: calculateAverageFeePerCase(cases),
      invoiceFrequency: calculateInvoicePattern(history),
    };
    
    return profile;
  }
  
  // Cevap önerileri
  async suggestNextAction(
    userId: string, 
    currentCase: Case
  ): Promise<Suggestion> {
    const userProfile = await this.learnUserPreferences(userId);
    const similarCases = await findSimilarCases(currentCase);
    
    // "Benzer davalar için sıradaki adım..."
    const commonNextSteps = findCommonPatterns(similarCases);
    
    return {
      suggestion: commonNextSteps[0],
      reasoning: `${similarCases.length} benzer davada bu adım kullanılmış`,
      confidence: calculateConfidence(similarCases)
    };
  }
}
```

---

## 🔄 AGENT ORCHESTRATION

### Message Queue (Bull + Redis)
```typescript
// Görevler kuyruğa gir
const taskQueue = new Queue('plms-tasks', {
  redis: redisConfig
});

// Yeni dosya yüklendi
taskQueue.add(
  'process-document',
  { 
    userId: 'alper',
    documentId: 'doc123',
    caseId: 'case456'
  },
  { delay: 0, priority: 10 } // Yüksek öncelik
);

// Worker: Her işi işle
taskQueue.process('process-document', async (job) => {
  const agent = documentAgent;
  const result = await agent.process(job.data);
  return result;
});

// Error handling
taskQueue.on('failed', async (job, err) => {
  await logError(job, err);
  await notifyUser(job.data.userId, 'İşlem başarısız');
});
```

---

## 📊 INTER-AGENT COMMUNICATION

### Webhooks & Events
```typescript
// Bir agent sonuç verince, diğeri bilgi alsın

// Event: Entry created
eventBus.on('entry:created', async (entry) => {
  // Finance agent: Fatura var mı?
  if (entry.content.includes('₺')) {
    financeAgent.extractFinance(entry);
  }
  
  // Reminder agent: Tarih var mı?
  if (entry.entities.dates.length > 0) {
    reminderAgent.createReminder(entry.caseId, entry.entities.dates);
  }
  
  // Learning agent: Öğren
  learningAgent.recordAction(entry.userId, 'entry:created');
});

// Event: Report requested
eventBus.on('report:requested', async (request) => {
  const report = await reportAgent.generate(request);
  await emailAgent.send(request.email, report);
});
```

---

## 🔐 HALLUCINATION PREVENTION

### Validation Layer (Her agent çıkışında)
```typescript
class HallucinationValidator {
  async validate(output: AgentOutput): Promise<ValidationResult> {
    // 1. Claim check: Her claim kaynağı var mı?
    const claims = extractClaims(output);
    for (const claim of claims) {
      const hasSource = await findSource(claim);
      if (!hasSource && claim.isFactual) {
        return { valid: false, reason: 'Unsourced claim' };
      }
    }
    
    // 2. Contradiction check: Veritabanı ile çatışma?
    const dbFacts = await getContextFacts(output.caseId);
    if (contradicts(output, dbFacts)) {
      return { valid: false, reason: 'Contradicts database' };
    }
    
    // 3. Law check: Yasal/etik?
    if (isSuspiciousAdvice(output)) {
      return { 
        valid: false, 
        reason: 'Potentially unethical advice',
        escalate: true // Human review
      };
    }
    
    return { valid: true };
  }
}
```

---

## 📈 PERFORMANCE METRICS

```typescript
// Agent başarı takibi
type AgentMetrics = {
  name: string;
  successRate: number;      // 0-1
  avgProcessingTime: number; // ms
  hallucinations: number;    // count
  errorRate: number;         // 0-1
  userSatisfaction: number;  // 1-5
};

// Dashboard
{
  "router-agent": { successRate: 0.99, hallucinations: 0 },
  "voice-agent": { successRate: 0.95, avgTime: 2300 },
  "legal-agent": { successRate: 0.92, hallucinations: 0 },
  "finance-agent": { successRate: 0.98, hallucinations: 0 },
  "reminder-agent": { successRate: 0.99, hallucinations: 0 },
}
```

---

## 🚀 DEPLOYMENT

### Kubernetes Pods (Ölçeklenebilir)
```yaml
# Each agent = separate pod
apiVersion: apps/v1
kind: Deployment
metadata:
  name: voice-agent
spec:
  replicas: 3 # Scale up if queue backed
  template:
    containers:
    - name: voice-agent
      image: plms/voice-agent:latest
      resources:
        limits:
          memory: "512Mi"
          cpu: "500m"
```

---

*Bu sistem her agenti bağımsız tutarken, iletişim kurmalarını sağlar. Scalability, maintainability, testability maksimum.* 🚀
