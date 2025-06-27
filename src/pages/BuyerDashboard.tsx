import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Clock, CheckCircle, XCircle, MessageCircle, Phone, Mail } from 'lucide-react'

interface Order {
  id: string
  serviceId: string
  buyerId: string
  sellerId: string
  status: 'pending' | 'accepted' | 'completed' | 'cancelled'
  message: string
  createdAt: string
  service: {
    title: string
    price: number
    sellerName: string
    sellerPhone: string
  }
}

const BuyerDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all')

  useEffect(() => {
    if (!user || user.role !== 'buyer') {
      navigate('/login')
      return
    }

    loadOrders()
  }, [user, navigate])

  const loadOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    const userOrders = allOrders.filter((order: Order) => order.buyerId === user?.id)
    setOrders(userOrders.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }

  const getFilteredOrders = () => {
    if (activeTab === 'all') return orders
    return orders.filter(order => order.status === activeTab)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'accepted':
        return <MessageCircle className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    accepted: orders.filter(o => o.status === 'accepted').length,
    completed: orders.filter(o => o.status === 'completed').length,
    totalSpent: orders.filter(o => o.status === 'completed').reduce((sum, order) => sum + order.service.price, 0)
  }

  if (!user || user.role !== 'buyer') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Buyer Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user.firstName}! Manage your orders and track progress.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-gray-600 text-sm">Total Orders</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-gray-600 text-sm">Pending</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{stats.accepted}</div>
            <div className="text-gray-600 text-sm">In Progress</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-gray-600 text-sm">Completed</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-primary-600">${stats.totalSpent}</div>
            <div className="text-gray-600 text-sm">Total Spent</div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'all', label: 'All Orders', count: stats.total },
                { key: 'pending', label: 'Pending', count: stats.pending },
                { key: 'accepted', label: 'In Progress', count: stats.accepted },
                { key: 'completed', label: 'Completed', count: stats.completed }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === tab.key ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Orders List */}
          <div className="p-6">
            {getFilteredOrders().length > 0 ? (
              <div className="space-y-4">
                {getFilteredOrders().map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1 mb-4 lg:mb-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {order.service.title}
                            </h3>
                            <div className="text-sm text-gray-600 mb-2">
                              Order #{order.id.slice(-8)} • {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-600">
                              Seller: {order.service.sellerName}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-primary-600 mb-1">
                              ${order.service.price}
                            </div>
                            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="capitalize">{order.status}</span>
                            </div>
                          </div>
                        </div>

                        {order.message && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <div className="text-sm font-medium text-gray-700 mb-1">Your Requirements:</div>
                            <div className="text-sm text-gray-600">{order.message}</div>
                          </div>
                        )}

                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{order.service.sellerPhone}</span>
                          </div>
                          <a
                            href={`tel:${order.service.sellerPhone}`}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Call Seller
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Status-specific actions or info */}
                    {order.status === 'pending' && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="text-sm text-yellow-800">
                          <strong>Waiting for seller response.</strong> The seller will review your requirements and contact you soon.
                        </div>
                      </div>
                    )}

                    {order.status === 'accepted' && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-sm text-blue-800">
                          <strong>Order in progress!</strong> The seller is working on your guest post. Stay in touch for updates.
                        </div>
                      </div>
                    )}

                    {order.status === 'completed' && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="text-sm text-green-800">
                          <strong>Order completed!</strong> Your guest post has been published. Check with the seller for the live URL.
                        </div>
                      </div>
                    )}

                    {order.status === 'cancelled' && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-sm text-red-800">
                          <strong>Order cancelled.</strong> This order was cancelled. Contact the seller for more details.
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {activeTab === 'all' ? 'No orders yet' : `No ${activeTab} orders`}
                </h3>
                <p className="text-gray-600 mb-4">
                  {activeTab === 'all' 
                    ? 'Start by browsing our guest posting services'
                    : `You don't have any ${activeTab} orders at the moment`
                  }
                </p>
                {activeTab === 'all' && (
                  <button
                    onClick={() => navigate('/services')}
                    className="btn-primary"
                  >
                    Browse Services
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyerDashboard