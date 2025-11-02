'use client'

import { useState, FormEvent } from 'react'
import { Send, User, Phone, MapPin, FileText, CheckCircle } from 'lucide-react'

interface FormData {
  name: string
  phone: string
  place: string
  description: string
}

export default function EnquiryForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    place: '',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Validate form
      if (!formData.name || !formData.phone || !formData.place || !formData.description) {
        setError('Please fill in all fields')
        setIsSubmitting(false)
        return
      }

      // Send email via API
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to send email')
      }

      // Create WhatsApp message
      const message = `Hello! I would like to enquire about:\n\nName: ${formData.name}\nPhone: ${formData.phone}\nPlace: ${formData.place}\nRequirement: ${formData.description}`
      const whatsappUrl = `https://wa.me/919972394416?text=${encodeURIComponent(message)}`

      // Show success message
      setShowSuccess(true)

      // Reset form
      setFormData({
        name: '',
        phone: '',
        place: '',
        description: '',
      })

      // Open WhatsApp after a short delay
      setTimeout(() => {
        window.open(whatsappUrl, '_blank')
        setShowSuccess(false)
      }, 1500)

    } catch (err) {
      console.error('Error submitting form:', err)
      setError('Failed to send enquiry. Please try again or contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="enquiry" className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-primary-100 rounded-full mb-4">
              <span className="text-primary-700 font-semibold text-sm">GET IN TOUCH</span>
            </div>
            <h2 className="section-title">
              Send Your Enquiry
            </h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Fill out the form below and we&apos;ll get back to you as soon as possible. 
              You&apos;ll be redirected to WhatsApp for instant communication.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              {/* Place Field */}
              <div>
                <label htmlFor="place" className="block text-sm font-semibold text-gray-700 mb-2">
                  Location / Place <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="place"
                    name="place"
                    value={formData.place}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Your city or area"
                  />
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description of Items <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-4 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                    placeholder="Please describe your requirements (e.g., TMT Bars 500D - 10 tons, UltraTech Cement - 100 bags, etc.)"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {showSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Enquiry sent successfully! Redirecting to WhatsApp...
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Enquiry
                    <Send className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>

              {/* Info Text */}
              <p className="text-sm text-gray-600 text-center mt-4">
                By submitting this form, you agree to be contacted via WhatsApp and email.
              </p>
            </form>
          </div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <a
              href="tel:+919972394416"
              className="bg-gradient-to-br from-primary-500 to-primary-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow group"
            >
              <Phone className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-1">Call Us</h3>
              <p className="text-primary-100">+91 9972394416</p>
            </a>

            <a
              href="mailto:mohammedtahirsteel@gmail.com"
              className="bg-gradient-to-br from-accent-500 to-accent-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow group"
            >
              <Send className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-1">Email Us</h3>
              <p className="text-orange-100 text-sm break-all">mohammedtahirsteel@gmail.com</p>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
