// Aplicación de Exámenes de Brevete - Perú
class BreveteApp {
    constructor() {
        // Base de datos unificada de preguntas (motos y autos juntos)
        this.allQuestions = [];
        this.currentExam = {
            type: '',
            questions: [],
            currentIndex: 0,
            answers: [],
            score: 0,
            timeLeft: 1800, // 30 minutos en segundos
            timer: null,
            startTime: null
        };
        this.isEditMode = false;
        this.editingQuestionId = null;
        
        this.init();
    }

    init() {
        this.loadSampleQuestions();
        this.bindEvents();
        this.showSection('home');
    }

    // Cargar preguntas del PDF desde el archivo externo
    loadSampleQuestions() {
        // Cargar preguntas desde la base de datos externa
        this.allQuestions = [...QUESTIONS_DATABASE];
        
        console.log(`Cargadas ${this.allQuestions.length} preguntas del PDF`);
    }

    // Función para obtener estadísticas de la base de preguntas
    getQuestionsStatistics() {
        const total = this.allQuestions.length;
        const general = this.allQuestions.filter(q => q.category === 'general').length;
        const auto = this.allQuestions.filter(q => q.category === 'auto').length;
        const moto = this.allQuestions.filter(q => q.category === 'moto').length;

        return { total, general, auto, moto };
    }

    // Sistema de base de datos local para resultados
    saveExamResult(score, timeUsed, examType) {
        const result = {
            id: Date.now(),
            date: new Date().toISOString(),
            score: score,
            totalQuestions: 20,
            timeUsed: timeUsed, // en segundos
            examType: examType,
            passed: score >= 14,
            percentage: Math.round((score / 20) * 100)
        };

        // Obtener resultados existentes
        let results = this.getExamResults();
        results.push(result);

        // Guardar en localStorage
        localStorage.setItem('breveteExamResults', JSON.stringify(results));
        
        return result;
    }

    getExamResults() {
        const results = localStorage.getItem('breveteExamResults');
        return results ? JSON.parse(results) : [];
    }

    clearExamResults() {
        localStorage.removeItem('breveteExamResults');
    }

    getExamStatistics() {
        const results = this.getExamResults();
        if (results.length === 0) return null;

        const totalExams = results.length;
        const passedExams = results.filter(r => r.passed).length;
        const averageScore = results.reduce((sum, r) => sum + r.score, 0) / totalExams;
        const averageTime = results.reduce((sum, r) => sum + r.timeUsed, 0) / totalExams;
        const bestScore = Math.max(...results.map(r => r.score));
        const bestTime = Math.min(...results.map(r => r.timeUsed));

        return {
            totalExams,
            passedExams,
            passRate: Math.round((passedExams / totalExams) * 100),
            averageScore: Math.round(averageScore * 10) / 10,
            averageTime: Math.round(averageTime),
            bestScore,
            bestTime
        };
    }

    bindEvents() {
        // Navegación
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.closest('.nav-btn').dataset.section;
                this.showSection(section);
            });
        });

        // Selección de vehículo
        document.querySelectorAll('.vehicle-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const type = e.target.closest('.vehicle-card').dataset.type;
                this.startExam(type);
            });
        });

        // Botones de examen
        document.getElementById('next-question').addEventListener('click', () => this.nextQuestion());
        document.getElementById('prev-question').addEventListener('click', () => this.prevQuestion());
        document.getElementById('finish-exam').addEventListener('click', () => this.finishExam());

        // Modal de resultados
        document.getElementById('close-results').addEventListener('click', () => this.closeResults());
        document.getElementById('retry-exam').addEventListener('click', () => this.retryExam());
        document.getElementById('back-home').addEventListener('click', () => this.backToHome());

        // Dashboard
        document.getElementById('clear-stats-btn').addEventListener('click', () => this.clearStats());
    }

    showSection(sectionName) {
        // Ocultar todas las secciones
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Mostrar la sección seleccionada
        document.getElementById(sectionName).classList.add('active');

        // Actualizar navegación
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Cargar contenido específico
        if (sectionName === 'admin') {
            this.loadDashboard();
        }
    }

    startExam(type) {
        this.currentExam.type = type;
        this.currentExam.startTime = Date.now();
        
        // Seleccionar preguntas según el tipo
        let availableQuestions = [];
        if (type === 'auto') {
            // Para automóvil: preguntas generales + específicas de auto
            availableQuestions = this.allQuestions.filter(q => 
                q.category === 'general' || q.category === 'auto'
            );
        } else if (type === 'moto') {
            // Para motocicleta: preguntas generales + específicas de moto
            availableQuestions = this.allQuestions.filter(q => 
                q.category === 'general' || q.category === 'moto'
            );
        }
        
        // Seleccionar 20 preguntas aleatorias
        this.currentExam.questions = availableQuestions
            .sort(() => Math.random() - 0.5)
            .slice(0, 20);
            
        this.currentExam.currentIndex = 0;
        this.currentExam.answers = new Array(20).fill(null);
        this.currentExam.score = 0;
        this.currentExam.timeLeft = 1800; // 30 minutos

        this.showSection('exam');
        this.updateExamHeader();
        this.showQuestion();
        this.startTimer();
    }

    updateExamHeader() {
        const title = this.currentExam.type === 'auto' ? 'Examen de Automóvil' : 'Examen de Motocicleta';
        document.getElementById('exam-title').textContent = title;
        this.updateStats();
    }

    updateStats() {
        const minutes = Math.floor(this.currentExam.timeLeft / 60);
        const seconds = this.currentExam.timeLeft % 60;
        document.getElementById('timer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('question-counter').textContent = `${this.currentExam.currentIndex + 1}/20`;
        document.getElementById('score').textContent = `${this.currentExam.score} correctas`;
    }

    showQuestion() {
        const question = this.currentExam.questions[this.currentExam.currentIndex];
        
        document.getElementById('current-question').textContent = this.currentExam.currentIndex + 1;
        document.getElementById('question-text').textContent = question.question;
        
        // Mostrar imagen si existe
        const imageContainer = document.getElementById('question-image');
        if (question.image) {
            imageContainer.style.display = 'block';
            imageContainer.querySelector('img').src = question.image;
        } else {
            imageContainer.style.display = 'none';
        }

        // Mostrar opciones
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                <span>${option}</span>
            `;
            
            optionElement.addEventListener('click', () => this.selectOption(index));
            
            // Marcar si ya fue seleccionada
            if (this.currentExam.answers[this.currentExam.currentIndex] === index) {
                optionElement.classList.add('selected');
            }
            
            optionsContainer.appendChild(optionElement);
        });

        // Actualizar botones
        document.getElementById('prev-question').disabled = this.currentExam.currentIndex === 0;
        document.getElementById('next-question').disabled = this.currentExam.answers[this.currentExam.currentIndex] === null;

        // Actualizar barra de progreso
        const progress = ((this.currentExam.currentIndex + 1) / 20) * 100;
        document.getElementById('exam-progress').style.width = `${progress}%`;
    }

    selectOption(optionIndex) {
        this.currentExam.answers[this.currentExam.currentIndex] = optionIndex;
        
        // Actualizar UI
        document.querySelectorAll('.option').forEach((option, index) => {
            option.classList.remove('selected');
            if (index === optionIndex) {
                option.classList.add('selected');
            }
        });

        // Habilitar botón siguiente
        document.getElementById('next-question').disabled = false;
    }

    nextQuestion() {
        if (this.currentExam.currentIndex < 19) {
            this.currentExam.currentIndex++;
            this.showQuestion();
        } else {
            this.finishExam();
        }
    }

    prevQuestion() {
        if (this.currentExam.currentIndex > 0) {
            this.currentExam.currentIndex--;
            this.showQuestion();
        }
    }

    startTimer() {
        this.currentExam.timer = setInterval(() => {
            this.currentExam.timeLeft--;
            this.updateStats();
            
            if (this.currentExam.timeLeft <= 0) {
                this.finishExam();
            }
        }, 1000);
    }

    finishExam() {
        clearInterval(this.currentExam.timer);
        
        // Calcular puntaje
        this.currentExam.score = 0;
        this.currentExam.questions.forEach((question, index) => {
            if (this.currentExam.answers[index] === question.correct) {
                this.currentExam.score++;
            }
        });

        // Calcular tiempo usado
        const timeUsed = Math.round((Date.now() - this.currentExam.startTime) / 1000);
        
        // Guardar resultado en la base de datos
        const result = this.saveExamResult(
            this.currentExam.score, 
            timeUsed, 
            this.currentExam.type
        );

        this.showResults(result);
    }

    showResults(result) {
        const modal = document.getElementById('results-modal');
        const scoreElement = document.getElementById('final-score');
        const percentageElement = document.getElementById('score-percentage');
        const statusElement = document.getElementById('result-status');
        const scoreCircle = document.querySelector('.score-circle');

        const score = result.score;
        const percentage = result.percentage;
        const passed = result.passed;
        const timeUsed = result.timeUsed;

        scoreElement.textContent = score;
        percentageElement.textContent = `${percentage}%`;
        
        // Mostrar tiempo usado
        const minutes = Math.floor(timeUsed / 60);
        const seconds = timeUsed % 60;
        const timeText = `Tiempo: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (passed) {
            statusElement.innerHTML = `<i class="fas fa-check-circle"></i><span>Aprobado</span>`;
            statusElement.className = 'result-status passed';
            scoreCircle.className = 'score-circle passed';
        } else {
            statusElement.innerHTML = `<i class="fas fa-times-circle"></i><span>No Aprobado</span>`;
            statusElement.className = 'result-status failed';
            scoreCircle.className = 'score-circle failed';
        }

        // Actualizar detalles con tiempo
        const detailsElement = document.querySelector('.result-details p');
        detailsElement.innerHTML = `
            Necesitas al menos 14 respuestas correctas para aprobar.<br>
            <strong>${timeText}</strong><br>
            Fecha: ${new Date(result.date).toLocaleString('es-PE')}
        `;

        modal.classList.add('active');
        
        // Mostrar estadísticas en consola (opcional)
        const stats = this.getExamStatistics();
        if (stats) {
            console.log('Estadísticas generales:', stats);
        }
    }

    closeResults() {
        document.getElementById('results-modal').classList.remove('active');
    }

    retryExam() {
        this.closeResults();
        this.startExam(this.currentExam.type);
    }

    backToHome() {
        this.closeResults();
        this.showSection('home');
    }

    // Funciones del Dashboard
    loadDashboard() {
        this.loadStatistics();
        this.loadQuestionsInfo();
    }

    loadQuestionsInfo() {
        const questionsStats = this.getQuestionsStatistics();
        const container = document.getElementById('questions-stats');
        
        container.innerHTML = `
            <div class="question-stat-card">
                <div class="question-stat-number">${questionsStats.total}</div>
                <div class="question-stat-label">Total Preguntas</div>
            </div>
            <div class="question-stat-card">
                <div class="question-stat-number">${questionsStats.general}</div>
                <div class="question-stat-label">Generales</div>
            </div>
            <div class="question-stat-card">
                <div class="question-stat-number">${questionsStats.auto}</div>
                <div class="question-stat-label">Automóvil</div>
            </div>
            <div class="question-stat-card">
                <div class="question-stat-number">${questionsStats.moto}</div>
                <div class="question-stat-label">Motocicleta</div>
            </div>
        `;
    }

    // Funciones de estadísticas
    loadStatistics() {
        const results = this.getExamResults();
        const summaryContainer = document.getElementById('stats-summary');
        const historyContainer = document.getElementById('history-list');

        if (results.length === 0) {
            summaryContainer.innerHTML = `
                <div class="no-stats">
                    <i class="fas fa-chart-bar"></i>
                    <p>No hay exámenes registrados aún.<br>Completa tu primer examen para ver las estadísticas.</p>
                </div>
            `;
            historyContainer.innerHTML = '';
            return;
        }

        const stats = this.getExamStatistics();
        
        // Mostrar resumen de estadísticas
        summaryContainer.innerHTML = `
            <div class="stat-card info">
                <div class="stat-value">${stats.totalExams}</div>
                <div class="stat-label">Exámenes Realizados</div>
            </div>
            <div class="stat-card success">
                <div class="stat-value">${stats.passRate}%</div>
                <div class="stat-label">Tasa de Aprobación</div>
            </div>
            <div class="stat-card warning">
                <div class="stat-value">${stats.averageScore}</div>
                <div class="stat-label">Promedio de Aciertos</div>
            </div>
            <div class="stat-card info">
                <div class="stat-value">${Math.floor(stats.averageTime / 60)}:${(stats.averageTime % 60).toString().padStart(2, '0')}</div>
                <div class="stat-label">Tiempo Promedio</div>
            </div>
            <div class="stat-card success">
                <div class="stat-value">${stats.bestScore}/20</div>
                <div class="stat-label">Mejor Puntaje</div>
            </div>
            <div class="stat-card info">
                <div class="stat-value">${Math.floor(stats.bestTime / 60)}:${(stats.bestTime % 60).toString().padStart(2, '0')}</div>
                <div class="stat-label">Mejor Tiempo</div>
            </div>
        `;

        // Mostrar historial (últimos 20 exámenes)
        const recentResults = results.slice(-20).reverse();
        historyContainer.innerHTML = recentResults.map(result => {
            const date = new Date(result.date);
            const timeMinutes = Math.floor(result.timeUsed / 60);
            const timeSeconds = result.timeUsed % 60;
            
            return `
                <div class="history-item ${result.passed ? 'passed' : 'failed'}">
                    <div class="history-date">${date.toLocaleDateString('es-PE')}<br>${date.toLocaleTimeString('es-PE', {hour: '2-digit', minute: '2-digit'})}</div>
                    <div class="history-type ${result.examType}">${result.examType === 'auto' ? 'Automóvil' : 'Motocicleta'}</div>
                    <div class="history-score">${result.score}/20 (${result.percentage}%)</div>
                    <div class="history-time">${timeMinutes}:${timeSeconds.toString().padStart(2, '0')}</div>
                    <div class="history-status ${result.passed ? 'passed' : 'failed'}">${result.passed ? 'Aprobado' : 'No Aprobado'}</div>
                </div>
            `;
        }).join('');
    }

    clearStats() {
        if (confirm('¿Está seguro de que desea eliminar todo el historial de exámenes? Esta acción no se puede deshacer.')) {
            this.clearExamResults();
            this.loadStatistics();
            alert('Historial eliminado correctamente');
        }
    }
}

// Inicializar la aplicación
const app = new BreveteApp();