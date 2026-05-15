const express = require('express');
const router = express.Router();
const driverPanelController = require('../controllers/driverPanelController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get(
  '/me',
  authMiddleware,
  roleMiddleware('driver'),
  driverPanelController.getMe
);

router.get(
  '/current-order',
  authMiddleware,
  roleMiddleware('driver'),
  driverPanelController.getCurrentOrder
);

router.get(
  '/order-history',
  authMiddleware,
  roleMiddleware('driver'),
  driverPanelController.getOrderHistory
);

router.patch(
  '/current-order/start',
  authMiddleware,
  roleMiddleware('driver'),
  driverPanelController.startCurrentOrder
);

router.patch(
  '/current-order/complete',
  authMiddleware,
  roleMiddleware('driver'),
  driverPanelController.completeCurrentOrder
);

module.exports = router;