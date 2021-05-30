const router = require('express').Router()
const { getOrder, getOrders, postOrders, getAdminOrders,statusUpdate } = require('../controllers/orderController')
const auth = require('../middlewares/auth')

//For Customer
router.get('/api/orders',auth,getOrders)
router.post('/api/orders',auth,postOrders)
router.get('/api/orders/:id',auth,getOrder)


//For Admin
router.get('/api/admin/orders', auth, getAdminOrders)
router.post('/api/orders/status', auth, statusUpdate)
module.exports = router