# 🚀 DEPLOYMENT ORTAMI + BU SABAH CHECKLIST
## Alper'in PLMS'ı Canlıya Çıkarma Rehberi

---

## 📍 DEPLOYMENT ORTAMI SEÇİMİ

### SEÇENEKLER vs TAVSIYEM

```
SEÇENEK 1: Türkiye-Only
├─ Database: Supabase Turkey
├─ Backend: Scaleway Istanbul
├─ Frontend: Vercel
└─ Avantaj: Düşük latency, KVKK uyumlu
   Dezavantaj: Küçük ekosistem

SEÇENEK 2: Hybrid (TAVSİYE) ✅
├─ Database: Supabase (Frankfurt = EU)
│   └─ Fallback: Scaleway Amsterdam
├─ Backend: Render.com Frankfurt
├─ Frontend: Vercel Global CDN
├─ Files: Cloudflare R2
├─ Vector DB: Pinecone (EU)
└─ Avantaj: Hızlı, KVKK uyumlu, ölçeklenebilir

SEÇENEK 3: Global
├─ Database: AWS (multi-region)
├─ Backend: Any cloud
└─ Dezavantaj: Masraflı, karmaşık
```

### TAVSIYE EDEN: HYBRID (SEÇENEK 2)

**Neden?**
- Türkiye'ye yakın (Frankfurt = 1000 km)
- KVKK uyumlu
- Ölçeklenebilir
- Ucuz ($90-500/month)
- Startup-friendly

---

## 🔐 KVKK COMPLIANCE CHECKLIST

```
✅ Veri Residency
   └─ Database = EU (Frankfurt)
   └─ Türkiye'den yönetimi mümkün

✅ Encryption
   └─ TLS 1.3 (data in transit)
   └─ AES-256 (data at rest)

✅ Access Control
   └─ Role-based access (RBAC)
   └─ User isolation
   └─ Audit logging

✅ Data Rights
   └─ Export (JSON/CSV)
   └─ Deletion (RTBF)
   └─ Portability

✅ Agreements
   └─ Privacy Policy (TR + EN)
   └─ DPA (Data Processing Agreement)
   └─ ToS (Şartlar ve Koşullar)

✅ Notifications
   └─ Breach notification (72 saat içinde)
   └─ User consent
```

---

## 💰 COST BREAKDOWN

### MVP Bütçesi (Ay 1-6, 500 user)

```
┌─────────────────────────────────────┐
│     PRODUCTION STACK COSTS          │
├─────────────────────────────────────┤
│                                     │
│ VERCEL (Frontend)                  │
│   Hobby: FREE                       │
│   Pro: $20/month                    │
│   ├─ SSL/TLS: ✅ Free              │
│   ├─ CDN: ✅ Global                │
│   └─ Auto-deploy: ✅ GitHub        │
│                                     │
│ RENDER.COM (Backend)               │
│   Starter: ₺500/month              │
│   ├─ Memory: 512MB                 │
│   ├─ Auto-scaling: ✅              │
│   └─ Background workers: ✅         │
│                                     │
│ SUPABASE (Database)                │
│   Free: ₺0 (50 MB)                 │
│   Pro: ₺500/month (10 GB)          │
│   ├─ PostgreSQL: ✅                │
│   ├─ Real-time: ✅                 │
│   ├─ REST API: ✅                  │
│   └─ Auth: ✅                      │
│                                     │
│ CLOUDFLARE R2 (File Storage)       │
│   Standard: ₺300/month             │
│   ├─ 10 GB storage: ₺500           │
│   ├─ Egress: FREE (Cloudflare edge)│
│   └─ Global CDN: ✅                │
│                                     │
│ PINECONE (Vector DB)               │
│   Starter: ₺200/month              │
│   ├─ 1M vectors                    │
│   ├─ 3k requests/day               │
│   └─ EU region                     │
│                                     │
│ SENDGRID (Email)                   │
│   Free: 100 emails/day             │
│   Paid: ₺200/month (10k/day)      │
│                                     │
│ MONITORING (Sentry + LogTail)      │
│   ₺200/month                       │
│   ├─ Error tracking                │
│   └─ Performance monitoring        │
│                                     │
│ GIT (GitHub)                       │
│   FREE (Public or Private)         │
│   └─ Unlimited repos               │
│                                     │
├─────────────────────────────────────┤
│ TOPLAM: ₺2900/month (~€90)         │
│                                     │
│ Per user: ₺5.80/month (500 users) │
└─────────────────────────────────────┘
```

### Growth Bütçesi (Ay 7-12, 5000 user)

```
├─────────────────────────────────────┤
│ Vercel Pro:         ₺500            │
│ Render Pro:         ₺3000           │
│ Supabase Pro+:      ₺2500           │
│ Cloudflare R2:      ₺1500           │
│ Pinecone Growth:    ₺1000           │
│ Monitoring:         ₺500            │
│ SendGrid:           ₺500            │
├─────────────────────────────────────┤
│ TOPLAM: ₺10,000/month (~€300)      │
│                                     │
│ Per user: ₺2.00/month (5000 users)│
└─────────────────────────────────────┘
```

---

## 📋 BU SABAH CHECKLIST (TAMAMLANMIŞ)

### ✅ ÖN ADIMLAR (08:00-09:00)

```
[ ] 1. GitHub Account Check
      ├─ https://github.com/login
      ├─ Account var mı?
      └─ SSH key setup
      
      Eğer yoksa:
      ├─ https://github.com/signup
      ├─ Email: alper@xxx.com
      ├─ Username: alper-gokce
      └─ SSH key oluştur (5 dakika)

[ ] 2. Gerekli Tools
      ├─ Git (https://git-scm.com) - Kurulu mu?
      │  Test: git --version
      ├─ Node.js 20 LTS (https://nodejs.org)
      │  Test: node --version (v20+)
      ├─ npm / pnpm
      │  Test: npm --version
      └─ Docker (optional, local DB için)
         Test: docker --version

[ ] 3. IDE Setup
      ├─ VS Code (https://code.visualstudio.com)
      │  Extensions:
      │  ├─ ESLint
      │  ├─ Prettier
      │  ├─ Prisma
      │  ├─ REST Client
      │  └─ Thunder Client (API testing)
      └─ Terminal (iTerm2 Mac / PowerShell Windows)

[ ] 4. Account Creation (Deployment)
      ├─ Supabase (https://supabase.com)
      │  └─ Henüz giriş yapma
      ├─ Vercel (https://vercel.com)
      │  └─ Henüz giriş yapma
      ├─ Render.com (https://render.com)
      │  └─ Henüz giriş yapma
      └─ Cloudflare (https://cloudflare.com)
         └─ Henüz giriş yapma
```

---

### 🔴 ADIM 1: GITHUB (09:00-09:15)

```bash
# 1. GitHub Organization oluştur
# Browser: github.com → Settings → Organizations → New organization
# Organization name: plms-io
# Billing: Free
# ✅ Create organization

# 2. GitHub'da SSH key setup (ilk sefer)
# Terminal:
ssh-keygen -t ed25519 -C "alper@email.com"
# → ~/.ssh/id_ed25519 oluşacak

# 3. SSH key'i GitHub'a ekle
cat ~/.ssh/id_ed25519.pub
# Kopyala → GitHub Settings → SSH Keys → New SSH key
# ✅ Save

# 4. SSH test
ssh -T git@github.com
# "Hi alper-gokce! You've successfully authenticated." çıkmalı

# 5. Repo oluştur
# Browser: github.com/plms-io → New repository
# Repo name: plms
# Description: Professional Life Management System
# Visibility: Private
# Initialize: ✅ Add README.md
# ✅ Create repository

# 6. Local'de clone
cd ~/Projects
git clone git@github.com:plms-io/plms.git
cd plms
```

**CHECKPOINTS:**
```
✅ Organization oluştu: github.com/plms-io
✅ Repo oluştu: github.com/plms-io/plms
✅ Local clone: ~/Projects/plms/
✅ Git working: git status (Clean)
```

---

### 🔴 ADIM 2: MONOREPO SETUP (09:15-09:45)

```bash
# İçinde: ~/Projects/plms/

# 1. pnpm kurulumu
npm install -g pnpm
pnpm --version

# 2. Package.json (root)
cat > package.json << 'PKGJSON'
{
  "name": "plms",
  "version": "0.1.0",
  "description": "Professional Life Management System",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "pnpm -r run dev",
    "build": "pnpm -r run build",
    "test": "pnpm -r run test",
    "lint": "pnpm -r run lint"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "prettier": "^3.0.0",
    "eslint": "^8.0.0"
  }
}
PKGJSON

# 3. Klasör yapısı
mkdir -p apps/web apps/api
mkdir -p packages/{database,agents,shared,ui}
mkdir -p docs

# 4. .gitignore
cat > .gitignore << 'GITIGNORE'
node_modules
dist
build
.env
.env.local
.env.*.local
*.log
.DS_Store
.vscode
.idea
.env.*.example
GITIGNORE

# 5. README
cat > README.md << 'README'
# PLMS - Professional Life Management System

Multi-agent AI sistem avukatlar, doktorlar, mimarlar ve danışmanlar için.

## Tech Stack
- Frontend: Next.js 14
- Backend: Express.js
- Database: PostgreSQL (Supabase)
- AI: Claude 3.5 Sonnet

## Kurulum

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

## Servers
- Web: http://localhost:3000
- API: http://localhost:4000
- DB Studio: http://localhost:5555
README

# 6. Git commit
git add .
git commit -m "chore: initial monorepo structure"
git push origin main
```

**CHECKPOINTS:**
```
✅ pnpm çalışıyor: pnpm -v
✅ Klasörler var: ls -la apps/ packages/
✅ GitHub senkron: git log (commit görünüyor)
```

---

### 🔴 ADIM 3: APPS SETUP (09:45-10:30)

#### A) FRONTEND (Next.js)

```bash
# apps/web'e gir
cd apps/web

# Next.js oluştur
pnpm create next-app@latest . --typescript --tailwind --eslint

# package.json kontrol
cat package.json | grep -A 5 "scripts"

# Test çalıştır
pnpm install
pnpm dev
# → http://localhost:3000 açıl
```

#### B) BACKEND (Express)

```bash
# apps/api'ye gir
cd apps/api

# package.json oluştur
cat > package.json << 'PKGJSON'
{
  "name": "plms-api",
  "version": "0.1.0",
  "main": "src/index.ts",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "@prisma/client": "^5.0.0",
    "jsonwebtoken": "^9.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.17",
    "tsx": "^3.14.0"
  }
}
PKGJSON

# TypeScript config
cat > tsconfig.json << 'TSCONFIG'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
TSCONFIG

# src/index.ts
mkdir -p src
cat > src/index.ts << 'SERVER'
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ API server çalışıyor: http://localhost:${PORT}`);
});
SERVER

# Dependencies install
pnpm install

# Test çalıştır
pnpm dev
# → Terminal: "✅ API server çalışıyor: http://localhost:4000"
```

#### C) DATABASE (Prisma)

```bash
# packages/database'ye gir
cd packages/database

# package.json
cat > package.json << 'PKGJSON'
{
  "name": "plms-database",
  "version": "0.1.0",
  "scripts": {
    "migrate": "prisma migrate dev",
    "studio": "prisma studio",
    "seed": "node prisma/seed.js"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "prisma": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
PKGJSON

# Prisma init
pnpm install

# .env.example
cat > .env.example << 'ENV'
DATABASE_URL="postgresql://user:password@localhost:5432/plms"
ENV

# Prisma schema (büyük)
mkdir -p prisma
# → SKILL-04'teki schema.prisma dosyasını kopyala
# Henüz Supabase URL olmadığı için burada duracak
```

**CHECKPOINTS:**
```
✅ Next.js çalışıyor: http://localhost:3000
✅ Express çalışıyor: http://localhost:4000/api/health
✅ Prisma setup: prisma --version
```

---

### 🟠 ADIM 4: SUPABASE SETUP (10:30-11:00)

```bash
# 1. https://supabase.com → Sign Up (GitHub ile)

# 2. New Project oluştur
# Project name: plms
# Region: Istanbul, Turkey
# Password: [STRONG PASSWORD]
# ✅ Create new project

# 3. Database bağlantı bilgileri al
# Supabase → Settings → Database
# Connection string:
# postgresql://postgres.xxxxx:password@db.xxxxx.supabase.co:5432/postgres

# 4. .env.local oluştur
# packages/database/.env.local

cat > packages/database/.env.local << 'ENVFILE'
DATABASE_URL="postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres?schema=public"
ENVFILE

# 5. Prisma migrate
cd packages/database
pnpm migrate
# → Schema oluşacak (tables)

# 6. Prisma Studio
pnpm studio
# → http://localhost:5555 açılacak
```

**CHECKPOINTS:**
```
✅ Supabase bağlı: DATABASE_URL çalışıyor
✅ Tables oluştu: Prisma Studio'da görünüyor
```

---

### 🟠 ADIM 5: GIT COMMIT & PUSH (11:00-11:15)

```bash
# Root'a dön
cd ~/Projects/plms

# Tüm değişiklikleri ekle
git add .

# Commit
git commit -m "feat: monorepo setup with Next.js, Express, Prisma"

# Push
git push origin main

# Kontrol
git log --oneline (2 commit görmeli)
```

---

### 🟡 ADIM 6: DEPLOYMENT ACCOUNTS (11:15-12:00)

Henüz **gerçek deployment yapılmayacak**, ama account'lar ready olacak:

#### Vercel (Frontend)

```bash
# 1. https://vercel.com → Sign Up (GitHub ile)

# 2. Connect GitHub
# ✅ plms-io/plms repo'yu seç

# 3. Settings
# Framework: Next.js
# Root Directory: apps/web
# Environment: Production
# (Deploy edeceksin ama commit ettikten sonra)
```

#### Render.com (Backend)

```bash
# 1. https://render.com → Sign Up

# 2. New Service
# Repository: plms-io/plms
# Root Dir: apps/api
# Build: npm run build
# Start: node dist/index.js
# (Deploy edeceksin ama sonra)
```

#### Cloudflare R2 (Files)

```bash
# 1. https://cloudflare.com → Sign Up

# 2. R2 Bucket oluştur
# Name: plms-files
# Region: Automatic
```

**CHECKPOINTS:**
```
✅ Vercel account: Dashboard açılıyor
✅ Render account: Dashboard açılıyor
✅ Cloudflare account: Dashboard açılıyor
```

---

## ✅ SABAH SONU KONTROL LİSTESİ

```
09:00-09:15
  ✅ GitHub Organization + Repo
  ✅ SSH setup
  ✅ Local clone

09:15-09:45
  ✅ pnpm workspace
  ✅ README + gitignore
  ✅ Initial commit

09:45-10:30
  ✅ Next.js (apps/web)
  ✅ Express (apps/api)
  ✅ Prisma (packages/database)
  ✅ 3 server çalışıyor

10:30-11:00
  ✅ Supabase account
  ✅ Database URL
  ✅ Prisma migrate
  ✅ Studio (localhost:5555)

11:00-11:15
  ✅ Git commit + push
  ✅ GitHub check

11:15-12:00
  ✅ Vercel connect
  ✅ Render connect
  ✅ Cloudflare setup

12:00
  ✅ SAB AH BİTTİ
  
SONUÇLAR:
  ✅ 3 localhost server çalışıyor
  ✅ Database ready
  ✅ GitHub repo senkron
  ✅ Deployment platforms ready
  ✅ İlk commit: "feat: initial setup"
```

---

## 🚀 SONRAKI ADIMLAR (BU GECE 18:00+)

```
[ ] AUTH SYSTEM
    ├─ POST /api/auth/register
    ├─ POST /api/auth/login
    ├─ POST /api/auth/logout
    └─ Frontend login page

[ ] DASHBOARD
    ├─ Case list
    ├─ Recent entries
    └─ Next hearings

[ ] CASE DETAIL
    ├─ Case info
    ├─ Entries list
    └─ Action buttons
```

---

## 🎯 HATA OLUŞURSA?

### Common Issues

```
❌ "git: command not found"
   → https://git-scm.com download et

❌ "pnpm: command not found"
   → npm install -g pnpm

❌ "node_modules error"
   → rm -rf node_modules && pnpm install

❌ "Port 3000 already in use"
   → lsof -i :3000 (Mac)
   → netstat -ano | findstr :3000 (Windows)
   → Kill process yada farklı port kullan

❌ "Supabase bağlantı hatası"
   → CONNECTION STRING kontrol et
   → .env.local dosyasında var mı?
   → DATABASE_URL doğru mu?

❌ "Prisma migrate error"
   → pnpm prisma migrate reset (tüm veriyi sil)
   → pnpm migrate fresh start
```

---

*Bu sabah 12:30'de tamamlanırsa, bu gece 18:00'de Auth başlatabilirsin!* 🚀
