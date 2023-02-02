const express = require('express');
const router = express.Router({mergeParams: true});
const Pgroomies = require('../models/pgroomies');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Review = require('../models/review');
const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const pg = await Pgroomies.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user.id;
    pg.reviews.push(review);
    await review.save();
    await pg.save();
    req.flash('success','Successfully created new review');
    res.redirect(`/pgroomies/${pg.id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Pgroomies.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted review');
    res.redirect(`/pgroomies/${id}`);
}));


module.exports = router;