
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role TEXT NOT NULL,
    name TEXT,
    email TEXT UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Disciplines Table
CREATE TABLE IF NOT EXISTS disciplines (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    icon_name TEXT,
    color TEXT,
    light_color TEXT,
    text_color TEXT
);

-- 3. Banners Table
CREATE TABLE IF NOT EXISTS banners (
    id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    tag TEXT,
    title TEXT,
    button_text TEXT,
    color_gradient TEXT
);

-- 4. Featured Players Table
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    image_url TEXT
);

-- 5. News Table
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT,
    tag TEXT,
    source TEXT,
    time_ago TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Clubs Table
CREATE TABLE IF NOT EXISTS clubs (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    image_url TEXT,
    description TEXT,
    location TEXT,
    rating DECIMAL(3,2),
    phone TEXT,
    email TEXT,
    website TEXT
);

-- 7. Club Disciplines (Many-to-Many)
CREATE TABLE IF NOT EXISTS club_disciplines (
    club_id TEXT REFERENCES clubs(id) ON DELETE CASCADE,
    discipline_id TEXT REFERENCES disciplines(id) ON DELETE CASCADE,
    PRIMARY KEY (club_id, discipline_id)
);

-- 8. Coaches Table
CREATE TABLE IF NOT EXISTS coaches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT, -- Redundant but useful for mock data
    image_url TEXT,
    role TEXT,
    specialty TEXT,
    experience TEXT,
    bio TEXT,
    phone TEXT,
    email TEXT,
    affiliation TEXT,
    rating DECIMAL(3,2) DEFAULT 5.0
);

-- 9. Shorts Table
CREATE TABLE IF NOT EXISTS shorts (
    id SERIAL PRIMARY KEY,
    title TEXT,
    author_handle TEXT,
    video_url TEXT,
    role_category TEXT -- To filter by athlete, coach, etc.
);

-- 10. Athletes Table
CREATE TABLE IF NOT EXISTS athletes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT,
    age INTEGER,
    school TEXT,
    sport_id TEXT REFERENCES disciplines(id),
    position TEXT,
    jersey_number TEXT,
    height TEXT,
    weight TEXT,
    overall_score INTEGER,
    bio TEXT,
    medical_info TEXT,
    academic_level TEXT,
    allow_donations BOOLEAN DEFAULT FALSE,
    wallet_info TEXT,
    fundraising_desc TEXT,
    balance DECIMAL(12,2) DEFAULT 0.0
);

-- 11. Athlete Metrics
CREATE TABLE IF NOT EXISTS athlete_metrics (
    id SERIAL PRIMARY KEY,
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    label TEXT,
    value INTEGER,
    color TEXT
);

-- 12. Athlete Score History
CREATE TABLE IF NOT EXISTS athlete_score_history (
    id SERIAL PRIMARY KEY,
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    score INTEGER,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Challenges Table
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    coach_id UUID REFERENCES coaches(id),
    difficulty TEXT,
    xp INTEGER,
    deadline TEXT,
    status TEXT DEFAULT 'pending',
    type TEXT,
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE
);

-- 14. Athlete Videos Table
CREATE TABLE IF NOT EXISTS athlete_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT,
    date_label TEXT,
    description TEXT,
    views TEXT DEFAULT '0',
    likes TEXT DEFAULT '0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Video Metrics (AI Analysis)
CREATE TABLE IF NOT EXISTS video_metrics (
    id SERIAL PRIMARY KEY,
    video_id UUID REFERENCES athlete_videos(id) ON DELETE CASCADE,
    speed INTEGER,
    technique INTEGER,
    power INTEGER,
    feedback TEXT
);

-- 16. Wallet Transactions
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id SERIAL PRIMARY KEY,
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    concept TEXT,
    date_label TEXT,
    amount DECIMAL(12,2)
);

-- 17. Coach Tasks
CREATE TABLE IF NOT EXISTS coach_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    title TEXT,
    description TEXT,
    deadline TEXT,
    type TEXT,
    status TEXT DEFAULT 'active'
);

-- 18. Task Assignments
CREATE TABLE IF NOT EXISTS task_assignments (
    task_id UUID REFERENCES coach_tasks(id) ON DELETE CASCADE,
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, athlete_id)
);

-- 19. Coach Events
CREATE TABLE IF NOT EXISTS coach_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    title TEXT,
    type TEXT,
    date_label TEXT,
    time_label TEXT,
    location TEXT,
    notify_parents BOOLEAN DEFAULT TRUE,
    published BOOLEAN DEFAULT TRUE
);

-- 20. Event Confirmations
CREATE TABLE IF NOT EXISTS event_confirmations (
    event_id UUID REFERENCES coach_events(id) ON DELETE CASCADE,
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, athlete_id)
);

-- POPULATE MOCK DATA

-- Disciplines
INSERT INTO disciplines (id, label, icon_name, color, light_color, text_color) VALUES
('futbol', 'Futbol', 'Zap', 'bg-emerald-500', 'bg-emerald-50', 'text-emerald-600'),
('beisbol', 'Beisbol', 'Target', 'bg-red-500', 'bg-red-50', 'text-red-600'),
('baloncesto', 'Baloncesto', 'Dribbble', 'bg-orange-500', 'bg-orange-50', 'text-orange-600'),
('natacion', 'Natacion', 'Waves', 'bg-blue-500', 'bg-blue-50', 'text-blue-600'),
('tenis', 'Tenis', 'Activity', 'bg-lime-500', 'bg-lime-50', 'text-lime-600'),
('voleybol', 'Voleybol', 'CircleDot', 'bg-amber-500', 'bg-amber-50', 'text-amber-600'),
('karate', 'Karate', 'Shield', 'bg-slate-800', 'bg-slate-100', 'text-slate-800')
ON CONFLICT (id) DO NOTHING;

-- Banners
INSERT INTO banners (image_url, tag, title, button_text, color_gradient) VALUES
('https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1000&auto=format&fit=crop', 'Oferta Exclusiva', 'Mejora tu equipo hoy mismo', 'Ver Tienda', 'from-emerald-600/90'),
('https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000&auto=format&fit=crop', 'Próximo Torneo', 'Inscríbete en la Copa Lutu 2024', 'Registrarse', 'from-blue-600/90'),
('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop', 'Lutu Pro', 'Análisis de video IA avanzado', 'Pruébalo', 'from-slate-900/90');

-- Players
INSERT INTO players (name, rating, image_url) VALUES
('Alex Rivera', 5, 'https://i.pravatar.cc/150?u=alex'),
('Sara Miller', 4, 'https://i.pravatar.cc/150?u=sara'),
('Marco Polo', 5, 'https://i.pravatar.cc/150?u=marco'),
('Elena G.', 4, 'https://i.pravatar.cc/150?u=elena'),
('Chris K.', 5, 'https://i.pravatar.cc/150?u=chris');

-- News
INSERT INTO news (title, image_url, tag, source, time_ago, content) VALUES
('Dominicana brilla en los Juegos Panamericanos 2024', 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?q=80&w=800&auto=format&fit=crop', 'Nacional', 'Lutu News', 'Hace 2h', 'Nuestros atletas han logrado un récord histórico de medallas en la última jornada, destacando en atletismo y pesas. La delegación dominicana se posiciona como una de las potencias emergentes del continente, sumando 12 medallas de oro en disciplinas clave.'),
('Nuevas becas para jóvenes talentos del béisbol dominicano', 'https://images.unsplash.com/photo-1544045020-8466bb54070a?q=80&w=800&auto=format&fit=crop', 'Oportunidad', 'Lutu Pro', 'Hace 5h', 'Se abre el proceso de selección para el programa de formación de élite "Diamantes del Caribe" patrocinado por Lutu. Los jóvenes seleccionados recibirán entrenamiento de primer nivel, nutrición personalizada y seguimiento académico integral para asegurar su éxito dentro y fuera del diamante.'),
('El impacto de la IA en el entrenamiento deportivo juvenil', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop', 'Tech', 'Lutu Lab', 'Ayer', 'Análisis de cómo los dispositivos wearables y el análisis de video por IA están cambiando la forma en que los entrenadores miden el rendimiento. La tecnología ahora permite identificar fatiga antes de las lesiones y optimizar los ángulos de tiro con una precisión milimétrica.'),
('Gran Final Intercolegial: Baloncesto U-17', 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800&auto=format&fit=crop', 'Eventos', 'Lutu Events', 'Hace 1d', 'El Palacio de los Deportes se prepara para recibir a los mejores equipos escolares del país. La final promete ser un duelo de estrategias donde la velocidad y el juego en equipo serán los protagonistas. ¡Entradas disponibles ya en la app!');

-- Clubs
INSERT INTO clubs (id, name, image_url, description, location, rating, phone, email, website) VALUES
('c1', 'Club Deportivo Los Prados', 'https://images.unsplash.com/photo-1562771242-a02d9090c90c?q=80&w=800&auto=format&fit=crop', 'Formando campeones desde 1995. Especialistas en desarrollo juvenil integral.', 'Av. Charles Sumner, Santo Domingo', 4.8, '+1 (809) 555-0123', 'info@losprados.club', 'www.losprados.club'),
('c2', 'Academia de Béisbol Estrellas', 'https://images.unsplash.com/photo-1587280501635-68a6e82cd7db?q=80&w=800&auto=format&fit=crop', 'El camino a las grandes ligas comienza aquí. Entrenamiento profesional.', 'Estadio Quisqueya, Santo Domingo', 4.9, '+1 (809) 555-0199', 'scout@estrellas.com', 'www.estrellasacademy.com'),
('c3', 'Centro de Tenis Elite', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop', 'Canchas de arcilla y dura. Programas para todas las edades.', 'Parque Mirador Sur', 4.7, '+1 (809) 555-0344', 'contact@elitetennis.do', 'www.elitetennis.do');

-- Club Disciplines
INSERT INTO club_disciplines (club_id, discipline_id) VALUES
('c1', 'futbol'), ('c1', 'baloncesto'), ('c1', 'natacion'),
('c2', 'beisbol'),
('c3', 'tenis');

-- Coaches
INSERT INTO coaches (id, name, image_url, role, specialty, experience, bio, phone, email, rating, affiliation) VALUES
('00000000-0000-0000-0000-000000000001', 'Coach Mike Johnson', 'https://i.pravatar.cc/150?u=mike', 'Entrenador Principal - Futbol', 'Táctica y Condición Física', '10 años', 'Ex-jugador profesional con 10 años de experiencia entrenando juveniles.', '+1 (829) 555-9988', 'mike.coach@lutu.com', 5.0, 'Club Deportivo Los Prados'),
('00000000-0000-0000-0000-000000000002', 'Sarah Williams', 'https://i.pravatar.cc/150?u=sarah', 'Entrenadora de Natación', 'Estilo Libre y Mariposa', 'Medallista olímpica', 'Medallista olímpica dedicada a enseñar la técnica perfecta.', '+1 (829) 555-7766', 'sarah.swim@lutu.com', 4.9, 'Club Deportivo Los Prados'),
('00000000-0000-0000-0000-000000000003', 'Carlos Rodriguez', 'https://i.pravatar.cc/150?u=carlos', 'Coach de Bateo', 'Bateo y Fildeo', 'Biomecánica', 'Especialista en biomecánica del swing y potencia.', '+1 (829) 555-4433', 'carlos.baseball@lutu.com', 4.8, 'Academia de Béisbol Estrellas');

-- Shorts
INSERT INTO shorts (title, author_handle, video_url, role_category) VALUES
('Dominio de Balón Pro', '@atleta_lutu', 'https://assets.mixkit.co/videos/preview/mixkit-basketball-player-dribbling-the-ball-4530-large.mp4', 'Atleta'),
('Rutina de Core Explosivo', '@train_hard', 'https://assets.mixkit.co/videos/preview/mixkit-man-doing-abs-exercises-on-mat-22524-large.mp4', 'Atleta'),
('Estrategia Defensiva', '@coach_master', 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-the-ball-in-the-field-22521-large.mp4', 'Entrenador');

-- Athletes (Lucas and Sofia)
INSERT INTO athletes (id, name, age, school, sport_id, position, jersey_number, height, weight, overall_score, bio, allow_donations, wallet_info, fundraising_desc, balance) VALUES
('00000000-0000-0000-0000-000000000101', 'Lucas Rivera', 12, 'San Judas Tadeo', 'futbol', 'Delantero', '10', '152', '95', 88, 'Apasionado por el fútbol, juega de delantero.', TRUE, 'LutuWallet-123', 'Para torneo internacional', 450.50),
('00000000-0000-0000-0000-000000000102', 'Sofia Rivera', 15, 'San Judas Tadeo', 'voleybol', 'Libero', '5', '165', '110', 91, 'Capitana del equipo escolar.', TRUE, 'LutuWallet-456', 'Para nuevos uniformes', 120.00);

-- Athlete Metrics
INSERT INTO athlete_metrics (athlete_id, label, value, color) VALUES
('00000000-0000-0000-0000-000000000101', 'Velocidad', 92, 'bg-emerald-500'),
('00000000-0000-0000-0000-000000000101', 'Técnica', 85, 'bg-blue-500'),
('00000000-0000-0000-0000-000000000101', 'Fuerza', 78, 'bg-rose-500'),
('00000000-0000-0000-0000-000000000101', 'Resistencia', 88, 'bg-amber-500'),
('00000000-0000-0000-0000-000000000102', 'Recepción', 94, 'bg-emerald-500'),
('00000000-0000-0000-0000-000000000102', 'Servicio', 88, 'bg-blue-500'),
('00000000-0000-0000-0000-000000000102', 'Agilidad', 90, 'bg-rose-500'),
('00000000-0000-0000-0000-000000000102', 'Salto', 82, 'bg-amber-500');

-- Wallet History
INSERT INTO wallet_transactions (athlete_id, concept, date_label, amount) VALUES
('00000000-0000-0000-0000-000000000101', 'Donación Tía Marta', '2023-10-15', 50.00),
('00000000-0000-0000-0000-000000000101', 'Compra Zapatillas', '2023-10-18', -120.00),
('00000000-0000-0000-0000-000000000101', 'Beca Deportiva', '2023-10-20', 200.00),
('00000000-0000-0000-0000-000000000101', 'Inscripción Torneo', '2023-10-25', -35.00),
('00000000-0000-0000-0000-000000000102', 'Venta de Rifas', '2023-10-12', 80.00),
('00000000-0000-0000-0000-000000000102', 'Pago Mensualidad', '2023-10-05', -60.00);

-- Challenges
INSERT INTO challenges (id, title, coach_id, difficulty, xp, deadline, status, type, athlete_id) VALUES
('00000000-0000-0000-0000-000000000201', '500 Toques de Balón', '00000000-0000-0000-0000-000000000001', 'Media', 150, 'Hoy, 18:00', 'pending', 'technical', '00000000-0000-0000-0000-000000000101'),
('00000000-0000-0000-0000-000000000202', 'Sprints 50m x 10', '00000000-0000-0000-0000-000000000001', 'Alta', 200, 'Mañana, 09:00', 'completed', 'physical', '00000000-0000-0000-0000-000000000101'),
('00000000-0000-0000-0000-000000000203', 'Recepción Perfecta x 50', '00000000-0000-0000-0000-000000000002', 'Media', 180, 'Hoy, 20:00', 'pending', 'technical', '00000000-0000-0000-0000-000000000102');

-- Coach Tasks
INSERT INTO coach_tasks (id, coach_id, title, description, deadline, type, status) VALUES
('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000001', 'Rutina de Core - Nivel 1', 'Realizar 3 series de 30 segundos de plancha y 20 abdominales.', 'Viernes', 'routine', 'active');

-- Task Assignments
INSERT INTO task_assignments (task_id, athlete_id) VALUES
('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000101');

-- Coach Events
INSERT INTO coach_events (id, coach_id, title, type, date_label, time_label, location) VALUES
('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001', 'Práctica Táctica', 'Entrenamiento', 'Mañana', '16:00', 'Campo 2'),
('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000001', 'Juego vs Tigres', 'Partido', 'Sábado 18', '09:00', 'Estadio Central');
