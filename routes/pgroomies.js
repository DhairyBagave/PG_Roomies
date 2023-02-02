const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const Pgroomies = require('../models/pgroomies');
const { isLoggedIn , isAuthor, validatePgroomies} = require('../middleware');
const { pgroomiesSchema, reviewSchema } = require('../schemas.js');

router.get('/', catchAsync(async (req, res) => {
    const pgroomies = await Pgroomies.find({});
    res.render('pgroomies/index', { pgroomies })
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('pgroomies/new');
})

router.post('/', isLoggedIn, validatePgroomies, catchAsync(async (req, res, next) => {
    const pgroomies = new Pgroomies(req.body.pgroomies);
    pgroomies.author = req.user.id;
    await pgroomies.save();
    req.flash('success', 'Successfully created a new PG room site !');
    res.redirect(`/pgroomies/${pgroomies.id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const pg = await Pgroomies.findById(req.params.id).populate('reviews').populate('author');
    console.log(pg);
    if (!pg) {
        req.flash('error', 'Cannot find any such PG Room')
        return res.redirect('/pgroomies');
    }
    res.render('pgroomies/show', { pg });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    const pg = await Pgroomies.findById(req.params.id)
    if (!pg) {
        req.flash('error', 'Cannot find any such PG Room')
        return res.redirect('/pgroomies');
    }
    res.render('pgroomies/edit', { pg });
}));

router.put('/:id', isLoggedIn, isAuthor, validatePgroomies, catchAsync(async (req, res) => {
    const { id } = req.params;
    const pgroomies = await Pgroomies.findByIdAndUpdate(id, { ...req.body.pgroomiesEdit });
    req.flash('success', 'Successfully updated PG Room');
    res.redirect(`/pgroomies/${pgroomies.id}`)
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Pgroomies.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted PG Room');
    res.redirect('/pgroomies');
}));

module.exports = router; 