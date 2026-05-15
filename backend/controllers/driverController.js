const driverService = require('../services/driverService');

async function getDrivers(req, res) {
  try {
    const { status } = req.query;
    const drivers = await driverService.getAllDrivers(status);
    return res.json(drivers);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd pobierania kierowców',
    });
  }
}

async function getDriver(req, res) {
  try {
    const { id } = req.params;
    const driver = await driverService.getDriverById(id);

    if (!driver) {
      return res.status(404).json({
        error: 'Kierowca nie został znaleziony',
      });
    }

    return res.json(driver);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd pobierania kierowcy',
    });
  }
}

async function createDriver(req, res) {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      licenseNumber,
      licenseCategory,
      medicalExamValidUntil,
      status,
      createUserAccount,
    } = req.body;

    if (!firstName || !lastName || !licenseNumber || !licenseCategory) {
      return res.status(400).json({
        error: 'firstName, lastName, licenseNumber i licenseCategory są wymagane',
      });
    }

    const result = await driverService.createDriver({
      firstName,
      lastName,
      phone,
      email,
      licenseNumber,
      licenseCategory,
      medicalExamValidUntil,
      status,
      createUserAccount,
    });

    if (result?.error) {
      return res.status(result.statusCode || 400).json({
        error: result.error,
      });
    }

    return res.status(201).json({
      message: result.createdAccount
        ? 'Kierowca i konto użytkownika zostały utworzone'
        : 'Kierowca został utworzony',
      driver: result.driver,
      createdAccount: result.createdAccount,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd tworzenia kierowcy',
    });
  }
}

async function updateDriver(req, res) {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      phone,
      email,
      licenseNumber,
      licenseCategory,
      medicalExamValidUntil,
      status,
    } = req.body;

    if (!firstName || !lastName || !licenseNumber || !licenseCategory || !status) {
      return res.status(400).json({
        error: 'firstName, lastName, licenseNumber, licenseCategory i status są wymagane',
      });
    }

    const driver = await driverService.updateDriver(id, {
      firstName,
      lastName,
      phone,
      email,
      licenseNumber,
      licenseCategory,
      medicalExamValidUntil,
      status,
    });

    if (!driver) {
      return res.status(404).json({
        error: 'Kierowca nie został znaleziony',
      });
    }

    return res.json(driver);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd aktualizacji kierowcy',
    });
  }
}

async function deleteDriver(req, res) {
  try {
    const { id } = req.params;
    const driver = await driverService.deleteDriver(id);

    if (!driver) {
      return res.status(404).json({
        error: 'Kierowca nie został znaleziony',
      });
    }

    return res.json({
      message: 'Kierowca został usunięty',
      driver,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd usuwania kierowcy',
    });
  }
}

module.exports = {
  getDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
};