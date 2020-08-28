const expect = require('chai').expect;
const InventoryAllocator = require('../inventory-allocator');

const inventoryAllocator = new InventoryAllocator()

const warehouseA = { name: "A", inventory: { apple: 5, orange: 5 } };
const warehouseB = { name: "B", inventory: { banana: 6, orange: 3 } };
const warehouseC = { name: "C", inventory: { mango: 4, strawberry: 7, blueberry: 2 } };
const warehouseD = { name: "D", inventory: { apple: 4, banana: 3, mango: 1, orange: 6 } };
const warehouseE = { name: "D", inventory: { apple: 0, orange: 0, mango: 0 } };

describe('InventoryAllocator', () => {
  describe('findCheapestShipment', () => {
    it('should return an empty array if given no orders', () => {
      const order = {};
      const warehouses = [warehouseA];
      const shipments = inventoryAllocator.findCheapestShipment(order, warehouses);
      expect(shipments).deep.equal([]);
    })

    it('should return an empty array if given no warehouses', () => {
      const order = { apple: 5 };
      const warehouses = [];
      const shipments = inventoryAllocator.findCheapestShipment(order, warehouses);
      expect(shipments).deep.equal([]);
    })
    
    it('should return an empty array if the warehouses do not contain any order items', () => {
      const order = { apple: 5 };
      const warehouses = [warehouseB, warehouseC];
      const shipments = inventoryAllocator.findCheapestShipment(order, warehouses);
      expect(shipments).deep.equal([]);
    })

    it('should return an empty array if the warehouses do not have any inventory left', () => {
      const order = { apple: 3, orange: 2 };
      const warehouses = [warehouseE];
      const shipments = inventoryAllocator.findCheapestShipment(order, warehouses);
      expect(shipments).deep.equal([]);
    })

    it('should return an empty array if the warehouses do not have enough inventory', () => {
      const order = { apple: 6, orange: 15 };
      const warehouses = [warehouseA, warehouseB];
      const shipments = inventoryAllocator.findCheapestShipment(order, warehouses);
      expect(shipments).deep.equal([]);
    })

    it('should return an empty array if given order items with quantity of 0', () => {
      const order = { apple: 0, orange: 0 };
      const warehouses = [warehouseA, warehouseB];
      const shipments = inventoryAllocator.findCheapestShipment(order, warehouses);
      expect(shipments).deep.equal([]);
    })

    it('should return shipments if given a single order', () => {
      const order = { apple: 5 };
      const warehouses = [warehouseA, warehouseB, warehouseC];
      const expectedResult = [{ "A": { apple: 5 } }];
      const shipments = inventoryAllocator.findCheapestShipment(order, warehouses);
      expect(shipments).to.have.deep.members(expectedResult);
    })
    
    it('should return a shipment from a warehouse with inventory matching the ordered items', () => {
      const order = { mango: 4, strawberry: 7, blueberry: 2 };
      const warehouses = [warehouseC, warehouseD];
      const expectedResult = [{ "C": { mango: 4, strawberry: 7, blueberry: 2 } }];
      const shipments = inventoryAllocator.findCheapestShipment(order, warehouses);
      expect(shipments).to.have.deep.members(expectedResult);
    })

    it('should return the cheapest shipments across multiple warehouses', () => {
      const order = { apple: 8, orange: 10, banana: 2 };
      const warehouses = [warehouseA, warehouseB, warehouseD];
      const expectedResult = [
        { "A": { apple: 5, orange: 5 } },
        { "B": { banana: 2, orange: 3 } },
        { "D": { apple: 3, orange: 2 } },
      ];
      const shipments = inventoryAllocator.findCheapestShipment(order, warehouses);
      expect(shipments).to.have.deep.members(expectedResult);
    })
  })
})
