/**
 * Lesson Player - Interactive Course Player
 * Gère l'affichage et l'interaction avec le contenu du cours
 */

let currentLessonState = {
    theme: null,
    lessonId: null,
    lessonData: null,
    currentStep: 'course',  // 'course', 'exercises', 'exam', 'completed'
    courseProgress: 0,      // 0-100
    exercisesCompleted: 0,
    exerciseAnswers: {},
    examAnswers: {},
    examScore: 0,
    startTime: null,
    courseTime: 0
};

/**
 * Initialise le lecteur de cours
 */
async function initLessonPlayer(theme, lessonId) {
    // Récupérer le contenu de la leçon
    const lessonContent = getLessonContent(theme, lessonId);
    
    currentLessonState = {
        theme: theme,
        lessonId: lessonId,
        lessonData: lessonContent,
        currentStep: 'course',
        courseProgress: 0,
        exercisesCompleted: 0,
        exerciseAnswers: {},
        examAnswers: {},
        examScore: 0,
        startTime: Date.now(),
        courseTime: 0
    };
    
    // Afficher l'écran du lecteur
    showLessonPlayerScreen();
    
    // Commencer par le cours
    showCourseContent();
}

/**
 * Affiche l'écran du lecteur
 */
function showLessonPlayerScreen() {
    // Cacher les autres écrans
    document.getElementById('homeScreen').style.display = 'none';
    document.getElementById('lessonsScreen').style.display = 'none';
    document.getElementById('badgesScreen').style.display = 'none';
    document.getElementById('profileScreen').style.display = 'none';
    document.getElementById('onboardingScreen').style.display = 'none';
    
    // Afficher l'écran du lecteur
    document.getElementById('lessonPlayerScreen').style.display = 'block';
    document.getElementById('lessonPlayerScreen').classList.remove('hidden');
}

/**
 * Affiche le contenu du cours
 */
function showCourseContent() {
    currentLessonState.currentStep = 'course';
    const container = document.getElementById('lessonPlayerContent');
    const { lessonData } = currentLessonState;
    
    let sectionsHTML = lessonData.course.sections.map((section, index) => `
        <div class="mb-8 animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.1}s">
            <h3 class="text-2xl font-bold text-blue-600 mb-4 flex items-center">
                <span class="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center mr-3">${index + 1}</span>
                ${section.title}
                <button 
                    onclick="speakText('${escapeTextForJS(section.title)}')"
                    class="inline-flex items-center justify-center text-lg text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full p-2 transition-all ml-2"
                    title="Écouter la prononciation"
                    style="cursor: pointer; border: none; background: transparent;"
                >
                    <i class="fas fa-microphone"></i>
                </button>
            </h3>
            <div class="bg-blue-50 rounded-lg p-5 mb-4 border-l-4 border-blue-500">
                <p class="text-gray-700 text-lg leading-relaxed mb-4">${section.content}</p>
                <button 
                    onclick="speakText('${escapeTextForJS(section.content)}')"
                    class="inline-flex items-center justify-center text-base text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full px-3 py-1 transition-all mt-2 mb-4"
                    title="Écouter la prononciation du contenu"
                    style="cursor: pointer; border: none; background: transparent; font-size: 12px;"
                >
                    <i class="fas fa-volume-up mr-1"></i>Écouter
                </button>
                ${section.examples && section.examples.length > 0 ? `
                    <div class="mt-4 pt-4 border-t border-blue-200">
                        <p class="font-semibold text-blue-600 mb-2">Exemples:</p>
                        <ul class="list-disc list-inside space-y-2">
                            ${section.examples.map(ex => `<li class="text-gray-700 flex items-center">📌 ${ex}<button onclick="speakText('${escapeTextForJS(ex)}')" class="inline-flex items-center justify-center text-sm text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full p-1 transition-all ml-2" title="Écouter" style="cursor: pointer; border: none; background: transparent;"><i class="fas fa-microphone"></i></button></li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div class="p-6">
            <!-- Header -->
            <div class="mb-8">
                <div class="flex justify-between items-center mb-4">
                    <button onclick="exitLesson()" class="text-gray-500 hover:text-red-500 flex items-center">
                        <i class="fas fa-arrow-left mr-2"></i>Retour
                    </button>
                    <button onclick="cancelLesson()" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center transition-colors">
                        <i class="fas fa-times mr-2"></i>Annuler
                    </button>
                </div>
                <h2 class="text-3xl font-bold text-gray-800 mb-2">${lessonData.title}</h2>
                <p class="text-gray-600 mb-4">${lessonData.description}</p>
                
                <!-- Progress Bar -->
                <div class="bg-gray-200 rounded-full h-3 overflow-hidden mb-4">
                    <div class="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-300" 
                         style="width: ${currentLessonState.courseProgress}%"></div>
                </div>
                <div class="flex justify-between items-center text-sm text-gray-600">
                    <span>Durée estimée: ${lessonData.course.duration} min</span>
                    <span>Progression: ${Math.round(currentLessonState.courseProgress)}%</span>
                </div>
            </div>
            
            <!-- Course Content -->
            <div class="space-y-6">
                ${sectionsHTML}
            </div>
            
            <!-- Progress Update -->
            <script>
                currentLessonState.courseProgress = 100;
                document.querySelector('[style*="width"]').style.width = '100%';
            </script>
            
            <!-- Action Buttons -->
            <div class="flex gap-4 mt-12 mb-6">
                <button onclick="showExercises()" class="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all">
                    <i class="fas fa-dumbbell mr-2"></i>Exercices (${currentLessonState.lessonData.exercises.items.length})
                </button>
            </div>
        </div>
    `;
}

/**
 * Affiche les exercices
 */
function showExercises() {
    currentLessonState.currentStep = 'exercises';
    const container = document.getElementById('lessonPlayerContent');
    const { lessonData, exerciseAnswers } = currentLessonState;
    const exercises = lessonData.exercises.items;
    
    let exercisesHTML = exercises.map((exercise, index) => {
        const isAnswered = exerciseAnswers[index] !== undefined;
        const isCorrect = isAnswered && exerciseAnswers[index] === exercise.correct;
        
        return `
            <div class="bg-white rounded-lg p-6 mb-6 border-2 ${isCorrect ? 'border-green-500 bg-green-50' : isAnswered ? 'border-red-500 bg-red-50' : 'border-gray-200'} animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.1}s">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center">
                        <h4 class="text-lg font-bold text-gray-800 flex-1">
                            <span class="bg-blue-100 text-blue-600 rounded-full w-8 h-8 inline-flex items-center justify-center mr-2">${index + 1}</span>
                            ${exercise.question}
                        </h4>
                        <button 
                            onclick="speakText('${escapeTextForJS(exercise.question)}')"
                            class="inline-flex items-center justify-center text-lg text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full p-2 transition-all ml-2"
                            title="Écouter la question"
                            style="cursor: pointer; border: none; background: transparent;"
                        >
                            <i class="fas fa-microphone"></i>
                        </button>
                    </div>
                    ${isCorrect ? '<span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">✓ Correct</span>' : ''}
                    ${isAnswered && !isCorrect ? '<span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">✗ Incorrect</span>' : ''}
                </div>
                
                <div class="space-y-2">
                    ${exercise.options ? exercise.options.map((option, optIndex) => {
                        const selected = exerciseAnswers[index] === option;
                        const isCorrectOption = option === exercise.correct;
                        
                        return `
                            <div class="flex items-center">
                                <button 
                                    onclick="answerExercise(${index}, '${escapeTextForJS(option)}')"
                                    class="flex-1 text-left p-4 rounded-lg border-2 transition-all font-semibold
                                        ${selected && isCorrect ? 'border-green-500 bg-green-100 text-green-700' : ''}
                                        ${selected && !isCorrect ? 'border-red-500 bg-red-100 text-red-700' : ''}
                                        ${!selected && isCorrectOption && isAnswered ? 'border-green-500 bg-green-100 text-green-700' : ''}
                                        ${!selected && !isAnswered ? 'border-gray-300 hover:border-blue-500 hover:bg-blue-50' : ''}
                                        ${!selected && !isCorrectOption && isAnswered ? 'border-gray-300 opacity-50' : ''}
                                    "
                                    ${isAnswered ? 'disabled' : ''}
                                >
                                    <i class="fas fa-circle mr-2"></i>${option}
                                </button>
                                <button 
                                    onclick="speakText('${escapeTextForJS(option)}')"
                                    class="inline-flex items-center justify-center text-sm text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full p-2 transition-all ml-2"
                                    title="Écouter l'option"
                                    style="cursor: pointer; border: none; background: transparent;"
                                >
                                    <i class="fas fa-microphone"></i>
                                </button>
                            </div>
                        `;
                    }).join('') : ''}
                </div>
            </div>
        `;
    }).join('');
    
    const correctCount = Object.keys(exerciseAnswers).filter(i => exerciseAnswers[i] === exercises[i].correct).length;
    
    container.innerHTML = `
        <div class="p-6">
            <!-- Header -->
            <div class="mb-8">
                <div class="flex justify-between items-center mb-4">
                    <button onclick="showCourseContent()" class="text-gray-500 hover:text-blue-500 flex items-center">
                        <i class="fas fa-arrow-left mr-2"></i>Retour au cours
                    </button>
                    <button onclick="cancelLesson()" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center transition-colors">
                        <i class="fas fa-times mr-2"></i>Annuler
                    </button>
                </div>
                <h2 class="text-3xl font-bold text-gray-800 mb-2">Exercices Pratiques</h2>
                <p class="text-gray-600">Complétez les ${lessonData.exercises.requiredCorrect} exercices correctement pour continuer</p>
                
                <!-- Progress -->
                <div class="mt-6 bg-white rounded-lg p-4 border-2 border-blue-200">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-semibold text-gray-800">Réponses correctes: ${correctCount}/${exercises.length}</span>
                        <span class="text-sm text-gray-600">Besoin: ${lessonData.exercises.requiredCorrect}</span>
                    </div>
                    <div class="bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div class="bg-gradient-to-r from-orange-400 to-red-500 h-full transition-all" 
                             style="width: ${(correctCount / exercises.length) * 100}%"></div>
                    </div>
                </div>
            </div>
            
            <!-- Exercises -->
            <div class="space-y-4">
                ${exercisesHTML}
            </div>
            
            <!-- Next Button -->
            ${correctCount >= lessonData.exercises.requiredCorrect ? `
                <div class="mt-12 mb-6">
                    <button onclick="showExam()" class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all">
                        <i class="fas fa-clipboard-check mr-2"></i>Examen Final
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Répond à une question d'exercice
 */
function answerExercise(index, answer) {
    currentLessonState.exerciseAnswers[index] = answer;
    showExercises();
}

/**
 * Affiche l'examen final
 */
function showExam() {
    currentLessonState.currentStep = 'exam';
    const container = document.getElementById('lessonPlayerContent');
    const { lessonData, examAnswers } = currentLessonState;
    const questions = lessonData.finalExam.questions;
    
    let questionsHTML = questions.map((question, index) => {
        const selected = examAnswers[index];
        const isAnswered = selected !== undefined;
        const isCorrect = isAnswered && selected === question.correct;
        
        let optionsHTML = '';
        if (question.options && Array.isArray(question.options)) {
            optionsHTML = question.options.map((option) => {
                const isSelected = selected === option;
                const isCorrectOption = option === question.correct;
                
                return `
                    <div class="flex items-center">
                        <button 
                            onclick="answerExam(${index}, '${escapeTextForJS(option)}')"
                            class="flex-1 text-left p-4 rounded-lg border-2 transition-all font-semibold
                                ${isSelected && isCorrect ? 'border-green-500 bg-green-100 text-green-700' : ''}
                                ${isSelected && !isCorrect ? 'border-red-500 bg-red-100 text-red-700' : ''}
                                ${!isSelected && isCorrectOption && isAnswered ? 'border-green-500 bg-green-100 text-green-700' : ''}
                                ${!isSelected && !isAnswered ? 'border-gray-300 hover:border-red-500 hover:bg-red-50' : ''}
                                ${!isSelected && !isCorrectOption && isAnswered ? 'border-gray-300 opacity-50' : ''}
                            "
                        >
                            <i class="fas fa-circle mr-2"></i>${option}
                        </button>
                        <button 
                            onclick="speakText('${escapeTextForJS(option)}')"
                            class="inline-flex items-center justify-center text-sm text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-2 transition-all ml-2"
                            title="Écouter l'option"
                            style="cursor: pointer; border: none; background: transparent;"
                        >
                            <i class="fas fa-microphone"></i>
                        </button>
                    </div>
                `;
            }).join('');
        }
        
        return `
            <div class="bg-white rounded-lg p-6 mb-6 border-2 ${isCorrect ? 'border-green-500 bg-green-50' : isAnswered ? 'border-red-500 bg-red-50' : 'border-gray-200'} animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.1}s">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center">
                        <h4 class="text-lg font-bold text-gray-800">
                            <span class="bg-red-100 text-red-600 rounded-full w-8 h-8 inline-flex items-center justify-center mr-2">${index + 1}</span>
                            ${question.question}
                        </h4>
                        <button 
                            onclick="speakText('${escapeTextForJS(question.question)}')"
                            class="inline-flex items-center justify-center text-lg text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-2 transition-all ml-2"
                            title="Écouter la question"
                            style="cursor: pointer; border: none; background: transparent;"
                        >
                            <i class="fas fa-microphone"></i>
                        </button>
                    </div>
                    ${isCorrect ? '<span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">✓</span>' : ''}
                    ${isAnswered && !isCorrect ? '<span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">✗</span>' : ''}
                </div>
                
                <div class="space-y-2">
                    ${optionsHTML}
                </div>
            </div>
        `;
    }).join('');
    
    const correctCount = Object.keys(examAnswers).filter(i => examAnswers[i] === questions[i].correct).length;
    const examScore = Math.round((correctCount / questions.length) * 100);
    const passingScore = lessonData.finalExam.passingScore;
    const passed = examScore >= passingScore;
    
    currentLessonState.examScore = examScore;
    
    container.innerHTML = `
        <div class="p-6">
            <!-- Header -->
            <div class="mb-8">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-3xl font-bold text-red-600">
                        <i class="fas fa-star mr-2"></i>Examen Final
                    </h2>
                    <button onclick="cancelLesson()" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center transition-colors">
                        <i class="fas fa-times mr-2"></i>Annuler
                    </button>
                </div>
                <p class="text-gray-600">Score minimum requis: ${passingScore}%</p>
                
                <!-- Score Preview -->
                <div class="mt-6 bg-white rounded-lg p-4 border-2 border-red-200">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-semibold text-gray-800">Score: ${examScore}%</span>
                        <span class="font-bold text-lg ${passed ? 'text-green-600' : 'text-red-600'}">
                            ${correctCount}/${questions.length}
                        </span>
                    </div>
                    <div class="bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div class="bg-gradient-to-r from-red-500 to-pink-500 h-full transition-all" 
                             style="width: ${examScore}%"></div>
                    </div>
                </div>
            </div>
            
            <!-- Questions -->
            <div class="space-y-4">
                ${questionsHTML}
            </div>
            
            <!-- Submit Button -->
            ${Object.keys(examAnswers).length === questions.length ? `
                <div class="mt-12 mb-6">
                    <button onclick="submitExam()" class="w-full ${passed ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-pink-500'} text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all">
                        <i class="fas fa-check-circle mr-2"></i>Soumettre l'examen
                    </button>
                </div>
            ` : `
                <div class="mt-12 mb-6 text-center">
                    <p class="text-gray-600">Répondez à toutes les questions pour soumettre</p>
                </div>
            `}
        </div>
    `;
}

/**
 * Répond à une question d'examen
 */
function answerExam(index, answer) {
    currentLessonState.examAnswers[index] = answer;
    showExam();
}

/**
 * Soumet l'examen et complète la leçon
 */
async function submitExam() {
    const { theme, lessonId, lessonData, examScore } = currentLessonState;
    const passingScore = lessonData.finalExam.passingScore;
    const passed = examScore >= passingScore;
    
    if (!passed) {
        alert(`❌ Score insuffisant (${examScore}% < ${passingScore}%). Réessayez!`);
        return;
    }
    
    // Leçon complétée!
    showCompletionScreen();
    
    // Mettre à jour la leçon dans la base de données
    const lesson = await getLessonById(lessonId);
    if (lesson) {
        lesson.completed = true;
        lesson.progress = 100;
        lesson.completedAt = new Date().toISOString();
        lesson.score = examScore;
        await saveLesson(lesson);
        
        // Ajouter les XP
        const user = await getUser();
        user.xp += lesson.xp;
        user.totalXPEarned = (user.totalXPEarned || 0) + lesson.xp;
        await saveUser(user);
    }
}

/**
 * Affiche l'écran de complétion
 */
function showCompletionScreen() {
    currentLessonState.currentStep = 'completed';
    const container = document.getElementById('lessonPlayerContent');
    const { lessonData, examScore, theme, lessonId } = currentLessonState;
    
    let stars = '⭐';
    if (examScore >= 90) stars = '⭐⭐⭐';
    else if (examScore >= 80) stars = '⭐⭐';
    
    container.innerHTML = `
        <div class="p-6 flex flex-col items-center justify-center min-h-screen text-center">
            <div class="animate__animated animate__bounceIn mb-8">
                <div class="text-7xl mb-4">🎉</div>
                <h2 class="text-4xl font-bold text-green-600 mb-2">Leçon Complétée!</h2>
                <p class="text-xl text-gray-600 mb-6">${lessonData.title}</p>
                
                <!-- Star Rating -->
                <div class="text-6xl mb-8">${stars}</div>
                
                <!-- Score -->
                <div class="bg-green-50 rounded-lg p-8 border-2 border-green-500 mb-8">
                    <p class="text-gray-600 mb-2">Score Final</p>
                    <p class="text-5xl font-bold text-green-600">${examScore}%</p>
                </div>
                
                <!-- XP Earned -->
                <div class="bg-blue-50 rounded-lg p-8 border-2 border-blue-500 mb-8">
                    <p class="text-gray-600 mb-2">XP Gagnés</p>
                    <p class="text-4xl font-bold text-blue-600">+${lessonData.difficulty ? lessonData.xp : 50} XP</p>
                </div>
                
                <!-- Actions -->
                <div class="flex gap-4 w-full max-w-md">
                    <button onclick="returnToLessons()" class="flex-1 bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-all">
                        <i class="fas fa-arrow-left mr-2"></i>Retour
                    </button>
                    <button onclick="nextLesson()" class="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all">
                        <i class="fas fa-arrow-right mr-2"></i>Suivant
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Retour à l'écran des leçons
 */
function returnToLessons() {
    document.getElementById('lessonPlayerScreen').style.display = 'none';
    document.getElementById('lessonPlayerScreen').classList.add('hidden');
    navigateTo('lessonsScreen');
}

/**
 * Charge la prochaine leçon du thème
 */
async function nextLesson() {
    const { theme, lessonId } = currentLessonState;
    const lessons = await getLessons();
    const themeLesson = lessons.filter(l => l.theme === theme).sort((a, b) => a.id - b.id);
    
    // Trouver la position actuelle et passer à la suivante
    const currentIndex = themeLesson.findIndex(l => l.id === lessonId);
    if (currentIndex < themeLesson.length - 1) {
        const nextLessonData = themeLesson[currentIndex + 1];
        initLessonPlayer(theme, nextLessonData.id);
    } else {
        alert('Vous avez complété toutes les leçons de ce thème! Bravo!');
        returnToLessons();
    }
}

/**
 * Annule la leçon
 */
function cancelLesson() {
    if (confirm('Êtes-vous sûr de vouloir quitter la leçon? Votre progression sera sauvegardée mais la leçon ne sera pas complétée.')) {
        returnToLessons();
    }
}

/**
 * Quitte la leçon
 */
function exitLesson() {
    if (confirm('Êtes-vous sûr de vouloir quitter la leçon? Votre progression sera sauvegardée.')) {
        returnToLessons();
    }
}
