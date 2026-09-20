'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

const ACCENT = '#e23744';
const ACCENT_HOVER = '#c42d3a';
const ACCENT_LIGHT = '#fef2f2';
const ACCENT_LIGHT_BORDER = '#fecaca';

export default function ReviewPage({ params }: { params: Promise<{ restaurantId: string }> }) {
  const { restaurantId } = use(params);
  const router = useRouter();
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [restaurantName, setRestaurantName] = useState('');

  useEffect(() => {
    fetch(`/api/restaurants/${restaurantId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.name) setRestaurantName(data.name);
      })
      .catch(() => {});
  }, [restaurantId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurantId: Number(restaurantId), rating, comment }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Something went wrong');
      setSubmitting(false);
      return;
    }

    router.push(`/restaurant/${restaurantId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#f1f0eb] shadow-sm">
        <div className="max-w-[560px] mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-xl font-bold text-[#e23744] tracking-tight">Zomato Lite</span>
        </div>
      </header>

      <main className="max-w-[560px] mx-auto px-4 py-6 pb-28">
        <div className="bg-white rounded-2xl border border-[#f1f0eb] shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-2">Write a review</h1>
          <p className="text-[#6b6b6b] mb-6">Reviewing <span className="font-medium text-[#1a1a1a]">{restaurantName || 'Loading…'}</span></p>

          {error && (
            <div className="mb-5 p-4 bg-[#fef2f2] border border-[#fecaca] rounded-xl text-[#e23744] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <fieldset className="mb-7">
              <legend className="block text-sm font-medium text-[#1a1a1a] mb-3">Rating</legend>
              <div className="flex gap-3" role="radiogroup" aria-label="Select rating">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = rating !== null && star <= rating;
                  return (
                    <button
                      key={star}
                      type="button"
                      role="radio"
                      aria-checked={isFilled}
                      onClick={() => setRating(star)}
                      className={`flex items-center justify-center w-14 h-14 rounded-xl border-2 transition-all duration-150 ${
                        isFilled
                          ? 'bg-[#fef2f2] border-[#e23744] text-[#e23744] shadow-sm shadow-[#e23744]/10'
                          : 'border-[#e5e7eb] text-[#d1d5db] hover:border-[#e23744] hover:text-[#e23744] hover:bg-[#fef2f2]'
                      }`}
                      aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                    >
                      ★
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mb-7">
              <label htmlFor="comment" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Comment
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                className="w-full px-4 py-3.5 border border-[#e5e7eb] rounded-xl text-[#1a1a1a] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#e23744] focus:border-transparent resize-none transition-all duration-150"
                placeholder="What did you think? Share your experience..."
              />
            </div>

            <button
              type="submit"
              disabled={!rating || !comment.trim() || submitting}
              className={`w-full px-5 py-3.5 rounded-xl font-semibold text-base transition-all duration-150 min-h-[44px] ${
                rating && comment.trim() && !submitting
                  ? 'bg-[#e23744] text-white shadow-lg shadow-[#e23744]/25 hover:bg-[#c42d3a] hover:shadow-[#e23744]/35 active:scale-[0.98]'
                  : 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
              }`}
            >
              {submitting ? 'Submitting…' : 'Submit review'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}