// Base de datos de preguntas extraídas del PDF
// Aquí debes agregar todas las preguntas reales del PDF

const QUESTIONS_DATABASE = [
    // PREGUNTAS GENERALES (aplican para ambos tipos de licencia)
    {
        id: 1,
        question: "¿Cuál es la velocidad máxima permitida en zonas urbanas?",
        options: ["30 km/h", "50 km/h", "60 km/h", "80 km/h"],
        correct: 1,
        category: "general",
        image: null
    },
    {
        id: 2,
        question: "¿Qué significa una línea amarilla continua en el pavimento?",
        options: ["Prohibido adelantar", "Zona de estacionamiento", "Carril exclusivo", "Reducir velocidad"],
        correct: 0,
        category: "general",
        image: null
    },
    {
        id: 3,
        question: "¿Qué debe hacer al aproximarse a un semáforo en ámbar?",
        options: ["Acelerar para pasar", "Detenerse si es seguro hacerlo", "Tocar la bocina", "Cambiar de carril"],
        correct: 1,
        category: "general",
        image: null
    },
    {
        id: 4,
        question: "¿Qué indica una señal de PARE?",
        options: ["Reducir velocidad", "Detenerse completamente", "Ceder el paso", "Prohibido el paso"],
        correct: 1,
        category: "general",
        image: null
    },
    {
        id: 5,
        question: "¿Cuál es el límite de alcohol en sangre permitido para conductores?",
        options: ["0.0 g/l", "0.5 g/l", "1.0 g/l", "1.5 g/l"],
        correct: 0,
        category: "general",
        image: null
    },
    {
        id: 6,
        question: "¿Dónde está prohibido estacionar?",
        options: ["En zona azul", "Frente a cocheras", "En parques", "En centros comerciales"],
        correct: 1,
        category: "general",
        image: null
    },
    {
        id: 7,
        question: "¿Qué debe hacer si su vehículo se avería en la carretera?",
        options: ["Dejarlo donde está", "Colocar triángulos de seguridad", "Llamar a la policía", "Empujarlo"],
        correct: 1,
        category: "general",
        image: null
    },
    {
        id: 8,
        question: "¿Cuándo debe renovar su licencia de conducir?",
        options: ["Cada año", "Cada 3 años", "Cada 5 años", "Nunca"],
        correct: 2,
        category: "general",
        image: null
    },
    {
        id: 9,
        question: "¿Cuándo debe usar las luces bajas durante el día?",
        options: ["Solo en túneles", "En carreteras y autopistas", "Solo cuando llueve", "Nunca durante el día"],
        correct: 1,
        category: "general",
        image: null
    },
    {
        id: 10,
        question: "¿Cuál es la distancia mínima de seguimiento en ciudad?",
        options: ["1 metro", "3 metros", "5 metros", "La que permita detenerse"],
        correct: 3,
        category: "general",
        image: null
    },

    // PREGUNTAS ESPECÍFICAS PARA AUTOMÓVILES (Clase A-IIA)
    {
        id: 11,
        question: "¿Cuál es la velocidad máxima en autopistas para automóviles?",
        options: ["80 km/h", "100 km/h", "120 km/h", "140 km/h"],
        correct: 1,
        category: "auto",
        image: null
    },
    {
        id: 12,
        question: "¿Cuántos pasajeros puede llevar un automóvil según su tarjeta de propiedad?",
        options: ["Máximo 4", "Según capacidad registrada", "Máximo 8", "Sin límite"],
        correct: 1,
        category: "auto",
        image: null
    },
    {
        id: 13,
        question: "¿Es obligatorio el uso del cinturón de seguridad en asientos traseros?",
        options: ["No es obligatorio", "Solo en carretera", "Sí, siempre", "Solo para menores"],
        correct: 2,
        category: "auto",
        image: null
    },
    {
        id: 14,
        question: "¿Qué documentos debe portar el conductor de automóvil?",
        options: ["Solo licencia", "Licencia, SOAT y tarjeta de propiedad", "Solo SOAT", "Solo tarjeta de propiedad"],
        correct: 1,
        category: "auto",
        image: null
    },
    {
        id: 15,
        question: "¿A partir de qué edad se puede obtener licencia para automóvil?",
        options: ["16 años", "17 años", "18 años", "21 años"],
        correct: 2,
        category: "auto",
        image: null
    },

    // PREGUNTAS ESPECÍFICAS PARA MOTOCICLETAS (Clase A-I)
    {
        id: 16,
        question: "¿Es obligatorio el uso de casco para el conductor de motocicleta?",
        options: ["Solo en carretera", "Solo en ciudad", "Siempre", "Solo de noche"],
        correct: 2,
        category: "moto",
        image: null
    },
    {
        id: 17,
        question: "¿Puede una motocicleta circular entre carriles?",
        options: ["Sí, siempre", "No, nunca", "Solo en tráfico lento", "Solo en autopistas"],
        correct: 1,
        category: "moto",
        image: null
    },
    {
        id: 18,
        question: "¿Cuántas personas pueden viajar en una motocicleta?",
        options: ["Solo el conductor", "Máximo 2 personas", "Máximo 3 personas", "No hay límite"],
        correct: 1,
        category: "moto",
        image: null
    },
    {
        id: 19,
        question: "¿Qué documentos debe portar el conductor de motocicleta?",
        options: ["Solo licencia", "Licencia y SOAT", "Solo SOAT", "Ninguno"],
        correct: 1,
        category: "moto",
        image: null
    },
    {
        id: 20,
        question: "¿A qué edad mínima se puede obtener licencia para motocicleta?",
        options: ["16 años", "17 años", "18 años", "21 años"],
        correct: 2,
        category: "moto",
        image: null
    },
    {
        id: 21,
        question: "¿Qué tipo de ropa es recomendable usar al conducir motocicleta?",
        options: ["Ropa ligera", "Ropa protectora", "Cualquier ropa", "Solo casco"],
        correct: 1,
        category: "moto",
        image: null
    },
    {
        id: 22,
        question: "¿Puede una motocicleta remolcar otro vehículo?",
        options: ["Sí, siempre", "No, nunca", "Solo motocicletas", "Solo bicicletas"],
        correct: 1,
        category: "moto",
        image: null
    },
    {
        id: 23,
        question: "¿Qué debe verificar antes de conducir su motocicleta?",
        options: ["Solo combustible", "Frenos, luces y llantas", "Solo el motor", "Nada especial"],
        correct: 1,
        category: "moto",
        image: null
    },
    {
        id: 24,
        question: "¿Está permitido hablar por teléfono mientras conduce motocicleta?",
        options: ["Sí, con manos libres", "Sí, siempre", "No, nunca", "Solo en emergencias"],
        correct: 2,
        category: "moto",
        image: null
    },
    {
        id: 25,
        question: "¿Cuál es la velocidad máxima para motocicletas en zona urbana?",
        options: ["40 km/h", "50 km/h", "60 km/h", "70 km/h"],
        correct: 1,
        category: "moto",
        image: null
    }

    // TODO: Agregar más preguntas del PDF aquí
    // Formato:
    // {
    //     id: [número único],
    //     question: "[texto de la pregunta]",
    //     options: ["opción A", "opción B", "opción C", "opción D"],
    //     correct: [índice de la respuesta correcta: 0, 1, 2, o 3],
    //     category: "general" | "auto" | "moto",
    //     image: null | "[URL de imagen si existe]"
    // }
];