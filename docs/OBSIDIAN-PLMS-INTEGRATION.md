# 📓 OBSİDİAN + PLMS ENTEGRASYONU
## Knowledge Management System Mimarisi

---

## 🎯 OBSIDIAN NEDIR? (1 Sayfa Özet)

### Tanım

```
Obsidian = Markdown-based Note-taking App
         + Local-first (bulut değil, bilgisayarında)
         + Knowledge Graph (notlar linklenmiş)
         + Plugin Ecosystem (1000+ plugin)
         + Offline-first (internet yok da çalışır)
```

### Temel Özellikleri

| Özellik | Açıklama | PLMS'ta Kullanım |
|---------|----------|------------------|
| **Vault** | Klasör = veritabanı | Case notes vault |
| **Markdown** | Yazı formatı | Mahkeme tutanakları |
| **Backlinks** | [[otherNote]] ile link | Case1 → Case2 |
| **Graph View** | Görsel bilgi ağı | Benzer davalar grafiği |
| **Plugins** | Ekstra özellikler | 15+ PLMS plugin |
| **Sync** | Buluta senkronizasyon | iCloud/Dropbox opsiyonel |
| **Mobile App** | iPad/iPhone | Case notes on-the-go |

---

## 📋 OBSİDİAN PLMS KURULUM PLANI

### FAZE 1: TEMELİ KURULUM (MVP'den sonra, Faze 2)

```
1. Obsidian indir
   https://obsidian.md/download
   
   Windows / Mac / Linux
   iOS / Android (opsiyonel)

2. Vault klasörü oluştur
   ~/Documents/PLMSVault/
   
3. Temel klasör yapısı
   PLMSVault/
   ├── _Meta/
   │   ├── Settings.md
   │   ├── Templates.md
   │   └── Plugins.md
   ├── Cases/
   │   ├── case_2024_001.md
   │   ├── case_2024_002.md
   │   └── ...
   ├── Clients/
   │   ├── client_Acme.md
   │   └── ...
   ├── Legal/
   │   ├── article_123_tcb.md
   │   ├── precedent_2023_101.md
   │   └── ...
   ├── Templates/
   │   ├── court_template.md
   │   ├── legal_memo.md
   │   └── case_summary.md
   └── Archive/
       └── (kapalı davalar)
```

---

## 🔗 OBSIDIAN ↔ PLMS ENTEGRASYONU

### MİMARİ (Veri Akışı)

```
USER JOURNEY:

1. Mahkeme tutanağı yükle
   ↓
   PLMS: POST /api/documents/upload
   
2. Document Agent çalışır
   ├─ OCR (Tesseract)
   ├─ Extract text
   ├─ Parse entities (dates, parties)
   └─ AI summarize (Claude)
   
3. PLMS: Generate markdown note
   {
     "title": "Dava Özeti - Case 2024_001",
     "content": "# Dava Özeti...",
     "tags": ["mahkeme", "hukuk", "2024"],
     "backlinks": ["case_2023_999", "client_acme"],
     "frontmatter": {
       "type": "court_transcript",
       "date": "2024-04-23",
       "caseNo": "2024/123",
       "court": "Istanbul Bölge"
     }
   }
   
4. Obsidian Sync Webhook
   POST /api/obsidian/sync
   → Markdown nota → Obsidian Vault
   
5. Obsidian: Markdown dosya oluştur
   ~/Documents/PLMSVault/Cases/2024_001.md
   
6. User: Obsidian'da not açar
   ├─ Kendi notlarını ekler
   ├─ Backlinks ekler
   └─ Tags yönetir
   
7. Obsidian Vault: local backup
   (Git ile senkronize)
   
8. PLMS: Graph query
   GET /api/obsidian/graph?caseId=2024_001
   → Benzer davalar (graph analysis)
   → "51 benzer davada..." önerisi
```

### IMPLEMENTATION (Kod)

#### BACKEND (Node.js/Express)

```typescript
// 1. PLMS: Generate Obsidian Note

import { generateMarkdown } from '../utils/markdown';
import { extractEntities } from '../utils/nlp';

app.post('/api/documents/upload', async (req, res) => {
  const { file, caseId, userId } = req.body;
  
  // Step 1: Process document
  const text = await documentAgent.process(file);
  
  // Step 2: Extract metadata
  const entities = await extractEntities(text);
  const summary = await claude.summarize(text);
  
  // Step 3: Create Obsidian frontmatter
  const frontmatter = {
    type: 'court_transcript',
    date: entities.dates[0] || new Date().toISOString(),
    caseNo: entities.caseNo,
    court: entities.courtName,
    parties: entities.parties,
    tags: ['mahkeme', 'hukuk', new Date().getFullYear().toString()],
    source: 'PLMS upload',
    sourceUrl: `https://plms.io/cases/${caseId}`
  };
  
  // Step 4: Generate markdown
  const markdownContent = generateMarkdown({
    title: `Dava: ${entities.caseNo}`,
    frontmatter,
    body: summary,
    content: text,
    entities
  });
  
  // Step 5: Sync to Obsidian (webhook)
  await syncToObsidian(userId, {
    vault: 'PLMSVault',
    folder: 'Cases',
    filename: `${entities.caseNo}.md`,
    content: markdownContent,
    backlinks: await findRelatedCases(caseId)
  });
  
  // Step 6: Save to PLMS database
  const entry = await db.entry.create({
    userId,
    caseId,
    content: text,
    aiSummary: summary,
    obsidianSync: true,
    obsidianPath: `/Cases/${entities.caseNo}.md`
  });
  
  return res.json({ success: true, entry });
});

// 2. Obsidian Sync Webhook (incoming)

app.post('/api/obsidian/sync', async (req, res) => {
  const { userId, vault, folder, filename, content } = req.body;
  
  // Parse markdown frontmatter
  const parsed = parseMarkdown(content);
  
  // Extract changes
  const newTags = parsed.frontmatter.tags;
  const newBacklinks = parsed.frontmatter.backlinks;
  const updates = parsed.metadata.changes;
  
  // Update PLMS database
  const entryId = parsed.frontmatter.entryId;
  await db.entry.update(entryId, {
    tags: newTags,
    backlinks: newBacklinks,
    lastSyncFromObsidian: new Date()
  });
  
  return res.json({ success: true });
});

// 3. Graph Analysis (benzer davalar bulma)

app.get('/api/obsidian/graph', async (req, res) => {
  const { caseId } = req.query;
  
  const case_ = await db.case.get(caseId);
  const entries = await db.entry.find({ caseId });
  
  // Extract case features (parties, court, year, etc)
  const features = extractCaseFeatures(case_, entries);
  
  // Find similar cases
  const similar = await db.case.findSimilar(features, { limit: 5 });
  
  // Return graph structure
  return res.json({
    mainCase: {
      id: case_.id,
      title: case_.title,
      parties: case_.parties
    },
    similarCases: similar.map(c => ({
      id: c.id,
      title: c.title,
      relevance: c.similarityScore,
      commonalities: c.commonalities
    })),
    insights: {
      winRate: `${calculateWinRate(similar)}%`,
      averageDuration: calculateAverageDuration(similar),
      commonOutcomes: findCommonOutcomes(similar)
    }
  });
});
```

---

## 🔧 OBSİDİAN PLUGINS (MVP+ için)

### Gerekli Pluginler

```
1. **Templater**
   └─ Template values otomatik doldurma
   └─ PLMS frontmatter template
   
   Template:
   ---
   type: court_transcript
   date: <% tp.date.now("YYYY-MM-DD") %>
   caseNo: <% tp.user.prompt("Case No") %>
   entryId: <% tp.user.prompt("Entry ID") %>
   ---

2. **Dataview**
   └─ SQL-like query yazma
   └─ Case listeleri otomatik
   
   Query:
   ```dataview
   LIST
   WHERE type = "court_transcript"
   AND contains(tags, "2024")
   SORT date DESC
   ```

3. **Advanced Tables**
   └─ Tablo editörü
   └─ Fatura/rapor tabloları

4. **Natural Language Dates**
   └─ "next Tuesday" → 2024-05-07
   └─ Mahkeme tarihleri otomatik

5. **Front Matter Title**
   └─ frontmatter'daki title'ı başlık yap
   
6. **Backlink in Document**
   └─ [[case_2023_999]] olduğunda otomatik link

7. **Daily Notes**
   └─ Her gün auto-journal
   └─ Günlük case progress

8. **Obsidian Git**
   └─ Vault'ı GitHub'a push
   └─ Version control

9. **Calendar**
   └─ Mahkeme tarihleri takvime

10. **PDF Embed**
    └─ PDF'leri inline embed
    └─ Tutanak PDF'leri görmek
```

### Plugin Configuration (PLMS)

```json
// ~/.obsidian/plugins/templater/data.json
{
  "templates": {
    "court_transcript": "Templates/court_transcript.md",
    "legal_memo": "Templates/legal_memo.md",
    "case_summary": "Templates/case_summary.md"
  },
  "api": {
    "plmsSync": "http://localhost:4000/api/obsidian/sync",
    "autoSync": true,
    "syncInterval": 300000 // 5 minutes
  }
}
```

---

## 📝 OBSİDİAN TEMPLATE ÖRNEKLERI

### Template 1: Court Transcript

```markdown
---
type: court_transcript
date: 2024-04-23
caseNo: 2024/123
court: Istanbul Bölge Adliyesi
parties: 
  - Acme Corp (davacı)
  - ABC Ltd (davalı)
judge: Yargıç Mehmet Demir
nextHearing: 2024-05-15
status: pending
tags: [mahkeme, hukuk, 2024]
backlinks: 
  - [[case_2023_999]]
  - [[client_acme]]
entryId: entry_123abc
---

# Dava Özeti: 2024/123

## Taraflar
- **Davacı**: Acme Corp
- **Davalı**: ABC Ltd

## Hukuki Meseleler
- Sözleşme ihlali
- Madde 49 TMK uygulanabilirliği

## Son Duruşma
- **Tarih**: 2024-04-23
- **Kâhya**: Yargıç Mehmet Demir
- **Karar**: ...

## Sonraki Adımlar
- [ ] Delil belgesini hazırla
- [ ] Cevap dilekçesi yaz
- [ ] Mahkemeye teslim et (Fark: 10 gün)

## Notlar
*Avukat'ın kendi notları...*

## Kaynaklar
- [[article_49_tmk]]
- [[precedent_2023_456]]

---
*Last synced: 2024-04-23 10:15*
```

### Template 2: Client Note

```markdown
---
type: client
clientName: Acme Corp
contactPerson: John Doe
email: john@acme.com
phone: +90 212 xxx xxxx
cases: 
  - [[case_2024_001]]
  - [[case_2024_123]]
tags: [client, corporate]
---

# Müşteri: Acme Corp

## İletişim
- **Kişi**: John Doe
- **Email**: john@acme.com
- **Telefon**: +90 212 xxx xxxx

## Davalar
1. [[case_2024_001]] - Devam ediyor
2. [[case_2024_123]] - Karar beklenecek

## Notlar
- Müşteri A tipi (önemli)
- Aylık raporlama ister
```

### Template 3: Legal Research

```markdown
---
type: legal_research
topic: "Sözleşme İhlali - Ticaret Kanunu"
date: 2024-04-23
relevantCases: 3
status: completed
tags: [research, contract, commerce_law]
---

# Legal Research: Sözleşme İhlali

## Yasal Çerçeve
- Türk Ticaret Kanunu Madde 49
- Borçlar Kanunu Madde 112

## Benzer Davalar
1. [[precedent_2023_001]] - Kazan
2. [[precedent_2023_456]] - Kaybet
3. [[precedent_2024_789]] - Kısmi kazan

## Sonuç
- %67 başarı oranı
- Ortalama süre: 18 ay
```

---

## 🔄 OBSIDIAN SYNC WORKFLOW (Günlük)

```
SABAH (09:00):
  └─ Obsidian açılır
  └─ Vault sync (otomatik)
  └─ PLMS'tan yeni notlar indirilir

GÜN İÇİNDE:
  ├─ Mahkeme gesi...
  ├─ Obsidian'da nota ekler: "Hâkim söyledi..."
  ├─ [[client_acme]] link ekler
  ├─ #2024 tag ekler
  └─ (Otomatik git push)

AKŞAM (18:00):
  └─ PLMS check
  └─ "Obsidian'da 3 yapılan değişiklik var"
  └─ PLMS database update
  └─ Graph yenilenir
  └─ Öneriler gösterilir: "Benzer dava buldum"

GECELEYİN:
  └─ Backup (Git + PLMS)
```

---

## 🚀 OBSIDIAN MVP TIMELINE

```
FAZE 1 (BU SABAH - ÖNCESİ):
  ❌ Obsidian entegrasyonu
  ✅ PLMS platform
  ✅ Agent'ler

FAZE 2 (AY 4-6):
  ✅ Obsidian kurulum talimatları
  ✅ Template'ler
  ✅ Plugin entegrasyonu
  ✅ Sync webhook
  ✅ Graph analysis

FAZE 3+ (AY 7+):
  ✅ Mobile sync (iPad)
  ✅ Advanced templates
  ✅ Team collaboration (Obsidian Sync)
  ✅ Custom plugins geliştirme
```

---

## 📊 OBSIDIAN AVANTAJLARI (PLMS için)

```
✅ LOCAL-FIRST
   → Tüm veriler bilgisayarında
   → İnternet yok da çalışır
   → Hızlı (bulut gecikmesi yok)

✅ OPEN FORMAT
   → Markdown = herkes okuyabilir
   → Lock-in yok
   → Bulk export kolay

✅ KNOWLEDGE GRAPH
   → Davalar otomatik linklenmiş
   → Benzer davaları bulma
   → Visual analysis

✅ PRIVACY
   → Hiçbir veri Obsidian'a gitmez
   → Synology gibi self-hosted kullanabilir
   → KVKK uyumlu

✅ PLUGIN ECO
   → 1000+ plugin
   → Custom automation
   → Integration flexibility

✅ OFFLINE-FIRST
   → Dışarıda çalışan avukat
   → Sessiz bölgelerde not tutuyor
   → Sync olduğunda senkronize
```

---

## 💡 ÖRNEK CASE: Obsidian Kullanılan Avukat

```
SABAH (Ofiste):
  1. PLMS'de tutanağı yükle
  2. PLMS otomatik → Obsidian markdown
  3. Obsidian'da not aç
  
ÖĞLEN (Dışarıda - Mahkeme):
  1. Obsidian iPad'de (offline)
  2. Duruşma notları yaz
  3. Tarafları [[client_acme]] olarak link et
  4. #mahkeme #urgent tag ekle
  
AKŞAM (Evde):
  1. iPad sync olur (WiFi)
  2. PLMS güncellenir
  3. Graph yenilenir
  4. "51 benzer dava buldum" öneri gelir
  5. PLMS raporu güncellenir
```

---

## 🎯 SONUÇ

**OBSİDİAN = PLMS'ın Knowledge Layer'ı**

```
PLMS = Backend (veri, otomatasyon, AI)
Obsidian = Frontend (insan-merkezi, bilgi grafiği)

İkisi birlikte:
- Avukat kendi notlarını tutuyor (Obsidian)
- PLMS onu organize ediyor + AI analiz yapıyor
- Sonuç: Daha hızlı, daha akıllı çalışma
```

---

*Obsidian Faze 2'de gelir, MVP'de zorunlu değil.* 📓
