'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Printer,
  Palette,
  Video,
  GraduationCap,
  CheckCircle2,
  Clock,
  Send,
  UploadCloud,
  FileText,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronRight,
  X,
} from 'lucide-react';
import { ServicePackage, ServiceCategory } from '@/lib/types';

export const DigitalServicesSection: React.FC = () => {
  const { user, showToast } = useApp();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('printing');
  const [modalService, setModalService] = useState<{
    title: string;
    category: ServiceCategory;
    subType: string;
    defaultPrice: number;
  } | null>(null);

  // Form states for service request
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [selectedOption, setSelectedOption] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [requirements, setRequirements] = useState('');
  const [deadline, setDeadline] = useState('Within 3 days');
  const [simulatedFile, setSimulatedFile] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Synchronize when user logs in/switches
  React.useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);
      if (!customerEmail && user.email) setCustomerEmail(user.email);
    }
  }, [user]);

  const categories = [
    {
      id: 'printing' as ServiceCategory,
      title: 'Printing Service',
      icon: Printer,
      desc: 'Offset, digital laser, banners, and business stationery with door delivery.',
    },
    {
      id: 'graphic_design' as ServiceCategory,
      title: 'Graphic Design',
      icon: Palette,
      desc: 'Custom logos, brand kits, marketing flyers, and YouTube thumbnails.',
    },
    {
      id: 'video_editing' as ServiceCategory,
      title: 'Video Editing',
      icon: Video,
      desc: 'Cinematic 4K YouTube edits, viral Reels/Shorts, and corporate promos.',
    },
    {
      id: 'computer_training' as ServiceCategory,
      title: 'Computer Training',
      icon: GraduationCap,
      desc: 'Practical lab-based MS Office, Graphic Design, & IT literacy courses.',
    },
  ];

  const serviceCatalog = {
    printing: [
      {
        id: 'p-1',
        title: 'Visiting & Business Cards',
        badge: 'Top Seller',
        price: '৳500 / 1000 pcs',
        rawPrice: 500,
        image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
        desc: 'Premium 350GSM imported Swedish board with matte or velvet touch thermal lamination.',
        specs: ['Double-Sided Full Color', 'Spot UV & Gold Foil Option', 'Round Corner Die Cut', 'Free Protective Box'],
        options: ['Standard 350GSM Matte', 'Gloss Laminated 350GSM', 'Spot UV Embossed Card', 'Transparent Plastic Card', 'Textured Linen Card'],
      },
      {
        id: 'p-2',
        title: 'Posters & Marketing Flyers',
        badge: 'Fast 24h',
        price: '৳1,200 / 500 pcs',
        rawPrice: 1200,
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
        desc: 'High-vibrancy full color offset prints on 120GSM to 150GSM art paper for impactful promotion.',
        specs: ['A4, A5, or Custom Sizes', 'Crisp High-DPI Laser', 'Folded Leaflet Option', 'Bundle Packaging'],
        options: ['A4 Single Page Flyer', 'A5 Promotional Flyer', 'Tri-fold Marketing Brochure', 'Glossy Event Poster A3'],
      },
      {
        id: 'p-3',
        title: 'PVC Vinyl Banners & Signage',
        badge: 'Outdoor Durable',
        price: '৳25 / sq.ft',
        rawPrice: 250,
        image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
        desc: 'Heavy duty waterproof UV-resistant banner printing with metal eyelets and reinforced hem edges.',
        specs: ['Star Flex Material', 'Weather & Rain Resistant', 'High-Res Roland Plotter', 'Installed Eyelets'],
        options: ['Frontlit Flex Banner', 'Backlit Signboard Banner', 'Roll-up Standee Display', 'Mesh Banner'],
      },
      {
        id: 'p-4',
        title: 'Invitations & Custom Stationery',
        badge: 'Exclusive',
        price: '৳800 / 100 pcs',
        rawPrice: 800,
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
        desc: 'Wedding cards, corporate seminar invites, letterheads, envelopes, and customized ID cards.',
        specs: ['Metallic Shimmer Paper', 'Foil Stamping Finish', 'Matching Envelope Included', 'Custom Die Cut'],
        options: ['Wedding Invitation Set', 'Corporate Envelope & Letterhead', 'Plastic PVC Student ID Card', 'Certificate of Completion'],
      },
    ],
    graphic_design: [
      {
        id: 'g-1',
        title: 'Modern Brand Logo Design',
        badge: 'Identity Kit',
        price: 'From ৳1,500',
        rawPrice: 1500,
        image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
        desc: 'Vector logos that stand out with modern minimalism, geometric precision, and timeless typography.',
        specs: ['3 Unique Concepts', 'Unlimited Revisions', 'AI, EPS, SVG, PNG Formats', 'Full Commercial Rights'],
        options: ['Minimalist Wordmark Logo', 'Emblem & Badge Mascot', 'Abstract Tech Logo', 'Complete Brand Identity Manual'],
      },
      {
        id: 'g-2',
        title: 'Facebook Cover & Social Media Kit',
        badge: 'Viral Boost',
        price: 'From ৳600',
        rawPrice: 600,
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
        desc: 'High-converting social graphics optimized for Facebook Page, Instagram, and LinkedIn banners.',
        specs: ['High-DPI RGB Formats', 'Optimized for Mobile Screens', 'Text-Rule Compliant', 'Source PSD Included'],
        options: ['Facebook Page Banner & Avatar', 'Instagram Carousel Post Pack', 'Promotional Discount Ad Banner', 'LinkedIn Company Header'],
      },
      {
        id: 'g-3',
        title: 'YouTube Thumbnail & Channel Art',
        badge: 'High CTR',
        price: 'From ৳400',
        rawPrice: 400,
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        desc: 'Click-magnet thumbnails designed to skyrocket your YouTube CTR with punchy text and vibrant contrast.',
        specs: ['1080p Ultra HD Canvas', 'Color Contrast Optimization', 'Face Enhancement', 'Fast 12-Hour Turnaround'],
        options: ['Gaming / Tech Thumbnail', 'Vlog / Lifestyle Thumbnail', 'Educational / Finance Thumbnail', 'YouTube Banner & Watermark'],
      },
      {
        id: 'g-4',
        title: 'Corporate Flyer & Menu Design',
        badge: 'Print Ready',
        price: 'From ৳1,000',
        rawPrice: 1000,
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
        desc: 'Sleek layouts for corporate presentations, restaurant menus, product catalogs, and brochures.',
        specs: ['CMYK 300DPI Print Ready', 'Bleed & Margin Checked', 'Typography Hierarchy', 'Editable PDF + InDesign'],
        options: ['Single Page Flyer', 'Bi-Fold / Tri-Fold Brochure', 'Restaurant Food Menu', 'Company Profile Booklet'],
      },
    ],
    video_editing: [
      {
        id: 'v-1',
        title: 'YouTube Long-Form Video Editing',
        badge: 'Full Production',
        price: 'From ৳1,500 / video',
        rawPrice: 1500,
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
        desc: 'Complete cuts, pacing, B-roll insertion, sound design, and color grading for professional creators.',
        specs: ['Pacing & Jump-cut Polishing', 'B-Roll & Stock Footage', 'Custom Lower Thirds', 'Sound Balancing & SFX'],
        options: ['Tech / Product Review (Up to 15m)', 'Tutorial / Educational Walkthrough', 'Podcast 2-Camera Cut', 'Vlog & Travel Documentary'],
      },
      {
        id: 'v-2',
        title: 'Viral Reels, Shorts & TikToks',
        badge: 'Trending Hooks',
        price: 'From ৳600 / reel',
        rawPrice: 600,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        desc: 'Vertical 9:16 high-retention edits featuring dynamic captions, sound effects, zooms, and trending audio.',
        specs: ['Animated Word-by-Word Captions', 'Motion Graphics & Emojis', 'Fast-Paced Hook Retention', '24-Hour Express Export'],
        options: ['Talking Head Educational Reel', 'Product Showcase Short', 'Podcast Clip Highlight', 'Motivational / Quote Reel'],
      },
      {
        id: 'v-3',
        title: 'Corporate Promotional & Commercial Video',
        badge: 'Cinematic',
        price: 'From ৳3,500',
        rawPrice: 3500,
        image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
        desc: 'High-end brand commercials, software explainer videos, company culture showcases, and real estate tours.',
        specs: ['4K UHD Master Delivery', 'Licensed Music Track', 'Professional Voiceover Sync', 'Cinematic LUT Grading'],
        options: ['Company Profile Explainer', 'Software SaaS Demo Walkthrough', 'Event Highlight Reel', 'Real Estate Property Showcase'],
      },
    ],
    computer_training: [
      {
        id: 't-1',
        title: 'MS Office Specialist (Word, Excel, PowerPoint)',
        badge: 'Career Essential',
        price: '৳2,500 (6-Week Course)',
        rawPrice: 2500,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        desc: 'Master official business documentation, Excel data formulas/pivot tables, and executive presentation design.',
        specs: ['1 PC per Student in Lab', 'Practical Daily Assignments', 'Govt. Grade Certificate', 'Lifetime Lab Practice Access'],
        options: ['Weekend Morning Batch', 'Weekday Evening Batch', 'Online Zoom Interactive Cohort', 'Private 1-on-1 Fast-Track'],
      },
      {
        id: 't-2',
        title: 'Professional Graphic Design Masterclass',
        badge: 'Freelance Ready',
        price: '৳4,500 (8-Week Course)',
        rawPrice: 4500,
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        desc: 'Adobe Photoshop and Illustrator training from basic tools to advanced print and social media portfolio creation.',
        specs: ['Fiverr & Upwork Freelance Guidance', 'Real Client Project Briefs', 'Graphic Assets Library', 'Portfolio Review'],
        options: ['Regular 3 Days/Week Lab', 'Friday + Saturday Intensive', 'Online Live Stream Batch'],
      },
      {
        id: 't-3',
        title: 'Basic Computing & Digital Literacy',
        badge: 'Beginner Friendly',
        price: '৳1,800 (4-Week Course)',
        rawPrice: 1800,
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
        desc: 'Perfect for students, job seekers, and seniors. Covers Windows, typing speed, internet security, and email etiquette.',
        specs: ['Touch Typing Speed Building', 'Safe Internet Browsing', 'Printer & Scanner Operation', 'Friendly Instructors'],
        options: ['Morning Batch (10:00 AM)', 'Afternoon Batch (03:00 PM)', 'Evening Batch (06:30 PM)'],
      },
    ],
  };

  const handleOpenRequest = (item: any) => {
    setModalService({
      title: item.title,
      category: activeCategory,
      subType: item.options[0],
      defaultPrice: item.rawPrice,
    });
    setSelectedOption(item.options[0]);
    if (activeCategory === 'printing') {
      setQuantity(1000);
    } else {
      setQuantity(1);
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !requirements) {
      showToast('Please fill in your name, phone, and requirements', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        serviceTitle: modalService?.title,
        category: modalService?.category,
        customerId: user?.id || 'guest',
        customerName,
        customerPhone,
        customerEmail,
        serviceType: selectedOption || modalService?.subType,
        quantity,
        requirements,
        deadline,
        estimatedCost: modalService?.defaultPrice ? modalService.defaultPrice * (modalService.category === 'printing' ? Math.max(1, Math.round(quantity / 1000)) : 1) : 500,
        attachmentName: simulatedFile || undefined,
      };

      const res = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        setModalService(null);
        setRequirements('');
        setSimulatedFile(null);
      } else {
        showToast(data.error || 'Failed to submit request', 'error');
      }
    } catch (err) {
      showToast('Error submitting request. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Services Hub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Comprehensive Digital, Creative & Educational Services
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            From premier visiting card printing to custom corporate logo branding, high-retention video production, and certified hands-on computer training.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  isActive
                    ? 'bg-blue-900/50 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-cyan-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {isActive && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </div>
                <div>
                  <h3 className={`text-base font-bold ${isActive ? 'text-white' : 'text-slate-200'}`}>
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{cat.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Service Offerings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceCatalog[activeCategory].map((service) => (
            <div
              key={service.id}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {service.badge}
                  </span>
                  <span className="text-sm font-black text-cyan-400 font-mono">
                    {service.price}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {service.title}
                </h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  {service.desc}
                </p>

                {/* Features Specs */}
                <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80">
                  {service.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-xs text-slate-400">Customized Quotes Available</span>
                <button
                  onClick={() => handleOpenRequest(service)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span>{activeCategory === 'computer_training' ? 'Enroll / Inquire' : 'Request Service'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Service Guarantee Banner */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              <span>Need Corporate or Bulk Inquiries?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              We provide wholesale print runs, custom corporate brand identity kits, multi-seat company training packages, and custom delivery retainers.
            </p>
          </div>
          <a
            href="tel:+8801711234567"
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold text-xs shrink-0 transition-all flex items-center gap-2"
          >
            <span>Call Hotline: +880 1711-234567</span>
          </a>
        </div>
      </div>

      {/* Interactive Service Request Modal */}
      {modalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalService(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800">
                {modalService.category.replace('_', ' ').toUpperCase()}
              </span>
              <h3 className="text-xl font-black text-white mt-1">{modalService.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Fill in the details below. Our team reviews submissions within 30 minutes!
              </p>
            </div>

            <form onSubmit={handleServiceSubmit} className="space-y-4">
              {/* Option Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Specific Requirement Type
                </label>
                <select
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  {serviceCatalog[modalService.category]
                    .find((s) => s.title === modalService.title)
                    ?.options.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                </select>
              </div>

              {/* Quantity (if printing) */}
              {modalService.category === 'printing' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Print Quantity (Pieces)
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value={100}>100 pcs</option>
                    <option value={500}>500 pcs</option>
                    <option value={1000}>1,000 pcs (Recommended Value)</option>
                    <option value={2000}>2,000 pcs</option>
                    <option value={5000}>5,000 pcs</option>
                  </select>
                </div>
              )}

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Tanvir Rahman"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+880 1812-456789"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="contact@yourbusiness.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Detailed Instructions & Specifications *
                </label>
                <textarea
                  required
                  rows={3}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Provide dimensions, text content, color preferences, brand notes, or course batch timing..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* File Attachment Upload Simulator */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Upload Design / Reference File (PDF, AI, PSD, JPG, PNG)
                </label>
                <div className="border border-dashed border-slate-700 rounded-xl p-3 text-center bg-slate-800/40 hover:bg-slate-800/80 transition-colors">
                  {simulatedFile ? (
                    <div className="flex items-center justify-between px-2 py-1 bg-slate-700/60 rounded-lg text-xs">
                      <span className="flex items-center gap-2 text-cyan-300 truncate">
                        <FileText className="w-4 h-4" />
                        {simulatedFile}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSimulatedFile(null)}
                        className="text-rose-400 hover:text-rose-300 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center gap-1">
                      <UploadCloud className="w-6 h-6 text-cyan-400" />
                      <span className="text-xs text-slate-300 font-medium">
                        Click to attach file or design brief
                      </span>
                      <span className="text-[10px] text-slate-500">Max size: 25MB</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSimulatedFile(e.target.files[0].name);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Preferred Delivery Deadline
                </label>
                <select
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="Urgent 24 Hours">Urgent 24 Hours</option>
                  <option value="Within 2-3 Days">Within 2-3 Days</option>
                  <option value="Standard (Within 1 Week)">Standard (Within 1 Week)</option>
                  <option value="Flexible / Immediate Batch">Flexible / Next Cohort</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Service Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
