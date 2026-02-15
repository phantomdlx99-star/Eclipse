export interface Chapter {
  id: number;
  title: string;
  description: string;
  slug: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  slug: string;
  chapters: Chapter[];
}

export interface ClassLevel {
  id: string;
  title: string;
  slug: string;
  subjects: Subject[];
}

export const GSEB_CURRICULUM: ClassLevel[] = [
  {
    id: "class-9",
    title: "Class 9",
    slug: "class-9",
    subjects: [
      {
        id: "9-maths",
        name: "Mathematics",
        slug: "mathematics",
        description:
          "Learn maths with ease and get your dobuts solved by our platform.",
        chapters: [
          {
            id: 1,
            title: "Number Systems",
            slug: "number-systems",
            description:
              "Explore different number systems including natural, whole, integers, and rational numbers.",
          },
          {
            id: 2,
            title: "Polynomials",
            slug: "polynomials",
            description:
              "Understand polynomials, their operations, and factorization techniques.",
          },
          {
            id: 3,
            title: "Coordinate Geometry",
            slug: "coordinate-geometry",
            description:
              "Learn how to plot points on a coordinate system and understand geometric relationships.",
          },
          {
            id: 4,
            title: "Linear Equations in Two Variables",
            slug: "linear-equations-in-two-variables",
            description:
              "Solve and graph linear equations involving two variables.",
          },
          {
            id: 5,
            title: "Introduction to Euclid's Geometry",
            slug: "introduction-to-euclids-geometry",
            description:
              "Discover the foundational principles of Euclidean geometry and geometric proofs.",
          },
          {
            id: 6,
            title: "Lines and Angles",
            slug: "lines-and-angles",
            description:
              "Study properties of lines, angles, and their relationships.",
          },
          {
            id: 7,
            title: "Triangles",
            slug: "triangles",
            description:
              "Explore triangle properties, congruence, and similarity.",
          },
        ],
      },
      {
        id: "9-science",
        name: "Science",
        slug: "science",
        description:
          "Discover fundamental concepts of physics, chemistry, and biology in the world around us.",
        chapters: [
          {
            id: 1,
            title: "Matter in Our Surroundings",
            slug: "matter-in-our-surroundings",
            description:
              "Learn about the physical states of matter and their properties.",
          },
          {
            id: 2,
            title: "Is Matter Around Us Pure?",
            slug: "is-matter-around-us-pure",
            description:
              "Understand pure substances, mixtures, and methods of separation.",
          },
          {
            id: 3,
            title: "Atoms and Molecules",
            slug: "atoms-and-molecules",
            description: "Explore the basic building blocks of matter.",
          },
          {
            id: 4,
            title: "Structure of the Atom",
            slug: "structure-of-the-atom",
            description:
              "Understand atomic structure, subatomic particles, and electron configuration.",
          },
          {
            id: 5,
            title: "The Fundamental Unit of Life",
            slug: "the-fundamental-unit-of-life",
            description:
              "Study cells as the basic unit of life and their organelles.",
          },
        ],
      },
    ],
  },
  {
    id: "class-10",
    title: "Class 10 (SSC)",
    slug: "class-10",
    subjects: [
      {
        id: "10-maths",
        name: "Mathematics",
        slug: "mathematics",
        description:
          "Master advanced mathematical concepts including equations, progressions, and geometric relationships.",
        chapters: [
          {
            id: 1,
            title: "Real Numbers",
            slug: "real-numbers",
            description:
              "Understand the real number system, Euclid's division algorithm, and the fundamental theorem of arithmetic.",
          },
          {
            id: 2,
            title: "Polynomials",
            slug: "polynomials",
            description:
              "Work with polynomial expressions, factorization, and the relationship between zeros and coefficients.",
          },
          {
            id: 3,
            title: "Pair of Linear Equations in Two Variables",
            slug: "pair-of-linear-equations-in-two-variables",
            description:
              "Solve systems of linear equations using various algebraic and graphical methods.",
          },
          {
            id: 4,
            title: "Quadratic Equations",
            slug: "quadratic-equations",
            description:
              "Solve quadratic equations and understand the nature of their roots.",
          },
          {
            id: 5,
            title: "Arithmetic Progressions",
            slug: "arithmetic-progressions",
            description:
              "Study arithmetic sequences, find their terms, and calculate their sums.",
          },
          {
            id: 6,
            title: "Triangles",
            slug: "triangles",
            description:
              "Explore triangle similarity, congruence criteria, and the Pythagorean theorem.",
          },
          {
            id: 7,
            title: "Coordinate Geometry",
            slug: "coordinate-geometry",
            description:
              "Find distances between points, understand section formula, and explore geometric shapes.",
          },
          {
            id: 8,
            title: "Introduction to Trigonometry",
            slug: "introduction-to-trigonometry",
            description:
              "Learn trigonometric ratios and their applications in solving problems.",
          },
        ],
      },
      {
        id: "10-science",
        name: "Science",
        slug: "science",
        description:
          "Explore chemical reactions, life processes, and natural phenomena in depth.",
        chapters: [
          {
            id: 1,
            title: "Chemical Reactions and Equations",
            slug: "chemical-reactions-and-equations",
            description:
              "Understand types of chemical reactions and how to balance chemical equations.",
          },
          {
            id: 2,
            title: "Acids, Bases and Salts",
            slug: "acids-bases-and-salts",
            description:
              "Learn about properties of acids and bases and how to identify salts.",
          },
          {
            id: 3,
            title: "Metals and Non-metals",
            slug: "metals-and-non-metals",
            description:
              "Study the characteristics of metals and non-metals and their reactions.",
          },
          {
            id: 4,
            title: "Carbon and its Compounds",
            slug: "carbon-and-its-compounds",
            description:
              "Explore the unique properties of carbon and organic compounds.",
          },
          {
            id: 5,
            title: "Life Processes",
            slug: "life-processes",
            description:
              "Understand vital life processes including respiration and photosynthesis.",
          },
          {
            id: 6,
            title: "Control and Coordination",
            slug: "control-and-coordination",
            description:
              "Learn about nervous and hormonal systems that control body functions.",
          },
        ],
      },
    ],
  },
  {
    id: "class-11-sci",
    title: "Class 11 Science",
    slug: "class-11-science",
    subjects: [
      {
        id: "11-phy",
        name: "Physics",
        slug: "physics",
        description:
          "Master the fundamental principles of classical mechanics and wave theory.",
        chapters: [
          {
            id: 1,
            title: "Physical World",
            slug: "physical-world",
            description:
              "Understand the scope and nature of physics and its applications.",
          },
          {
            id: 2,
            title: "Units and Measurements",
            slug: "units-and-measurements",
            description:
              "Learn about different units of measurement and the importance of accuracy.",
          },
          {
            id: 3,
            title: "Motion in a Straight Line",
            slug: "motion-in-a-straight-line",
            description:
              "Study kinematics and analyze motion along a straight path.",
          },
          {
            id: 4,
            title: "Motion in a Plane",
            slug: "motion-in-a-plane",
            description:
              "Explore two-dimensional motion including projectile motion.",
          },
          {
            id: 5,
            title: "Laws of Motion",
            slug: "laws-of-motion",
            description:
              "Understand Newton's laws of motion and their applications.",
          },
        ],
      },
      {
        id: "11-chem",
        name: "Chemistry",
        slug: "chemistry",
        description:
          "Discover the structure of matter and the nature of chemical bonds.",
        chapters: [
          {
            id: 1,
            title: "Some Basic Concepts of Chemistry",
            slug: "some-basic-concepts-of-chemistry",
            description:
              "Learn fundamental chemistry concepts including atomic mass and mole concept.",
          },
          {
            id: 2,
            title: "Structure of Atom",
            slug: "structure-of-atom",
            description:
              "Understand modern atomic theory and quantum mechanics.",
          },
          {
            id: 3,
            title: "Classification of Elements",
            slug: "classification-of-elements",
            description: "Study the periodic table and periodic trends.",
          },
        ],
      },
    ],
  },
  {
    id: "class-12-sci",
    title: "Class 12 Science (HSC)",
    slug: "class-12-science",
    subjects: [
      {
        id: "12-maths",
        name: "Mathematics",
        slug: "mathematics",
        description: "Explore advanced calculus and linear algebra concepts.",
        chapters: [
          {
            id: 1,
            title: "Relations and Functions",
            slug: "relations-and-functions",
            description:
              "Understand relationships between sets and properties of functions.",
          },
          {
            id: 2,
            title: "Inverse Trigonometric Functions",
            slug: "inverse-trigonometric-functions",
            description:
              "Study inverse trigonometric functions and their properties.",
          },
          {
            id: 3,
            title: "Matrices",
            slug: "matrices",
            description: "Learn matrix operations and applications.",
          },
          {
            id: 4,
            title: "Determinants",
            slug: "determinants",
            description:
              "Understand determinants and their use in solving linear equations.",
          },
          {
            id: 5,
            title: "Continuity and Differentiability",
            slug: "continuity-and-differentiability",
            description:
              "Master concepts of limits, continuity, and derivatives.",
          },
        ],
      },
      {
        id: "12-phy",
        name: "Physics",
        slug: "physics",
        description: "Study electromagnetism and modern physics phenomena.",
        chapters: [
          {
            id: 1,
            title: "Electric Charges and Fields",
            slug: "electric-charges-and-fields",
            description:
              "Understand electric charges and the concept of electric fields.",
          },
          {
            id: 2,
            title: "Electrostatic Potential and Capacitance",
            slug: "electrostatic-potential-and-capacitance",
            description:
              "Learn about electric potential energy and capacitors.",
          },
          {
            id: 3,
            title: "Current Electricity",
            slug: "current-electricity",
            description:
              "Study electric current, resistance, and circuit analysis.",
          },
        ],
      },
    ],
  },
  {
    id: "class-12-com",
    title: "Class 12 Commerce",
    slug: "class-12-commerce",
    subjects: [
      {
        id: "12-acc",
        name: "Accountancy",
        slug: "accountancy",
        description:
          "Master the principles of accounting and financial record-keeping.",
        chapters: [
          {
            id: 1,
            title: "Introduction to Partnership",
            slug: "introduction-to-partnership",
            description:
              "Understand partnership agreements and the partnership business structure.",
          },
          {
            id: 2,
            title: "Partnership Final Accounts",
            slug: "partnership-final-accounts",
            description:
              "Learn how to prepare financial statements for partnerships.",
          },
          {
            id: 3,
            title: "Valuation of Goodwill",
            slug: "valuation-of-goodwill",
            description:
              "Study methods for valuing goodwill in partnership firms.",
          },
        ],
      },
      {
        id: "12-stat",
        name: "Statistics",
        slug: "statistics",
        description:
          "Learn statistical methods for data analysis and interpretation.",
        chapters: [
          {
            id: 1,
            title: "Index Number",
            slug: "index-number",
            description:
              "Understand index numbers and their applications in economics.",
          },
          {
            id: 2,
            title: "Linear Correlation",
            slug: "linear-correlation",
            description:
              "Study the relationship between two variables using correlation analysis.",
          },
          {
            id: 3,
            title: "Linear Regression",
            slug: "linear-regression",
            description: "Learn regression analysis for predicting values.",
          },
        ],
      },
    ],
  },
];

export const LEGAL = [
  {
    label: "Privacy Policy",
    name: "privacy-policy",
    content:
      "At Eclipse, we prioritize your data security. We collect minimal personal information to provide you with personalized AI-driven learning paths, study schedules, and progress tracking. Your interactions with our AI tools, such as the Mind Map and Flashcard generators, are used to refine your experience. We never sell your data to third parties and use industry-standard encryption to keep your information safe and private.",
  },
  {
    label: "Terms of Use",
    name: "terms-of-use",
    content:
      "By using Eclipse, you agree to use our platform for educational purposes only. All content, including courses, curriculum materials, and AI-generated study aids, is the intellectual property of Eclipse. You may not redistribute, sell, or modify our content without explicit permission. Users are responsible for maintaining account security and must comply with all local and international laws while using our services.",
  },
  {
    label: "Disclaimer",
    name: "disclaimer",
    content:
      "The information provided on Eclipse, including AI-generated timetables and study materials, is for supplemental educational purposes only. While we strive for accuracy in our GSEB curriculum and AI responses, we do not guarantee that all content is error-free. Eclipse is not liable for any academic outcomes or decisions made based on the platform's content. We recommend cross-referencing with official textbooks for critical exam preparation.",
  },
];
