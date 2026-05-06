// CourseDetail.tsx
import './CourseDetail.css'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

// All courses data — same as Courses.tsx, later replace with API call
const ALL_COURSES = [
  {
    id: 1,
    title: 'Master Mathematics from Basics to Advanced',
    tutor: 'Ayesha Khan', subject: 'Mathematics', level: 'All Levels',
    rating: 4.9, reviewCount: 128, students: 340, price: 800, avatar: 'AK', experience: '6 years',
    about: 'I am a certified Mathematics tutor with 6 years of teaching experience. I have helped hundreds of students from Matric to university level improve their grades significantly. My sessions are structured, patient, and tailored to your individual pace.',
    whatYouLearn: ['Build a strong foundation in all core Math topics', 'Solve past papers and exam questions confidently', 'Understand concepts rather than just memorizing formulas', 'Get personalized attention and homework help'],
    subjects: ['Algebra', 'Calculus', 'Trigonometry', 'Statistics', 'Geometry'],
    availability: ['Mon – Fri: 4pm – 9pm', 'Sat – Sun: 10am – 6pm'],
    reviews: [
      { name: 'Ahmed K.', rating: 5, comment: 'Ayesha is an amazing tutor. My grades improved from C to A in just 2 months!' },
      { name: 'Fatima R.', rating: 5, comment: 'Very patient and explains everything clearly. Highly recommend.' },
      { name: 'Hassan M.', rating: 4, comment: 'Great sessions. Always prepared and on time.' },
    ],
  },
  {
    id: 2,
    title: 'Physics for Matric & Intermediate Students',
    tutor: 'Zain Ahmed', subject: 'Physics', level: 'Intermediate',
    rating: 4.8, reviewCount: 95, students: 210, price: 750, avatar: 'ZA', experience: '4 years',
    about: 'I specialize in making Physics easy and understandable for Matric and Intermediate students. My approach focuses on building concepts from scratch with real-world examples.',
    whatYouLearn: ['Understand core Physics concepts clearly', 'Solve numerical problems step by step', 'Prepare for board exams confidently', 'Learn through real-world examples'],
    subjects: ['Mechanics', 'Waves', 'Electricity', 'Magnetism', 'Optics'],
    availability: ['Mon – Fri: 3pm – 8pm', 'Sat: 11am – 4pm'],
    reviews: [
      { name: 'Ali R.', rating: 5, comment: 'Zain explains Physics in a way that actually makes sense!' },
      { name: 'Sana M.', rating: 4, comment: 'Very helpful for board exam preparation.' },
    ],
  },
  {
    id: 3,
    title: 'English Grammar & Writing Masterclass',
    tutor: 'Sara Raza', subject: 'English', level: 'Beginner',
    rating: 4.7, reviewCount: 210, students: 450, price: 600, avatar: 'SR', experience: '5 years',
    about: 'I help students master English grammar and writing skills from the ground up. Whether you struggle with essays or basic grammar, I will guide you step by step.',
    whatYouLearn: ['Master English grammar rules', 'Write essays and paragraphs confidently', 'Improve spoken and written English', 'Score well in English exams'],
    subjects: ['Grammar', 'Essay Writing', 'Comprehension', 'Vocabulary', 'Punctuation'],
    availability: ['Mon – Sat: 2pm – 7pm'],
    reviews: [
      { name: 'Hina K.', rating: 5, comment: 'My English improved dramatically in just a few sessions!' },
      { name: 'Bilal A.', rating: 5, comment: 'Sara is very patient and explains everything clearly.' },
    ],
  },
  {
    id: 4,
    title: 'Chemistry: Concepts Made Simple',
    tutor: 'Hamid Ali', subject: 'Chemistry', level: 'Intermediate',
    rating: 4.6, reviewCount: 87, students: 180, price: 700, avatar: 'HA', experience: '3 years',
    about: 'Chemistry does not have to be hard. I break down complex concepts into simple, easy-to-understand lessons tailored for Matric and Intermediate students.',
    whatYouLearn: ['Understand chemical reactions and equations', 'Learn organic and inorganic chemistry', 'Solve past paper questions', 'Build strong lab knowledge'],
    subjects: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Periodic Table'],
    availability: ['Tue – Fri: 4pm – 9pm', 'Sat – Sun: 10am – 5pm'],
    reviews: [
      { name: 'Raza M.', rating: 5, comment: 'Finally understood chemistry thanks to Hamid!' },
      { name: 'Ayra S.', rating: 4, comment: 'Good teaching style, very clear explanations.' },
    ],
  },
  {
    id: 5,
    title: 'Biology for Pre-Medical Preparation',
    tutor: 'Nadia Iqbal', subject: 'Biology', level: 'Advanced',
    rating: 4.9, reviewCount: 154, students: 320, price: 850, avatar: 'NI', experience: '7 years',
    about: 'I am a Biology specialist with 7 years of experience preparing pre-medical students for MDCAT and board exams. My sessions are focused, exam-oriented, and highly effective.',
    whatYouLearn: ['Master all Biology topics for MDCAT', 'Understand human anatomy and physiology', 'Learn genetics and evolution', 'Practice with past paper MCQs'],
    subjects: ['Cell Biology', 'Genetics', 'Human Physiology', 'Ecology', 'Botany'],
    availability: ['Mon – Fri: 5pm – 9pm', 'Sun: 10am – 2pm'],
    reviews: [
      { name: 'Zara K.', rating: 5, comment: 'Best Biology tutor I have ever had. Highly recommend!' },
      { name: 'Usman T.', rating: 5, comment: 'My MDCAT Biology score improved by 30 marks!' },
    ],
  },
  {
    id: 6,
    title: 'Computer Science & Programming Fundamentals',
    tutor: 'Usman Tariq', subject: 'Computer Science', level: 'Beginner',
    rating: 4.8, reviewCount: 76, students: 140, price: 900, avatar: 'UT', experience: '4 years',
    about: 'I teach Computer Science and programming from scratch. Whether you are a complete beginner or want to strengthen your fundamentals, my sessions are practical and project-based.',
    whatYouLearn: ['Learn programming basics in Python', 'Understand data structures and algorithms', 'Build small real-world projects', 'Prepare for CS board exams'],
    subjects: ['Python', 'Data Structures', 'OOP', 'Databases', 'Web Basics'],
    availability: ['Mon – Sat: 6pm – 10pm'],
    reviews: [
      { name: 'Faisal H.', rating: 5, comment: 'Usman made programming fun and easy to learn!' },
      { name: 'Maira A.', rating: 4, comment: 'Very practical approach, learned a lot quickly.' },
    ],
  },
  {
    id: 7,
    title: 'Urdu Literature & Comprehension',
    tutor: 'Farah Naz', subject: 'Urdu', level: 'All Levels',
    rating: 4.5, reviewCount: 63, students: 95, price: 500, avatar: 'FN', experience: '5 years',
    about: 'I help students appreciate and master Urdu literature, grammar, and comprehension. My sessions cover both prose and poetry for Matric and Intermediate students.',
    whatYouLearn: ['Understand Urdu prose and poetry', 'Improve Urdu essay writing', 'Master Urdu grammar rules', 'Score well in Urdu board exams'],
    subjects: ['Urdu Grammar', 'Poetry', 'Prose', 'Essay Writing', 'Comprehension'],
    availability: ['Mon – Fri: 3pm – 7pm'],
    reviews: [
      { name: 'Nimra B.', rating: 5, comment: 'Farah makes Urdu literature so interesting!' },
      { name: 'Kamran L.', rating: 4, comment: 'My Urdu grades improved a lot.' },
    ],
  },
  {
    id: 8,
    title: 'Statistics & Probability Crash Course',
    tutor: 'Omar Sheikh', subject: 'Statistics', level: 'Advanced',
    rating: 4.7, reviewCount: 112, students: 205, price: 780, avatar: 'OS', experience: '6 years',
    about: 'I offer an intensive Statistics course covering all major topics from probability to regression. Perfect for Intermediate and university-level students.',
    whatYouLearn: ['Master probability and distributions', 'Learn regression and correlation', 'Solve statistical problems confidently', 'Prepare for university-level Stats'],
    subjects: ['Probability', 'Distributions', 'Regression', 'Hypothesis Testing', 'Data Analysis'],
    availability: ['Mon – Fri: 4pm – 9pm', 'Sat: 10am – 3pm'],
    reviews: [
      { name: 'Saad R.', rating: 5, comment: 'Omar is an excellent Statistics tutor. Very thorough!' },
      { name: 'Hira M.', rating: 4, comment: 'Explained everything clearly and patiently.' },
    ],
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="cd-stars">
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
    </span>
  )
}

function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Find the course matching the URL id
  const COURSE = ALL_COURSES.find(c => c.id === Number(id))

  // If no course found, show a not found message
  if (!COURSE) {
    return (
      <div className="cd-page">
        <Navbar />
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Course not found</h2>
          <button onClick={() => navigate('/courses')} style={{ marginTop: '1rem' }}>
            Back to Courses
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cd-page">
      <Navbar />

      {/* Top banner */}
      <div className="cd-banner">
        <div className="cd-banner__inner">
          <span className="cd-banner__subject">{COURSE.subject}</span>
          <h1 className="cd-banner__title">{COURSE.title}</h1>
          <div className="cd-banner__meta">
            <span className="cd-banner__rating">
              <StarRating rating={COURSE.rating} />
              <strong>{COURSE.rating}</strong> ({COURSE.reviewCount} reviews)
            </span>
            <span className="cd-banner__dot">·</span>
            <span>{COURSE.students} students enrolled</span>
            <span className="cd-banner__dot">·</span>
            <span>{COURSE.level}</span>
          </div>
        </div>
      </div>

      <div className="cd-body">
        <div className="cd-main">

          {/* What you'll learn */}
          <section className="cd-section">
            <h2 className="cd-section__heading">What you'll learn</h2>
            <ul className="cd-learn-list">
              {COURSE.whatYouLearn.map((item, i) => (
                <li className="cd-learn-list__item" key={i}>
                  <span className="cd-learn-list__check">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Topics covered */}
          <section className="cd-section">
            <h2 className="cd-section__heading">Topics covered</h2>
            <div className="cd-topics">
              {COURSE.subjects.map(s => (
                <span className="cd-topic-chip" key={s}>{s}</span>
              ))}
            </div>
          </section>

          {/* About tutor */}
          <section className="cd-section">
            <h2 className="cd-section__heading">About the tutor</h2>
            <div className="cd-tutor-about">
              <div className="cd-tutor-about__avatar">{COURSE.avatar}</div>
              <div>
                <p className="cd-tutor-about__name">{COURSE.tutor}</p>
                <p className="cd-tutor-about__exp">{COURSE.experience} teaching experience</p>
              </div>
            </div>
            <p className="cd-tutor-about__bio">{COURSE.about}</p>
          </section>

          {/* Student reviews */}
          <section className="cd-section">
            <h2 className="cd-section__heading">Student reviews</h2>
            <div className="cd-reviews">
              {COURSE.reviews.map((r, i) => (
                <div className="cd-review-card" key={i}>
                  <div className="cd-review-card__top">
                    <div className="cd-review-card__avatar">{r.name[0]}</div>
                    <div>
                      <p className="cd-review-card__name">{r.name}</p>
                      <StarRating rating={r.rating} />
                    </div>
                  </div>
                  <p className="cd-review-card__comment">{r.comment}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Sticky booking sidebar */}
        <aside className="cd-sidebar">
          <div className="cd-booking-card">
            <p className="cd-booking-card__price">
              Rs {COURSE.price}<span>/hour</span>
            </p>

            <div className="cd-booking-card__info">
              <div className="cd-booking-card__info-row">
                <span>⭐ Rating</span>
                <strong>{COURSE.rating} / 5</strong>
              </div>
              <div className="cd-booking-card__info-row">
                <span>👥 Students</span>
                <strong>{COURSE.students}</strong>
              </div>
              <div className="cd-booking-card__info-row">
                <span>🎓 Level</span>
                <strong>{COURSE.level}</strong>
              </div>
              <div className="cd-booking-card__info-row">
                <span>📅 Experience</span>
                <strong>{COURSE.experience}</strong>
              </div>
            </div>

            <div className="cd-booking-card__availability">
              <p className="cd-booking-card__avail-label">Availability</p>
              {COURSE.availability.map((a, i) => (
                <p className="cd-booking-card__avail-time" key={i}>🕐 {a}</p>
              ))}
            </div>

            <a href="/booking" className="cd-booking-card__btn">
              Book a Session
            </a>
            <button className="cd-booking-card__msg-btn">
              Message Tutor
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default CourseDetail