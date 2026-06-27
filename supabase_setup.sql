-- 0. Drop existing tables to fix camelCase column names
DROP TABLE IF EXISTS public.profile CASCADE;
DROP TABLE IF EXISTS public.skills CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.certificates CASCADE;
DROP TABLE IF EXISTS public.contact CASCADE;

-- 1. Create tables with exact camelCase column names

CREATE TABLE public.profile (
    "id" TEXT PRIMARY KEY DEFAULT '1',
    "greeting" TEXT,
    "name" TEXT,
    "subtitle" TEXT,
    "shortIntro" TEXT,
    "typingWords" TEXT[],
    "resumeUrl" TEXT,
    "profilePhotoUrl" TEXT,
    "description" TEXT,
    "education" TEXT,
    "careerGoal" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "location" TEXT,
    "siteName" TEXT,
    "theme" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "socialLinks" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.skills (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER DEFAULT 0,
    "isVisible" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.projects (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "featuredImage" TEXT,
    "images" TEXT[],
    "githubUrl" TEXT,
    "liveUrl" TEXT,
    "techStack" TEXT[],
    "category" TEXT,
    "status" TEXT,
    "order" INTEGER DEFAULT 0,
    "isVisible" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.certificates (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "issuer" TEXT,
    "date" TEXT,
    "imageUrl" TEXT,
    "credentialUrl" TEXT,
    "order" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.contact (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "read" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Configure Row Level Security (RLS)

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact ENABLE ROW LEVEL SECURITY;

-- Allow public read access to portfolio content
CREATE POLICY "Public profiles are viewable by everyone" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Public skills are viewable by everyone" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public certificates are viewable by everyone" ON public.certificates FOR SELECT USING (true);

-- Allow public to insert contact messages
CREATE POLICY "Anyone can submit a contact message" ON public.contact FOR INSERT WITH CHECK (true);

-- Allow authenticated users (admin) full access to all tables
CREATE POLICY "Admin full access profile" ON public.profile FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access skills" ON public.skills FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access projects" ON public.projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access certificates" ON public.certificates FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access contact" ON public.contact FOR ALL TO authenticated USING (true);
