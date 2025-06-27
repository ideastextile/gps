import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Edit, 
  Eye, 
  EyeOff, 
  Trash2, 
  DollarSign, 
  BarChart3, 
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  MessageCircle
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

const SellerDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [services, setServices] = useState<Service[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState<'services' | 'orders'>('services')
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    price: '',
    websiteUrl: '',
    da: '',
    dr: '',
    traffic: ''
  })

  useEffect(() => {
    if (!user || user.role !== 'seller') {
      navigate('/login')
      return
    }

    if (!user.isApproved) {
      // Show pending approval message
      return
    }

    loadData()
  }, [user, navigate])

  const loadData = () => {
    // Load services
    const allServices = JSON.parse(localStorage.getItem('services') || '[]')
    const userServices = allServices.filter((s: Service) => s.sellerId === user?.id)
    setServices(userServices)

    // Load orders
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    const userOrders = allOrders.filter((o: Order) => o.sellerId === user?.id)
    setOrders(userOrders.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const allServices = JSON.parse(localStorage.getItem('services') || '[]')
    
    if (editingService) {
      // Update existing service
      const updatedServices = allServices.map((s: Service) =>
        s.id === editingService.id
          ? {
              ...s,
              title: serviceForm.title,
              description: serviceForm.description,
              price: parseInt(serviceForm.price),
              websiteUrl: serviceForm.websiteUrl,
              da: parseInt(serviceForm.da),
              dr: parseInt(serviceForm.dr),
              traffic: serviceForm.traffic,
              isApproved: false // Needs re-approval after edit
            }
          : s
      )
      localStorage.setItem('services', JSON.stringify(updatedServices))
      alert('Service updated successfully! It will need admin approval again.')
    } else {
      // Create new service
      const newService: Service = {
        id: Date.now().toString(),
        title: serviceForm.title,
        description: serviceForm.description,
        price: parseInt(serviceForm.price),
        websiteUrl: serviceForm.websiteUrl,
        da: parseInt(serviceForm.da),
        dr: parseInt(serviceForm.dr),
        traffic: serviceForm.traffic,
        sellerId: user!.id,
        sellerName: `${user!.firstName} ${user!.lastName}`,
        sellerPhone: user!.phone,
        isApproved: false
      }
      
      allServices.push(newService)
      localStorage.setItem('services', JSON.stringify(allServices))
      alert('Service created successfully! It will be reviewed by admin for approval.')
    }

    // Reset form
    setServiceForm({
      title: '',
      description: '',
      price: '',
      websiteUrl: '',
      da: '',
      dr: '',
      traffic: ''
    })
    setShowServiceForm(false)
    setEditingService(null)
    loadData()
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setServiceForm({
      title: service.title,
      description: service.description,
      price: service.price.toString(),
      websiteUrl: service.websiteUrl,
      da: service.da.toString(),
      dr: service.dr.toString(),
      traffic: service.traffic
    })
    setShowServiceForm(true)
  }

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      const allServices = JSON.parse(localStorage.getItem('services') || '[]')
      const updatedServices = allServices.filter((s: Service) => s.id !== serviceId)
      localStorage.setItem('services', JSON.stringify(updatedServices))
      loadData()
    }
  }

  const handleOrderStatusChange = (orderId: string, newStatus: 'accepted' | 'completed' | 'cancelled') => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    const updatedOrders = allOrders.map((o: Order) =>
      o.id === orderId ? { ...o, status: newStatus } : o
    )
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    loadData()
  }

  const stats = {
    totalServices: services.length,
    approvedServices: services.filter(s => s.isApproved).length,
    pendingServices: services.filter(s => !s.isApproved).length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    completedOrders: orders.filter(o => o.status === 'completed').length,
    totalEarnings: orders.filter(o => o.status === 'completed').reduce((sum, order) => sum + order.service.price, 0)
  }

  if (!user || user.role !== 'seller') {
    return null
  }

  if (!user.isApproved) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Account Pending Approval
          </h2>
          <p className="text-gray-600 mb-6">
            Your seller account is currently under review by our admin team. 
            You'll receive a notification once your account is approved and you can start listing services.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>What's next?</strong><br />
              Our team will review your account within 24-48 hours. 
              Once approved, you'll be able to create and manage your guest posting services.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Seller Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user.firstName}! Manage your services and orders.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{stats.totalServices}</div>
            <div className="text-gray-600 text-sm">Total Services</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{stats.approvedServices}</div>
            <div className="text-gray-600 text-sm">Approved</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingServices}</div>
            <div className="text-gray-600 text-sm">Pending</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">{stats.totalOrders}</div>
            <div className="text-gray-600 text-sm">Total Orders</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</div>
            <div className="text-gray-600 text-sm">New Orders</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
            <div className="text-gray-600 text-sm">Completed</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-primary-600">${stats.totalEarnings}</div>
            <div className="text-gray-600 text-sm">Earnings</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('services')}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'services'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>My Services</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'orders'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Orders</span>
                {stats.pendingOrders > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {stats.pendingOrders}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">My Services</h2>
                <button
                  onClick={() => {
                    setShowServiceForm(true)
                    setEditingService(null)
                    setServiceForm({
                      title: '',
                      description: '',
                      price: '',
                      websiteUrl: '',
                      da: '',
                      dr: '',
                      traffic: ''
                    })
                  }}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Service</span>
                </button>
              </div>

              {/* Service Form Modal */}
              {showServiceForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        
                        {editingService ? 'Edit Service' : 'Add New Service'}
                      </h3>
                      <form onSubmit={handleServiceSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Service Title
                          </label>
                          <input
                            type="text"
                            required
                            value={serviceForm.title}
                            onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                            className="input-field"
                            placeholder="e.g., High DA Tech Blog Guest Post"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Website URL
                          </label>
                          <input
                            type="text"
                            required
                            value={serviceForm.websiteUrl}
                            onChange={(e) => setServiceForm({ ...serviceForm, websiteUrl: e.target.value })}
                            className="input-field"
                            placeholder="example.com (without https://)"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Domain Authority (DA)
                            </label>
                            <input
                              type="number"
                              required
                              min="1"
                              max="100"
                              value={serviceForm.da}
                              onChange={(e) => setServiceForm({ ...serviceForm, da: e.target.value })}
                              className="input-field"
                              placeholder="50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Domain Rating (DR)
                            </label>
                            <input
                              type="number"
                              required
                              min="1"
                              max="100"
                              value={serviceForm.dr}
                              onChange={(e) => setServiceForm({ ...serviceForm, dr: e.target.value })}
                              className="input-field"
                              placeholder="45"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Monthly Traffic
                            </label>
                            <input
                              type="text"
                              required
                              value={serviceForm.traffic}
                              onChange={(e) => setServiceForm({ ...serviceForm, traffic: e.target.value })}
                              className="input-field"
                              placeholder="10K"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price ($)
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={serviceForm.price}
                            onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                            className="input-field"
                            placeholder="100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            required
                            rows={4}
                            value={serviceForm.description}
                            onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                            className="input-field"
                            placeholder="Describe your website, niche, content guidelines, and what buyers can expect..."
                          />
                        </div>

                        <div className="flex space-x-3 pt-4">
                          <button
                            type="submit"
                            className="btn-primary"
                          >
                            {editingService ? 'Update Service' : 'Create Service'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowServiceForm(false)
                              setEditingService(null)
                            }}
                            className="btn-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* Services List */}
              {services.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {service.title}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{service.websiteUrl}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-xl font-bold text-primary-600">
                            ${service.price}
                          </div>
                          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                            service.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {service.isApproved ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <span>{service.isApproved ? 'Live' : 'Pending'}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {service.description}
                      </p>

                      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">DA {service.da}</div>
                          <div className="text-gray-500">Authority</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">DR {service.dr}</div>
                          <div className="text-gray-500">Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{service.traffic}</div>
                          <div className="text-gray-500">Traffic</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditService(service)}
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No services yet</h3>
                  <p className="text-gray-600 mb-4">Create your first guest posting service to start earning</p>
                  <button
                    onClick={() => setShowServiceForm(true)}
                    className="btn-primary"
                  >
                    Add Your First Service
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Management</h2>
              
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6">
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
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-primary-600 mb-1">
                                ${order.service.price}
                              </div>
                              <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {order.status === 'pending' && <Clock className="w-3 h-3" />}
                                {order.status === 'accepted' && <MessageCircle className="w-3 h-3" />}
                                {order.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                                {order.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                                <span className="capitalize">{order.status}</span>
                              </div>
                            </div>
                          </div>

                          {order.message && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                              <div className="text-sm font-medium text-gray-700 mb-1">Buyer Requirements:</div>
                              <div className="text-sm text-gray-600">{order.message}</div>
                            </div>
                          )}

                          {order.status === 'pending' && (
                            <div className="flex items-center space-x-2 mt-4">
                              <button
                                onClick={() => handleOrderStatusChange(order.id, 'accepted')}
                                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>Accept Order</span>
                              </button>
                              <button
                                onClick={() => handleOrderStatusChange(order.id, 'cancelled')}
                                className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>Decline</span>
                              </button>
                            </div>
                          )}

                          {order.status === 'accepted' && (
                            <div className="flex items-center space-x-2 mt-4">
                              <button
                                onClick={() => handleOrderStatusChange(order.id, 'completed')}
                                className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>Mark as Completed</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600">Orders will appear here when buyers purchase your services</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard