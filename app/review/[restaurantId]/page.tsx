'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Header,
  StarPicker,
  Button,
  Textarea,
  Chip,
} from '@/components';
import { getDynamicHeading, getPlaceholder, RATING_LABELS } from '@/lib/review-utils';

export default function ReviewPage({ params }: { params: Promise<{ restaurantId: string }> }) {
  const { restaurantId } = use(params);
  const router = useRouter();
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [foodRating, setFoodRating] = useState<number | null>(null);
  const [foodHoverRating, setFoodHoverRating] = useState<number | null>(null);
  const [packagingRating, setPackagingRating] = useState<number | null>(null);
  const [packagingHoverRating, setPackagingHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [recommends, setRecommends] = useState(false);
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
      body: JSON.stringify({
        restaurantId: Number(restaurantId),
        rating,
        comment,
        recommends,
        foodRating,
        packagingRating,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Something went wrong');
      setSubmitting(false);
      return;
    }

    router.push(`/restaurant/${restaurantId}`);
  };

  const dynamicHeading = getDynamicHeading(rating);
  const placeholder = getPlaceholder(rating);

  return (
    <div className="min-h-screen bg-white">
      <Header title="Zomato Lite" />

      <main className="max-w-[560px] mx-auto px-4 py-6 pb-28">
        <div className="bg-white rounded-2xl border border-[#f1f0eb] shadow-sm p-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">{dynamicHeading}</h1>
          <p className="text-[#6b6b6b] mb-6">Reviewing <span className="font-medium text-[#1a1a1a]">{restaurantName || 'Loading…'}</span></p>

          {error && (
            <div className="mb-5 p-4 bg-[#fef2f2] border border-[#fecaca] rounded-xl text-[#e23744] text-sm" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <fieldset className="mb-7">
              <legend className="block text-sm font-medium text-[#1a1a1a] mb-3">Overall rating</legend>
              <StarPicker
                rating={rating}
                onRatingChange={setRating}
                onHoverChange={setHoverRating}
                hoverRating={hoverRating}
                label="Overall rating"
                size="lg"
              />
            </fieldset>

            <fieldset className="mb-7">
              <legend className="block text-sm font-medium text-[#1a1a1a] mb-3">Food (optional)</legend>
              <StarPicker
                rating={foodRating}
                onRatingChange={setFoodRating}
                onHoverChange={setFoodHoverRating}
                hoverRating={foodHoverRating}
                label="Food rating"
                size="md"
              />
            </fieldset>

            <fieldset className="mb-7">
              <legend className="block text-sm font-medium text-[#1a1a1a] mb-3">Packaging (optional)</legend>
              <StarPicker
                rating={packagingRating}
                onRatingChange={setPackagingRating}
                onHoverChange={setPackagingHoverRating}
                hoverRating={packagingHoverRating}
                label="Packaging rating"
                size="md"
              />
            </fieldset>

            <Textarea
              id="comment"
              label="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              placeholder={placeholder}
              error={error || undefined}
            />

            <div className="mb-7">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recommends}
                  onChange={(e) => setRecommends(e.target.checked)}
                  className="w-5 h-5 rounded border-[#e5e7eb] text-[#e23744] focus:ring-2 focus:ring-[#e23744] focus:ring-offset-2 transition-colors"
                  aria-label="I recommend it to my friends"
                />
                <span className="text-sm text-[#1a1a1a]">I recommend it to my friends</span>
              </label>
            </div>

            <Button type="submit" fullWidth size="lg" loading={submitting} disabled={!rating || !comment.trim()}>
              {submitting ? 'Submitting…' : 'Submit your feedback'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}