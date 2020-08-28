class InventoryAllocator {
  constructor() {}

  findCheapestShipment(order, warehouses) {
    if (Object.keys(order).length === 0
        || warehouses.length === 0
        || !this._hasEnoughInventory(order, warehouses)
    ) {
      return [];
    }

    const orderEntries = Object.entries(order);
    const shipmentsByWarehouse = {};

    for (let [item, quantity] of orderEntries) {
      for (const { name, inventory } of warehouses) {
        if (inventory[item] && quantity > 0) {
          const quantityAvailable = inventory[item];
          const shipmentQuantity = quantity > quantityAvailable
            ? quantityAvailable
            : quantity;
          
          quantity -= shipmentQuantity;

          if (!shipmentsByWarehouse[name]) {
            shipmentsByWarehouse[name] = {};
          }
          shipmentsByWarehouse[name][item] = 
            shipmentsByWarehouse[name][item] + shipmentQuantity || shipmentQuantity;
        }
      }
    }

    return this._createShipments(shipmentsByWarehouse);
  }

  _hasEnoughInventory(order, warehouses) {
    const orderEntries = Object.entries(order);

    for (const [item, quantity] of orderEntries) {
      if (!this._hasEnoughInventoryForItem(item, quantity, warehouses)) {
        return false;
      }
    }

    return true;
  }

  _hasEnoughInventoryForItem(item, quantity, warehouses) {
    const totalInventory = warehouses
      .filter(warehouse => warehouse.inventory[item])
      .reduce((total, warehouse) => total + warehouse.inventory[item], 0);

    return totalInventory >= quantity;
  }

  _createShipments(shipmentsByWarehouse) {
    return Object
      .entries(shipmentsByWarehouse)
      .map(([warehouse, inventories]) => {
        return {
          [warehouse]: inventories
        };
      });
  }
}

module.exports = new InventoryAllocator()
