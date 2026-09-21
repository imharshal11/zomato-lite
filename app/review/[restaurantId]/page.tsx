'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Header,
  StarPicker,
  Button,
  Textarea,
} from '@/components';
import { getDynamicHeading, getPlaceholder } from '@/lib/review-utils';

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
}

export default function ReviewPage({ params }: { params: Promise<{ restaurantId: string }> }) {
  const { restaurantId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const [success, setSuccess] = useState(false);
  const [restaurantName, setRestaurantName] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<number | null>(null);

  useEffect(() => {
    const dishParam = searchParams.get('dish');
    if (dishParam) {
      const dishId = Number(dishParam);
      if (!isNaN(dishId)) {
        setSelectedMenuItemId(dishId);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    fetch(`/api/restaurants/${restaurantId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.name) setRestaurantName(data.name);
      })
      .catch(() => {});
  }, [restaurantId]);

  useEffect(() => {
    fetch(`/api/restaurants/${restaurantId}/menu`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMenuItems(data);
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
        menuItemId: selectedMenuItemId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Something went wrong');
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    router.refresh();
    setTimeout(() => {
      router.push(`/restaurant/${restaurantId}`);
    }, 1500);
  };

  const dynamicHeading = getDynamicHeading(rating);
  const placeholder = getPlaceholder(rating);

  return (
    <div className="min-h-screen bg-white">
      <Header title="Zomato Lite" backHref={`/restaurant/${restaurantId}`} backLabel="Back to restaurant" />

      <main className="max-w-[560px] mx-auto px-4 py-6 pb-8">
        <div className="bg-white rounded-2xl border border-[#f1f0eb] shadow-sm p-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">{dynamicHeading}</h1>
          <p className="text-[#6b6b6b] mb-6">Reviewing <span className="font-medium text-[#1a1a1a]">{restaurantName || 'Loading…'}</span></p>

          {success && (
            <div className="mb-5 p-4 bg-[#dcfce7] border border-[#bbf7d0] rounded-xl text-[#16a34a] text-sm text-center" role="status">
              <p className="font-semibold">Thank you!</p>
              <p>Your review has been submitted.</p>
            </div>
          )}

          {error && (
            <div className="mb-5 p-4 bg-[#fef2f2] border border-[#fecaca] rounded-xl text-[#e23744] text-sm" role="alert">
              {error}
            </div>
          )}

          {!success && (
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

              <fieldset className="mb-7">
                <legend className="block text-sm font-medium text-[#1a1a1a] mb-2">Which dish? (optional)</legend>
                <select
                  value={selectedMenuItemId ?? ''}
                  onChange={(e) => setSelectedMenuItemId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-4 py-3.5 border border-[#e5e7eb] rounded-xl text-[#1a1a1a] bg-white focus:outline-none focus:ring-2 focus:ring-[#e23744] focus:border-transparent transition-all duration-150 appearance-none bg-no-repeat bg-right min-h-[44px]"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22%3E%3Cpath stroke=%22%236b6b6b%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%221.5%22 d=%22M6 8l4 4 4-4%22/%3E%3C/svg%3E")', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                >
                  <option value="">General review (no specific dish)</option>
                  {menuItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} — ₹{item.price.toFixed(0)}
                    </option>
                  ))}
                </select>
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
          )}
        </div>
      </main>
    </div>
  );
}