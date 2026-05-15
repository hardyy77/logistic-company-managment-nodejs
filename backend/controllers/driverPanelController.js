const driverPanelService = require('../services/driverPanelService');

async function getMe(req, res) {
  try {
    const driver = await driverPanelService.getDriverByUserId(req.user.userId);

    if (!driver) {
      return res.status(404).json({
        error: 'Nie znaleziono profilu kierowcy dla zalogowanego użytkownika',
      });
    }

    return res.json(driver);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd pobierania danych kierowcy',
    });
  }
}

async function getCurrentOrder(req, res) {
  try {
    const order = await driverPanelService.getCurrentOrderByUserId(req.user.userId);
    return res.json(order);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd pobierania aktualnego zlecenia kierowcy',
    });
  }
}

async function getOrderHistory(req, res) {
  try {
    const orders = await driverPanelService.getOrderHistoryByUserId(req.user.userId);
    return res.json(orders);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd pobierania historii zleceń kierowcy',
    });
  }
}

async function startCurrentOrder(req, res) {
  try {
    const result = await driverPanelService.startCurrentOrder(req.user.userId);

    if (result?.error) {
      return res.status(result.statusCode || 400).json({
        error: result.error,
      });
    }

    return res.json({
      message: 'Rozpoczęto realizację zlecenia',
      order: result,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd rozpoczynania zlecenia',
    });
  }
}

async function completeCurrentOrder(req, res) {
  try {
    const result = await driverPanelService.completeCurrentOrder(req.user.userId);

    if (result?.error) {
      return res.status(result.statusCode || 400).json({
        error: result.error,
      });
    }

    return res.json({
      message: 'Zakończono realizację zlecenia',
      order: result,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd kończenia zlecenia',
    });
  }
}

module.exports = {
  getMe,
  getCurrentOrder,
  getOrderHistory,
  startCurrentOrder,
  completeCurrentOrder,
};