// Comprehensive Exercise Dataset for FitLife Exercise Library
// 50+ exercises covering Chest, Back, Shoulders, Biceps, Triceps, Legs, Core, Cardio & Mobility

export const EXERCISE_CATEGORIES = {
  muscles: [
    'All',
    'Chest',
    'Back',
    'Shoulders',
    'Biceps',
    'Triceps',
    'Legs',
    'Core',
    'Cardio',
    'Full Body'
  ],
  equipment: [
    'All',
    'Barbell',
    'Dumbbell',
    'Cable',
    'Machine',
    'Bodyweight',
    'Kettlebell',
    'Other'
  ],
  difficulties: [
    'All',
    'Beginner',
    'Intermediate',
    'Advanced'
  ],
  types: [
    'All',
    'Strength',
    'Bodyweight',
    'Cardio',
    'Mobility',
    'Stretching'
  ]
};

export const INITIAL_EXERCISES = [
  // ==================== CHEST ====================
  {
    id: 'barbell-bench-press',
    name: 'Barbell Bench Press',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Triceps', 'Front Deltoids'],
    equipment: 'Barbell',
    exerciseType: 'Strength',
    difficulty: 'Intermediate',
    recommendedReps: '8 - 12 reps',
    met: 5.0,
    description: 'A foundational compound upper-body pressing movement for maximal pectoral hypertrophy and horizontal pressing strength.',
    instructions: [
      'Lie flat on the bench with your eyes aligned under the racked barbell.',
      'Grip the bar slightly wider than shoulder-width and retract your shoulder blades.',
      'Unrack the bar and hold it steady directly above your sternum.',
      'Lower the bar under control until it lightly touches your mid-chest.',
      'Press the bar explosively back to starting position while exhaling.'
    ],
    tips: 'Keep your feet flat on the floor and maintain a natural arch in your lower back.'
  },
  {
    id: 'incline-barbell-bench-press',
    name: 'Incline Barbell Bench Press',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Front Deltoids', 'Triceps'],
    equipment: 'Barbell',
    exerciseType: 'Strength',
    difficulty: 'Intermediate',
    recommendedReps: '8 - 12 reps',
    met: 5.0,
    description: 'Targeted upper chest compound exercise that builds clavicular head thickness and shoulder stability.',
    instructions: [
      'Set an incline bench to approximately 30 to 45 degrees.',
      'Grip the bar slightly wider than shoulder-width with wrists straight.',
      'Unrack the bar and lower it slowly toward your upper chest.',
      'Push forcefully upward until your elbows reach full extension.'
    ],
    tips: 'Avoid too steep an incline angle (over 45°) to prevent excessive anterior delt takeover.'
  },
  {
    id: 'dumbbell-bench-press',
    name: 'Dumbbell Bench Press',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Triceps', 'Front Deltoids'],
    equipment: 'Dumbbell',
    exerciseType: 'Strength',
    difficulty: 'Beginner',
    recommendedReps: '10 - 12 reps',
    met: 4.5,
    description: 'Allows greater range of motion and unilateral chest recruitment while protecting shoulder joint health.',
    instructions: [
      'Sit on a flat bench with dumbbells resting vertically on your thighs.',
      'Kick the dumbbells back as you lie down, positioning them outside your chest.',
      'Press both dumbbells upward in an arc toward the ceiling without clanking them.',
      'Lower under control to feel a deep stretch in the chest.'
    ],
    tips: 'Rotate your hands slightly inward at 45 degrees for ergonomic shoulder safety.'
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Front Deltoids', 'Triceps'],
    equipment: 'Dumbbell',
    exerciseType: 'Strength',
    difficulty: 'Intermediate',
    recommendedReps: '10 - 15 reps',
    met: 4.5,
    description: 'Premier upper chest builder ensuring balanced strength development across both pectorals.',
    instructions: [
      'Set bench to a 30-degree incline and lean back with dumbbells at shoulder level.',
      'Press the weights smoothly upward until arms are straight.',
      'Slowly lower the dumbbells until you feel a comfortable stretch in your upper chest.'
    ],
    tips: 'Keep your elbows tucked at roughly 60 degrees from your torso.'
  },
  {
    id: 'cable-fly',
    name: 'Cable Chest Fly',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Front Deltoids'],
    equipment: 'Cable',
    exerciseType: 'Strength',
    difficulty: 'Beginner',
    recommendedReps: '12 - 15 reps',
    met: 3.5,
    description: 'Provides continuous tension throughout the entire range of motion, optimizing the chest peak contraction.',
    instructions: [
      'Set pulleys to shoulder height and hold both stirrup handles.',
      'Step forward with one foot for stability and lean forward slightly.',
      'Bring hands together in front of your chest in a hugging motion with elbows slightly bent.',
      'Return slowly to feel the chest stretch.'
    ],
    tips: 'Do not let your shoulders roll forward at the peak of the squeeze.'
  },
  {
    id: 'pec-deck-fly',
    name: 'Pec Deck Machine Fly',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Front Deltoids'],
    equipment: 'Machine',
    exerciseType: 'Strength',
    difficulty: 'Beginner',
    recommendedReps: '12 - 15 reps',
    met: 3.5,
    description: 'Isolated chest machine that eliminates balance requirements, focusing 100% on pectoral contraction.',
    instructions: [
      'Adjust seat height so handles align with mid-chest.',
      'Grip the handles or place forearms on the pads with elbows slightly bent.',
      'Squeeze the pads/handles together in front of your body.',
      'Pause for 1 second, then slowly control the return.'
    ],
    tips: 'Focus on squeezing your chest muscles rather than pushing with your hands.'
  },
  {
    id: 'push-up',
    name: 'Push-Up',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Triceps', 'Front Deltoids', 'Core'],
    equipment: 'Bodyweight',
    exerciseType: 'Bodyweight',
    difficulty: 'Beginner',
    recommendedReps: '15 - 25 reps',
    met: 4.0,
    description: 'Classic functional bodyweight exercise developing core stiffness and upper-body pushing stamina.',
    instructions: [
      'Start in a high plank position with hands beneath your shoulders.',
      'Engage your glutes and core to keep your body in a straight line.',
      'Lower your chest until it is an inch from the floor.',
      'Push the ground away to return to top position.'
    ],
    tips: 'Do not let your hips sag or hike up toward the ceiling.'
  },
  {
    id: 'chest-dip',
    name: 'Chest Dip',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Triceps', 'Front Deltoids'],
    equipment: 'Bodyweight',
    exerciseType: 'Bodyweight',
    difficulty: 'Advanced',
    recommendedReps: '8 - 12 reps',
    met: 5.5,
    description: 'High-intensity compound movement targeting the lower pectoral fibers and triceps.',
    instructions: [
      'Mount parallel bars and support your bodyweight with straight arms.',
      'Lean your torso forward about 30 degrees and flare elbows slightly.',
      'Lower yourself until your upper arms are parallel to the floor.',
      'Push through your palms to return to the top.'
    ],
    tips: 'Leaning forward emphasizes the chest; staying upright targets the triceps.'
  },

  // ==================== BACK ====================
  {
    id: 'pull-up',
    name: 'Pull-Up',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Biceps', 'Forearms', 'Rear Deltoids'],
    equipment: 'Bodyweight',
    exerciseType: 'Bodyweight',
    difficulty: 'Intermediate',
    recommendedReps: '6 - 12 reps',
    met: 6.0,
    description: 'The king of bodyweight pulling exercises for back width, lat activation, and grip strength.',
    instructions: [
      'Grip a pull-up bar with an overhand grip slightly wider than shoulder-width.',
      'Hang with arms fully extended and engage your lats.',
      'Pull your chest up toward the bar, driving your elbows down toward your hips.',
      'Clear your chin over the bar, pause briefly, and lower with control.'
    ],
    tips: 'Avoid swinging your legs or using momentum (kipping).'
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Biceps', 'Upper Back'],
    equipment: 'Cable',
    exerciseType: 'Strength',
    difficulty: 'Beginner',
    recommendedReps: '10 - 12 reps',
    met: 4.5,
    description: 'Accessible vertical pull that lets you isolate the latissimus dorsi with precise weight increments.',
    instructions: [
      'Sit facing the lat pulldown machine with thighs secured under pads.',
      'Grip the wide bar with palms facing forward.',
      'Pull the bar down smoothly toward your upper collarbone.',
      'Squeeze your lats at the bottom, then slowly extend arms back up.'
    ],
    tips: 'Lean back slightly (10-15°) but keep your spine neutral without jerking.'
  },
  {
    id: 'barbell-row',
    name: 'Bent-Over Barbell Row',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Biceps', 'Hamstrings', 'Lower Back'],
    equipment: 'Barbell',
    exerciseType: 'Strength',
    difficulty: 'Intermediate',
    recommendedReps: '8 - 10 reps',
    met: 5.5,
    description: 'Heavy compound horizontal row building supreme back thickness, rhomboid density, and spinal erector strength.',
    instructions: [
      'Hinge at your hips with knees slightly bent until torso is roughly 45 degrees.',
      'Grip barbell overhand and pull the bar up toward your belly button.',
      'Squeeze shoulder blades firmly together at the top.',
      'Lower the bar with control without rounding your lower back.'
    ],
    tips: 'Maintain a flat lower back and brace your core tightly throughout.'
  },
  {
    id: 'seated-cable-row',
    name: 'Seated Cable Row',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Biceps', 'Forearms', 'Rear Deltoids'],
    equipment: 'Cable',
    exerciseType: 'Strength',
    difficulty: 'Beginner',
    recommendedReps: '10 - 12 reps',
    met: 4.0,
    description: 'Safe horizontal pull providing constant cable tension for mid-back and lat development.',
    instructions: [
      'Sit on the bench with feet resting against footplates and knees slightly bent.',
      'Grip the V-bar handle and sit up tall with shoulders back.',
      'Pull the handle into your abdomen, pinching your shoulder blades together.',
      'Slowly extend arms forward while maintaining an upright posture.'
    ],
    tips: 'Do not rock backward and forward excessively with your lower back.'
  },
  {
    id: 'dumbbell-row',
    name: 'One-Arm Dumbbell Row',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Biceps', 'Rear Deltoids'],
    equipment: 'Dumbbell',
    exerciseType: 'Strength',
    difficulty: 'Beginner',
    recommendedReps: '10 - 12 reps',
    met: 4.5,
    description: 'Unilateral lat builder allowing you to fix side-to-side muscular imbalances.',
    instructions: [
      'Place one knee and hand on a flat bench for support.',
      'Hold a dumbbell in the opposite hand letting it hang straight down.',
      'Pull the dumbbell up toward your hip pocket, keeping elbow tight to your side.',
      'Lower under control to a full stretch.'
    ],
    tips: 'Think of your hand as a hook and pull with your elbow.'
  },
  {
    id: 'deadlift',
    name: 'Barbell Conventional Deadlift',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Hamstrings', 'Glutes', 'Forearms', 'Core'],
    equipment: 'Barbell',
    exerciseType: 'Strength',
    difficulty: 'Advanced',
    recommendedReps: '5 - 8 reps',
    met: 6.5,
    description: 'The ultimate posterior chain test of total-body strength, spinal density, and hip power.',
    instructions: [
      'Stand with mid-foot directly under the bar, feet hip-width apart.',
      'Bend at hips and knees to grip the bar outside your shins.',
      'Flatten your back, pack your lats, and take the slack out of the bar.',
      'Drive through your heels to stand up tall, locking hips and knees together.',
      'Hinge back down in a controlled reverse path.'
    ],
    tips: 'Never let your lower back round over under heavy loads.'
  },

  // ==================== SHOULDERS ====================
  {
    id: 'overhead-press',
    name: 'Overhead Barbell Press',
    primaryMuscle: 'Shoulders',
    secondaryMuscles: ['Triceps', 'Upper Chest', 'Core'],
    equipment: 'Barbell',
    exerciseType: 'Strength',
    difficulty: 'Intermediate',
    recommendedReps: '6 - 10 reps',
    met: 5.5,
    description: 'Standing military press building broad boulder shoulders and athletic core stability.',
    instructions: [
      'Stand tall holding barbell across upper chest with hands just outside shoulders.',
      'Brace core and squeeze glutes for a rock-solid foundation.',
      'Press the bar straight up overhead, moving your head slightly back to let it pass.',
      'Lock out with the bar directly aligned over your mid-foot and spine.'
    ],
    tips: 'Keep your core braced tightly to prevent excessive lumbar hyperextension.'
  },
  {
    id: 'dumbbell-shoulder-press',
    name: 'Seated Dumbbell Shoulder Press',
    primaryMuscle: 'Shoulders',
    secondaryMuscles: ['Triceps'],
    equipment: 'Dumbbell',
    exerciseType: 'Strength',
    difficulty: 'Beginner',
    recommendedReps: '8 - 12 reps',
    met: 4.5,
    description: 'Classic vertical shoulder press allowing natural wrist rotation and balanced deltoid hypertrophy.',
    instructions: [
      'Sit on an upright bench with dumbbells at ear level, elbows bent 90 degrees.',
      'Press the dumbbells upward until arms are straight overhead.',
      'Slowly lower back to ear level under full control.'
    ],
    tips: 'Avoid clanking the dumbbells together at the top.'
  },
  {
    id: 'lateral-raise',
    name: 'Dumbbell Lateral Raise',
    primaryMuscle: 'Shoulders',
    secondaryMuscles: ['Traps'],
    equipment: 'Dumbbell',
    exerciseType: 'Strength',
    difficulty: 'Beginner',
    recommendedReps: '12 - 15 reps',
    met: 3.5,
    description: 'The number one exercise for adding side-delt width and creating the coveted V-taper physique.',
    instructions: [
      'Stand holding dumbbells at your sides with a slight forward torso lean.',
      'Raise the dumbbells out to the sides until upper arms are parallel to the floor.',
      'Lead with your elbows and keep wrists slightly below your elbows.',
      'Control the descent back to your sides.'
    ],
    tips: 'Use moderate weight and avoid swinging your torso for momentum.'
  },
  {
    id: 'face-pull',
    name: 'Cable Face Pull',
    primaryMuscle: 'Shoulders',
    secondaryMuscles: ['Rear Deltoids', 'Rotator Cuff', 'Upper Back'],
    equipment: 'Cable',
    exerciseType: 'Strength',
    difficulty: 'Beginner',
    recommendedReps: '15 - 20 reps',
    met: 3.5,
    description: 'Crucial posture-correcting movement strengthening the rear delts and external shoulder rotators.',
    instructions: [
      'Attach a rope handle to a high cable pulley.',
      'Grip the rope ends with thumbs pointing backward toward you.',
      'Pull the rope towards your face, separating your hands and flaring elbows back.',
      'Rotate your hands upward at the end of the pull and squeeze your upper back.'
    ],
    tips: 'Keep your shoulders down and avoid shrugging up toward your ears.'
  },
  {
    id: 'arnold-press',
    name: 'Arnold Dumbbell Press',
    primaryMuscle: 'Shoulders',
    secondaryMuscles: ['Triceps'],
    equipment: 'Dumbbell',
    exerciseType: 'Strength',
    difficulty: 'Intermediate',
    recommendedReps: '10 - 12 reps',
    met: 4.5,
    description: 'Invented by Arnold Schwarzenegger, this rotational press hits all three deltoid heads in one movement.',
    instructions: [
      'Hold dumbbells in front of your chin with palms facing your chest (like top of a curl).',
      'Press upward while simultaneously rotating your wrists 180 degrees outward.',
      'Finish at the top with palms facing forward.',
      'Reverse the rotational movement on the descent.'
    ],
    tips: 'Keep the rotation smooth and continuous throughout the press.'
  },

  // ==================== ARMS (BICEPS & TRICEPS) ====================
  {
    id: 'barbell-bicep-curl',
    name: 'Barbell Bicep Curl',
    primaryMuscle: 'Biceps',
    secondaryMuscles: ['Forearms'],
    equipment: 'Barbell',
    exerciseType: 'Strength',
    difficulty: 'Beginner',
    recommendedReps: '8 - 12 reps',
    met: 3.5,
    description: 'Gold standard bicep mass builder allowing heavy overloading of both bicep heads.',
    instructions: [
      'Stand with feet shoulder-width apart holding a barbell with palms facing up.',
      'Pin elbows to your sides and curl the bar toward your chest.',
      'Squeeze biceps hard at the peak for 1 second.',
      'Lower the bar slowly until arms are fully extended.'
    ],
    tips: 'Do not swing your hips or lean backward to lift the weight.'
  },
  {
    id: 'hammer-curl',
    name: 'Dumbbell Hammer Curl',
    primaryMuscle: 'Biceps',
    secondaryMuscles: ['Brachialis', 'Forearms'],
    equipment: 'Dumbbell',
    exerciseType: 'Strength',
    difficulty: 'Beginner',
    recommendedReps: '10 - 12 reps',
    met: 3.5,
    description: 'Neutral-grip curl targeting the brachialis and forearm muscles to push up the bicep peak.',
    instructions: [
      'Hold dumbbells with palms facing each other (neutral grip).',
      'Keeping elbows pinned at sides, curl weights up toward your shoulders.',
      'Pause at peak contraction, then lower slowly.'
    ],
    tips: 'Can be performed alternating one arm at a time or simultaneously.'
  },
  {
    id: 'preacher-curl',
    name: 'EZ-Bar Preacher Curl',
    primaryMuscle: 'Biceps',
    secondaryMuscles: ['Forearms'],
    equipment: 'Machine',
    exerciseType: 'Strength',
    difficulty: 'Intermediate',
    recommendedReps: '10 - 12 reps',
    met: 3.0,
    description: 'Eliminates all shoulder assistance and momentum, isolating the lower and middle bicep fibers.',
    instructions: [
      'Adjust preacher bench so armpits rest comfortably over the top of the pad.',
      'Hold EZ-bar with an underhand grip with arms extended.',
      'Curl the bar up toward your face, stopping before elbows lift off pad.',
      'Lower under complete control.'
    ],
    tips: 'Do not hyperextend your elbows at the very bottom of the rep.'
  },
  {
    id: 'triceps-pushdown',
    name: 'Cable Triceps Rope Pushdown',
    primaryMuscle: 'Triceps',
    secondaryMuscles: ['Forearms'],
    equipment: 'Cable',
    exerciseType: 'Strength',
    difficulty: 'Beginner',
    recommendedReps: '12 - 15 reps',
    met: 3.0,
    description: 'Isolates the lateral and medial triceps heads with a continuous cable resistance curve.',
    instructions: [
      'Attach a rope to high pulley and hold ends with palms facing each other.',
      'Pin elbows to your ribcage and push the rope down toward your thighs.',
      'Spread the rope ends apart at the bottom for maximum tricep contraction.',
      'Return up to 90 degrees with elbows remaining fixed.'
    ],
    tips: 'Keep your upper arms stationary; only your forearms should move.'
  },
  {
    id: 'skull-crusher',
    name: 'Lying Triceps Extension (Skull Crusher)',
    primaryMuscle: 'Triceps',
    secondaryMuscles: ['Forearms'],
    equipment: 'Barbell',
    exerciseType: 'Strength',
    difficulty: 'Intermediate',
    recommendedReps: '10 - 12 reps',
    met: 3.5,
    description: 'Hits the long head of the triceps responsible for upper arm thickness.',
    instructions: [
      'Lie flat on a bench holding an EZ-bar directly over your chest with narrow grip.',
      'Keeping upper arms vertical, bend elbows to lower the bar toward your forehead.',
      'Extend forearms back up by flexing the triceps.'
    ],
    tips: 'Keep elbows tucked in and pointed forward rather than flared out.'
  },
  {
    id: 'close-grip-bench-press',
    name: 'Close-Grip Bench Press',
    primaryMuscle: 'Triceps',
    secondaryMuscles: ['Chest', 'Front Deltoids'],
    equipment: 'Barbell',
    exerciseType: 'Strength',
    difficulty: 'Intermediate',
    recommendedReps: '8 - 10 reps',
    met: 5.0,
    description: 'Heavy compound pressing variation that shifts the primary load onto all three triceps heads.',
    instructions: [
      'Lie on flat bench and grip barbell shoulder-width apart.',
      'Unrack and lower the bar to lower chest while keeping elbows tucked close to body.',
      'Press up forcefully to lockout.'
    ],
    tips: 'Do not use too narrow a grip (less than shoulder-width) to protect wrist joints.'
  },

  // ==================== LEGS (QUADRICEPS, HAMSTRINGS, GLUTES) ====================
  {
    id: 'barbell-squat',
    name: 'Barbell Back Squat',
    primaryMuscle: 'Legs',
    secondaryMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    equipment: 'Barbell',
    exerciseType: 'Strength',
    difficulty: 'Advanced',
    recommendedReps: '6 - 10 reps',
    met: 6.0,
    description: 'The indisputable king of leg development. Strengthens quads, glutes, core, and promotes systemic muscle growth.',
    instructions: [
      'Rest barbell securely across upper trapezius muscles with feet shoulder-width apart.',
      'Brace core, inhale deeply, and initiate squat by breaking at hips and knees.',
      'Descend until thighs reach parallel to the ground.',
      'Drive powerfully through your heels to stand back up, exhaling near the top.'
    ],
    tips: 'Keep your chest proud and do not let your knees cave inward on the ascent.'
  },
  {
    id: 'leg-press',
    name: '45-Degree Leg Press',
    primaryMuscle: 'Legs',
    secondaryMuscles: ['Quadriceps', 'Glutes'],
    equipment: 'Machine',
    exerciseType: 'Strength',
    difficulty: 'Beginner',
    recommendedReps: '10 - 15 reps',
    met: 5.0,
    description: 'Enables massive quad overloading without putting heavy compressive shear forces on the spine.',
    instructions: [
      'Sit on machine with lower back pressed flush against the pad.',
      'Place feet shoulder-width in the center of the platform.',
      'Release safety pins and lower the platform until knees are at 90 degrees.',
      'Press through full foot to return, stopping just short of locking knees.'
    ],
    tips: 'Never lock out your knees forcefully at the top of the press.'
  },
  {
    id: 'leg-extension',
    name: 'Leg Extension Machine',
    primaryMuscle: 'Legs',
    secondaryMuscles: ['Quadriceps'],
    equipment: 'Machine',
    exerciseType: 'Strength',
    difficulty: 'Beginner',
    recommendedReps: '12 - 15 reps',
    met: 3.5,
    description: 'Strict quadriceps isolation hitting the rectus femoris and teardrop muscle (vastus medialis).',
    instructions: [
      'Sit on machine with pad positioned against lower shins just above ankles.',
      'Grip side handles and extend knees until legs are completely straight.',
      'Hold the peak quad squeeze for 1 second, then lower with control.'
    ],
    tips: 'Control the eccentric descent rather than letting the weights drop.'
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift (RDL)',
    primaryMuscle: 'Legs',
    secondaryMuscles: ['Hamstrings', 'Glutes', 'Lower Back'],
    equipment: 'Barbell',
    exerciseType: 'Strength',
    difficulty: 'Intermediate',
    recommendedReps: '8 - 12 reps',
    met: 5.5,
    description: 'Supreme hamstring and glute builder focusing on deep eccentric stretch and hip hinge mechanics.',
    instructions: [
      'Stand holding barbell with feet hip-width and a micro-bend in knees.',
      'Push your hips backward as if touching a wall behind you.',
      'Lower the bar down the front of your shins until you feel a deep hamstring stretch.',
      'Squeeze glutes to pull your hips forward back to starting stance.'
    ],
    tips: 'Movement comes entirely from the hips hinging; do not bend knees further.'
  },
  {
    id: 'lying-leg-curl',
    name: 'Lying Hamstring Leg Curl',
    primaryMuscle: 'Legs',
    secondaryMuscles: ['Hamstrings', 'Calves'],
    equipment: 'Machine',
    exerciseType: 'Strength',
    difficulty: 'Beginner',
    recommendedReps: '12 - 15 reps',
    met: 3.5,
    description: 'Isolated knee flexion movement sculpting the posterior thighs and knee joint stabilizers.',
    instructions: [
      'Lie face down on machine with roller pad positioned just below calf muscles.',
      'Grip side handles and curl legs upward toward your glutes.',
      'Squeeze hamstrings at the top, then slowly lower back down.'
    ],
    tips: 'Keep your hips pressed down into the bench throughout the curl.'
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    primaryMuscle: 'Legs',
    secondaryMuscles: ['Glutes', 'Quadriceps'],
    equipment: 'Dumbbell',
    exerciseType: 'Strength',
    difficulty: 'Intermediate',
    recommendedReps: '8 - 12 reps per leg',
    met: 5.0,
    description: 'Brutal unilateral leg builder developing balance, hip mobility, and single-leg strength.',
    instructions: [
      'Stand two feet in front of a bench and place the top of one rear foot on the bench.',
      'Hold dumbbells at sides and descend until front thigh is parallel to floor.',
      'Drive through front heel to stand back up.'
    ],
    tips: 'Keep your torso slightly forward to load the glute, or upright for quads.'
  },
  {
    id: 'hip-thrust',
    name: 'Barbell Hip Thrust',
    primaryMuscle: 'Legs',
    secondaryMuscles: ['Glutes', 'Hamstrings'],
    equipment: 'Barbell',
    exerciseType: 'Strength',
    difficulty: 'Intermediate',
    recommendedReps: '10 - 15 reps',
    met: 5.5,
    description: 'The number one exercise for glute max hypertrophy, hip extension power, and athletic sprint speed.',
    instructions: [
      'Sit on floor with upper back against a bench and a padded barbell across hips.',
      'Plant feet flat on floor shoulder-width apart.',
      'Drive through heels and extend hips upward until thighs and torso are in line.',
      'Squeeze glutes hard at the top for 2 seconds, then lower.'
    ],
    tips: 'Tuck your chin and look forward rather than tilting your head backward.'
  },
  {
    id: 'standing-calf-raise',
    name: 'Standing Calf Raise',
    primaryMuscle: 'Legs',
    secondaryMuscles: ['Calves'],
    equipment: 'Machine',
    exerciseType: 'Strength',
    difficulty: 'Beginner',
    recommendedReps: '15 - 20 reps',
    met: 3.0,
    description: 'Hits the gastrocnemius calf head through a deep stretch and high-rep ankle plantarflexion.',
    instructions: [
      'Place balls of feet on edge of platform with heels hanging off.',
      'Lower heels down as far as possible for a deep stretch.',
      'Rise up as high as possible on your tiptoes and hold for a full second.'
    ],
    tips: 'Pause at the bottom stretch to eliminate Achilles tendon bounce momentum.'
  },

  // ==================== CORE / ABS ====================
  {
    id: 'plank',
    name: 'Forearm Plank',
    primaryMuscle: 'Core',
    secondaryMuscles: ['Shoulders', 'Glutes'],
    equipment: 'Bodyweight',
    exerciseType: 'Bodyweight',
    difficulty: 'Beginner',
    recommendedReps: '45 - 60 sec hold',
    met: 3.5,
    description: 'Essential isometric core builder stabilizing the lumbar spine and developing abdominal endurance.',
    instructions: [
      'Rest on forearms with elbows directly under shoulders.',
      'Extend legs back with balls of feet touching the ground.',
      'Form a straight line from heels to crown of head, squeezing glutes and core.',
      'Hold position breathing smoothly throughout.'
    ],
    tips: 'Do not let your hips sag down or rise up into a tent shape.'
  },
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg Raise',
    primaryMuscle: 'Core',
    secondaryMuscles: ['Forearms', 'Hip Flexors'],
    equipment: 'Bodyweight',
    exerciseType: 'Bodyweight',
    difficulty: 'Advanced',
    recommendedReps: '10 - 15 reps',
    met: 4.5,
    description: 'Elite lower abdominal exercise requiring grip strength and dynamic posterior pelvic tilt.',
    instructions: [
      'Hang from a pull-up bar with arms fully extended.',
      'Keeping legs straight or slightly bent, raise feet up to bar level.',
      'Roll your pelvis up at the top to fully engage lower abs.',
      'Lower legs slowly without swinging.'
    ],
    tips: 'Control the descent to eliminate body swing before starting the next rep.'
  },
  {
    id: 'cable-woodchopper',
    name: 'Cable Woodchopper',
    primaryMuscle: 'Core',
    secondaryMuscles: ['Obliques', 'Shoulders'],
    equipment: 'Cable',
    exerciseType: 'Strength',
    difficulty: 'Intermediate',
    recommendedReps: '12 - 15 reps per side',
    met: 3.5,
    description: 'Rotational power exercise targeting internal and external obliques for athletic performance.',
    instructions: [
      'Stand perpendicular to cable tower with pulley set high.',
      'Grip handle with both hands and rotate torso diagonally down across your body.',
      'Pivot on rear foot as you complete the rotation.',
      'Return with control against cable resistance.'
    ],
    tips: 'Initiate the rotation from your core rather than pulling with your arms.'
  },
  {
    id: 'ab-wheel-rollout',
    name: 'Ab Wheel Rollout',
    primaryMuscle: 'Core',
    secondaryMuscles: ['Lats', 'Shoulders'],
    equipment: 'Other',
    exerciseType: 'Strength',
    difficulty: 'Advanced',
    recommendedReps: '8 - 12 reps',
    met: 4.5,
    description: 'High-leverage anti-extension core exercise building bulletproof abdominal tension.',
    instructions: [
      'Kneel on the floor holding the ab roller handles beneath shoulders.',
      'Roll the wheel forward slowly, extending your body as far as possible.',
      'Pull yourself back up by flexing your abs and rounding lower back slightly.'
    ],
    tips: 'Only extend as far as you can maintain a rigid, neutral lumbar spine.'
  },

  // ==================== CARDIO ====================
  {
    id: 'running-jogging',
    name: 'Treadmill / Outdoor Running',
    primaryMuscle: 'Cardio',
    secondaryMuscles: ['Legs', 'Heart'],
    equipment: 'Machine',
    exerciseType: 'Cardio',
    difficulty: 'Beginner',
    recommendedReps: '20 - 45 mins',
    met: 8.5,
    description: 'Cardiovascular endurance training that optimizes VO2 max, cardiac output, and burns massive calories.',
    instructions: [
      'Maintain an upright posture with a slight forward lean from the ankles.',
      'Land lightly on mid-foot with a quick cadence of 160-180 steps/min.',
      'Keep arms bent at 90 degrees swinging smoothly in rhythm.'
    ],
    tips: 'Start with a brisk 5-minute warm-up walk before ramping up speed.'
  },
  {
    id: 'jump-rope',
    name: 'Jump Rope (Skipping)',
    primaryMuscle: 'Cardio',
    secondaryMuscles: ['Calves', 'Shoulders', 'Forearms'],
    equipment: 'Other',
    exerciseType: 'Cardio',
    difficulty: 'Intermediate',
    recommendedReps: '10 - 20 mins',
    met: 10.0,
    description: 'High-density agility conditioning building foot speed, calf endurance, and aerobic conditioning.',
    instructions: [
      'Hold rope handles at hip height with elbows tucked in.',
      'Turn the rope with small wrist rotations rather than whole arm movements.',
      'Bounce lightly on the balls of your feet just 1-2 inches off the ground.'
    ],
    tips: 'Keep knees soft to absorb impact and jump with minimal vertical bounce.'
  },
  {
    id: 'cycling',
    name: 'Stationary / Outdoor Cycling',
    primaryMuscle: 'Cardio',
    secondaryMuscles: ['Quadriceps', 'Glutes'],
    equipment: 'Machine',
    exerciseType: 'Cardio',
    difficulty: 'Beginner',
    recommendedReps: '20 - 40 mins',
    met: 7.5,
    description: 'Low-impact cardiovascular conditioning ideal for knee health and sustained aerobic fat oxidation.',
    instructions: [
      'Adjust saddle height so knee has a slight bend (about 25-30°) at bottom of pedal stroke.',
      'Maintain a smooth circular pedaling cadence between 80-100 RPM.',
      'Engage core and rest hands lightly on handlebars.'
    ],
    tips: 'Avoid rocking your hips side to side on the saddle.'
  },
  {
    id: 'rowing-machine',
    name: 'Rowing Ergometer',
    primaryMuscle: 'Cardio',
    secondaryMuscles: ['Back', 'Legs', 'Core'],
    equipment: 'Machine',
    exerciseType: 'Cardio',
    difficulty: 'Intermediate',
    recommendedReps: '15 - 30 mins',
    met: 8.0,
    description: 'Full-body cardiovascular workout utilizing 85% of total muscle mass in an ergonomic pulling cycle.',
    instructions: [
      'Catch: Sit with knees bent, shins vertical, arms straight forward.',
      'Drive: Push with legs first, swing torso back, then pull handle to ribcage.',
      'Finish: Legs straight, torso leaned back 10 degrees, handle at sternum.',
      'Recovery: Extend arms, hinge forward, then bend knees to slide forward.'
    ],
    tips: 'Power breakdown: 60% legs, 20% core, 20% arms.'
  },

  // ==================== MOBILITY & YOGA ====================
  {
    id: 'surya-namaskar',
    name: 'Surya Namaskar (Sun Salutation)',
    primaryMuscle: 'Full Body',
    secondaryMuscles: ['Hamstrings', 'Shoulders', 'Spine'],
    equipment: 'Bodyweight',
    exerciseType: 'Mobility',
    difficulty: 'Beginner',
    recommendedReps: '5 - 12 rounds',
    met: 4.0,
    description: 'Ancient flow of 12 linked yoga postures synchronizing breath with dynamic full-body mobility and flexibility.',
    instructions: [
      'Pranamasana: Stand in prayer pose taking a deep breath.',
      'Hastauttanasana: Inhale, raise arms and arch back gently.',
      'Padahastasana: Exhale, fold forward touching toes with palms on ground.',
      'Ashwa Sanchalanasana: Inhale, step right leg back and look up.',
      'Chaturanga / Plank: Hold breath in straight push-up position.',
      'Ashtanga Namaskara: Exhale, lower knees, chest, and chin.',
      'Bhujangasana: Inhale, lift chest into cobra pose.',
      'Adho Mukha Svanasana: Exhale, push hips up into downward dog.',
      'Complete sequence by reversing steps back to prayer pose.'
    ],
    tips: 'Coordinate each posture smoothly with deliberate inhaling and exhaling.'
  },
  {
    id: 'worlds-greatest-stretch',
    name: "World's Greatest Stretch",
    primaryMuscle: 'Mobility',
    secondaryMuscles: ['Hip Flexors', 'Thoracic Spine', 'Hamstrings'],
    equipment: 'Bodyweight',
    exerciseType: 'Mobility',
    difficulty: 'Beginner',
    recommendedReps: '5 reps per side',
    met: 2.5,
    description: 'Comprehensive dynamic mobility stretch opening up hips, thoracic rotation, and hamstring elasticity.',
    instructions: [
      'Step forward into a deep lunge with back leg straight.',
      'Place both hands on floor inside front foot.',
      'Take front-side elbow and drop it down toward floor inside your ankle.',
      'Rotate your torso and reach that same arm straight up toward the ceiling.',
      'Return hand down, push hips back to stretch front hamstring, then switch legs.'
    ],
    tips: 'Hold the top rotational reach for 2 deep breaths on every repetition.'
  }
];
