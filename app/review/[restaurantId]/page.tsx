'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

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
    <main className="min-h-screen bg-[#faf9f6] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[560px] bg-white rounded-xl border border-[#e8e4dd] p-8">
        <h1 className="text-2xl font-normal text-[#1a1a1a] mb-6">Write a review</h1>

        <p className="text-[#6b635a] mb-8">Reviewing <span className="font-medium text-[#1a1a1a]">{restaurantName || 'Loading…'}</span></p>

        {error && (
          <div className="mb-6 p-4 bg-[#fff5f5] border border-[#f5c6c6] rounded-lg text-[#c0392b] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <fieldset className="mb-8">
            <legend className="block text-sm font-medium text-[#1a1a1a] mb-3">Rating</legend>
            <div className="flex gap-2" role="radiogroup" aria-label="Select rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  role="radio"
                  aria-checked={rating === star}
                  onClick={() => setRating(star)}
                  className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-colors ${
                    rating === star
                      ? 'border-[#d4a843] bg-[#fffbf0] text-[#d4a843]'
                      : 'border-[#e8e4dd] text-[#c4b9ad] hover:border-[#d4a843] hover:text-[#d4a843]'
                  }`}
                  aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                >
                  ★
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mb-8">
            <label htmlFor="comment" className="block text-sm font-medium text-[#1a1a1a] mb-2">
              Comment
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-[#e8e4dd] rounded-lg text-[#1a1a1a] placeholder-[#c4b9ad] focus:outline-none focus:ring-2 focus:ring-[#d4a843] focus:border-transparent resize-none"
              placeholder="What did you think?"
            />
          </div>

          <button
            type="submit"
            disabled={!rating || !comment.trim() || submitting}
            className={`w-full py-3 rounded-lg font-medium text-sm transition-colors ${
              rating && comment.trim() && !submitting
                ? 'bg-[#d4a843] text-white hover:bg-[#c49638]'
                : 'bg-[#e8e4dd] text-[#c4b9ad] cursor-not-allowed'
            }`}
          >
            {submitting ? 'Submitting…' : 'Submit review'}
          </button>
        </form>
      </div>
    </main>
  );
}