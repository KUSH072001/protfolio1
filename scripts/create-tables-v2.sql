-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS email_notifications CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS portfolio_data CASCADE;

-- Create portfolio_data table to store all portfolio information
CREATE TABLE portfolio_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'krishna_deshmukh',
  profile JSONB NOT NULL DEFAULT '{}',
  skills JSONB NOT NULL DEFAULT '[]',
  projects JSONB NOT NULL DEFAULT '[]',
  contact JSONB NOT NULL DEFAULT '{}',
  cv JSONB NOT NULL DEFAULT '{}',
  stats JSONB NOT NULL DEFAULT '[]',
  highlights JSONB NOT NULL DEFAULT '[]',
  journey JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Create contact_messages table to store form submissions
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create email_notifications table to track sent emails
CREATE TABLE email_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_message_id UUID REFERENCES contact_messages(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_portfolio_data_user_id ON portfolio_data(user_id);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_email_notifications_status ON email_notifications(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for portfolio_data
CREATE TRIGGER update_portfolio_data_updated_at
    BEFORE UPDATE ON portfolio_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE portfolio_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed)
CREATE POLICY "Allow all operations on portfolio_data" ON portfolio_data FOR ALL USING (true);
CREATE POLICY "Allow all operations on contact_messages" ON contact_messages FOR ALL USING (true);
CREATE POLICY "Allow all operations on email_notifications" ON email_notifications FOR ALL USING (true);

-- Insert default portfolio data
INSERT INTO portfolio_data (
  user_id, 
  profile, 
  skills, 
  projects, 
  contact, 
  cv, 
  stats, 
  highlights, 
  journey
) VALUES (
  'krishna_deshmukh',
  '{
    "name": "Krishna Deshmukh",
    "title": "Java Full Stack Developer",
    "tagline": "I am a Fresher Java Full Stack Developer skilled in building scalable web applications with modern technologies.",
    "bio": "I am a passionate Fresher specializing in Java Full Stack Development. With a strong foundation in modern technologies, I am eager to contribute to innovative projects and grow in the tech industry.",
    "location": "Mumbai, India",
    "profileImage": "/placeholder.svg?height=320&width=320&text=Krishna+Deshmukh",
    "skills": ["Java", "Spring Boot", "React", "Node.js"],
    "tags": [
      {"text": "☕ Java Full Stack Developer", "gradientStart": "from-blue-400", "gradientEnd": "to-green-400"},
      {"text": "🚀 Spring Boot Expert", "gradientStart": "from-green-400", "gradientEnd": "to-blue-400"},
      {"text": "⚛️ React Developer", "gradientStart": "from-blue-400", "gradientEnd": "to-purple-400"},
      {"text": "🌟 Fresher & Eager to Learn", "gradientStart": "from-purple-400", "gradientEnd": "to-blue-400"}
    ]
  }'::jsonb,
  '[
    {"id": "1", "name": "Java", "level": 85, "icon": "☕", "category": "Programming"},
    {"id": "2", "name": "Spring Boot", "level": 80, "icon": "🍃", "category": "Framework"},
    {"id": "3", "name": "Data JPA", "level": 75, "icon": "🗄️", "category": "Framework"},
    {"id": "4", "name": "React", "level": 85, "icon": "⚛️", "category": "Frontend"},
    {"id": "5", "name": "Node.js", "level": 75, "icon": "🟢", "category": "Backend"}
  ]'::jsonb,
  '[
    {
      "id": "1",
      "title": "Real Estate Project",
      "description": "A comprehensive real estate platform with property listings, search functionality, and user management built with modern full-stack technologies.",
      "image": "/placeholder.svg?height=400&width=600&text=Real+Estate+Platform",
      "technologies": ["Java", "Spring Boot", "React", "MongoDB", "Tailwind CSS"],
      "demoUrl": "#",
      "codeUrl": "#",
      "featured": true,
      "category": "Full Stack",
      "stats": {"stars": 45, "views": "1.2k"}
    },
    {
      "id": "2",
      "title": "React To-Do App with Animation",
      "description": "An interactive to-do application featuring smooth animations, drag-and-drop functionality, and local storage persistence.",
      "image": "/placeholder.svg?height=400&width=600&text=Animated+Todo+App",
      "technologies": ["React", "Framer Motion", "JavaScript", "CSS3", "Local Storage"],
      "demoUrl": "#",
      "codeUrl": "#",
      "featured": true,
      "category": "Frontend",
      "stats": {"stars": 32, "views": "890"}
    }
  ]'::jsonb,
  '{
    "email": "krishnadesh2001@gmail.com",
    "phone": "+91 98765 43210",
    "location": "Mumbai, India",
    "github": "https://github.com/krishnadeshmukh",
    "linkedin": "https://linkedin.com/in/krishnadeshmukh",
    "githubUsername": "@krishnadeshmukh",
    "linkedinName": "Krishna Deshmukh"
  }'::jsonb,
  '{
    "file": null,
    "url": "",
    "buttonText": "Download Resume",
    "showInHero": true,
    "showInContact": true
  }'::jsonb,
  '[
    {"value": "5+", "label": "Projects Built", "color": "from-yellow-400 to-orange-400"},
    {"value": "Fresher", "label": "Experience Level", "color": "from-green-400 to-emerald-400"},
    {"value": "Open", "label": "To Opportunities", "color": "from-blue-400 to-cyan-400"},
    {"value": "100%", "label": "Dedication", "color": "from-purple-400 to-pink-400"}
  ]'::jsonb,
  '[
    {"title": "Problem Solving", "description": "Strong analytical and debugging skills"},
    {"title": "Adaptability", "description": "Quick to learn new technologies"},
    {"title": "Goal Oriented", "description": "Focused on delivering quality solutions"},
    {"title": "Continuous Learning", "description": "Always expanding my knowledge base"}
  ]'::jsonb,
  '[
    {"phase": "Learning Phase", "description": "Mastered Java fundamentals and OOP concepts", "icon": "📚"},
    {"phase": "Framework Exploration", "description": "Dove deep into Spring Boot and React", "icon": "🔧"},
    {"phase": "Project Building", "description": "Created full-stack applications", "icon": "🚀"},
    {"phase": "Ready for Industry", "description": "Seeking opportunities to apply my skills", "icon": "💼"}
  ]'::jsonb
) ON CONFLICT (user_id) DO UPDATE SET
  profile = EXCLUDED.profile,
  skills = EXCLUDED.skills,
  projects = EXCLUDED.projects,
  contact = EXCLUDED.contact,
  cv = EXCLUDED.cv,
  stats = EXCLUDED.stats,
  highlights = EXCLUDED.highlights,
  journey = EXCLUDED.journey,
  updated_at = TIMEZONE('utc'::text, NOW());
