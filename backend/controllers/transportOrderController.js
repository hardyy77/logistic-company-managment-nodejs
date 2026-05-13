const transportOrderService = require('../services/transportOrderService');

async function getTransportOrders(req, res) {
  try {
    const { status } = req.query;
    const orders = await transportOrderService.getAllTransportOrders(status);
    return res.json(orders);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd pobierania zleceń transportowych',
    });
  }
}

async function getTransportOrder(req, res) {
  try {
    const { id } = req.params;
    const order = await transportOrderService.getTransportOrderById(id);

    if (!order) {
      return res.status(404).json({
        error: 'Zlecenie transportowe nie zostało znalezione',
      });
    }

    return res.json(order);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd pobierania zlecenia transportowego',
    });
  }
}

async function createTransportOrder(req, res) {
  try {
    const {
      orderNumber,
      clientName,
      pickupLocation,
      deliveryLocation,
      cargoWeightKg,
      cargoType,
      plannedDistanceKm,
      plannedDurationMinutes,
      estimatedCost,
      plannedDate,
      status,
      driverId,
      vehicleId,
      trailerId,
      createdByUserId,
    } = req.body;

    if (!orderNumber || !clientName || !pickupLocation || !deliveryLocation || cargoWeightKg === undefined || !plannedDate) {
      return res.status(400).json({
        error: 'orderNumber, clientName, pickupLocation, deliveryLocation, cargoWeightKg i plannedDate są wymagane',
      });
    }

    const order = await transportOrderService.createTransportOrder({
      orderNumber,
      clientName,
      pickupLocation,
      deliveryLocation,
      cargoWeightKg,
      cargoType,
      plannedDistanceKm,
      plannedDurationMinutes,
      estimatedCost,
      plannedDate,
      status,
      driverId,
      vehicleId,
      trailerId,
      createdByUserId,
    });

    if (order?.error) {
      return res.status(order.statusCode || 400).json({
        error: order.error,
      });
    }

    return res.status(201).json(order);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd tworzenia zlecenia transportowego',
    });
  }
}

async function updateTransportOrder(req, res) {
  try {
    const { id } = req.params;
    const {
      orderNumber,
      clientName,
      pickupLocation,
      deliveryLocation,
      cargoWeightKg,
      cargoType,
      plannedDistanceKm,
      plannedDurationMinutes,
      estimatedCost,
      plannedDate,
      status,
      driverId,
      vehicleId,
      trailerId,
      createdByUserId,
    } = req.body;

    if (!orderNumber || !clientName || !pickupLocation || !deliveryLocation || cargoWeightKg === undefined || !plannedDate || !status) {
      return res.status(400).json({
        error: 'orderNumber, clientName, pickupLocation, deliveryLocation, cargoWeightKg, plannedDate i status są wymagane',
      });
    }

    const order = await transportOrderService.updateTransportOrder(id, {
      orderNumber,
      clientName,
      pickupLocation,
      deliveryLocation,
      cargoWeightKg,
      cargoType,
      plannedDistanceKm,
      plannedDurationMinutes,
      estimatedCost,
      plannedDate,
      status,
      driverId,
      vehicleId,
      trailerId,
      createdByUserId,
    });

    if (!order) {
      return res.status(404).json({
        error: 'Zlecenie transportowe nie zostało znalezione',
      });
    }

    if (order?.error) {
      return res.status(order.statusCode || 400).json({
        error: order.error,
      });
    }

    return res.json(order);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd aktualizacji zlecenia transportowego',
    });
  }
}

async function deleteTransportOrder(req, res) {
  try {
    const { id } = req.params;
    const order = await transportOrderService.deleteTransportOrder(id);

    if (!order) {
      return res.status(404).json({
        error: 'Zlecenie transportowe nie zostało znalezione',
      });
    }

    return res.json({
      message: 'Zlecenie transportowe zostało usunięte',
      order,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd usuwania zlecenia transportowego',
    });
  }
}

module.exports = {
  getTransportOrders,
  getTransportOrder,
  createTransportOrder,
  updateTransportOrder,
  deleteTransportOrder,
};