import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { tours, regions, durations } from '../data/tours';
import TourCard from '../components/TourCard';
import './Tours.css';

const tourTypes = ['All', 'Escorted', 'Tailor-Made'];

export default function Tours() {
  const [searchParams] = useSearchParams();
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('Any Duration');
  const [sortBy, setSortBy] = useState('popular');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...tours];
    if (selectedRegion !== 'All Regions') result = result.filter((t) => t.region === selectedRegion);
    if (selectedType !== 'All') result = result.filter((t) => t.type === selectedType);
    if (selectedDuration !== 'Any Duration') {
      if (selectedDuration === 'Up to 7 days') result = result.filter((t) => parseInt(t.duration) <= 7);
      else if (selectedDuration === '8–10 days') result = result.filter((t) => parseInt(t.duration) >= 8 && parseInt(t.duration) <= 10);
      else if (selectedDuration === '11–14 days') result = result.filter((t) => parseInt(t.duration) >= 11 && parseInt(t.duration) <= 14);
      else if (selectedDuration === '15+ days') result = result.filter((t) => parseInt(t.duration) >= 15);
    }
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [selectedRegion, selectedType, selectedDuration, sortBy]);

  const clearFilters = () => {
    setSelectedRegion('All Regions');
    setSelectedType('All');
    setSelectedDuration('Any Duration');
    setSortBy('popular');
  };

  const hasFilters = selectedRegion !== 'All Regions' || selectedType !== 'All' || selectedDuration !== 'Any Duration';

  return (
    <main className="tours-page">
      {/* Hero */}
      <div className="tours-page__hero">
        <div className="tours-page__hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80)' }} />
        <div className="tours-page__hero-overlay" />
        <div className="container tours-page__hero-content">
          <span className="tag">All Tours</span>
          <h1 className="tours-page__hero-title">Tours & Holidays</h1>
          <p className="tours-page__hero-sub">Discover {tours.length} handpicked journeys to the world's most extraordinary destinations</p>
        </div>
      </div>

      <div className="container tours-page__body">
        {/* Filters bar */}
        <div className="tours-page__filters-bar">
          <div className="tours-page__filters-left">
            <button className="tours-page__filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)}>
              <SlidersHorizontal size={16} /> Filters
              {hasFilters && <span className="tours-page__filter-count">•</span>}
            </button>

            {/* Region filter */}
            <div className="tours-page__filter-group">
              {['All Regions', ...regions.slice(0, 4)].map((r) => (
                <button
                  key={r}
                  className={`tours-page__filter-chip ${selectedRegion === r ? 'active' : ''}`}
                  onClick={() => setSelectedRegion(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="tours-page__filters-right">
            {hasFilters && (
              <button className="tours-page__clear-filters" onClick={clearFilters}>
                <X size={14} /> Clear
              </button>
            )}
            <label className="tours-page__sort-label">Sort by:</label>
            <select className="tours-page__sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Expanded filters */}
        {filtersOpen && (
          <div className="tours-page__filters-expanded">
            <div className="tours-page__filter-section">
              <h4 className="tours-page__filter-title">Tour Type</h4>
              <div className="tours-page__filter-options">
                {tourTypes.map((t) => (
                  <label key={t} className={`tours-page__filter-option ${selectedType === t ? 'active' : ''}`}>
                    <input type="radio" name="type" value={t} checked={selectedType === t} onChange={() => setSelectedType(t)} />
                    {t}
                  </label>
                ))}
              </div>
            </div>
            <div className="tours-page__filter-section">
              <h4 className="tours-page__filter-title">Duration</h4>
              <div className="tours-page__filter-options">
                {durations.map((d) => (
                  <label key={d} className={`tours-page__filter-option ${selectedDuration === d ? 'active' : ''}`}>
                    <input type="radio" name="duration" value={d} checked={selectedDuration === d} onChange={() => setSelectedDuration(d)} />
                    {d}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="tours-page__results-meta">
          <span>{filtered.length} tours found</span>
        </div>

        {filtered.length > 0 ? (
          <div className="tours-page__grid">
            {filtered.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="tours-page__empty">
            <p>No tours match your filters. Try adjusting your selection.</p>
            <button className="btn-primary" onClick={clearFilters}>Clear Filters</button>
          </div>
        )}
      </div>
    </main>
  );
}
