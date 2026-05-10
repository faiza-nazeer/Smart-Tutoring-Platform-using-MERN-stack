import './Contact.css'
import Navbar from '../components/Navbar'
import { useState } from 'react'
import { sendContactMessage } from '../api/api'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setLoading(true)
    setError('')
    try {
      const data = await sendContactMessage(form)
      if (data.message === 'Message sent successfully') {
        setSubmitted(true)
      } else {
        setError(data.message || 'Something went wrong')
      }
    } catch (err) {
      setError('Failed to send message. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div>
      <Navbar />

      <section className="contact__hero">
        <span className="contact__label">Contact Us</span>
        <h1 className="contact__hero-title">We'd love to hear from you</h1>
        <p className="contact__hero-text">Have a question, suggestion, or just want to say hi? Our team is here to help.</p>
      </section>

      <div className="contact__body">

        <div className="contact__info-cards">
          {[
            { icon: '📧', title: 'Email Us', desc: 'support@etutor.com', sub: 'We reply within 24 hours' },
            { icon: '📞', title: 'Call Us', desc: '+1 (800) 123-4567', sub: 'Mon–Fri, 9am–6pm EST' },
            { icon: '📍', title: 'Visit Us', desc: '123 Learning Lane', sub: 'New York, NY 10001' },
          ].map(c => (
            <div key={c.title} className="contact__info-card">
              <span className="contact__info-icon">{c.icon}</span>
              <h3 className="contact__info-title">{c.title}</h3>
              <p className="contact__info-desc">{c.desc}</p>
              <p className="contact__info-sub">{c.sub}</p>
            </div>
          ))}
        </div>

        <div className="contact__layout">

          <div className="contact__form-wrap">
            <h2 className="contact__form-title">Send us a Message</h2>
            {submitted ? (
              <div className="contact__success">
                <span className="contact__success-icon">✅</span>
                <h3>Message Sent!</h3>
                <p>Thanks, <strong>{form.name}</strong>! We'll get back to you at <strong>{form.email}</strong> shortly.</p>
                <button className="contact__reset-btn" onClick={() => {
                  setSubmitted(false)
                  setForm({ name: '', email: '', subject: '', message: '' })
                }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit}>
                <div className="contact__row">
                  <div className="contact__field">
                    <label className="contact__field-label">Full Name</label>
                    <input name="name" type="text" className="contact__input" placeholder="John Smith" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="contact__field">
                    <label className="contact__field-label">Email Address</label>
                    <input name="email" type="email" className="contact__input" placeholder="john@email.com" value={form.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="contact__field">
                  <label className="contact__field-label">Subject</label>
                  <select name="subject" className="contact__input" value={form.subject} onChange={handleChange}>
                    <option value="">Select a subject...</option>
                    <option value="booking">Booking Help</option>
                    <option value="billing">Billing</option>
                    <option value="tutor">Become a Tutor</option>
                    <option value="technical">Technical Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="contact__field">
                  <label className="contact__field-label">Message</label>
                  <textarea name="message" className="contact__textarea" placeholder="Tell us how we can help you..." rows={5} value={form.message} onChange={handleChange} required />
                </div>

                {error && (
                  <div style={{
                    background: '#fdecea', color: '#e74c3c',
                    padding: '0.75rem', borderRadius: 8, fontSize: '0.88rem'
                  }}>
                    ⚠️ {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="contact__submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            )}
          </div>

          <div className="contact__faq">
            <h2 className="contact__faq-title">Frequently Asked</h2>
            {[
              { q: 'How do I book a session?', a: 'Visit any tutor profile and click "Book a Session" to pick a date, time, and subject.' },
              { q: 'Can I cancel a booking?', a: 'Yes, bookings can be cancelled up to 24 hours before the session for a full refund.' },
              { q: 'How do I become a tutor?', a: 'Fill out our tutor application form and our team will review your profile within 3–5 business days.' },
              { q: 'Is there a free trial?', a: 'New students get one free 30-minute introductory session with any tutor.' },
            ].map((item, i) => (
              <div key={i} className="contact__faq-item">
                <h4 className="contact__faq-q">❓ {item.q}</h4>
                <p className="contact__faq-a">{item.a}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      <footer className="footer">
        <p>© 2024 eTutor. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Contact