import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, Send, User, MessageSquare } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for contacting us! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+91 8087 96 30 35', '+91 9579403248'],
      action: 'Call Us',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      details: ['+91 8087 96 30 35'],
      action: 'Chat on WhatsApp',
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@footers.in', 'support@footers.in'],
      action: 'Send Email',
    },
    {
      icon: MapPin,
      title: 'Address',
      details: [
        'Footers Workshop',
        'Main Market, Kolhapur',
        'Maharashtra 416001',
        'India'
      ],
      action: 'Get Directions',
    },
  ];

  const storeHours = [
    { day: 'Monday - Saturday', hours: '9:00 AM - 8:00 PM' },
    { day: 'Sunday', hours: '10:00 AM - 6:00 PM' },
    { day: 'Online Orders', hours: '24/7 Available' },
  ];

  const faqs = [
    {
      question: 'Do you ship outside India?',
      answer: 'Currently, we only ship within India. We are working on international shipping options.',
    },
    {
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 3-5 business days. Express delivery is available in major cities.',
    },
    {
      question: 'Can I customize my order?',
      answer: 'Yes! We offer customization for size, color, and design. Contact us for custom orders.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for unused items in original packaging.',
    },
  ];

  return (
    <div className="min-h-screen bg-black-900">
      <div className="container-custom section-padding">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-luxury text-black-100 mb-4">
            Contact <span className="text-gradient">Footers</span>
          </h1>
          <p className="text-xl text-black-400 max-w-2xl mx-auto">
            Get in touch with us for premium Kolhapuri chappals and leather footwear. 
            We're here to help you find the perfect pair!
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <div key={index} className="card p-6 text-center">
              <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <info.icon className="w-8 h-8 text-gold-500" />
              </div>
              <h3 className="text-lg font-semibold text-black-100 mb-3">
                {info.title}
              </h3>
              <div className="space-y-1 mb-4">
                {info.details.map((detail, i) => (
                  <p key={i} className="text-black-400 text-sm">
                    {detail}
                  </p>
                ))}
              </div>
              <button className="text-gold-500 hover:text-gold-400 transition-colors text-sm font-medium">
                {info.action}
              </button>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold text-black-100 mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black-300 mb-2">
                    Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="input-field pl-10"
                      placeholder="Your name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black-300 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="input-field pl-10"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black-300 mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                >
                  <option value="">Select a subject</option>
                  <option value="product-inquiry">Product Inquiry</option>
                  <option value="custom-order">Custom Order</option>
                  <option value="bulk-order">Bulk Order</option>
                  <option value="complaint">Complaint</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black-300 mb-2">
                  Message *
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-black-400 w-5 h-5" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="input-field pl-10 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner w-5 h-5 mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Store Info & FAQs */}
          <div className="space-y-8">
            {/* Store Hours */}
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="w-6 h-6 text-gold-500" />
                <h2 className="text-xl font-semibold text-black-100">
                  Store Hours
                </h2>
              </div>
              <div className="space-y-3">
                {storeHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-black-800 last:border-b-0">
                    <span className="text-black-300">{schedule.day}</span>
                    <span className="text-gold-500 font-medium">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-black-100 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-black-800 pb-4 last:border-b-0">
                    <h3 className="font-medium text-black-100 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-black-400 text-sm">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="card p-6 text-center">
              <h2 className="text-xl font-semibold text-black-100 mb-4">
                Follow Us
              </h2>
              <p className="text-black-400 mb-6">
                Stay updated with our latest collections and offers
              </p>
              <div className="flex justify-center space-x-4">
                <button className="w-10 h-10 bg-gold-500/10 rounded-lg flex items-center justify-center hover:bg-gold-500/20 transition-colors">
                  <span className="text-gold-500 font-bold">f</span>
                </button>
                <button className="w-10 h-10 bg-gold-500/10 rounded-lg flex items-center justify-center hover:bg-gold-500/20 transition-colors">
                  <span className="text-gold-500 font-bold">📷</span>
                </button>
                <button className="w-10 h-10 bg-gold-500/10 rounded-lg flex items-center justify-center hover:bg-gold-500/20 transition-colors">
                  <span className="text-gold-500 font-bold">📱</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-black-100 text-center mb-8">
            Visit Our Workshop
          </h2>
          <div className="card p-8">
            <div className="bg-black-800 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                <p className="text-black-300 mb-2">
                  Main Market, Kolhapur, Maharashtra 416001
                </p>
                <p className="text-black-400 text-sm">
                  Interactive map loading...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
