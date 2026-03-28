
import ServiceProvider from '../models/ServiceProvider.js';
import Counter from '../models/Counter.js'

exports.getVerifiedProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.find({ isVerified: true, status: 'active' })
      .select('name category location rating totalReviews')
      .sort('-rating');
    res.json({ success: true, count: providers.length, data: providers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching providers', error: error.message });
  }
};

exports.createProvider = async (req, res) => {
  try {
    const provider = new ServiceProvider(req.body);
    await provider.save();

    if (provider.isVerified) await Counter.findOneAndUpdate({ type: 'workers' }, { $inc: { value: 1 } });

    res.status(201).json({ success: true, message: 'Provider created', data: provider });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating provider', error: error.message });
  }
};

exports.verifyProvider = async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    if (!provider) return res.status(404).json({ success: false, message: 'Provider not found' });

    if (!provider.isVerified) {
      provider.isVerified = true;
      provider.verifiedAt = Date.now();
      await provider.save();
      await Counter.findOneAndUpdate({ type: 'workers' }, { $inc: { value: 1 } });
    }

    res.json({ success: true, message: 'Provider verified', data: provider });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying provider', error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalProviders = await ServiceProvider.countDocuments();
    const verifiedProviders = await ServiceProvider.countDocuments({ isVerified: true });
    const activeProviders = await ServiceProvider.countDocuments({ status: 'active' });
    const locations = await ServiceProvider.distinct('location.city');
    const avgRating = await ServiceProvider.aggregate([{ $match: { rating: { $gt: 0 } } }, { $group: { _id: null, avgRating: { $avg: '$rating' } } }]);
    const totalContracts = await ServiceProvider.aggregate([{ $group: { _id: null, total: { $sum: '$contractsCompleted' } } }]);

    res.json({
      success: true,
      data: {
        totalProviders,
        verifiedProviders,
        activeProviders,
        uniqueLocations: locations.length,
        averageRating: avgRating[0]?.avgRating || 0,
        totalContracts: totalContracts[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching stats', error: error.message });
  }
};
