import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter, Globe, Star, ArrowRight, SlidersHorizontal } from 'lucide-react'

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

const Services = () => {
  const [searchParams] = useSearchParams()
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minDA: '',
    maxDA: '',
    minDR: '',
    maxDR: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    // Load approved services
    const allServices = JSON.parse(localStorage.getItem('services') || '[]')
    const approvedServices = allServices.filter((s: Service) => s.isApproved)
    setServices(approvedServices)
    setFilteredServices(approvedServices)
  }, [])

  useEffect(() => {
    // Apply filters and search
    let filtered = services.filter((service) => {
      const matchesSearch = searchQuery === '' || 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.websiteUrl.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesPrice = 
        (filters.minPrice === '' || service.price >= parseInt(filters.minPrice)) &&
        (filters.maxPrice === '' || service.price <= parseInt(filters.maxPrice))

      const matchesDA = 
        (filters.minDA === '' || service.da >= parseInt(filters.minDA)) &&
        (filters.maxDA === '' || service.da <= parseInt(filters.maxDA))

      const matchesDR = 
        (filters.minDR === '' || service.dr >= parseInt(filters.minDR)) &&
        (filters.maxDR === '' || service.dr <= parseInt(filters.maxDR))

      return matchesSearch && matchesPrice && matchesDA && matchesDR
    })

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'da-high':
        filtered.sort((a, b) => b.da - a.da)
        break
      case 'dr-high':
        filtered.sort((a, b) => b.dr - a.dr)
        break
      default:
        // newest first (default order)
        break
    }

    setFilteredServices(filtered)
  }, [services, searchQuery, filters, sortBy])

  const handleFilterChange = (key: string, value: string) => {
    setFilters({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      minDA: '',
      maxDA: '',
      minDR: '',
      maxDR: ''
    })
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Guest Posting Services
          </h1>
          <p className="text-gray-600">
            Discover premium websites for your guest posting needs
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search services, websites, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="da-high">Highest DA</option>
                <option value="dr-high">Highest DR</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price ($)
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price ($)
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min DA
                  </label>
                  <input
                    type="number"
                    value={filters.minDA}
                    onChange={(e) => handleFilterChange('minDA', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max DA
                  </label>
                  <input
                    type="number"
                    value={filters.maxDA}
                    onChange={(e) => handleFilterChange('maxDA', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min DR
                  </label>
                  <input
                    type="number"
                    value={filters.minDR}
                    onChange={(e) => handleFilterChange('minDR', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max DR
                  </label>
                  <input
                    type="number"
                    value={filters.maxDR}
                    onChange={(e) => handleFilterChange('maxDR', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="100"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredServices.length} of {services.length} services
          </p>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
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
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Load More (if needed) */}
        {filteredServices.length > 0 && filteredServices.length < services.length && (
          <div className="text-center mt-12">
            <button className="btn-secondary">
              Load More Services
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Services