import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Search, 
  TrendingUp, 
  Shield, 
  Globe, 
  Users, 
  Star, 
  ArrowRight,
  CheckCircle,
  BarChart3,
  Zap,
  Award
} from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  price: number
  websiteUrl: string
  da: number
  dr: number
  traffic: string
  sellerId: string
  sellerName: string
  sellerPhone: string
  isApproved: boolean
}

const Home = () => {
  const { user } = useAuth()
  const [featuredServices, setFeaturedServices] = useState<Service[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState({
    totalServices: 0,
    totalSellers: 0,
    totalOrders: 0,
    avgRating: 4.8
  })

  useEffect(() => {
    // Load featured services (approved ones)
    const services = JSON.parse(localStorage.getItem('services') || '[]')
    const approvedServices = services.filter((s: Service) => s.isApproved)
    setFeaturedServices(approvedServices.slice(0, 6))

    // Calculate stats
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    
    setStats({
      totalServices: approvedServices.length,
      totalSellers: users.filter((u: any) => u.role === 'seller' && u.isApproved).length,
      totalOrders: orders.length,
      avgRating: 4.8
    })
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/services?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              World's Premier
              <span className="block text-primary-200">Guest Posting Marketplace</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with premium websites globally. Buy high-quality guest posts or sell your website's authority to boost SEO rankings worldwide.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/services"
                className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <span className="flex items-center justify-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Browse Services</span>
                </span>
              </Link>
              <Link
                to="/register"
                className="bg-primary-500 hover:bg-primary-400 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg border-2 border-primary-400"
              >
                <span className="flex items-center justify-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Start Selling</span>
                </span>
              </Link>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for guest posting opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 text-gray-900 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary-300 text-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-lg transition-colors"
                >
                  <Search className="w-6 h-6" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                {stats.totalServices}+
              </div>
              <div className="text-gray-600 font-medium">Active Services</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                {stats.totalSellers}+
              </div>
              <div className="text-gray-600 font-medium">Verified Sellers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                {stats.totalOrders}+
              </div>
              <div className="text-gray-600 font-medium">Orders Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                {stats.avgRating}
              </div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose GuestPost Pro?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide a secure, efficient, and global platform for all your guest posting needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Verified Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                All services are manually reviewed and approved by our admin team to ensure premium quality and authentic metrics.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Global Reach</h3>
              <p className="text-gray-600 leading-relaxed">
                Access websites from 190+ countries with diverse niches, languages, and audiences to maximize your global presence.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                Quick turnaround times with direct communication between buyers and sellers for efficient project completion.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Detailed Metrics</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive DA, DR, and traffic data verified through Ahrefs and SEMrush for informed decision making.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Community</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with experienced SEO professionals and website owners who understand your marketing goals.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Success Guarantee</h3>
              <p className="text-gray-600 leading-relaxed">
                Our platform ensures successful collaborations with dispute resolution and quality assurance processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      {featuredServices.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Guest Posting Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover premium websites ready to publish your content
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredServices.map((service) => (
                <div key={service.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {service.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                          <Globe className="w-4 h-4" />
                          <span className="truncate">{service.websiteUrl}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          by {service.sellerName}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">
                          ${service.price}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">DA {service.da}</div>
                        <div className="text-xs text-gray-500">Authority</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">DR {service.dr}</div>
                        <div className="text-xs text-gray-500">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{service.traffic}</div>
                        <div className="text-xs text-gray-500">Traffic</div>
                      </div>
                    </div>

                    <Link
                      to={`/service/${service.id}`}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/services"
                className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                <span>View All Services</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to start your guest posting journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* For Buyers */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">For Buyers</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Sign Up & Browse</h4>
                    <p className="text-gray-600">Create your buyer account and explore thousands of verified guest posting opportunities.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Choose & Order</h4>
                    <p className="text-gray-600">Select services that match your niche and budget, then place your order with custom requirements.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Get Published</h4>
                    <p className="text-gray-600">Work directly with sellers to create and publish high-quality content on their websites.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Sellers */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">For Sellers</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Register & Verify</h4>
                    <p className="text-gray-600">Sign up as a seller and wait for admin approval to ensure platform quality.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">List Your Website</h4>
                    <p className="text-gray-600">Create detailed service listings with your website's metrics, pricing, and guidelines.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Earn Money</h4>
                    <p className="text-gray-600">Receive orders, publish quality content, and earn money from your website's authority.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Boost Your SEO?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Join thousands of marketers and website owners who trust GuestPost Pro for their link building needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Get Started Today
            </Link>
            <Link
              to="/services"
              className="bg-primary-500 hover:bg-primary-400 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 border-2 border-primary-400"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home