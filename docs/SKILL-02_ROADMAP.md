# SKILL-02: YOL HARITASI (18 Ay)
## Profesyonel Yaşam Yönetim Sistemi (PLMS) - Startup Journey

---

## 📅 TIMELINE ÖZET

```
FAZE 1 (Ay 1-3):   MVP + Beta
FAZE 2 (Ay 4-6):   Core Features + Compliance
FAZE 3 (Ay 7-9):   AI Intelligence + Sector Modules
FAZE 4 (Ay 10-12): Multi-Platform + Automation
FAZE 5 (Ay 13-18): Scale + Series A
```

---

## 🔴 FAZE 1: MVP + BETA (Ay 1-3)

### Hedef
Hukuk sektörü için MVP. Avukatlar test etsin.

### Deliverables

#### **AY 1: Infrastructure & Auth**
```
HAFTA 1-2:
  [ ] Tech stack final (Next.js, Express, Postgres)
  [ ] GitHub monorepo setup
  [ ] Database schema (User, Case, Document, Entry, Report)
  [ ] Development environment
  
HAFTA 3-4:
  [ ] User registration & login (email)
  [ ] 2FA (phone/auth app)
  [ ] Role-based access (user, client, admin)
  [ ] KVKK consent form (kayıtta)
  [ ] Audit logging (tüm işlemler)

DELIVERABLE: Çalışan auth sistemi
```

**Database Schema (Prisma):**
```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  phone         String   @unique
  passwordHash  String
  name          String
  profession    String   // LAWYER, ARCHITECT, DOCTOR, etc.
  avatar        String?
  
  // Settings
  timezone      String   @default("Europe/Istanbul")
  language      String   @default("tr")
  
  // Compliance
  kvkkAgreed    Boolean  @default(false)
  kvkkDate      DateTime?
  dataAccess    DataAccess @default(OWNER)
  
  // Relations
  clients       Client[]
  cases         Case[]
  documents     Document[]
  entries       Entry[]
  reports       Report[]
  reminders     Reminder[]
  auditLog      AuditLog[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Client {
  id            String   @id @default(cuid())
  userId        String
  name          String
  email         String?
  phone         String?
  tcNo          String?   // Hukuk için TC kimlik
  
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  cases         Case[]
  documents     Document[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Case {
  id            String   @id @default(cuid())
  userId        String
  clientId      String
  caseNo        String   @unique
  title         String
  description   String?
  
  // Legal fields
  courtName     String?
  judgeName     String?
  startDate     DateTime
  status        CaseStatus @default(ONGOING)
  
  user          User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  client        Client     @relation(fields: [clientId], references: [id], onDelete: Cascade)
  documents     Document[]
  entries       Entry[]
  reminders     Reminder[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum CaseStatus {
  ONGOING
  PENDING_HEARING
  DECIDED
  APPEALED
  CLOSED
}

model Entry {
  id            String   @id @default(cuid())
  userId        String
  caseId        String
  
  // Source
  sourceType    SourceType  // VOICE, TRANSCRIPT, DOCUMENT, MANUAL
  sourceUrl     String?
  
  // Content
  title         String
  content       String    @db.Text
  rawText       String?   @db.Text
  
  // Extracted entities
  entities      Json      // {parties: [], dates: [], amounts: []}
  keyDates      DateTime[]
  
  // AI Analysis
  aiSummary     String?
  aiKeyPoints   String[]
  aiRisks       String[]
  
  // Metadata
  confidence    Float     // 0-1 (AI yapacağı işin güveni)
  
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  case          Case      @relation(fields: [caseId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum SourceType {
  VOICE
  TRANSCRIPT
  DOCUMENT
  MANUAL
  EMAIL
  WHATSAPP
}

model Document {
  id            String   @id @default(cuid())
  userId        String
  caseId        String?
  
  title         String
  fileUrl       String    // S3/R2 URL
  fileType      String    // pdf, docx, txt, wav, etc.
  fileSize      Int
  
  // OCR/Processing
  extractedText String?   @db.Text
  ocrStatus     ProcessingStatus @default(PENDING)
  
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  case          Case?     @relation(fields: [caseId], references: [id], onDelete: SetNull)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum ProcessingStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  FAILED
}

model Reminder {
  id            String   @id @default(cuid())
  userId        String
  caseId        String
  
  title         String
  description   String?
  dueDate       DateTime
  daysAhead     Int       @default(7) // Kaç gün önceden uyar
  
  status        ReminderStatus @default(ACTIVE)
  sentAt        DateTime?
  
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  case          Case      @relation(fields: [caseId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum ReminderStatus {
  ACTIVE
  SNOOZED
  SENT
  DISMISSED
}

model Report {
  id            String   @id @default(cuid())
  userId        String
  caseId        String?
  
  title         String
  reportType    ReportType // CASE_SUMMARY, MONTHLY, ANNUAL, TAX, etc.
  
  content       String    @db.Text
  htmlContent   String?   @db.Text
  pdfUrl        String?
  
  generatedAt   DateTime  @default(now())
  sentTo        String[]  // Email addresses
  
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  case          Case?     @relation(fields: [caseId], references: [id], onDelete: SetNull)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum ReportType {
  CASE_SUMMARY
  MONTHLY_PROGRESS
  ANNUAL_SUMMARY
  TAX_REPORT
  INVOICE_SUMMARY
  CLIENT_REPORT
}

model AuditLog {
  id            String   @id @default(cuid())
  userId        String
  
  action        String
  resource      String
  resourceId    String
  changes       Json?
  
  ipAddress     String?
  userAgent     String?
  
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
}

enum DataAccess {
  OWNER
  EXPORT_ONLY
  READ_ONLY
}
```

---

#### **AY 2: Frontend MVP**
```
HAFTA 5-6:
  [ ] Dashboard (summary, recent cases, upcoming dates)
  [ ] Client CRUD (add, edit, list)
  [ ] Case CRUD (new case form, case detail)
  [ ] Document upload (drag-drop, file manager)
  
HAFTA 7-8:
  [ ] Entry creation (manual input, voice button placeholder)
  [ ] Simple report view (case summary)
  [ ] Basic search (case, client)

DELIVERABLE: Fonksiyonel web arayüzü
```

**UI Stack:**
- Next.js 14 + React
- Tailwind CSS + Shadcn/ui
- Zustand (state management)
- React Query (data fetching)

---

#### **AY 3: Backend Core + Beta Launch**
```
HAFTA 9-10:
  [ ] Document storage (S3/R2 integration)
  [ ] OCR backend (Tesseract + Whisper placeholders)
  [ ] Simple reporting (PDF generation)
  [ ] Email notifications
  
HAFTA 11-12:
  [ ] Beta user onboarding flow
  [ ] Feedback collection system
  [ ] Performance optimization
  [ ] Security audit (basic)

DELIVERABLE: MVP ready for beta
```

**Deployment (Day 1):**
- Frontend: Vercel
- Backend: Render.com
- Database: Supabase
- Files: Cloudflare R2
- Cost: ~$300/month

---

### Ay 1-3 Başarı Kriterleri
```
✅ 20 beta users (avukatlar)
✅ 100+ test cases uploaded
✅ 95% uptime
✅ < 2s page load
✅ KVKK compliance başlangıç
```

---

## 🟠 FAZE 2: CORE FEATURES + COMPLIANCE (Ay 4-6)

### Hedef
Üretim kalitesi. Multi-sector (Hukuk + Mimarlık + Tıp)

### Deliverables

#### **AY 4: AI + Advanced Intake**
```
[ ] Voice transcription (Whisper API)
[ ] Email webhook (incoming messages → automatic entry)
[ ] Whisper WhatsApp integration
[ ] NER (Named Entity Extraction) - tarih, para, taraf
[ ] Claude API integration (analysis)
[ ] Hallucination-free prompting (custom system instructions)
```

**Prompt Engineering (Halüsinasyon Yok):**
```
SYSTEM:
"You are a legal assistant. You ONLY provide information based on:
1. Turkish law database
2. Uploaded documents
3. Known jurisprudence

You NEVER make assumptions. If uncertain, say 'Bilinenmiyor.'
For every claim, cite the article/precedent.

Format: Fact [SOURCE: Article 123]"
```

---

#### **AY 5: Sector Modules**
```
HUKUK:
  [ ] Case template library (mahkeme tipi)
  [ ] Turkish law database (mevzuat.gov.tr integration)
  [ ] Court deadline calendar
  [ ] Precedent search (benzeri davalar)
  
MİMARLIK:
  [ ] Project management (timeline, contractors)
  [ ] Cost estimation templates
  [ ] Safety compliance checklist
  [ ] Team collaboration (real-time)
  
TIP:
  [ ] Patient record (HIPAA-like compliance)
  [ ] Prescription management
  [ ] Medical history timeline
  [ ] Medical documentation templates
```

---

#### **AY 6: Compliance + Legal**
```
[ ] KVKK full implementation (DPA, consent, RTBF)
[ ] Audit trail (immutable log)
[ ] Encryption at rest & in transit (TLS 1.3)
[ ] GDPR compliance (if EU users)
[ ] Data residency (user choice: TR, EU, US)
[ ] Compliance dashboard (for admins)
```

**Compliance Checklist:**
```
KVKK (TR):
  ✅ Privacy Policy (Türkçe/İngilizce)
  ✅ Data Processing Agreement
  ✅ Consent form (signup)
  ✅ Deletion request handling (30 days)
  ✅ Data export (GDPR format)
  ✅ Cookie consent (banner)
  
HUKUK:
  ✅ E-Duruşma uyumluluğu
  ✅ Mahkeme kuralları uyumluluğu
  ✅ Sır saklama yükümlülüğü
  ✅ Muhabir gizliliği
  
TIBBİ:
  ✅ Hasta gizliliği (HIPAA-like)
  ✅ Medical record standards
```

---

### Ay 4-6 Başarı Kriterleri
```
✅ 500+ users
✅ 3 sectors live
✅ KVKK certified
✅ 50% feature completion
```

---

## 🟡 FAZE 3: AI INTELLIGENCE (Ay 7-9)

### Hedef
Smart automation. Terminler otomatik, raporlar otomatik.

### Deliverables

#### **AY 7: Smart Reminders + Triggers**
```
[ ] Calendar.ai (mahkeme tarihleri otomatik algılama)
[ ] Deadline extraction (7-3-1 gün öncesi bildirim)
[ ] Auto-follow-up (7 gün hiç update yoksa uyar)
[ ] Weekly digest (hafta özeti)
[ ] SMS/Push notifications (preferences per user)
```

**Reminder Logic (Node.js):**
```javascript
// Veri: Case hearing on 2024-05-15
// Today: 2024-05-14 (1 day before)
// Action: Send SMS "Tomorrow mahkeme var"

const checkReminders = async (userId) => {
  const cases = await getCases(userId);
  for (const c of cases) {
    const daysUntil = daysBetween(today(), c.hearingDate);
    if ([7, 3, 1].includes(daysUntil)) {
      await sendSMS(user.phone, `${c.title} - ${daysUntil} gün kaldı`);
      await logReminder(c.id, 'sent');
    }
  }
};
```

---

#### **AY 8: Automated Reporting**
```
[ ] Case summary generator (ai-generated, no hallucination)
[ ] Monthly progress report (auto, email to client)
[ ] Annual summary (year-end)
[ ] Invoice generator (linked to entries)
[ ] Tax report helper (KDV, income summary)
[ ] Time tracking (duration per case/task)
```

**Report Template (Hukuk):**
```markdown
# Dava Özeti - ${case.title}

## Durumu
[AI özeti - sadece belgelerden]

## Son İşlemler
- ${latestEntry.date}: ${latestEntry.summary}

## Gelecek Adım
- Mahkeme tarihi: ${nextHearing}
- Hazırlanacak belgeler: ${pendingDocs}

## Harcamalar
[Fatura tablosu - otomatik]

## Yasal Referanslar
- Madde 123: [Kısa açıklama]

Hazırladı: AI Assistant (İnsan denetimi: Avukat)
```

---

#### **AY 9: Intelligence Layer**
```
[ ] Case analysis (benzer davalar, başarı oranı)
[ ] Risk assessment (mahkeme kararı olasılığı)
[ ] Cost prediction (tahmini maliyet)
[ ] Time estimation (kalan süre)
[ ] Bottleneck detection (nerede takılmış)
```

**Analytics Dashboard:**
```
Avukat'a gösterilecek:
- Cases by status (çember grafik)
- Time spent per case (bar)
- Revenue per case (dönem)
- Win rate (başarı %)
- Upcoming deadlines (takvim)
```

---

### Ay 7-9 Başarı Kriterleri
```
✅ 1000+ users
✅ Automated reminders çalışıyor
✅ Auto-reporting 80% doğru
✅ Revenue: ₺50k/month
```

---

## 🟢 FAZE 4: MULTI-PLATFORM + AUTOMATION (Ay 10-12)

### Hedef
Mobil, masaüstü, otomatasyon.

### Deliverables

#### **AY 10: Mobile App**
```
[ ] React Native (iOS + Android)
[ ] Offline mode (sync when online)
[ ] Voice recording (in-app)
[ ] Push notifications
[ ] Biometric login
[ ] Document camera (OCR)
```

#### **AY 11: Desktop + Integrations**
```
[ ] Electron app (Windows/Mac/Linux)
[ ] Microsoft 365 integration (Outlook, Teams)
[ ] Google Workspace (Calendar, Drive)
[ ] Zapier webhook (IFTTT automation)
[ ] API v1 (third-party integrations)
```

#### **AY 12: Advanced Automation**
```
[ ] Workflow builder (if-then rules)
[ ] Bulk operations (100+ cases at once)
[ ] Custom reports (template builder)
[ ] Data sync (Dropbox, Google Drive)
[ ] E-signature integration (e-imza)
```

---

### Ay 10-12 Başarı Kriterleri
```
✅ iOS + Android apps live
✅ 5000+ users
✅ Revenue: ₺200k/month
✅ NPS score: 45+
```

---

## 🔵 FAZE 5: SCALE + SERIES A (Ay 13-18)

### Hedef
Enterprise ready. Yatırımcı sunum hazır.

### Deliverables

#### **AY 13-14: Enterprise Edition**
```
[ ] White-label option
[ ] SSO (Active Directory, Google)
[ ] Team management (departments)
[ ] Compliance dashboard (admin)
[ ] SLA guarantee (99.9% uptime)
```

#### **AY 15-16: Marketplace + Ecosystem**
```
[ ] App marketplace (plugins)
[ ] Legal template library (paid)
[ ] Expert network (consultation)
[ ] Training academy (courses)
[ ] Community forum
```

#### **AY 17-18: International Expansion**
```
[ ] EU expansion (GDPR full)
[ ] Arabic localization (MENA market)
[ ] German law database
[ ] Spanish law database
[ ] Multi-currency (EUR, SAR, etc.)
```

---

### Ay 13-18 Başarı Kriterleri
```
✅ 10,000+ users
✅ Revenue: ₺500k+/month
✅ Series A funding (₺50-100M)
✅ Team: 30+ people
✅ International: 3+ countries
```

---

## 📊 TIMELINE GANTT

```
AY   1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18
     ├──────────────┤ MVP BETA
            ├────────────────────┤ CORE FEATURES
                    ├──────────────────────┤ AI INTELLIGENCE
                             ├────────────────────┤ MULTI-PLATFORM
                                      ├────────────────────────────┤ ENTERPRISE

────────────────────────────────────────────────────────────────────────────
```

---

## 💰 BUDGET & RESOURCES

### Team (Ay 1-3)
```
Founder (Alper):       Coding + Product
Contractor Developer:  Frontend (part-time)
QA Tester:             Beta testing
Designer:              UI/UX (contract)
```

**Cost:** ~₺50k/month

### Infrastructure (Year 1)
```
Ay 1-3:  ₺3k/month (MVP)
Ay 4-6:  ₺8k/month (scaling)
Ay 7-12: ₺15k/month (production)
```

---

## 🎯 FUNDING TIMELINE

```
AY 6:   Angel funding (seed)
        Target: ₺10-30M
        Use: Team expansion, marketing

AY 12:  Series A preparation
        Target: ₺50-100M
        Use: Growth, international
```

---

## 🚀 NEXT: SKILL-03

Multi-Agent tasarımı (sub-agents, task delegation)

---

## 📝 NOTES

- Her faze sonunda user feedback loop
- 2-week sprints (continuous deployment)
- Daily standup (Alper + team)
- Weekly investor updates (Series A sonrası)

---

*Takvim esiktir. Market feedback'e göre ajuste edilir.*
