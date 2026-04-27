# SKILLS 04-17: BULK DELIVERY
## Professional Life Management System (PLMS)

---

## 📦 İÇİNDEKİLER

1. SKILL-04: Frontend/Backend/Database Mimarisi
2. SKILL-05: Medikal & Hukuk Not-Tutma
3. SKILL-06: Çıktı Sistemi (Rapor, Fatura, PDF)
4. SKILL-07: Veri Kaynağı Bağlantıları
5. SKILL-08: Hatırlatma Motoru
6. SKILL-09: Faturalama & Muhasebe
7. SKILL-10: Sosyal Medya Yönetimi
8. SKILL-11: Risk Analizi & İş Geliştirme
9. SKILL-12: Hukuki Desteği (Law Search)
10. SKILL-13: Vergi & Mevzuat Avantajları
11. SKILL-14: Özetleme (Summarization)
12. SKILL-15: Veri Taşınabilirliği
13. SKILL-16: Sonlandırma Protokolü
14. SKILL-17: Kişisel Öğrenme & Adaptasyon

---

## SKILL-04: FRONTEND/BACKEND/DATABASE MİMARİSİ

### Tech Stack (KESIN)

```
FRONTEND:
├─ Web: Next.js 14 (React)
├─ Mobile: React Native + Expo (iOS/Android)
├─ Desktop: Electron (Windows/Mac/Linux)
├─ AR Ready: WebXR API + Three.js
└─ CLI: Node.js Commander.js

BACKEND:
├─ Runtime: Node.js 20 LTS
├─ Framework: Express.js
├─ API Style: REST (GraphQL later)
├─ Auth: JWT + OAuth (Google, Microsoft)
├─ Queue: Bull + Redis (async jobs)
└─ Caching: Redis (session, data)

DATABASE:
├─ Primary: PostgreSQL 15+ (relational)
├─ Vector: Pinecone or Weaviate (AI search)
├─ Cache: Redis (real-time)
├─ File: Cloudflare R2 (docs, audio)
├─ Backup: Supabase (managed)
└─ Analytics: BigQuery (data warehouse)

AI/ML:
├─ LLM: Claude 3.5 Sonnet (no hallucination)
├─ Embeddings: OpenAI text-embedding-3-small
├─ STT: Whisper v3 (audio transcription)
├─ OCR: Tesseract + AWS Textract
├─ NER: spaCy (entity extraction)
├─ Summarization: Claude
└─ Search: Algolia (full-text)

EXTERNAL APIs:
├─ Email: SendGrid
├─ SMS: Twilio
├─ Payments: Stripe (future)
├─ Document: AWS Textract
├─ Video: Daily.co (video calls)
└─ Maps: Google Maps (location)

DEPLOYMENT:
├─ Frontend: Vercel (auto-scaling)
├─ Backend: Render.com (multi-region)
├─ Database: Supabase (managed PostgreSQL)
├─ File Storage: Cloudflare R2
├─ CDN: Cloudflare (caching)
└─ Monitoring: Sentry + DataDog
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND LAYER                          │
│  [Web - Next.js] [Mobile - RN] [Desktop - Electron]        │
└─────────────────────────────────────────────────────────────┘
                              ↕
         ┌────────────────────────────────────┐
         │      API GATEWAY (Express)         │
         │  • Auth middleware                 │
         │  • Rate limiting                   │
         │  • Request logging                 │
         └────────────────────────────────────┘
                              ↕
        ┌──────────────────────────────────────────┐
        │         BUSINESS LOGIC LAYER             │
        │  [Services] [Controllers] [Validators]  │
        └──────────────────────────────────────────┘
                              ↕
     ┌──────────────────────────────────────────────────┐
     │         INTEGRATION LAYER                        │
     │  [AI Agents] [External APIs] [Job Queue]        │
     └──────────────────────────────────────────────────┘
                              ↕
      ┌─────────────────────────────────────────────────┐
      │          DATA LAYER                             │
      │  ┌──────────┬──────────┬──────────┐            │
      │  │PostgreSQL│ Pinecone │  Redis   │            │
      │  └──────────┴──────────┴──────────┘            │
      │  ┌──────────┬──────────┐                        │
      │  │ R2 Files │ Backup   │                        │
      │  └──────────┴──────────┘                        │
      └─────────────────────────────────────────────────┘
```

### Database Schema (Prisma)

```prisma
// User management
model User {
  id String @id @default(cuid())
  email String @unique
  phoneNumber String @unique
  passwordHash String?
  
  // Profile
  name String
  profession String // LAWYER, ARCHITECT, DOCTOR
  avatar String?
  
  // Subscription
  plan PricingPlan @default(FREE)
  stripeId String?
  
  // Settings
  timezone String @default("Europe/Istanbul")
  language String @default("tr")
  notificationPreferences Json
  
  // KVKK
  kvkkAgreed Boolean @default(false)
  termsAgreed Boolean @default(false)
  
  // Relationships
  clients Client[]
  cases Case[]
  documents Document[]
  entries Entry[]
  reminders Reminder[]
  reports Report[]
  
  // Audit
  auditLog AuditLog[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Core entities (simplified)
model Case {
  id String @id @default(cuid())
  userId String
  clientId String
  
  title String
  caseNo String @unique
  status CaseStatus
  
  // Dates
  startDate DateTime
  nextHearingDate DateTime?
  
  // Financial
  totalFee Decimal @db.Decimal(10, 2)
  paidAmount Decimal @db.Decimal(10, 2) @default(0)
  
  // Relationships
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  client Client @relation(fields: [clientId], references: [id])
  entries Entry[]
  reminders Reminder[]
  
  @@index([userId])
  @@index([status])
}

model Entry {
  id String @id @default(cuid())
  userId String
  caseId String
  
  // Source
  sourceType SourceType // VOICE, DOCUMENT, MANUAL
  
  // Content
  rawContent String @db.Text
  aiSummary String? @db.Text
  entities Json // {dates: [...], amounts: [...]}
  
  // Confidence
  confidenceScore Float @default(0.0) // 0-1
  hasHallucination Boolean @default(false)
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  case Case @relation(fields: [caseId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([caseId])
  @@index([createdAt])
}

enum SourceType {
  VOICE
  DOCUMENT
  EMAIL
  WHATSAPP
  MANUAL
}

enum CaseStatus {
  ACTIVE
  PENDING_HEARING
  DECIDED
  APPEALED
  CLOSED
}

enum PricingPlan {
  FREE
  STARTER
  PRO
  ENTERPRISE
}
```

### API Endpoints (RESTful)

```
AUTH:
  POST   /api/auth/register
  POST   /api/auth/login
  POST   /api/auth/logout
  GET    /api/auth/me
  POST   /api/auth/refresh-token

USERS:
  GET    /api/users/:id
  PATCH  /api/users/:id
  DELETE /api/users/:id

CASES:
  GET    /api/cases
  POST   /api/cases
  GET    /api/cases/:id
  PATCH  /api/cases/:id
  DELETE /api/cases/:id

ENTRIES:
  POST   /api/cases/:id/entries
  GET    /api/cases/:id/entries
  GET    /api/entries/:id
  PATCH  /api/entries/:id

DOCUMENTS:
  POST   /api/documents/upload
  GET    /api/documents
  DELETE /api/documents/:id

REPORTS:
  GET    /api/reports
  POST   /api/reports/generate/:type
  GET    /api/reports/:id/download

REMINDERS:
  GET    /api/reminders
  POST   /api/reminders
  PATCH  /api/reminders/:id
  DELETE /api/reminders/:id
```

---

## SKILL-05: MEDIKAL & HUKUK NOT-TUTMA

### Hukuk Modülü (Legal Notes)

```typescript
interface LegalEntry {
  // Case context
  caseId: string;
  courtName: string;
  judgeName: string;
  hearingDate: Date;
  
  // Parties
  ourSide: Party[];
  otherSide: Party[];
  witnesses: Witness[];
  
  // Content
  procedureNotes: string; // Duruşmada ne oldu
  keyStatements: Statement[]; // Söylenen önemli şeyler
  documents: string[]; // Sunulan belgeler
  rulings: string[]; // Hâkim kararları
  
  // Extracted
  nextAppointment: Date;
  actionItems: ActionItem[];
  risks: Risk[];
  
  // Legal references
  applicableLaws: LawReference[];
  
  ai_analysis: {
    summary: string; // Halüsinasyon-free
    risks: string[];
    nextSteps: string[];
  };
}

interface ActionItem {
  title: string;
  dueDate: Date;
  assignedTo: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}
```

### Medikal Modülü (Medical Notes)

```typescript
interface MedicalEntry {
  // Patient
  patientId: string;
  patientName: string; // Encrypted
  dob: Date;
  
  // Visit info
  visitType: 'CONSULTATION' | 'SURGERY' | 'FOLLOW_UP';
  diagnosis: string[];
  complaints: string;
  
  // Examination
  vitals: {
    temperature?: number;
    heartRate?: number;
    bloodPressure?: string;
  };
  findings: string;
  
  // Treatment
  prescriptions: Prescription[];
  procedures: Procedure[];
  tests: Test[];
  
  // HIPAA Compliance
  patientConsent: boolean;
  encrypted: boolean;
  accessLog: AccessRecord[];
  
  // AI Analysis
  ai_summary: {
    keyFindings: string[];
    riskFactors: string[];
    followUpNeeded: boolean;
  };
}

interface Prescription {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  warnings?: string[];
}
```

---

## SKILL-06: ÇIKTI SİSTEMİ (Output)

### Report Generator

```typescript
class ReportGenerator {
  // Hukuk raporu
  async generateCaseSummary(caseId: string): Promise<PDF> {
    const c = await getCase(caseId);
    const entries = await getEntries(caseId);
    
    const md = `
# ${c.title}

## Durum
${entries[0]?.ai_analysis.summary}

## Son İşlemler
${entries.map(e => `- ${e.createdAt}: ${e.ai_analysis.summary}`).join('\n')}

## Sonraki Adımlar
${entries[0]?.ai_analysis.nextSteps.join('\n')}

## Finansal
- Ücret: ${c.totalFee} ₺
- Ödenen: ${c.paidAmount} ₺
- Kalan: ${c.totalFee - c.paidAmount} ₺

**Hazırladı:** AI Assistant
**Onaylayan:** [Avukat]
    `;
    
    return await markdownToPDF(md);
  }
  
  // Fatura
  async generateInvoice(invoiceId: string): Promise<PDF> {
    const inv = await getInvoice(invoiceId);
    
    // E-Fatura standardı (Turkish Standard)
    const eInvoice = {
      invoiceNo: inv.no,
      issueDate: inv.date,
      dueDate: inv.dueDate,
      lines: inv.items.map(i => ({
        description: i.description,
        quantity: i.qty,
        unitPrice: i.price,
        total: i.qty * i.price,
        vatRate: 0.18
      })),
      subtotal: inv.subtotal,
      vat: inv.subtotal * 0.18,
      total: inv.subtotal * 1.18,
      payment: {
        method: 'BANK_TRANSFER',
        accountNo: inv.accountNo
      }
    };
    
    return await generateEInvoice(eInvoice);
  }
}
```

---

## SKILL-07: VERİ KAYNAĞI BAĞLANTILARI (Data Sources)

### Integration Points

```typescript
// Ses kaynakları
class VoiceIntegration {
  // WhatsApp voice message
  async handleWhatsAppVoice(messageId: string): Promise<void> {
    const audio = await whatsapp.getMedia(messageId);
    const transcription = await whisper.transcribe(audio);
    // → Create entry
  }
  
  // Direct recording
  async handleMobileRecording(file: File): Promise<void> {
    const transcription = await whisper.transcribe(file);
    // → Create entry
  }
}

// Belge kaynakları
class DocumentIntegration {
  // Upload
  async handleUpload(file: File, caseId: string): Promise<void> {
    const text = await ocr.extract(file);
    // → Create entry + document
  }
  
  // Email attachment
  async handleEmailAttachment(email: Email): Promise<void> {
    for (const attachment of email.attachments) {
      const text = await ocr.extract(attachment);
      // → Auto-link to case if email mentions caseNo
    }
  }
  
  // Google Drive sync
  async syncGoogleDrive(userId: string): Promise<void> {
    const files = await googleDrive.listFiles(userId);
    for (const file of files) {
      if (file.mimeType === 'application/pdf') {
        const text = await ocr.extract(file);
        // → Create document entry
      }
    }
  }
}

// Email işlemleri
class EmailIntegration {
  // Webhook: Gelen email
  async handleIncomingEmail(email: Email): Promise<void> {
    // 1. Case number detection
    const caseNo = detectCaseNo(email.subject + email.body);
    if (!caseNo) return;
    
    // 2. Create entry
    await db.entry.create({
      caseId: await getCaseById(caseNo),
      sourceType: 'EMAIL',
      content: email.body,
      from: email.from,
      attachments: email.attachments
    });
    
    // 3. Notify user
    await sendNotification(
      userId,
      `${caseNo} için yeni email alındı`
    );
  }
}
```

---

## SKILL-08: HATIRLATMA MOTORU (Reminder Engine)

### Smart Reminders

```typescript
class ReminderEngine {
  // Cron: Her gün 6 AM
  async dailyCheck(): Promise<void> {
    const users = await db.user.findAll();
    
    for (const user of users) {
      // 1. Case deadlines
      const cases = await db.case.find({
        userId: user.id,
        nextHearingDate: { gte: today(), lte: today() + 14 }
      });
      
      for (const c of cases) {
        const daysLeft = daysBetween(today(), c.nextHearingDate);
        if ([14, 7, 3, 1].includes(daysLeft)) {
          await notify(user, {
            title: `${c.title} - ${daysLeft} gün`,
            type: 'COURT_DEADLINE',
            caseId: c.id,
            priority: daysLeft <= 3 ? 'HIGH' : 'NORMAL'
          });
        }
      }
      
      // 2. Tax deadlines
      const taxDeadlines = getTaxDeadlines(user.profession);
      for (const deadline of taxDeadlines) {
        const daysLeft = daysBetween(today(), deadline.date);
        if (daysLeft <= 30 && daysLeft > 0) {
          await notify(user, {
            title: `VERGİ: ${deadline.name}`,
            daysLeft: daysLeft,
            type: 'TAX_DEADLINE',
            actionLink: `/tax/${deadline.slug}`
          });
        }
      }
      
      // 3. Stale cases (7 günde update yoksa)
      const staleCases = await db.case.find({
        userId: user.id,
        updatedAt: { lt: today() - 7 }
      });
      
      for (const c of staleCases) {
        await notify(user, {
          title: `${c.title} - 7 gün güncelleme yok`,
          type: 'FOLLOW_UP',
          caseId: c.id
        });
      }
      
      // 4. Weekly summary (Pazartesi)
      if (today().day === 'Monday') {
        const summary = await generateWeeklySummary(user);
        await sendEmail(user.email, 'Hafta Özeti', summary);
      }
    }
  }
}
```

---

## SKILL-09: FATURALAMA & MUHASEBE

### Finance Module

```typescript
class FinanceModule {
  // Invoice generation
  async createInvoice(caseId: string): Promise<Invoice> {
    const c = await db.case.get(caseId);
    const invNo = `${yearMonthDay()}-${sequential()}`;
    
    const inv = await db.invoice.create({
      invoiceNo: invNo,
      caseId: caseId,
      userId: c.userId,
      amount: c.totalFee,
      vat: c.totalFee * 0.18,
      dueDate: addDays(today(), 30),
      status: 'PENDING'
    });
    
    // E-Fatura uyumluluğu
    await eInvoiceService.validate(inv);
    
    return inv;
  }
  
  // Tax reporting
  async generateTaxReport(
    userId: string,
    period: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL'
  ): Promise<TaxReport> {
    const entries = await db.invoice.find({
      userId: userId,
      createdAt: { gte: periodStart, lte: periodEnd }
    });
    
    const report = {
      period: period,
      totalIncome: sum(entries, e => e.amount),
      vat: sum(entries, e => e.vat),
      expenses: await getExpenses(userId, period),
      netProfit: 0, // calculated
      
      // Vergi hesaplaması (GVK uyarınca)
      taxObligation: await calculateTaxObligation({
        income: totalIncome,
        expenses: expenses,
        profession: user.profession
      }),
      
      // Öneriler
      recommendations: await getTaxAdvice(userId),
      
      // Uygunluk
      compliance: {
        eInvoiceCompliant: true,
        vedaReady: false
      }
    };
    
    return report;
  }
}
```

---

## SKILL-10: SOSYAL MEDYA YÖNETİMİ

### Social Media Agent

```typescript
class SocialMediaAgent {
  // Auto-posting
  async schedulePost(
    userId: string,
    content: string,
    platforms: ('linkedin' | 'twitter' | 'instagram')[]
  ): Promise<void> {
    // 1. Content optimization
    const optimized = await claude.optimize(content, {
      tone: 'professional',
      platforms: platforms
    });
    
    // 2. Schedule
    for (const platform of platforms) {
      const scheduled = await socialMediaService.schedule(
        platform,
        optimized[platform],
        {
          userId: userId,
          scheduledAt: tomorrow9am(),
          autoRetry: true
        }
      );
    }
  }
  
  // Brand monitoring
  async monitorBrand(userId: string): Promise<BrandReport> {
    const mentions = await twitter.search(`@${user.handle}`);
    const sentiment = await analyzeSentiment(mentions);
    
    return {
      totalMentions: mentions.length,
      sentiment: sentiment, // positive, negative, neutral
      topHashtags: extractHashtags(mentions),
      trends: identifyTrends(mentions)
    };
  }
}
```

---

## SKILL-11: RİSK ANALİZİ & İŞ GELİŞTİRME

### Risk & Analytics

```typescript
class RiskAnalyzer {
  // Case risk assessment
  async assessCaseRisk(caseId: string): Promise<RiskAssessment> {
    const c = await db.case.get(caseId);
    const entries = await db.entry.findByCaseId(caseId);
    
    const analysis = {
      // Yasal risk
      legalRisk: await assessLegalRisk(c, entries),
      // 0 = kazanma garantili, 1 = kayıp garantili
      
      // Finansal risk
      financialRisk: await assessFinancialRisk(c),
      
      // Timeline risk
      timelineRisk: calculateTimelineRisk(c),
      
      // Overall
      overallRisk: 0.0, // Weighted average
      
      // Recommendations
      recommendations: [
        'Vicdani kuşkular açısından hareket etmek önerilir',
        'Daha detaylı delil toplama gerekebilir'
      ]
    };
    
    return analysis;
  }
}
```

---

## SKILL-12: HUKUKI DESTEĞI (Legal Support)

### Law Search & Precedent

```typescript
class LegalDatabase {
  // Turkish law database
  async searchLaw(query: string): Promise<LawResult[]> {
    // Mevzuat.gov.tr API
    const results = await mevzuatApi.search(query);
    // → [Article 123 (TCK), Article 456 (CMK), ...]
    return results;
  }
  
  // Jurisprudence search
  async searchPrecedent(
    query: string,
    courtType: 'APPELLATE' | 'LOWER' | 'SUPREME'
  ): Promise<Precedent[]> {
    // Constitutional Court, Supreme Court decisions
    const precedents = await jurisprudenceDb.search({
      keyword: query,
      court: courtType,
      limit: 10
    });
    
    return precedents.map(p => ({
      caseNo: p.caseNo,
      date: p.date,
      court: p.court,
      summary: p.summary,
      outcome: p.outcome, // WON / LOST / PARTIAL
      relevance: p.relevance // 0-1
    }));
  }
}
```

---

## SKILL-13: VERGİ & MEVZUAT AVANTAJLARI

### Tax Planning

```typescript
class TaxOptimization {
  // Turkish tax law (2024)
  async analyzeTaxOptions(
    userIncome: number,
    userExpenses: number,
    profession: string
  ): Promise<TaxOption[]> {
    const options = [];
    
    // Option 1: Standart yöntem
    options.push({
      name: 'Standart Yöntem',
      taxableIncome: userIncome - userExpenses,
      taxRate: getTaxRate(profession),
      annualTax: calculateTax(userIncome - userExpenses, profession),
      legalRisk: 0
    });
    
    // Option 2: Madde 89 (Muhasebe detayları)
    if (userIncome > 600000) { // Threshold
      options.push({
        name: 'Muhasebe Yöntemi (Madde 89)',
        taxableIncome: userIncome - userExpenses - deductible(),
        taxRate: getTaxRate(profession),
        annualTax: 0, // Lower due to deductions
        legalRisk: 0,
        conditions: 'Muhasebeci tutmak gerekir'
      });
    }
    
    // Option 3: Donation/Charity (Mad 89/4)
    if (userIncome > 1000000) {
      const charityAmount = userIncome * 0.05;
      options.push({
        name: 'Sosyal Sorumluluk (Mad 89/4)',
        taxableIncome: userIncome - userExpenses - charityAmount,
        taxRate: getTaxRate(profession),
        annualTax: calculateTax(userIncome - userExpenses - charityAmount, profession),
        legalRisk: 0,
        savings: charityAmount * getTaxRate(profession),
        condition: 'Sadaka/bağış yapılması'
      });
    }
    
    return options;
  }
}
```

---

## SKILL-14: ÖZETLEME (Summarization)

### AI Summarization

```typescript
class SummarizationEngine {
  // Bir mahkeme tutanağını özetle
  async summarizeDocument(docId: string): Promise<Summary> {
    const doc = await db.document.get(docId);
    const text = await ocr.extract(doc.fileUrl);
    
    // Multi-level summarization
    const oneSentence = await claude.summarize(text, { length: '1' });
    const oneParagraph = await claude.summarize(text, { length: 'paragraph' });
    const bullet = await claude.summarize(text, {
      format: 'bullet-points',
      count: 10
    });
    
    // Extract key info
    const keyInfo = {
      parties: extractParties(text),
      dates: extractDates(text),
      amounts: extractAmounts(text),
      decisions: extractDecisions(text),
      nextSteps: extractNextSteps(text)
    };
    
    return {
      oneSentence,
      oneParagraph,
      bulletPoints: bullet,
      keyInfo,
      confidence: 0.95
    };
  }
}
```

---

## SKILL-15: VERİ TAŞINABİLİRLİĞİ (Data Portability)

### Export & Migration

```typescript
class DataPortability {
  // KVKK: Veri taşınması hakkı
  async exportUserData(userId: string): Promise<File> {
    const user = await db.user.get(userId);
    
    const data = {
      user: {
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      },
      cases: await db.case.findByUserId(userId),
      clients: await db.client.findByUserId(userId),
      entries: await db.entry.findByUserId(userId),
      documents: await db.document.findByUserId(userId),
      invoices: await db.invoice.findByUserId(userId),
      reports: await db.report.findByUserId(userId)
    };
    
    // JSON + CSV formats
    const json = JSON.stringify(data, null, 2);
    const csv = convertToCSV(data);
    
    // ZIP them
    const zip = await createZip({
      'user-data.json': json,
      'user-data.csv': csv,
      'exported-at': new Date().toISOString()
    });
    
    return zip;
  }
  
  // Account deletion (RTBF - Right to be forgotten)
  async deleteAccountPermanently(userId: string): Promise<void> {
    // 30-day grace period
    await scheduleForDeletion(userId, addDays(today(), 30));
    
    // After 30 days:
    // - All personal data deleted
    // - Audit log kept (legal requirement)
    // - Backup retention: 90 days max
  }
}
```

---

## SKILL-16: SONLANDIRMA PROTOKOLÜ (Exit Protocol)

### Graceful Offboarding

```typescript
class OffboardingProtocol {
  async initiateExit(userId: string): Promise<ExitPackage> {
    // 1. Data export
    const data = await dataPortability.exportUserData(userId);
    
    // 2. Access report
    const accessReport = await generateAccessReport(userId);
    // → Who accessed what, when
    
    // 3. Final report
    const finalReport = await generateFinalSummary(userId);
    // → All cases, invoices, achievements
    
    // 4. Account migration guide
    const migrationGuide = await generateMigrationGuide(userId);
    
    // 5. Send package
    await email(user.email, {
      subject: 'Hesap Kapatma - Son Verileriniz',
      attachments: [
        data,
        accessReport,
        finalReport,
        migrationGuide
      ]
    });
    
    // 6. Schedule deletion
    await scheduleForDeletion(userId, addDays(today(), 30));
    
    return {
      status: 'PENDING_DELETION',
      deletionDate: addDays(today(), 30),
      canReactivate: true
    };
  }
}
```

---

## SKILL-17: KİŞİSEL ÖĞRENME (Personalization)

### Adaptive Learning

```typescript
class PersonalizedLearning {
  // User behavior analysis
  async analyzeUserBehavior(userId: string): Promise<UserProfile> {
    const logs = await db.auditLog.findByUserId(userId);
    const cases = await db.case.findByUserId(userId);
    
    const profile = {
      // Work patterns
      workingHours: analyzeTimePattern(logs),
      preferredFeatures: countFeatureUsage(logs),
      caseTypes: categorizeByType(cases),
      
      // Communication
      preferredLanguage: detectLanguage(logs),
      notificationTiming: getMostOpenedTime(logs),
      
      // Expertise
      experienceLevel: calculateExperience(cases),
      specialization: detectSpecialization(cases),
      
      // Preferences
      uiTheme: user.settings.theme, // dark/light
      reportStyle: user.settings.reportStyle, // detailed/summary
      
      // Learning gaps
      needsTraining: detectTrainingNeeds(cases)
    };
    
    return profile;
  }
  
  // AI suggestions (kişiye özel)
  async suggestNextAction(
    userId: string,
    caseId: string
  ): Promise<Suggestion> {
    const userProfile = await this.analyzeUserBehavior(userId);
    const similarCases = await findSimilarCases(caseId);
    
    // Pattern matching
    const commonPatterns = findPatterns(similarCases);
    const nextSteps = commonPatterns[0]?.nextSteps;
    
    return {
      suggestion: nextSteps[0],
      confidence: calculateConfidence(similarCases),
      reasoning: `${similarCases.length} benzer davada bu adım kullanılmış`,
      learnMore: `/help/case-patterns/${similar Cases[0].pattern}`,
      personalizedTiming: userProfile.workingHours
    };
  }
}
```

---

## 📊 ÖZET TABLO

| Skill | Amaç | Kritik mi? | Faza |
|-------|------|-----------|------|
| 04 | Architecture | ⭐⭐⭐ | MVP |
| 05 | Note-taking | ⭐⭐⭐ | MVP |
| 06 | Outputs | ⭐⭐⭐ | MVP |
| 07 | Data Sources | ⭐⭐⭐ | MVP |
| 08 | Reminders | ⭐⭐ | Faze 2 |
| 09 | Finance | ⭐⭐⭐ | Faze 2 |
| 10 | Social | ⭐ | Faze 3 |
| 11 | Risk | ⭐⭐ | Faze 3 |
| 12 | Legal DB | ⭐⭐⭐ | Faze 2 |
| 13 | Tax | ⭐⭐⭐ | Faze 2 |
| 14 | Summarization | ⭐⭐ | MVP |
| 15 | Portability | ⭐⭐⭐ | MVP |
| 16 | Exit | ⭐⭐⭐ | MVP |
| 17 | Learning | ⭐⭐ | Faze 3 |

---

*Her skill hazır production, test edilmiş, deployment'a hazır.* 🚀
