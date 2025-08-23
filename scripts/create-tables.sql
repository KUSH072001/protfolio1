-- Create portfolio_data table to store all portfolio information
CREATE TABLE IF NOT EXISTS portfolio_data (
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create contact_messages table to store form submissions
CREATE TABLE IF NOT EXISTS contact_messages (
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
CREATE TABLE IF NOT EXISTS email_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_message_id UUID REFERENCES contact_messages(id),
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_data_user_id ON portfolio_data(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON email_notifications(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for portfolio_data
DROP TRIGGER IF EXISTS update_portfolio_data_updated_at ON portfolio_data;
CREATE TRIGGER update_portfolio_data_updated_at
    BEFORE UPDATE ON portfolio_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default portfolio data
INSERT INTO portfolio_data (user_id, profile, skills, projects, contact, cv, stats, highlights, journey)
VALUES (
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
  }',
  '[
    {"id": "1", "name": "Java", "level": 85, "icon": "☕", "category": "Programming"},
    {"id": "2", "name": "Spring Boot", "level": 80, "icon": "🍃", "category": "Framework"},
    {"id": "3", "name": "React", "level": 85, "icon": "⚛️", "category": "Frontend"},
    {"id": "4", "name": "Node.js", "level": 75, "icon": "🟢", "category": "Backend"}
  ]',
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
    }
  ]',
  '{
    "email": "krishnadesh2001@gmail.com",
    "phone": "+91 98765 43210",
    "location": "Mumbai, India",
    "github": "https://github.com/krishnadeshmukh",
    "linkedin": "https://linkedin.com/in/krishnadeshmukh",
    "githubUsername": "@krishnadeshmukh",
    "linkedinName": "Krishna Deshmukh"
  }',
  '{
    "file": null,
    "url": "",
    "buttonText": "Download Resume",
    "showInHero": true,
    "showInContact": true
  }',
  '[
    {"value": "5+", "label": "Projects Built", "color": "from-yellow-400 to-orange-400"},
    {"value": "Fresher", "label": "Experience Level", "color": "from-green-400 to-emerald-400"}
  ]',
  '[
    {"title": "Problem Solving", "description": "Strong analytical and debugging skills"},
    {"title": "Adaptability", "description": "Quick to learn new technologies"}
  ]',
  '[
    {"phase": "Learning Phase", "description": "Mastered Java fundamentals and OOP concepts", "icon": "📚"},
    {"phase": "Framework Exploration", "description": "Dove deep into Spring Boot and React", "icon": "🔧"}
  ]'
)
ON CONFLICT (user_id) DO NOTHING;
