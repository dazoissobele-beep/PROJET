/**
 * Lesson Content Manager
 * Gère le contenu pédagogique des leçons
 * Structure: Cours → Exercices → Examen Final
 */

/**
 * Structure complète d'une leçon
 */
const LESSON_STRUCTURE = {
    course: {
        sections: [],      // Sections du cours avec contenu
        duration: null     // Durée estimée en minutes
    },
    exercises: {
        items: [],         // Exercices à compléter
        requiredCorrect: null  // Nombre de réponses correctes requises
    },
    finalExam: {
        questions: [],     // Questions du test final
        passingScore: null // Score minimum pour passer (%)
    }
};

/**
 * Base de données des contenus de leçons
 * Organisée par thème et leçon
 */
const LESSON_DATABASE = {
    'Alphabet & Phonétique': {
        1: {
            title: 'Les Voyelles Simples',
            description: 'Apprenez les voyelles A, E, I, O, U',
            course: {
                sections: [
                    {
                        title: 'Introduction aux Voyelles',
                        content: 'Les voyelles sont les sons fondamentaux du français. Il existe 5 voyelles principales: A, E, I, O, U.',
                        examples: ['Amour', 'Église', 'Igloo', 'Orage', 'Utile']
                    },
                    {
                        title: 'Prononciation du A',
                        content: 'Le "A" se prononce [a], bouche ouverte, langue plate.',
                        examples: ['Chat', 'Papa', 'Maison', 'Canada', 'Banane']
                    },
                    {
                        title: 'Prononciation du E',
                        content: 'Le "E" peut se prononcer [ə] (fermé) ou [ɛ] (ouvert).',
                        examples: ['Été', 'Mère', 'Lève', 'Été', 'École']
                    },
                    {
                        title: 'Prononciation du I',
                        content: 'Le "I" se prononce [i], lèvres arrondies vers l\'avant.',
                        examples: ['Lit', 'Tigre', 'Ski', 'Ici', 'Imiter']
                    },
                    {
                        title: 'Prononciation du O et U',
                        content: 'Le "O" [o] et le "U" [y] nécessitent une prononciation précise.',
                        examples: ['Olive', 'Ours', 'Utile', 'Université']
                    }
                ],
                duration: 10
            },
            exercises: {
                items: [
                    {
                        type: 'matching',
                        question: 'Associez le mot à la bonne voyelle initiale',
                        pairs: [
                            { word: 'Amis', vowel: 'A', correct: true },
                            { word: 'École', vowel: 'E', correct: true },
                            { word: 'Igloo', vowel: 'I', correct: true },
                            { word: 'Oeil', vowel: 'O', correct: true },
                            { word: 'Utile', vowel: 'U', correct: true }
                        ]
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Quel mot commence par "A"?',
                        options: ['École', 'Amour', 'Igloo', 'Orage'],
                        correct: 'Amour'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Quel mot commence par "E"?',
                        options: ['Amour', 'École', 'Igloo', 'Orage'],
                        correct: 'École'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Quel mot commence par "I"?',
                        options: ['Amour', 'École', 'Igloo', 'Orage'],
                        correct: 'Igloo'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Quel mot commence par "O"?',
                        options: ['Amour', 'École', 'Igloo', 'Orage'],
                        correct: 'Orage'
                    }
                ],
                requiredCorrect: 4
            },
            finalExam: {
                questions: [
                    {
                        type: 'multiple-choice',
                        question: 'Quelle est la prononciation correcte du "A"?',
                        options: ['[ə]', '[a]', '[i]', '[y]'],
                        correct: '[a]'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Quel mot utilise la voyelle "E" fermé?',
                        options: ['Mère', 'Lève', 'Été', 'École'],
                        correct: 'Été'
                    },
                    {
                        type: 'matching',
                        question: 'Associez chaque mot à sa voyelle dominante',
                        pairs: [
                            { word: 'Papa', vowel: 'A', correct: true },
                            { word: 'Tigre', vowel: 'I', correct: true },
                            { word: 'Utile', vowel: 'U', correct: true }
                        ]
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Laquelle de ces mots commence par "U"?',
                        options: ['Olivier', 'Utile', 'Igloo', 'École'],
                        correct: 'Utile'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Quel est l\'ordre correct des voyelles?',
                        options: ['E, A, I, O, U', 'A, E, I, O, U', 'I, E, A, O, U', 'O, A, E, I, U'],
                        correct: 'A, E, I, O, U'
                    }
                ],
                passingScore: 80
            }
        },
        2: {
            title: 'Les Consonnes Simples',
            description: 'Découvrez B, C, D, F, G',
            course: {
                sections: [
                    {
                        title: 'Introduction aux Consonnes',
                        content: 'Les consonnes créent des obstacles au passage de l\'air. Commençons par les 5 premières.',
                        examples: ['Ballon', 'Chat', 'Dent', 'Feu', 'Gâteau']
                    },
                    {
                        title: 'Le B - Consonne Occlusive',
                        content: 'Le "B" [b] se prononce avec les deux lèvres fermées.',
                        examples: ['Ballon', 'Bleu', 'Bambou', 'Boule', 'Bébé']
                    },
                    {
                        title: 'Le C - Consonne Variable',
                        content: 'Le "C" peut se prononcer [k] ou [s] selon le contexte.',
                        examples: ['Chat [k]', 'Cerise [s]', 'Classe [k]', 'Cinéma [s]', 'Crème [k]']
                    },
                    {
                        title: 'Le D et F - Consonnes Fricatives',
                        content: 'Le "D" [d] et le "F" [f] créent des fricatives distinctes.',
                        examples: ['Dent', 'Danger', 'Feu', 'Fille', 'Foyer']
                    },
                    {
                        title: 'Le G - Consonne Vélaire',
                        content: 'Le "G" se prononce [g] ou [ʒ] selon sa position.',
                        examples: ['Gâteau [g]', 'Girafe [ʒ]', 'Gris [g]', 'Gène [ʒ]']
                    }
                ],
                duration: 12
            },
            exercises: {
                items: [
                    {
                        type: 'multiple-choice',
                        question: 'Comment prononce-t-on le "B"?',
                        options: ['Avec la langue', 'Avec les dents', 'Avec les lèvres', 'Avec le palais'],
                        correct: 'Avec les lèvres'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Quel est le son du "C" dans "Chat"?',
                        options: ['[s]', '[k]', '[ʃ]', '[z]'],
                        correct: '[k]'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Quel est le son du "C" dans "Cerise"?',
                        options: ['[s]', '[k]', '[ʃ]', '[z]'],
                        correct: '[s]'
                    },
                    {
                        type: 'matching',
                        question: 'Associez chaque consonne à son son',
                        pairs: [
                            { word: 'Ballon', cons: 'B', correct: true },
                            { word: 'Dent', cons: 'D', correct: true },
                            { word: 'Feu', cons: 'F', correct: true },
                            { word: 'Gâteau', cons: 'G', correct: true }
                        ]
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Quel mot commence par "F"?',
                        options: ['Girafe', 'Dent', 'Fille', 'Ballon'],
                        correct: 'Fille'
                    }
                ],
                requiredCorrect: 4
            },
            finalExam: {
                questions: [
                    {
                        type: 'multiple-choice',
                        question: 'Prononcez "B" avec:',
                        options: ['La langue', 'Les lèvres', 'Les dents', 'Le palais'],
                        correct: 'Les lèvres'
                    },
                    {
                        type: 'matching',
                        question: 'Associez les mots à leurs consonnes initiales',
                        pairs: [
                            { word: 'Ballon', cons: 'B', correct: true },
                            { word: 'Cerise', cons: 'C', correct: true },
                            { word: 'Dent', cons: 'D', correct: true },
                            { word: 'Feu', cons: 'F', correct: true }
                        ]
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Quel mot contient deux consonnes différentes?',
                        options: ['Ballon', 'Chat', 'Fiche', 'Dada'],
                        correct: 'Chat'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Le "G" dans "Gâteau" se prononce:',
                        options: ['[ʒ]', '[g]', '[k]', '[f]'],
                        correct: '[g]'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Quel son "C" correspond à "Cinéma"?',
                        options: ['[k]', '[s]', '[ʃ]', '[z]'],
                        correct: '[s]'
                    }
                ],
                passingScore: 80
            }
        }
    },
    'Nombres & Mathématiques': {
        1: {
            title: 'Les Chiffres 0-10',
            description: 'Apprenez à compter jusqu\'à dix',
            course: {
                sections: [
                    {
                        title: 'Zéro à Cinq',
                        content: '0=Zéro, 1=Un, 2=Deux, 3=Trois, 4=Quatre, 5=Cinq',
                        examples: ['0 stylo', '1 chat', '2 yeux', '3 fleurs', '5 doigts']
                    },
                    {
                        title: 'Six à Dix',
                        content: '6=Six, 7=Sept, 8=Huit, 9=Neuf, 10=Dix',
                        examples: ['6 pieds', '7 jours', '8 chaises', '9 fenêtres', '10 doigts']
                    },
                    {
                        title: 'Utilisation Quotidienne',
                        content: 'Les chiffres s\'utilisent pour compter, donner l\'heure, etc.',
                        examples: ['Il y a 5 personnes', 'À 9 heures', '3 kilos']
                    }
                ],
                duration: 8
            },
            exercises: {
                items: [
                    {
                        type: 'multiple-choice',
                        question: 'Quel nombre est "Trois"?',
                        options: ['2', '3', '4', '5'],
                        correct: '3'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Comment s\'écrit "Six"?',
                        options: ['5', '6', '7', '8'],
                        correct: '6'
                    },
                    {
                        type: 'matching',
                        question: 'Associez le nombre au mot',
                        pairs: [
                            { num: '1', word: 'Un', correct: true },
                            { num: '5', word: 'Cinq', correct: true },
                            { num: '8', word: 'Huit', correct: true },
                            { num: '10', word: 'Dix', correct: true }
                        ]
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Après 7 vient?',
                        options: ['6', '8', '9', '10'],
                        correct: '8'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Quel nombre manque? 0,1,2,_,4',
                        options: ['2', '3', '5', '6'],
                        correct: '3'
                    }
                ],
                requiredCorrect: 4
            },
            finalExam: {
                questions: [
                    {
                        type: 'multiple-choice',
                        question: 'Quel est le nombre "Zéro"?',
                        options: ['0', '1', '2', '10'],
                        correct: '0'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Complétez: 2, 4, 6, 8, _',
                        options: ['7', '9', '10', '12'],
                        correct: '10'
                    },
                    {
                        type: 'matching',
                        question: 'Associez nombre à nom',
                        pairs: [
                            { num: '3', word: 'Trois', correct: true },
                            { num: '7', word: 'Sept', correct: true },
                            { num: '9', word: 'Neuf', correct: true }
                        ]
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Combien font 3+2?',
                        options: ['3', '4', '5', '6'],
                        correct: '5'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Quel nombre vient après 9?',
                        options: ['8', '10', '11', '12'],
                        correct: '10'
                    }
                ],
                passingScore: 80
            }
        }
    },
    'Vocabulaire Quotidien': {
        1: {
            title: 'Famille et Maison',
            description: 'Apprenez les mots liés à la famille et la maison',
            course: {
                sections: [
                    {
                        title: 'Membres de la Famille',
                        content: 'Papa, Maman, Frère, Sœur, Grand-mère, Grand-père, Cousin',
                        examples: ['Mon père', 'Ma mère', 'Mon frère aîné', 'Ma petite sœur', 'Mes cousins']
                    },
                    {
                        title: 'Pièces de la Maison',
                        content: 'Salon, Cuisine, Chambre, Salle de bain, Garage, Jardin',
                        examples: ['Dans la cuisine', 'Ma chambre', 'La salle de bain', 'Le salon']
                    },
                    {
                        title: 'Meubles et Objets',
                        content: 'Lit, Table, Chaise, Canapé, Armoire, Fenêtre',
                        examples: ['Une table en bois', 'Des chaises', 'Mon lit douillet', 'L\'armoire']
                    }
                ],
                duration: 10
            },
            exercises: {
                items: [
                    {
                        type: 'multiple-choice',
                        question: 'Quel mot signifie "père"?',
                        options: ['Frère', 'Papa', 'Cousin', 'Oncle'],
                        correct: 'Papa'
                    },
                    {
                        type: 'matching',
                        question: 'Associez la pièce à sa description',
                        pairs: [
                            { room: 'Cuisine', desc: 'Où on cuisine', correct: true },
                            { room: 'Chambre', desc: 'Où on dort', correct: true },
                            { room: 'Salle de bain', desc: 'Où on prend une douche', correct: true }
                        ]
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Quel meuble a des pieds?',
                        options: ['Porte', 'Table', 'Plafond', 'Mur'],
                        correct: 'Table'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Où dormez-vous?',
                        options: ['Cuisine', 'Chambre', 'Garage', 'Jardin'],
                        correct: 'Chambre'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'La maman est la mère de?',
                        options: ['Son ami', 'Son enfant', 'Son collègue', 'Son voisin'],
                        correct: 'Son enfant'
                    }
                ],
                requiredCorrect: 4
            },
            finalExam: {
                questions: [
                    {
                        type: 'matching',
                        question: 'Associez le terme à sa définition',
                        pairs: [
                            { term: 'Papa', def: 'Père', correct: true },
                            { term: 'Chambre', def: 'Lieu de sommeil', correct: true },
                            { term: 'Cuisine', def: 'Lieu de cuisson', correct: true }
                        ]
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Quel est un membre de la famille?',
                        options: ['Ami', 'Cousin', 'Voisin', 'Collègue'],
                        correct: 'Cousin'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Une salle de bain contient:',
                        options: ['Une cuisinière', 'Une douche', 'Un garage', 'Un jardin'],
                        correct: 'Une douche'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Quel n\'est pas un meuble?',
                        options: ['Table', 'Chaise', 'Porte', 'Canapé'],
                        correct: 'Porte'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Votre frère est votre:',
                        options: ['Cousin', 'Oncle', 'Sibling', 'Ami'],
                        correct: 'Sibling'
                    }
                ],
                passingScore: 80
            }
        }
    }
};

/**
 * Récupère le contenu complet d'une leçon
 */
function getLessonContent(theme, lessonId) {
    // Chercher dans la base de données
    if (LESSON_DATABASE[theme] && LESSON_DATABASE[theme][lessonId]) {
        return LESSON_DATABASE[theme][lessonId];
    }
    
    // Générer un contenu par défaut si la leçon n'existe pas dans la DB
    return generateDefaultLessonContent(theme, lessonId);
}

/**
 * Génère un contenu par défaut pour les leçons non définies
 */
function generateDefaultLessonContent(theme, lessonId) {
    const themeData = {
        'Alphabet & Phonétique': { icon: '🔤', baseXP: 10 },
        'Nombres & Mathématiques': { icon: '🔢', baseXP: 15 },
        'Vocabulaire Quotidien': { icon: '📖', baseXP: 20 },
        'Grammaire Essentielle': { icon: '✏️', baseXP: 25 },
        'Conversation & Dialogue': { icon: '💬', baseXP: 30 }
    };
    
    const data = themeData[theme] || { icon: '📚', baseXP: 20 };
    
    return {
        title: `${theme} - Leçon ${lessonId}`,
        description: `Apprenez les concepts clés de ${theme}`,
        course: {
            sections: [
                {
                    title: 'Concepts Fondamentaux',
                    content: `Dans cette leçon, nous explorons les concepts essentiels de "${theme}". Cette section vous introduce aux bases et aux principes clés.`,
                    examples: ['Exemple 1', 'Exemple 2', 'Exemple 3']
                },
                {
                    title: 'Pratique et Application',
                    content: 'Découvrez comment appliquer ces concepts dans des situations réelles du quotidien.',
                    examples: ['Application pratique 1', 'Application pratique 2']
                }
            ],
            duration: 10
        },
        exercises: {
            items: Array(5).fill(null).map((_, i) => ({
                type: 'multiple-choice',
                question: `Question d'exercice ${i + 1} - Testez votre compréhension`,
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correct: 'Option A'
            })),
            requiredCorrect: 3
        },
        finalExam: {
            questions: Array(5).fill(null).map((_, i) => ({
                type: 'multiple-choice',
                question: `Question d'examen ${i + 1}`,
                options: ['Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'],
                correct: 'Réponse A'
            })),
            passingScore: 80
        }
    };
}
