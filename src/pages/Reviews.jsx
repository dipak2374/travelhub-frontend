import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiArrowLeft, FiEdit3, FiMessageSquare, FiSend, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { reviewAPI } from '../services';

const itemModels = ['Hotel', 'Flight', 'Bus', 'Car', 'Tour'];

const Reviews = () => {
  const [searchParams] = useSearchParams();
  const itemModel = searchParams.get('itemModel') || '';
  const itemId = searchParams.get('itemId') || '';
  const itemName = searchParams.get('name') || 'this experience';

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(Boolean(itemModel && itemId));
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    item: itemId,
    itemModel,
    rating: 5,
    title: '',
    comment: '',
  });

  const canReview = itemModels.includes(itemModel) && itemId;

  useEffect(() => {
    setForm((current) => ({ ...current, item: itemId, itemModel }));
  }, [itemId, itemModel]);

  useEffect(() => {
    if (!canReview) {
      setLoading(false);
      return;
    }

    setLoading(true);
    reviewAPI
      .get(itemModel, itemId)
      .then((response) => setReviews(response.data.data || []))
      .catch(() => toast.error('Unable to load reviews right now'))
      .finally(() => setLoading(false));
  }, [canReview, itemId, itemModel]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
    return Math.round((total / reviews.length) * 10) / 10;
  }, [reviews]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canReview) {
      toast.error('Open this page from a listing to write a review');
      return;
    }

    if (!form.title.trim() || !form.comment.trim()) {
      toast.error('Please add a title and comment');
      return;
    }

    setSubmitting(true);
    try {
      const response = await reviewAPI.create({
        ...form,
        rating: Number(form.rating),
        title: form.title.trim(),
        comment: form.comment.trim(),
      });
      setReviews((current) => [response.data.data, ...current]);
      setForm((current) => ({ ...current, title: '', comment: '', rating: 5 }));
      toast.success('Review submitted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Please login to submit a review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={-1} className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 mb-6">
          <FiArrowLeft />
          Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          <section className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Ratings and reviews</p>
              <h1 className="mt-2 text-3xl md:text-4xl font-display font-bold text-gray-950 dark:text-white">
                Share your TravelHub experience
              </h1>
              <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl">
                {canReview
                  ? `Tell other travelers what stood out about ${itemName}.`
                  : 'Choose a hotel, flight, bus, car, or tour detail page first, then open reviews from there.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card p-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">Average rating</p>
                <div className="mt-2 flex items-center gap-2">
                  <FiStar className="text-amber-400 fill-amber-400" size={24} />
                  <span className="text-3xl font-bold">{averageRating || '-'}</span>
                </div>
              </div>
              <div className="card p-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total reviews</p>
                <p className="mt-2 text-3xl font-bold">{reviews.length}</p>
              </div>
              <div className="card p-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">Reviewing</p>
                <p className="mt-2 text-lg font-semibold truncate">{canReview ? itemName : 'No item selected'}</p>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-2 mb-5">
                <FiMessageSquare className="text-primary-600" />
                <h2 className="text-xl font-semibold">Recent reviews</h2>
              </div>

              {loading ? (
                <p className="text-gray-500 dark:text-gray-400">Loading reviews...</p>
              ) : reviews.length ? (
                <div className="space-y-5">
                  {reviews.map((review) => (
                    <article key={review._id} className="border-b border-gray-100 dark:border-gray-800 pb-5 last:border-0 last:pb-0">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{review.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{review.user?.name || 'Traveler'}</p>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <FiStar key={index} className={index < review.rating ? 'fill-amber-400' : 'text-gray-300'} />
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">{review.comment}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No reviews yet. Yours can be the first one.</p>
              )}
            </div>
          </section>

          <aside className="card p-6 lg:sticky lg:top-28">
            <div className="flex items-center gap-2 mb-5">
              <FiEdit3 className="text-primary-600" />
              <h2 className="text-xl font-semibold">Write a review</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Rating</label>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const value = index + 1;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm((current) => ({ ...current, rating: value }))}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                        aria-label={`${value} star rating`}
                      >
                        <FiStar size={26} className={value <= form.rating ? 'fill-amber-400' : 'text-gray-300'} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <input
                  className="input-field"
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="What should others know?"
                  maxLength={80}
                  disabled={!canReview}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Review</label>
                <textarea
                  className="input-field min-h-36 resize-none"
                  value={form.comment}
                  onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))}
                  placeholder="Share details about comfort, service, timing, cleanliness, or value."
                  maxLength={600}
                  disabled={!canReview}
                />
              </div>

              <button type="submit" className="btn-primary w-full inline-flex items-center justify-center gap-2" disabled={submitting || !canReview}>
                <FiSend />
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
