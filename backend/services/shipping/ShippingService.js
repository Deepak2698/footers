/**
 * Shipping provider abstraction.
 * Switch SHIPPING_PROVIDER env to change implementation.
 * Supported: dummy | shiprocket | delhivery | bluedart
 */

class DummyShippingProvider {
  async createShipment(order) {
    const trackingNumber = `FT${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const shipmentId = `SHP-${order.orderNumber}`;
    return {
      trackingNumber,
      trackingStatus: 'label_created',
      courierPartner: 'Dummy Logistics',
      shipmentId,
      trackingUrl: `${process.env.APP_URL || 'http://localhost:3000'}/track-order?order=${order.orderNumber}&phone=${encodeURIComponent(order.customerPhone)}`
    };
  }

  async getTrackingStatus(trackingNumber) {
    return {
      trackingNumber,
      status: 'in_transit',
      events: [
        { date: new Date(), description: 'Shipment created', location: 'Kolhapur Hub' },
        { date: new Date(), description: 'In transit to destination', location: 'Regional Hub' }
      ]
    };
  }
}

class ShiprocketAdapter {
  async createShipment() { throw new Error('Shiprocket integration not configured. Set SHIPROCKET_API_KEY.'); }
  async getTrackingStatus() { throw new Error('Shiprocket integration not configured.'); }
}

class DelhiveryAdapter {
  async createShipment() { throw new Error('Delhivery integration not configured. Set DELHIVERY_API_KEY.'); }
  async getTrackingStatus() { throw new Error('Delhivery integration not configured.'); }
}

class BlueDartAdapter {
  async createShipment() { throw new Error('BlueDart integration not configured. Set BLUEDART_API_KEY.'); }
  async getTrackingStatus() { throw new Error('BlueDart integration not configured.'); }
}

const providers = {
  dummy: DummyShippingProvider,
  shiprocket: ShiprocketAdapter,
  delhivery: DelhiveryAdapter,
  bluedart: BlueDartAdapter
};

function getProvider() {
  const name = (process.env.SHIPPING_PROVIDER || 'dummy').toLowerCase();
  const Provider = providers[name] || DummyShippingProvider;
  return new Provider();
}

export async function createShipment(order) {
  return getProvider().createShipment(order);
}

export async function getTrackingStatus(trackingNumber) {
  return getProvider().getTrackingStatus(trackingNumber);
}

export default { createShipment, getTrackingStatus };
