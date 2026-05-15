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

async function getAvailableResources(req, res) {
  try {
    const { cargoType, cargoWeightKg, excludeOrderId } = req.query;

    if (!cargoType || cargoWeightKg === undefined) {
      return res.status(400).json({
        error: 'cargoType i cargoWeightKg są wymagane',
      });
    }

    const resources = await transportOrderService.getAvailableResources({
      cargoType,
      cargoWeightKg,
      excludeOrderId: excludeOrderId ? Number(excludeOrderId) : null,
    });

    return res.json(resources);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd pobierania dostępnych zasobów',
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
      cargoName,
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

    if (!clientName || !pickupLocation || !deliveryLocation || cargoWeightKg === undefined || !plannedDate) {
      return res.status(400).json({
        error: 'clientName, pickupLocation, deliveryLocation, cargoWeightKg i plannedDate są wymagane',
      });
    }

    const order = await transportOrderService.createTransportOrder({
      orderNumber,
      clientName,
      pickupLocation,
      deliveryLocation,
      cargoWeightKg,
      cargoType,
      cargoName,
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

    if (err.code === '23505') {
      return res.status(400).json({
        error: 'Kierowca, pojazd lub naczepa są już przypisane do innego aktywnego zlecenia',
      });
    }

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
      cargoName,
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
      cargoName,
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

    if (err.code === '23505') {
      return res.status(400).json({
        error: 'Kierowca, pojazd lub naczepa są już przypisane do innego aktywnego zlecenia',
      });
    }

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
  getAvailableResources,
  createTransportOrder,
  updateTransportOrder,
  deleteTransportOrder,
};