import { DropdownOption, ShotPlan } from './types';

export const NONE_OPTION: DropdownOption = {
  value: 'none',
  label: 'Desactivado',
  labelEn: 'None / Disabled',
  description: 'No se aplica este ajuste.',
  descriptionEn: 'This setting is not applied.',
  promptEn: '',
  promptEs: ''
};

const withNone = (options: DropdownOption[]) => [NONE_OPTION, ...options];

// --- ENGINES ---
export const ENGINES: DropdownOption[] = [
  // --- PHOTO GROUP ---
  { value: 'header_photo', label: '--- FOTO / IMAGEN ---', labelEn: '--- PHOTO / IMAGE ---', description: '', type: 'header' },
  { value: 'Nano Banana Pro', label: 'Nano Banana Pro (Gemini)', description: 'Alta fidelidad, comprensión compleja.', descriptionEn: 'High fidelity, complex reasoning.', type: 'image' },
  { value: 'Midjourney', label: 'Midjourney v6', description: 'Artístico, texturas ricas, estilo pictórico.', descriptionEn: 'Artistic, rich textures, painterly style.', type: 'image' },
  { value: 'DALL-E 3', label: 'DALL·E 3', description: 'Adherencia exacta al prompt, fácil de usar.', descriptionEn: 'Exact prompt adherence, easy to use.', type: 'image' },
  { value: 'Stable Diffusion XL', label: 'Stable Diffusion XL', description: 'Versátil, control técnico preciso.', descriptionEn: 'Versatile, precise technical control.', type: 'image' },
  { value: 'FLUX', label: 'FLUX.1', description: 'Realismo extremo, texto legible.', descriptionEn: 'Extreme realism, readable text.', type: 'image' },
  { value: 'Ideogram', label: 'Ideogram', description: 'Excelente tipografía y diseño.', descriptionEn: 'Excellent typography and design.', type: 'image' },
  { value: 'Adobe Firefly', label: 'Adobe Firefly', description: 'Fotorealismo comercial, seguro.', descriptionEn: 'Commercial photorealism, safe for work.', type: 'image' },

  // --- VIDEO GROUP ---
  { value: 'header_video', label: '--- VIDEO / CINE ---', labelEn: '--- VIDEO / CINEMA ---', description: '', type: 'header' },
  { value: 'Kling 3', label: 'Kling 3', description: 'Movimiento complejo (Soporta Multi-planos).', descriptionEn: 'Complex movement (Supports Multi-shot).', type: 'video' },
  { value: 'Veo 3', label: 'Veo 3', description: 'Cinematográfico, 1080p+ (Google).', descriptionEn: 'Cinematic, 1080p+ (Google).', type: 'video' },
  { value: 'Runway Gen-3', label: 'Runway Gen-3', description: 'Control temporal preciso.', descriptionEn: 'Precise temporal control.', type: 'video' },
  { value: 'Luma Dream Machine', label: 'Luma Dream Machine', description: 'Física realista, morphing suave.', descriptionEn: 'Realistic physics, smooth morphing.', type: 'video' },
  { value: 'Pika Art', label: 'Pika', description: 'Animación estilizada y lip-sync.', descriptionEn: 'Stylized animation and lip-sync.', type: 'video' },
  { value: 'Haiper', label: 'Haiper', description: 'Alta calidad visual.', descriptionEn: 'High visual quality.', type: 'video' },
  { value: 'Hunyuan Video', label: 'Hunyuan Video', description: 'Modelo open source potente.', descriptionEn: 'Powerful open source model.', type: 'video' },
  { value: 'Sora', label: 'Sora', description: 'Si tienes acceso (OpenAI).', descriptionEn: 'If available (OpenAI).', type: 'video' },
];

export const GENRES: DropdownOption[] = withNone([
  { value: 'Cinematic', label: 'Cinematográfico', labelEn: 'Cinematic', description: 'Calidad de película con composición dramática.', descriptionEn: 'Film quality with dramatic composition.' },
  { value: 'Suspense/Thriller', label: 'Suspenso/Thriller', labelEn: 'Suspense/Thriller', description: 'Alta tensión, sombras y misterio.', descriptionEn: 'High tension, shadows and mystery.' },
  { value: 'Horror', label: 'Terror', labelEn: 'Horror', description: 'Atmósfera oscura, inquietante y aterradora.', descriptionEn: 'Dark, unsettling and scary atmosphere.' },
  { value: 'Action', label: 'Acción', labelEn: 'Action', description: 'Movimiento dinámico, alta energía e impacto.', descriptionEn: 'Dynamic movement, high energy.' },
  { value: 'Romantic', label: 'Romántico', labelEn: 'Romantic', description: 'Visuales suaves, oníricos y emocionales.', descriptionEn: 'Soft, dreamy and emotional visuals.' },
  { value: 'Sci-Fi', label: 'Ciencia Ficción', labelEn: 'Sci-Fi', description: 'Estética futurista, neón y tecnológica.', descriptionEn: 'Futuristic, neon and tech aesthetic.' },
  { value: 'Documentary', label: 'Documental', labelEn: 'Documentary', description: 'Estilo de vida real, crudo y observacional.', descriptionEn: 'Real life, raw and observational.' },
  { value: 'Anime', label: 'Anime', labelEn: 'Anime', description: 'Estilo de animación japonesa con colores vibrantes.', descriptionEn: 'Japanese animation style.' },
  { value: 'Photorealistic', label: 'Fotorrealista', labelEn: 'Photorealistic', description: 'Indistinguible de una fotografía real.', descriptionEn: 'Indistinguishable from real photo.' },
  { value: 'Epic', label: 'Épico', labelEn: 'Epic', description: 'Gran escala, majestuoso y legendario.', descriptionEn: 'Large scale, majestic and legendary.' },
]);

export const SHOT_SIZES: DropdownOption[] = withNone([
  { value: 'Extreme Close-Up', label: 'Primerísimo Primer Plano', labelEn: 'Extreme Close-Up', description: 'Se enfoca en un detalle diminuto.', descriptionEn: 'Focuses on a tiny detail.' },
  { value: 'Close-Up', label: 'Primer Plano', labelEn: 'Close-Up', description: 'Muestra la cabeza y hombros.', descriptionEn: 'Shows head and shoulders.' },
  { value: 'Medium Shot', label: 'Plano Medio', labelEn: 'Medium Shot', description: 'Cintura hacia arriba.', descriptionEn: 'Waist up view.' },
  { value: 'Wide Shot', label: 'Plano General', labelEn: 'Wide Shot', description: 'Sujeto completo y entorno.', descriptionEn: 'Full subject and environment.' },
  { value: 'Extreme Wide Shot', label: 'Gran Plano General', labelEn: 'Extreme Wide Shot', description: 'Sujeto pequeño, paisaje dominante.', descriptionEn: 'Small subject, dominant landscape.' },
]);

export const CAMERA_ANGLES: DropdownOption[] = withNone([
  { value: 'Eye Level', label: 'Nivel de los Ojos', labelEn: 'Eye Level', description: 'Perspectiva neutral.', descriptionEn: 'Neutral perspective.' },
  { value: 'Low Angle', label: 'Contrapicado', labelEn: 'Low Angle', description: 'Mirando hacia arriba.', descriptionEn: 'Looking up at subject.' },
  { value: 'High Angle', label: 'Picado', labelEn: 'High Angle', description: 'Mirando hacia abajo.', descriptionEn: 'Looking down at subject.' },
  { value: 'Bird\'s Eye View', label: 'Cenital', labelEn: 'Overhead / Bird\'s Eye', description: 'Directamente desde arriba.', descriptionEn: 'Directly from above.' },
  { value: 'Dutch Angle', label: 'Plano Holandés', labelEn: 'Dutch Angle', description: 'Horizonte inclinado.', descriptionEn: 'Tilted horizon.' },
]);

export const COMPOSITIONS: DropdownOption[] = withNone([
  { 
    value: 'tilt_reveal', 
    label: 'Tilt reveal pies→ojos', 
    labelEn: 'Tilt reveal feet→eyes',
    description: 'Empieza encuadrando los pies y sube.', 
    descriptionEn: 'Starts at feet and pans up.',
    promptEs: 'tilt up desde los pies hasta los ojos, reveal cinematográfico',
    promptEn: 'tilt up from feet to eyes, cinematic reveal'
  },
  { 
    value: 'rear_follow', 
    label: 'Plano desde atrás (follow)', 
    labelEn: 'Rear follow shot',
    description: 'Ves al personaje por la espalda.', 
    descriptionEn: 'View character from behind.',
    promptEs: 'plano desde atrás siguiendo al sujeto, sensación inmersiva',
    promptEn: 'rear follow shot, immersive feel'
  },
  { 
    value: 'top_down', 
    label: 'Cenital (top-down)', 
    labelEn: 'Top-down',
    description: 'Cámara justo encima.', 
    descriptionEn: 'Camera directly above.',
    promptEs: 'plano cenital, composición geométrica y control visual',
    promptEn: 'overhead top-down shot, geometric composition and control'
  },
  { 
    value: 'ots', 
    label: 'Over-the-shoulder (OTS)', 
    labelEn: 'Over-the-shoulder',
    description: 'Por encima del hombro.', 
    descriptionEn: 'Over the shoulder view.',
    promptEs: 'plano OTS sobre el hombro, tensión narrativa',
    promptEn: 'over-the-shoulder shot, narrative tension'
  },
  { 
    value: 'pov', 
    label: 'POV (primera persona)', 
    labelEn: 'POV (First Person)',
    description: 'Ves lo que ve el personaje.', 
    descriptionEn: 'See what the character sees.',
    promptEs: 'POV en primera persona, inmersión total',
    promptEn: 'first-person POV, full immersion'
  },
  { 
    value: 'foreground_framing', 
    label: 'A través de objeto', 
    labelEn: 'Foreground Framing',
    description: 'Un objeto en primer plano enmarca.', 
    descriptionEn: 'Object in foreground frames the scene.',
    promptEs: 'encuadre con objeto en primer plano, profundidad',
    promptEn: 'foreground framing, added depth'
  },
  { 
    value: 'doorway_silhouette', 
    label: 'Silueta en puerta', 
    labelEn: 'Doorway Silhouette',
    description: 'Figura recortada contra luz.', 
    descriptionEn: 'Figure silhouetted against light.',
    promptEs: 'silueta recortada en un marco de puerta, misterio',
    promptEn: 'doorway silhouette, instant mystery'
  },
  { 
    value: 'reflection', 
    label: 'Reflejo (Mirror shot)', 
    labelEn: 'Reflection / Mirror',
    description: 'Personaje en espejo/reflejo.', 
    descriptionEn: 'Character in mirror/reflection.',
    promptEs: 'toma por reflejo, estilo cinematográfico',
    promptEn: 'reflection shot, cinematic style'
  },
  { 
    value: 'dutch_tilt', 
    label: 'Dutch tilt (inclinado)', 
    labelEn: 'Dutch Tilt',
    description: 'Horizonte torcido.', 
    descriptionEn: 'Tilted horizon.',
    promptEs: 'dutch tilt sutil, tensión psicológica',
    promptEn: 'subtle dutch tilt, psychological tension'
  },
  { 
    value: 'orbit', 
    label: 'Órbita 180°', 
    labelEn: 'Orbit 180°',
    description: 'La cámara rodea al sujeto.', 
    descriptionEn: 'Camera circles the subject.',
    promptEs: 'órbita 180° alrededor del sujeto, sensación envolvente',
    promptEn: '180° orbit around the subject, enveloping feel'
  }
]);

export const CAMERA_MOVEMENTS: DropdownOption[] = withNone([
  { value: 'Static', label: 'Estático', labelEn: 'Static', description: 'Sin movimiento.', descriptionEn: 'No movement.' },
  { value: 'Pan', label: 'Paneo', labelEn: 'Pan', description: 'Rotación horizontal.', descriptionEn: 'Horizontal rotation.' },
  { value: 'Tilt', label: 'Inclinación (Tilt)', labelEn: 'Tilt', description: 'Rotación vertical.', descriptionEn: 'Vertical rotation.' },
  { value: 'Dolly In', label: 'Dolly In', labelEn: 'Dolly In', description: 'Acercarse físicamente.', descriptionEn: 'Physically moving closer.' },
  { value: 'Tracking Shot', label: 'Travelling', labelEn: 'Tracking Shot', description: 'Seguir al sujeto.', descriptionEn: 'Following the subject.' },
  { value: 'Handheld', label: 'Cámara en Mano', labelEn: 'Handheld', description: 'Tembloroso y real.', descriptionEn: 'Shaky and raw.' },
  { value: 'Drone FPV', label: 'Dron FPV', labelEn: 'Drone FPV', description: 'Vuelo rápido.', descriptionEn: 'Fast flight.' },
]);

export const LENSES: DropdownOption[] = withNone([
  { value: '14mm Fisheye', label: '14mm Ojo de Pez', labelEn: '14mm Fisheye', description: 'Ultra gran angular.', descriptionEn: 'Ultra wide angle.' },
  { value: '24mm Wide', label: '24mm Gran Angular', labelEn: '24mm Wide', description: 'Campo amplio.', descriptionEn: 'Wide field.' },
  { value: '35mm Standard', label: '35mm Estándar', labelEn: '35mm Standard', description: 'Visión natural.', descriptionEn: 'Natural view.' },
  { value: '50mm Prime', label: '50mm Prime', labelEn: '50mm Prime', description: 'Versátil.', descriptionEn: 'Versatile.' },
  { value: '85mm Portrait', label: '85mm Retrato', labelEn: '85mm Portrait', description: 'Favorecedor.', descriptionEn: 'Flattering.' },
  { value: '200mm Telephoto', label: '200mm Teleobjetivo', labelEn: '200mm Telephoto', description: 'Zoom potente.', descriptionEn: 'Powerful zoom.' },
]);

export const DEPTH_OF_FIELD: DropdownOption[] = withNone([
  { value: 'Deep Focus', label: 'Enfoque Profundo (f/16)', labelEn: 'Deep Focus (f/16)', description: 'Todo nítido.', descriptionEn: 'Everything sharp.' },
  { value: 'Standard', label: 'Estándar (f/5.6)', labelEn: 'Standard (f/5.6)', description: 'Equilibrado.', descriptionEn: 'Balanced.' },
  { value: 'Shallow', label: 'Profundidad Baja (f/2.8)', labelEn: 'Shallow (f/2.8)', description: 'Fondo borroso.', descriptionEn: 'Blurred background.' },
  { value: 'Bokeh', label: 'Bokeh Intenso (f/1.2)', labelEn: 'Heavy Bokeh (f/1.2)', description: 'Muy desenfocado.', descriptionEn: 'Very blurry background.' },
]);

export const LIGHTING: DropdownOption[] = withNone([
  { value: 'Natural', label: 'Natural', labelEn: 'Natural', description: 'Luz día.', descriptionEn: 'Daylight.' },
  { value: 'Golden Hour', label: 'Hora Dorada', labelEn: 'Golden Hour', description: 'Atardecer cálido.', descriptionEn: 'Warm sunset.' },
  { value: 'Blue Hour', label: 'Hora Azul', labelEn: 'Blue Hour', description: 'Crepuscular frío.', descriptionEn: 'Cold twilight.' },
  { value: 'Cinematic Studio', label: 'Estudio Cine', labelEn: 'Cinematic Studio', description: 'Controlada.', descriptionEn: 'Controlled.' },
  { value: 'Rembrandt', label: 'Rembrandt', labelEn: 'Rembrandt', description: 'Dramática.', descriptionEn: 'Dramatic.' },
  { value: 'Neon/Cyberpunk', label: 'Neón / Cyberpunk', labelEn: 'Neon / Cyberpunk', description: 'Colores vibrantes.', descriptionEn: 'Vibrant colors.' },
  { value: 'Volumetric', label: 'Volumétrica', labelEn: 'Volumetric', description: 'Rayos de luz.', descriptionEn: 'Light beams.' },
]);

export const COLOR_GRADING: DropdownOption[] = withNone([
  { value: 'Neutral', label: 'Neutral', labelEn: 'Neutral', description: 'Realista.', descriptionEn: 'Realistic.' },
  { value: 'Teal and Orange', label: 'Turquesa y Naranja', labelEn: 'Teal and Orange', description: 'Blockbuster.', descriptionEn: 'Blockbuster look.' },
  { value: 'Black and White', label: 'Blanco y Negro', labelEn: 'Black and White', description: 'Monocromo.', descriptionEn: 'Monochrome.' },
  { value: 'Vintage/Sepia', label: 'Vintage', labelEn: 'Vintage', description: 'Retro.', descriptionEn: 'Retro look.' },
  { value: 'Vibrant', label: 'Vibrante', labelEn: 'Vibrant', description: 'Saturado.', descriptionEn: 'Saturated.' },
  { value: 'Desaturated', label: 'Desaturado', labelEn: 'Desaturated', description: 'Apagado.', descriptionEn: 'Muted.' },
]);

export const ATMOSPHERE: DropdownOption[] = withNone([
  { value: 'Clean', label: 'Limpio / Claro', labelEn: 'Clean / Clear', description: 'Nítido.', descriptionEn: 'Sharp.' },
  { value: 'Foggy', label: 'Neblina', labelEn: 'Foggy', description: 'Niebla.', descriptionEn: 'Fog.' },
  { value: 'Haze', label: 'Bruma', labelEn: 'Haze', description: 'Suave.', descriptionEn: 'Soft.' },
  { value: 'Rain', label: 'Lluvia', labelEn: 'Rain', description: 'Mojado.', descriptionEn: 'Wet.' },
  { value: 'Snow', label: 'Nieve', labelEn: 'Snow', description: 'Frío.', descriptionEn: 'Cold.' },
  { value: 'Smoke', label: 'Humo', labelEn: 'Smoke', description: 'Humo.', descriptionEn: 'Smoke.' },
  { value: 'Dusty', label: 'Polvoriento', labelEn: 'Dusty', description: 'Viejo.', descriptionEn: 'Old/Desert.' },
]);

export const PACE: DropdownOption[] = withNone([
  { value: 'Normal', label: 'Normal', labelEn: 'Normal', description: 'Tiempo real.', descriptionEn: 'Real time.' },
  { value: 'Slow Motion', label: 'Cámara Lenta', labelEn: 'Slow Motion', description: 'Lento.', descriptionEn: 'Slow.' },
  { value: 'Hyperlapse', label: 'Hyperlapse', labelEn: 'Hyperlapse', description: 'Rápido.', descriptionEn: 'Fast.' },
  { value: 'Timelapse', label: 'Timelapse', labelEn: 'Timelapse', description: 'Muy rápido.', descriptionEn: 'Very fast.' },
]);

export const QUALITY: DropdownOption[] = withNone([
  { value: 'Standard', label: 'Estándar', labelEn: 'Standard', description: 'Boceto.', descriptionEn: 'Draft.' },
  { value: 'High Fidelity', label: 'Alta Fidelidad', labelEn: 'High Fidelity', description: 'Detallado.', descriptionEn: 'Detailed.' },
  { value: '8K Raw', label: '8K Raw', labelEn: '8K Raw', description: 'Máximo.', descriptionEn: 'Max resolution.' },
  { value: 'Stylized', label: 'Estilizado', labelEn: 'Stylized', description: 'Artístico.', descriptionEn: 'Artistic.' },
]);

export const AVOID_OPTIONS: DropdownOption[] = [
  { value: 'blurry', label: 'Borrosa', labelEn: 'Blurry', description: 'Fuera de foco.', descriptionEn: 'Out of focus.' },
  { value: 'warping', label: 'Deformación', labelEn: 'Warping', description: 'Distorsión.', descriptionEn: 'Distortion.' },
  { value: 'text', label: 'Texto', labelEn: 'Text', description: 'Letras.', descriptionEn: 'Letters.' },
  { value: 'bad anatomy', label: 'Mala Anatomía', labelEn: 'Bad Anatomy', description: 'Errores cuerpo.', descriptionEn: 'Body errors.' },
  { value: 'oversaturated', label: 'Saturación', labelEn: 'Oversaturated', description: 'Color quemado.', descriptionEn: 'Burnt colors.' },
  { value: 'low resolution', label: 'Baja Res', labelEn: 'Low Res', description: 'Pixelado.', descriptionEn: 'Pixelated.' },
  { value: 'glitches', label: 'Glitches', labelEn: 'Glitches', description: 'Errores digitales.', descriptionEn: 'Digital errors.' },
];

export const ASPECT_RATIOS: DropdownOption[] = withNone([
  { value: '16:9', label: '16:9 (Panorámico)', labelEn: '16:9 (Landscape)', description: 'TV/YouTube.', descriptionEn: 'TV/YouTube.' },
  { value: '9:16', label: '9:16 (Vertical)', labelEn: '9:16 (Vertical)', description: 'TikTok/Reels.', descriptionEn: 'TikTok/Reels.' },
  { value: '1:1', label: '1:1 (Cuadrado)', labelEn: '1:1 (Square)', description: 'Instagram.', descriptionEn: 'Instagram.' },
  { value: '2.35:1', label: '2.35:1 (Cine)', labelEn: '2.35:1 (Cinema)', description: 'Película.', descriptionEn: 'Movie.' },
  { value: '4:3', label: '4:3 (Clásico)', labelEn: '4:3 (Classic)', description: 'TV antigua.', descriptionEn: 'Old TV.' },
]);

export const DURATIONS: DropdownOption[] = withNone([
  { value: '5s', label: '5 Segundos', labelEn: '5 Seconds', description: 'Corto.', descriptionEn: 'Short.' },
  { value: '10s', label: '10 Segundos', labelEn: '10 Seconds', description: 'Medio.', descriptionEn: 'Medium.' },
  { value: 'Loop', label: 'Bucle Infinito', labelEn: 'Infinite Loop', description: 'Repetición.', descriptionEn: 'Repeating.' },
]);

export const DEFAULT_SHOT: ShotPlan = {
  id: '1',
  action: '',
  shotSize: 'none',
  cameraAngle: 'none',
  composition: 'none',
  cameraMovement: 'none',
  duration: '5'
};