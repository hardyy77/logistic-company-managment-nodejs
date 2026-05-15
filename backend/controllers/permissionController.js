const permissionService = require('../services/permissionService');

async function getPermissions(req, res) {
  try {
    const permissions = await permissionService.getAllPermissions();
    return res.json(permissions);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd pobierania uprawnień',
    });
  }
}

async function getDriverPermissions(req, res) {
  try {
    const { driverId } = req.params;
    const permissions = await permissionService.getPermissionsByDriverId(driverId);
    return res.json(permissions);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd pobierania uprawnień kierowcy',
    });
  }
}

async function addDriverPermission(req, res) {
  try {
    const { driverId } = req.params;
    const { permissionId } = req.body;

    if (!permissionId) {
      return res.status(400).json({
        error: 'permissionId jest wymagane',
      });
    }

    const permission = await permissionService.addPermissionToDriver(driverId, permissionId);

    return res.status(201).json({
      message: permission
        ? 'Uprawnienie zostało dodane'
        : 'Uprawnienie już było przypisane',
      permission,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd dodawania uprawnienia kierowcy',
    });
  }
}

async function removeDriverPermission(req, res) {
  try {
    const { driverId } = req.params;
    const { permissionId } = req.body;

    if (!permissionId) {
      return res.status(400).json({
        error: 'permissionId jest wymagane',
      });
    }

    const permission = await permissionService.removePermissionFromDriver(driverId, permissionId);

    if (!permission) {
      return res.status(404).json({
        error: 'Uprawnienie nie zostało znalezione',
      });
    }

    return res.json({
      message: 'Uprawnienie zostało usunięte',
      permission,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd usuwania uprawnienia kierowcy',
    });
  }
}

module.exports = {
  getPermissions,
  getDriverPermissions,
  addDriverPermission,
  removeDriverPermission,
};