import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  Globe, 
  ShoppingCart, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  BarChart3,
  Settings,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  city: string
  role: 'buyer' | 'seller' | 'admin'
  isApproved?: boolean
}

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

const AdminDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'services' | 'orders'>('overview')
  const [users, setUsers] = useState<User[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }

    loadData()
  }, [user, navigate])

  const loadData = () => {
    // Load users
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
    setUsers(allUsers.filter((u: User) => u.role !== 'admin'))

    // Load services
    const allServices = JSON.parse(localStorage.getItem('services') || '[]')
    setServices(allServices)

    // Load orders
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    setOrders(allOrders.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }

  const handleUserApproval = (userId: string, approved: boolean) => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = allUsers.map((u: User) =>
      u.id === userId ? { ...u, isApproved: approved } : u
    )
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    loadData()
    
    const userName = users.find(u => u.id === userId)?.firstName
    alert(`${userName}'s account has been ${approved ? 'approved' : 'rejected'}!`)
  }

  const handleServiceApproval = (serviceId: string, approved: boolean) => {
    const allServices = JSON.parse(localStorage.getItem('services') || '[]')
    const updatedServices = allServices.map((s: Service) =>
      s.id === serviceId ? { ...s, isApproved: approved } : s
    )
    localStorage.setItem('services', JSON.stringify(updatedServices))
    loadData()
    
    const serviceName = services.find(s => s.id === serviceId)?.title
    alert(`Service "${serviceName}" has been ${approved ? 'approved' : 'rejected'}!`)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
      const updatedUsers = allUsers.filter((u: User) => u.id !== userId)
      localStorage.setItem('users', JSON.stringify(updatedUsers))
      
      // Also delete related services and orders
      const allServices = JSON.parse(localStorage.getItem('services') || '[]')
      const updatedServices = allServices.filter((s: Service) => s.sellerId !== userId)
      localStorage.setItem('services', JSON.stringify(updatedServices))
      
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const updatedOrders = allOrders.filter((o: Order) => o.buyerId !== userId && o.sellerId !== userId)
      localStorage.setItem('orders', JSON.stringify(updatedOrders))
      
      loadData()
      alert('User and all related data have been deleted.')
    }
  }

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      const allServices = JSON.parse(localStorage.getItem('services') || '[]')
      const updatedServices = allServices.filter((s: Service) => s.id !== serviceId)
      localStorage.setItem('services', JSON.stringify(updatedServices))
      loadData()
      alert('Service has been deleted.')
    }
  }

  // Filter functions
  const getFilteredUsers = () => {
    let filtered = users.filter(user => {
      const matchesSearch = searchQuery === '' || 
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'pending' && !user.isApproved) ||
        (filterStatus === 'approved' && user.isApproved)

      return matchesSearch && matchesStatus
    })
    return filtered
  }

  const getFilteredServices = () => {
    let filtered = services.filter(service => {
      const matchesSearch = searchQuery === '' || 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.websiteUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.sellerName.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'pending' && !service.isApproved) ||
        (filterStatus === 'approved' && service.isApproved)

      return matchesSearch && matchesStatus
    })
    return filtered
  }

  // Statistics
  const stats = {
    totalUsers: users.length,
    totalBuyers: users.filter(u => u.role === 'buyer').length,
    totalSellers: users.filter(u => u.role === 'seller').length,
    pendingUsers: users.filter(u => u.role === 'seller' && !u.isApproved).length,
    totalServices: services.length,
    approvedServices: services.filter(s => s.isApproved).length,
    pendingServices: services.filter(s => !s.isApproved).length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    completedOrders: orders.filter(o => o.status === 'completed').length,
    totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, order) => sum + order.service.price, 0)
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user.firstName}! Manage your platform from here.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            <div className="text-gray-600 text-sm">Total Users</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{stats.totalBuyers}</div>
            <div className="text-gray-600 text-sm">Buyers</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">{stats.totalSellers}</div>
            <div className="text-gray-600 text-sm">Sellers</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingUsers}</div>
            <div className="text-gray-600 text-sm">Pending Users</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-indigo-600">{stats.totalServices}</div>
            <div className="text-gray-600 text-sm">Total Services</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">{stats.pendingServices}</div>
            <div className="text-gray-600 text-sm">Pending Services</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-teal-600">{stats.totalOrders}</div>
            <div className="text-gray-600 text-sm">Total Orders</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-primary-600">${stats.totalRevenue}</div>
            <div className="text-gray-600 text-sm">Revenue</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview', icon: BarChart3 },
                { key: 'users', label: 'Users', icon: Users, count: stats.pendingUsers },
                { key: 'services', label: 'Services', icon: Globe, count: stats.pendingServices },
                { key: 'orders', label: 'Orders', icon: ShoppingCart }
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
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count && tab.count > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {/* Pending Users */}
                    {stats.pendingUsers > 0 && (
                      <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <div>
                          <div className="font-medium text-yellow-800">
                            {stats.pendingUsers} seller{stats.pendingUsers > 1 ? 's' : ''} awaiting approval
                          </div>
                          <div className="text-sm text-yellow-600">Review and approve new sellers</div>
                        </div>
                      </div>
                    )}

                    {/* Pending Services */}
                    {stats.pendingServices > 0 && (
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <Globe className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-blue-800">
                            {stats.pendingServices} service{stats.pendingServices > 1 ? 's' : ''} awaiting approval
                          </div>
                          <div className="text-sm text-blue-600">Review and approve new services</div>
                        </div>
                      </div>
                    )}

                    {/* Recent Orders */}
                    {stats.pendingOrders > 0 && (
                      <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <ShoppingCart className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium text-green-800">
                            {stats.pendingOrders} new order{stats.pendingOrders > 1 ? 's' : ''} placed
                          </div>
                          <div className="text-sm text-green-600">Monitor order activity</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Platform Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-5 h-5 text-primary-600" />
                        <span className="font-medium">Total Revenue</span>
                      </div>
                      <span className="text-xl font-bold text-primary-600">${stats.totalRevenue}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Completed Orders</span>
                      </div>
                      <span className="text-xl font-bold text-green-600">{stats.completedOrders}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Eye className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Active Services</span>
                      </div>
                      <span className="text-xl font-bold text-blue-600">{stats.approvedServices}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="p-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Users</option>
                  <option value="pending">Pending Approval</option>
                  <option value="approved">Approved</option>
                </select>
              </div>

              {/* Users List */}
              <div className="space-y-4">
                {getFilteredUsers().map((user) => (
                  <div key={user.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1 mb-4 lg:mb-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {user.firstName} {user.lastName}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <div className="flex items-center space-x-1">
                                <Mail className="w-4 h-4" />
                                <span>{user.email}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Phone className="w-4 h-4" />
                                <span>{user.phone}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{user.city}, {user.country}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'seller' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                            {user.role === 'seller' && (
                              <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${
                                user.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {user.isApproved ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                <span>{user.isApproved ? 'Approved' : 'Pending'}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {user.role === 'seller' && !user.isApproved && (
                          <div className="flex items-center space-x-2 mt-4">
                            <button
                              onClick={() => handleUserApproval(user.id, true)}
                              className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              <UserCheck className="w-4 h-4" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleUserApproval(user.id, false)}
                              className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                              <UserX className="w-4 h-4" />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}

                        <div className="flex items-center space-x-2 mt-4">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Delete User</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {getFilteredUsers().length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="p-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Services</option>
                  <option value="pending">Pending Approval</option>
                  <option value="approved">Approved</option>
                </select>
              </div>

              {/* Services List */}
              <div className="space-y-4">
                {getFilteredServices().map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1 mb-4 lg:mb-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {service.title}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                              <Globe className="w-4 h-4" />
                              <span>{service.websiteUrl}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              by {service.sellerName} • {service.sellerPhone}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-primary-600 mb-1">
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

                        <div className="flex items-center space-x-2">
                          {!service.isApproved && (
                            <>
                              <button
                                onClick={() => handleServiceApproval(service.id, true)}
                                className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleServiceApproval(service.id, false)}
                                className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {getFilteredServices().length === 0 && (
                <div className="text-center py-12">
                  <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No services found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
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
                              <div className="text-sm text-gray-600">
                                Seller: {order.service.sellerName}
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
                                <span className="capitalize">{order.status}</span>
                              </div>
                            </div>
                          </div>

                          {order.message && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                              <div className="text-sm font-medium text-gray-700 mb-1">Requirements:</div>
                              <div className="text-sm text-gray-600">{order.message}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600">Orders will appear here when users start purchasing services</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard