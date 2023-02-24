const { Router } = require('express')
const userModel = require('../../dao/models/user.model')
const { roleMiddleware } = require('../../middlewares/role.middleware')
const { createHash, isValidPassword } = require('../../utils')
const passport = require('passport')

const router = Router()

router.post('/register',
 passport.authenticate('register', {failureRedirect: '/api/session/failRegister'}), 
 (req, res)=>res.redirect('/login')
 )

router.get('/failRegister', (req,res)=>{
    res.send({error: 'Failed Register'})
})

router.post('/login', 
    roleMiddleware, 
    passport.authenticate('login', {failureRedirect: '/api/session/failLogin'}),
    async (req,res)=>{
        if(!req.user){
            return res.status(400).send({
                status: 'error',
                error: 'Invalid credentials'
            })
        }
        const userSession = {
            name: req.user.name,
            lastName: req.user.lastName,
            email: req.user.email,
            age: req.user.age,
            githubLogin: req.user.githubLogin,
            role: 'user'
        } 
        req.session.user = userSession
        req.session.save(err => {
            if (err){
                console.log('session error: ', err);
            } 
            else {
                res.redirect('/products');
            }
        })
    }
)

router.get('/failLogin', (req,res)=>{
    res.send({error: 'Failed Login'})
})

router.get('/github', 
    passport.authenticate('github', { scope: ['user:email'] }
))

router.get('/github/callback',
    passport.authenticate('github', {failureRedirect: '/api/session/failLogin'}),
    async (req, res) =>{
        const sessionUser = {
            name: req.user.name,
            lastName: req.user.lastName,
            age: req.user.age,
            email: req.user.email,
            githubLogin: req.user.githubLogin,
            role: 'user'
        }
        req.session.user = sessionUser
        res.redirect('/products')
    }
)

router.get('/logout', async (req, res)=>{
    try {
        await req.session.destroy(err => {
            if (err) {
              console.log(err);
            }
            else {
              res.clearCookie('start-solo');
              res.redirect('/');
            }
          })
    } catch (error) {
        res.status(500).send({
            status: 'error',
            error: error
        })   
    }
})


module.exports = router