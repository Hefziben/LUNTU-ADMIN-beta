
-- 21. Colegios Table
CREATE TABLE IF NOT EXISTS colegios (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    deporte_principal TEXT,
    miembros INTEGER DEFAULT 0,
    estado TEXT DEFAULT 'Activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 22. Entrevistas Table
CREATE TABLE IF NOT EXISTS entrevistas (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    entrevistado TEXT NOT NULL,
    fecha DATE,
    estado TEXT DEFAULT 'Borrador',
    portada_url TEXT,
    video_url TEXT,
    contenido TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 23. Guia para Padres Table
CREATE TABLE IF NOT EXISTS guia_padres (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    categoria TEXT,
    fecha DATE,
    autor TEXT,
    estado TEXT DEFAULT 'Borrador',
    imagen_url TEXT,
    contenido TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 24. Publicidad Clientes Table
CREATE TABLE IF NOT EXISTS publicidad_clientes (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    campanas_totales INTEGER DEFAULT 0,
    inversion_total DECIMAL(12,2) DEFAULT 0.0,
    estado TEXT DEFAULT 'Activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 25. Publicidad Campañas Table
CREATE TABLE IF NOT EXISTS publicidad_campanas (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    cliente_id INTEGER REFERENCES publicidad_clientes(id) ON DELETE CASCADE,
    fecha_inicio DATE,
    fecha_fin DATE,
    dimensiones TEXT,
    presupuesto DECIMAL(12,2) DEFAULT 0.0,
    gastado DECIMAL(12,2) DEFAULT 0.0,
    ingresos DECIMAL(12,2) DEFAULT 0.0,
    estado TEXT DEFAULT 'Programado',
    imagen_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 26. Publicidad Solicitudes Table
CREATE TABLE IF NOT EXISTS publicidad_solicitudes (
    id SERIAL PRIMARY KEY,
    cliente_nombre TEXT NOT NULL,
    email TEXT,
    descripcion TEXT,
    dimensiones TEXT,
    fecha DATE DEFAULT CURRENT_DATE,
    estado TEXT DEFAULT 'Pendiente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 27. Solicitudes de Registro Table
CREATE TABLE IF NOT EXISTS solicitudes_registro (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    tipo TEXT, -- Entrenador, Club, Jugador, Arbitro, etc.
    fecha DATE DEFAULT CURRENT_DATE,
    estado TEXT DEFAULT 'Pendiente',
    detalles TEXT,
    documentos TEXT[], -- Array of URLs or filenames
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 28. Suscripciones Table
CREATE TABLE IF NOT EXISTS suscripciones (
    id SERIAL PRIMARY KEY,
    entidad TEXT NOT NULL,
    tipo TEXT, -- Entrenador, Club, Colegio
    plan TEXT,
    monto TEXT, -- Stored as string to match component, or DECIMAL if preferred
    proximo_cobro TEXT,
    estado TEXT DEFAULT 'Activa',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 29. Categorias Table
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    deporte TEXT NOT NULL,
    atletas_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 30. Atletas por Categoria (Many-to-Many or just for detail)
CREATE TABLE IF NOT EXISTS categoria_atletas (
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE CASCADE,
    atleta_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    PRIMARY KEY (categoria_id, atleta_id)
);

-- MOCK DATA MIGRATION

-- Colegios
INSERT INTO colegios (nombre, deporte_principal, miembros, estado) VALUES
('Colegio San Agustín', 'Fútbol', 350, 'Activo'),
('Instituto Panamericano', 'Baloncesto', 200, 'Activo'),
('Colegio Brader', 'Natación', 150, 'Inactivo')
ON CONFLICT DO NOTHING;

-- Entrevistas
INSERT INTO entrevistas (titulo, entrevistado, fecha, estado, portada_url, video_url, contenido) VALUES
('El camino al éxito', 'Diego Martínez', '2026-03-05', 'Publicado', 'https://picsum.photos/seed/entrevista1/400/225', 'https://youtube.com', 'En esta entrevista exclusiva, Diego Martínez nos cuenta sus secretos para alcanzar el éxito en el deporte de alto rendimiento...'),
('Preparación mental en el Tenis', 'Ana Silva', '2026-03-01', 'Borrador', 'https://picsum.photos/seed/entrevista2/400/225', 'https://vimeo.com', 'Ana Silva, psicóloga deportiva, explica la importancia de la preparación mental antes de un Grand Slam.')
ON CONFLICT DO NOTHING;

-- Guia Padres
INSERT INTO guia_padres (titulo, categoria, fecha, autor, estado, imagen_url, contenido) VALUES
('Cómo apoyar a tu hijo después de una derrota', 'Psicología', '2026-03-02', 'Dra. María Gómez', 'Publicado', 'https://picsum.photos/seed/padres1/800/400', 'Es fundamental entender que la derrota es parte del proceso de aprendizaje...'),
('Nutrición pre-competencia: Qué deben comer', 'Nutrición', '2026-03-06', 'Lic. Juan Pérez', 'Borrador', 'https://picsum.photos/seed/padres2/800/400', 'Una correcta alimentación antes de competir puede marcar la diferencia en el rendimiento...'),
('Equilibrando los estudios y el deporte de alto rendimiento', 'Educación', '2026-03-08', 'Equipo LUNTU', 'Publicado', 'https://picsum.photos/seed/padres3/800/400', 'Consejos prácticos para ayudar a los jóvenes atletas a mantener buenas calificaciones sin descuidar sus entrenamientos...')
ON CONFLICT DO NOTHING;

-- Publicidad Clientes
INSERT INTO publicidad_clientes (id, nombre, email, telefono, campanas_totales, inversion_total, estado) VALUES
(1, 'Nike Panamá', 'marketing@nike.pa', '+507 6123-4567', 5, 2500, 'Activo'),
(2, 'Gatorade', 'ads@gatorade.com', '+507 6987-6543', 2, 800, 'Activo'),
(3, 'Sportline America', 'contacto@sportline.com', '+507 6555-1234', 8, 4200, 'Inactivo')
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  email = EXCLUDED.email,
  telefono = EXCLUDED.telefono,
  campanas_totales = EXCLUDED.campanas_totales,
  inversion_total = EXCLUDED.inversion_total,
  estado = EXCLUDED.estado;

-- Publicidad Campañas
INSERT INTO publicidad_campanas (titulo, cliente_id, fecha_inicio, fecha_fin, dimensiones, presupuesto, gastado, ingresos, estado, imagen_url) VALUES
('Campaña Verano 2026', 1, '2026-06-01', '2026-08-31', '1200x628', 500, 120.5, 1500, 'Activo', 'https://picsum.photos/seed/summer/800/400'),
('Torneo Nacional', 2, '2026-09-15', '2026-10-15', '1080x1080', 300, 0, 0, 'Programado', 'https://picsum.photos/seed/sports/800/400')
ON CONFLICT DO NOTHING;

-- Publicidad Solicitudes
INSERT INTO publicidad_solicitudes (cliente_nombre, email, descripcion, dimensiones, fecha, estado) VALUES
('Nike Panamá', 'marketing@nike.pa', 'Banner para nueva colección de zapatillas de running. Colores vibrantes.', '1080x1080', '2026-03-01', 'Pendiente'),
('Gatorade', 'ads@gatorade.com', 'Campaña de hidratación verano. Necesitamos diseño dinámico con atletas.', '1200x628', '2026-03-02', 'Pendiente'),
('Sportline America', 'contacto@sportline.com', 'Promoción de vuelta a clases. Descuentos en mochilas.', '1080x1920', '2026-03-02', 'Pendiente')
ON CONFLICT DO NOTHING;

-- Solicitudes Registro
INSERT INTO solicitudes_registro (nombre, email, tipo, fecha, estado, detalles, documentos) VALUES
('Juan Pérez', 'juan@example.com', 'Entrenador', '2026-03-05', 'Pendiente', 'Experiencia de 5 años entrenando equipos juveniles. Licencia UEFA B.', ARRAY['CV_JuanPerez.pdf', 'Licencia_Entrenador.jpg']),
('Academia FC', 'contacto@academiafc.com', 'Club', '2026-03-06', 'Pendiente', 'Club formativo con más de 200 niños inscritos. Buscamos plataforma para gestión.', ARRAY['Registro_Club.pdf']),
('María Gómez', 'maria.g@example.com', 'Jugadora', '2026-03-01', 'Aprobada', 'Jugadora amateur buscando equipo en la liga local.', NULL),
('Carlos Ruiz', 'cruiz@example.com', 'Árbitro', '2026-02-28', 'Rechazada', 'Documentación incompleta.', NULL)
ON CONFLICT DO NOTHING;

-- Suscripciones
INSERT INTO suscripciones (entidad, tipo, plan, monto, proximo_cobro, estado) VALUES
('Club Deportivo LUNTU', 'Club', 'Premium Anual', '$1,200', '2027-01-15', 'Activa'),
('Carlos Ruiz', 'Entrenador', 'Pro Mensual', '$49', '2026-04-01', 'Activa'),
('Colegio San Agustín', 'Colegio', 'Institucional', '$2,500', '-', 'Vencida'),
('Academia FC', 'Club', 'Básico', '$299', '-', 'Cancelada')
ON CONFLICT DO NOTHING;

-- Categorias
INSERT INTO categorias (id, nombre, deporte, atletas_count) VALUES
(1, 'Sub-15 Masculino', 'Fútbol', 450),
(2, 'Sub-17 Femenino', 'Fútbol', 320),
(3, 'Pre-Infantil', 'Béisbol', 150),
(4, 'Juvenil', 'Baloncesto', 210),
(5, 'Cinturón Blanco-Naranja', 'Karate', 85),
(6, 'Infantil', 'Natación', 120),
(7, 'Nivel 3', 'Gimnasia', 60)
ON CONFLICT (id) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    deporte = EXCLUDED.deporte,
    atletas_count = EXCLUDED.atletas_count;
