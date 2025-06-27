import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Globe, 
  Star, 
  BarChart3, 
  TrendingUp, 
  Phone, 
  Mail, 
  ArrowLeft,
  ShoppingCart,
  MessageCircle,
  CheckCircle,
  ExternalLink
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

const ServiceDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [service, setService] = useState<Service | null>(null)
  const [orderMessage, setOrderMessage] = useState('')
  const [isOrdering, setIsOrdering] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)

  useEffect(() => {
    if (id) {
      const services = JSON.parse(localStorage.getItem('services') || '[]')
      const foundService = services.find((s: Service) => s.id === id && s.isApproved)
      
      if (foundService) {
        setService(foundService)
      } else {
        navigate('/services')
      }
    }
  }, [id, navigate])

  const handleOrder = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (user.role !== 'buyer') {
      alert('Only buyers can place orders. Please register as a buyer.')
      return
    }

    if (!orderMessage.trim()) {
      alert('Please provide details about your requirements.')
      return
    }

    setIsOrdering(true)

    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      const newOrder = {
        id: Date.now().toString(),
        serviceId: service!.id,
        buyerId: user.id,
        sellerId: service!.sellerId,
        status: 'pending',
        message: orderMessage,
        createdAt: new Date().toISOString(),
        service: {
          title: service!.title,
          price: service!.price,
          sellerName: service!.sellerName,
          sellerPhone: service!.sellerPhone
        }
      }

      orders.push(newOrder)
      localStorage.setItem('orders', JSON.stringify(orders))

      alert('Order placed successfully! The seller will contact you soon.')
      navigate('/buyer-dashboard')
    } catch (error) {
      alert('Failed to place order. Please try again.')
    } finally {
      setIsOrdering(false)
    }
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/services"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Services</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1 mb-6 lg:mb-0">
                <h1 className="text-3xl font-bold mb-4">
                  {service.title}
                </h1>
                <div className="flex items-center space-x-2 text-primary-100 mb-2">
                  <Globe className="w-5 h-5" />
                  <span className="text-lg">{service.websiteUrl}</span>
                  <a 
                    href={`https://${service.websiteUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-200 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <div className="text-primary-100">
                  Offered by <span className="font-semibold">{service.sellerName}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold mb-2">
                  ${service.price}
                </div>
                <div className="text-primary-200">
                  One-time payment
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Metrics */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Website Metrics
                  </h2>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <BarChart3 className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">DA {service.da}</div>
                      <div className="text-sm text-gray-600">Domain Authority</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Star className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">DR {service.dr}</div>
                      <div className="text-sm text-gray-600">Domain Rating</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{service.traffic}</div>
                      <div className="text-sm text-gray-600">Monthly Traffic</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Service Description
                  </h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* What You Get */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    What You Get
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">High-quality guest post publication</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Do-follow backlink to your website</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Content published permanently</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Direct communication with website owner</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Detailed report after publication</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Seller Info */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Seller Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium text-gray-900">{service.sellerName}</div>
                      <div className="text-sm text-gray-600">Website Owner</div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{service.sellerPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Order Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      ${service.price}
                    </div>
                    <div className="text-gray-600">
                      One-time payment
                    </div>
                  </div>

                  {user && user.role === 'buyer' ? (
                    <>
                      {!showOrderForm ? (
                        <button
                          onClick={() => setShowOrderForm(true)}
                          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          <span>Order Now</span>
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Project Requirements
                            </label>
                            <textarea
                              value={orderMessage}
                              onChange={(e) => setOrderMessage(e.target.value)}
                              placeholder="Please describe your requirements, target keywords, content guidelines, etc."
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={handleOrder}
                              disabled={isOrdering}
                              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isOrdering ? 'Placing Order...' : 'Place Order'}
                            </button>
                            <button
                              onClick={() => setShowOrderForm(false)}
                              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : user && user.role === 'seller' ? (
                    <div className="text-center text-gray-600">
                      <p className="mb-4">You cannot order your own service or other services as a seller.</p>
                      <Link
                        to="/seller-dashboard"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Go to Dashboard
                      </Link>
                    </div>
                  ) : user && user.role === 'admin' ? (
                    <div className="text-center text-gray-600">
                      <p className="mb-4">Admin accounts cannot place orders.</p>
                      <Link
                        to="/admin-dashboard"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Go to Dashboard
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        to="/login"
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <span>Login to Order</span>
                      </Link>
                      <Link
                        to="/register"
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <span>Sign Up as Buyer</span>
                      </Link>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MessageCircle className="w-4 h-4" />
                      <span>Direct communication with seller</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceDetails