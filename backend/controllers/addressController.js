import Address from '../models/addressModel.js';

// Get the logged-in user's address
export const getAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ user: req.user.id });
    res.json({ success: true, address });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add or update the logged-in user's address
export const addOrUpdateAddress = async (req, res) => {
  try {
    const { street, city, state, zip, country, phone } = req.body;
    let address = await Address.findOneAndUpdate(
      { user: req.user.id },
      { street, city, state, zip, country, phone, user: req.user.id },
      { new: true, upsert: true }
    );
    res.json({ success: true, address });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete the logged-in user's address
export const deleteAddress = async (req, res) => {
  try {
    await Address.findOneAndDelete({ user: req.user.id });
    res.json({ success: true, message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}; 