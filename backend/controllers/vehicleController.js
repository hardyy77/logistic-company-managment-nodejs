const vehicleService = require('../services/vehicleService');

async function getVehicles(req, res) {
  try {
    const { status } = req.query;
    const vehicles = await vehicleService.getAllVehicles(status);
    return res.json(vehicles);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd pobierania pojazdów',
    });
  }
}

async function getVehicle(req, res) {
  try {
    const { id } = req.params;
    const vehicle = await vehicleService.getVehicleById(id);

    if (!vehicle) {
      return res.status(404).json({
        error: 'Pojazd nie został znaleziony',
      });
    }

    return res.json(vehicle);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd pobierania pojazdu',
    });
  }
}

async function createVehicle(req, res) {
  try {
    const {
      registrationNumber,
      brand,
      model,
      productionYear,
      vehicleType,
      capacityKg,
      mileage,
      status,
      inspectionValidUntil,
      insuranceValidUntil,
    } = req.body;

    if (!registrationNumber || !brand || !model || !vehicleType || capacityKg === undefined) {
      return res.status(400).json({
        error: 'registrationNumber, brand, model, vehicleType i capacityKg są wymagane',
      });
    }

    const vehicle = await vehicleService.createVehicle({
      registrationNumber,
      brand,
      model,
      productionYear,
      vehicleType,
      capacityKg,
      mileage,
      status,
      inspectionValidUntil,
      insuranceValidUntil,
    });

    return res.status(201).json(vehicle);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd tworzenia pojazdu',
    });
  }
}

async function updateVehicle(req, res) {
  try {
    const { id } = req.params;
    const {
      registrationNumber,
      brand,
      model,
      productionYear,
      vehicleType,
      capacityKg,
      mileage,
      status,
      inspectionValidUntil,
      insuranceValidUntil,
    } = req.body;

    if (!registrationNumber || !brand || !model || !vehicleType || capacityKg === undefined || !status) {
      return res.status(400).json({
        error: 'registrationNumber, brand, model, vehicleType, capacityKg i status są wymagane',
      });
    }

    const vehicle = await vehicleService.updateVehicle(id, {
      registrationNumber,
      brand,
      model,
      productionYear,
      vehicleType,
      capacityKg,
      mileage,
      status,
      inspectionValidUntil,
      insuranceValidUntil,
    });

    if (!vehicle) {
      return res.status(404).json({
        error: 'Pojazd nie został znaleziony',
      });
    }

    return res.json(vehicle);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd aktualizacji pojazdu',
    });
  }
}

async function deleteVehicle(req, res) {
  try {
    const { id } = req.params;
    const vehicle = await vehicleService.deleteVehicle(id);

    if (!vehicle) {
      return res.status(404).json({
        error: 'Pojazd nie został znaleziony',
      });
    }

    return res.json({
      message: 'Pojazd został usunięty',
      vehicle,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd usuwania pojazdu',
    });
  }
}

module.exports = {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};