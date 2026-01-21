import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Star, MapPin, Search, Globe, Phone, Mail, 
  ExternalLink, Navigation, Clock, Euro, 
  GraduationCap, Building, ChevronRight, X
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Informações das cidades
const cityInfo = {
  Dublin: {
    emoji: "🏙️",
    description: "Capital da Irlanda - Maior cidade e mais opções de escolas",
    description_en: "Capital of Ireland - Largest city with most school options",
    image: "https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800"
  },
  Cork: {
    emoji: "🏰",
    description: "Segunda maior cidade - Custo de vida mais acessível",
    description_en: "Second largest city - More affordable cost of living",
    image: "https://images.unsplash.com/photo-1558981852-426c6c22a060?w=800"
  },
  Galway: {
    emoji: "🌊",
    description: "Costa oeste - Vida cultural vibrante e paisagens incríveis",
    description_en: "West coast - Vibrant cultural life and amazing landscapes",
    image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800"
  },
  Limerick: {
    emoji: "🏛️",
    description: "Centro-oeste - Cidade universitária com ótimo custo-benefício",
    description_en: "Mid-west - University city with great value",
    image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800"
  },
  Drogheda: {
    emoji: "🏘️",
    description: "Nordeste - 30 min de Dublin, custo de vida mais baixo",
    description_en: "Northeast - 30 min from Dublin, lower cost of living",
    image: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=800"
  }
};

export const Schools = () => {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, isPlusUser } = useAuth();
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await axios.get(`${API}/schools`);
      setSchools(response.data);
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
    }
  };

  // Agrupar escolas por cidade
  const schoolsByCity = schools.reduce((acc, school) => {
    const city = school.city || 'Dublin';
    if (!acc[city]) acc[city] = [];
    acc[city].push(school);
    return acc;
  }, {});

  // Filtrar escolas
  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (school.description && school.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = selectedCity === 'all' || school.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  // Abrir Google Maps
  const openGoogleMaps = (school) => {
    if (school.coordinates) {
      const url = `https://www.google.com/maps/search/?api=1&query=${school.coordinates.lat},${school.coordinates.lng}`;
      window.open(url, '_blank');
    } else if (school.address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.address)}`;
      window.open(url, '_blank');
    }
  };

  // Abrir direções no Google Maps
  const openDirections = (school) => {
    if (school.coordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${school.coordinates.lat},${school.coordinates.lng}`;
      window.open(url, '_blank');
    } else if (school.address) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(school.address)}`;
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Skeleton className="h-12 w-64 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="schools-page">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">
            🏫 {language === 'pt' ? 'Escolas de Inglês na Irlanda' : 'English Schools in Ireland'}
          </h1>
          <p className="text-emerald-100 text-lg mb-6">
            {language === 'pt' 
              ? `${schools.length} escolas em 5 cidades • Todas com acreditação ACELS`
              : `${schools.length} schools in 5 cities • All ACELS accredited`}
          </p>
          
          {/* Search */}
          <div className="flex gap-4 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder={language === 'pt' ? 'Buscar escola...' : 'Search school...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-white text-gray-800 border-0"
                data-testid="search-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* City Filter Tabs */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <Tabs value={selectedCity} onValueChange={setSelectedCity}>
            <TabsList className="h-14 bg-transparent gap-2 flex-wrap justify-start">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800 px-4 py-2 rounded-full"
              >
                🌍 {language === 'pt' ? 'Todas' : 'All'} ({schools.length})
              </TabsTrigger>
              {Object.entries(schoolsByCity).map(([city, citySchools]) => (
                <TabsTrigger 
                  key={city}
                  value={city}
                  className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800 px-4 py-2 rounded-full"
                >
                  {cityInfo[city]?.emoji || '📍'} {city} ({citySchools.length})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* City Info Banner */}
        {selectedCity !== 'all' && cityInfo[selectedCity] && (
          <div className="mb-8 bg-gradient-to-r from-emerald-50 to-orange-50 rounded-2xl p-6 flex items-center gap-6">
            <img 
              src={cityInfo[selectedCity].image} 
              alt={selectedCity}
              className="w-32 h-32 rounded-xl object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {cityInfo[selectedCity].emoji} {selectedCity}
              </h2>
              <p className="text-gray-600">
                {language === 'pt' ? cityInfo[selectedCity].description : cityInfo[selectedCity].description_en}
              </p>
              <p className="text-emerald-600 font-medium mt-2">
                {schoolsByCity[selectedCity]?.length || 0} {language === 'pt' ? 'escolas disponíveis' : 'schools available'}
              </p>
            </div>
          </div>
        )}

        {/* Schools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school) => (
            <Card 
              key={school.id} 
              className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-md"
              onClick={() => setSelectedSchool(school)}
              data-testid={`school-card-${school.id}`}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={school.images?.[0] || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800'}
                  alt={school.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {school.featured && (
                  <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
                    ⭐ {language === 'pt' ? 'Destaque' : 'Featured'}
                  </Badge>
                )}
                <Badge className="absolute top-3 right-3 bg-emerald-600 text-white">
                  {cityInfo[school.city]?.emoji || '📍'} {school.city}
                </Badge>
              </div>
              
              <CardContent className="p-5">
                {/* School Name & Rating */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-emerald-600 transition-colors">
                    {school.name}
                  </h3>
                  {school.rating && (
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-yellow-700">{school.rating}</span>
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{school.address}</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-4">
                  <Euro className="h-4 w-4" />
                  <span>€{school.price_week}/semana</span>
                </div>

                {/* Accreditations */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {school.accreditations?.slice(0, 3).map((acc, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                      {acc}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      openGoogleMaps(school);
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    {language === 'pt' ? 'Mapa' : 'Map'}
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(school.website, '_blank');
                    }}
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    Site
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredSchools.length === 0 && (
          <div className="text-center py-16">
            <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {language === 'pt' ? 'Nenhuma escola encontrada' : 'No schools found'}
            </h3>
            <p className="text-gray-400">
              {language === 'pt' ? 'Tente ajustar sua busca' : 'Try adjusting your search'}
            </p>
          </div>
        )}
      </div>

      {/* School Detail Modal */}
      {selectedSchool && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedSchool(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Image */}
            <div className="relative h-64">
              <img
                src={selectedSchool.images?.[0] || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800'}
                alt={selectedSchool.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                onClick={() => setSelectedSchool(null)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40 transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <Badge className="mb-2 bg-emerald-600">
                  {cityInfo[selectedSchool.city]?.emoji} {selectedSchool.city}
                </Badge>
                <h2 className="text-3xl font-bold text-white">{selectedSchool.name}</h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-emerald-50 p-4 rounded-xl text-center">
                  <Euro className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-emerald-600">€{selectedSchool.price_week}</p>
                  <p className="text-sm text-gray-500">{language === 'pt' ? 'por semana' : 'per week'}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl text-center">
                  <Star className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-yellow-600">{selectedSchool.rating || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{selectedSchool.reviews_count || 0} reviews</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <GraduationCap className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-blue-600">{selectedSchool.courses?.length || 0}</p>
                  <p className="text-sm text-gray-500">{language === 'pt' ? 'cursos' : 'courses'}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl text-center">
                  <Building className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-purple-600">{selectedSchool.facilities?.length || 0}</p>
                  <p className="text-sm text-gray-500">{language === 'pt' ? 'instalações' : 'facilities'}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">{language === 'pt' ? 'Sobre a Escola' : 'About the School'}</h3>
                <p className="text-gray-600">
                  {language === 'pt' ? selectedSchool.description : selectedSchool.description_en}
                </p>
              </div>

              {/* Address & Contact */}
              <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <h3 className="font-semibold text-lg mb-3">{language === 'pt' ? 'Localização e Contato' : 'Location & Contact'}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    <span className="text-gray-700">{selectedSchool.address}</span>
                  </div>
                  {selectedSchool.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-emerald-600" />
                      <a href={`tel:${selectedSchool.phone}`} className="text-emerald-600 hover:underline">
                        {selectedSchool.phone}
                      </a>
                    </div>
                  )}
                  {selectedSchool.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-emerald-600" />
                      <a href={`mailto:${selectedSchool.email}`} className="text-emerald-600 hover:underline">
                        {selectedSchool.email}
                      </a>
                    </div>
                  )}
                  {selectedSchool.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-emerald-600" />
                      <a href={selectedSchool.website} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                        {selectedSchool.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Courses */}
              {selectedSchool.courses && selectedSchool.courses.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">{language === 'pt' ? 'Cursos Oferecidos' : 'Courses Offered'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSchool.courses.map((course, idx) => (
                      <Badge key={idx} className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Facilities */}
              {selectedSchool.facilities && selectedSchool.facilities.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">{language === 'pt' ? 'Instalações' : 'Facilities'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSchool.facilities.map((facility, idx) => (
                      <Badge key={idx} variant="outline" className="bg-gray-50">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Accreditations */}
              {selectedSchool.accreditations && selectedSchool.accreditations.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">{language === 'pt' ? 'Acreditações' : 'Accreditations'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSchool.accreditations.map((acc, idx) => (
                      <Badge key={idx} className="bg-blue-100 text-blue-700">
                        ✓ {acc}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Gallery */}
              {selectedSchool.images && selectedSchool.images.length > 1 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">{language === 'pt' ? 'Galeria de Fotos' : 'Photo Gallery'}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedSchool.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${selectedSchool.name} ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12"
                  onClick={() => window.open(selectedSchool.website, '_blank')}
                >
                  <Globe className="h-5 w-5 mr-2" />
                  {language === 'pt' ? 'Visitar Site Oficial' : 'Visit Official Website'}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50 h-12"
                  onClick={() => openGoogleMaps(selectedSchool)}
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  {language === 'pt' ? 'Ver no Mapa' : 'View on Map'}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 h-12"
                  onClick={() => openDirections(selectedSchool)}
                >
                  <Navigation className="h-5 w-5 mr-2" />
                  {language === 'pt' ? 'Como Chegar' : 'Get Directions'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
