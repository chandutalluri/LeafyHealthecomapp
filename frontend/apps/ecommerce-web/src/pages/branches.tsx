import Head from 'next/head'
import { useState, useEffect } from 'react'
import { MapPin, Clock, Phone, Star, Navigation, Car } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { GlassCard } from '../components/ui/GlassCard'
import Header from '../components/layout/Header'

interface Branch {
  id: string
  name: string
  address: string
  city: string
  phone: string
  hours: string
  rating: number
  reviews: number
  distance?: number
  coordinates: {
    lat: number
    lng: number
  }
  services: string[]
  isOpen: boolean
}

export default function Branches() {
  const [userLocation, setUserLocation] = useState<any>(null)
  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
  const [isLocationLoading, setIsLocationLoading] = useState(true)

  // Sample branches data - in production, this would come from API
  const sampleBranches: Branch[] = [
    {
      id: '1',
      name: 'Downtown Fresh Market',
      address: '123 Main Street',
      city: 'Downtown',
      phone: '+1 (555) 123-4567',
      hours: '7 AM - 10 PM',
      rating: 4.8,
      reviews: 245,
      coordinates: { lat: 40.7128, lng: -74.0060 },
      services: ['Same-day delivery', 'Curbside pickup', 'Online ordering'],
      isOpen: true
    },
    {
      id: '2',
      name: 'Green Valley Organic',
      address: '456 Oak Avenue',
      city: 'Green Valley',
      phone: '+1 (555) 234-5678',
      hours: '6 AM - 11 PM',
      rating: 4.9,
      reviews: 189,
      coordinates: { lat: 40.7589, lng: -73.9851 },
      services: ['24/7 pickup lockers', 'Fresh juice bar', 'Nutrition consultation'],
      isOpen: true
    },
    {
      id: '3',
      name: 'Riverside Gardens',
      address: '789 River Road',
      city: 'Riverside',
      phone: '+1 (555) 345-6789',
      hours: '8 AM - 9 PM',
      rating: 4.7,
      reviews: 156,
      coordinates: { lat: 40.6892, lng: -74.0445 },
      services: ['Farm tours', 'Seasonal produce', 'Cooking classes'],
      isOpen: false
    },
    {
      id: '4',
      name: 'Suburban Fresh Hub',
      address: '321 Elm Street',
      city: 'Suburbia',
      phone: '+1 (555) 456-7890',
      hours: '7 AM - 10 PM',
      rating: 4.6,
      reviews: 203,
      coordinates: { lat: 40.7282, lng: -73.7949 },
      services: ['Drive-through pickup', 'Bulk ordering', 'Corporate delivery'],
      isOpen: true
    }
  ]

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const d = R * c // Distance in kilometers
    return Math.round(d * 10) / 10 // Round to 1 decimal place
  }

  // Get user location and calculate distances
  useEffect(() => {
    const getUserLocation = async () => {
      setIsLocationLoading(true)
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            
            try {
              // Reverse geocoding to get address
              const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
              const data = await response.json()
              
              const locationData = {
                latitude,
                longitude,
                address: data.locality || 'Unknown',
                city: data.city || data.locality || 'Unknown City',
                country: data.countryName || 'Unknown Country'
              }
              
              setUserLocation(locationData)
              
              // Calculate distances and sort branches
              const branchesWithDistance = (sampleBranches || []).map(branch => ({
                ...branch,
                distance: calculateDistance(latitude, longitude, branch.coordinates.lat, branch.coordinates.lng)
              })).sort((a, b) => (a.distance || 0) - (b.distance || 0))
              
              setBranches(branchesWithDistance)
              
              // Auto-select nearest branch
              if (branchesWithDistance.length > 0) {
                setSelectedBranch(branchesWithDistance[0].id)
              }
              
              // Store location for future use
              localStorage.setItem('userLocation', JSON.stringify(locationData))
              localStorage.setItem('nearestBranch', branchesWithDistance[0]?.name || 'Unknown Branch')
              
            } catch (error) {
              console.error('Error getting address:', error)
              setBranches(sampleBranches)
            } finally {
              setIsLocationLoading(false)
            }
          },
          (error) => {
            console.error('Error getting location:', error)
            setBranches(sampleBranches)
            setIsLocationLoading(false)
          },
          { enableHighAccuracy: true, timeout: 10000 }
        )
      } else {
        setBranches(sampleBranches)
        setIsLocationLoading(false)
      }
    }

    getUserLocation()
  }, [])

  const handleSetPreferredBranch = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId)
    if (branch) {
      localStorage.setItem('preferredBranch', JSON.stringify(branch))
      setSelectedBranch(branchId)
      // You could also update a user preference via API here
    }
  }

  const openInMaps = (branch: Branch) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(branch.address + ', ' + branch.city)}`
    window.open(url, '_blank')
  }

  if (isLocationLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
        <Header />
        <div className="pt-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Finding nearby branches...</h2>
              <p className="text-gray-600">Please allow location access for the best experience</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Store Locations - LeafyHealth</title>
        <meta name="description" content="Find LeafyHealth stores near you. Fresh organic produce with convenient pickup and delivery options." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
        <Header />
        
        <div className="pt-20 px-4">
          <div className="container mx-auto max-w-7xl">
            {/* Header Section */}
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Store Locations</h1>
              <p className="text-xl text-gray-600 mb-6">
                Find a LeafyHealth store near you for fresh organic produce
              </p>
              
              {/* User Location Display */}
              {userLocation && (
                <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full">
                  <Navigation className="w-5 h-5 mr-2" />
                  <span className="font-medium">
                    Your location: {userLocation.city}, {userLocation.country}
                  </span>
                </div>
              )}
            </div>

            {/* Branches Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {branches.map((branch, index) => (
                <GlassCard 
                  key={branch.id} 
                  className={`group hover:scale-102 transition-all duration-300 ${
                    selectedBranch === branch.id ? 'ring-2 ring-green-500 bg-green-50/50' : ''
                  }`}
                >
                  <div className="p-8">
                    {/* Branch Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-bold text-gray-900 mr-3">{branch.name}</h3>
                          {index === 0 && userLocation && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Nearest
                            </span>
                          )}
                          {selectedBranch === branch.id && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium ml-2">
                              Preferred
                            </span>
                          )}
                        </div>
                        
                        {/* Rating */}
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(branch.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {branch.rating} ({branch.reviews} reviews)
                          </span>
                        </div>
                      </div>
                      
                      {/* Status */}
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        branch.isOpen 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {branch.isOpen ? 'Open' : 'Closed'}
                      </div>
                    </div>

                    {/* Branch Details */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-gray-900 font-medium">{branch.address}</p>
                          <p className="text-gray-600">{branch.city}</p>
                          {branch.distance && (
                            <p className="text-green-600 text-sm font-medium mt-1">
                              {branch.distance} km away
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                        <span className="text-gray-900">{branch.hours}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                        <a 
                          href={`tel:${branch.phone}`}
                          className="text-green-600 hover:text-green-700 transition-colors"
                        >
                          {branch.phone}
                        </a>
                      </div>
                    </div>

                    {/* Services */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Services Available</h4>
                      <div className="flex flex-wrap gap-2">
                        {branch.services.map((service, serviceIndex) => (
                          <span 
                            key={serviceIndex}
                            className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Button
                        variant={selectedBranch === branch.id ? "secondary" : "primary"}
                        className="flex-1"
                        onClick={() => handleSetPreferredBranch(branch.id)}
                      >
                        {selectedBranch === branch.id ? 'Preferred Store' : 'Set as Preferred'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => openInMaps(branch)}
                        className="flex items-center"
                      >
                        <Car className="w-4 h-4 mr-2" />
                        Directions
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Additional Information */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <GlassCard className="p-6 text-center">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="font-bold text-gray-900 mb-2">Free Delivery</h3>
                <p className="text-gray-600 text-sm">
                  Same-day delivery available from all locations. Free on orders over $25.
                </p>
              </GlassCard>
              
              <GlassCard className="p-6 text-center">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="font-bold text-gray-900 mb-2">Order Ahead</h3>
                <p className="text-gray-600 text-sm">
                  Place your order online and pick up at your convenience. No waiting in line.
                </p>
              </GlassCard>
              
              <GlassCard className="p-6 text-center">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="font-bold text-gray-900 mb-2">Farm Fresh</h3>
                <p className="text-gray-600 text-sm">
                  All locations receive daily shipments of fresh organic produce from local farms.
                </p>
              </GlassCard>
            </div>

            {/* Contact Info */}
            <div className="mt-16 bg-green-50 rounded-3xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help Finding Us?</h3>
              <p className="text-gray-600 mb-6">
                Our customer service team is here to help you find the perfect location and answer any questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Support
                </Button>
                <Button variant="outline">
                  Live Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}