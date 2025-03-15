import User from '../models/Users.js';

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    console.log('Received profile update request:', req.body);
    console.log('User ID from token:', req.user.id);

    const { industry, subIndustry, experience, skills, bio, authProvider, profilePicture } = req.body;
    
    // Find user by ID
    let user = await User.findById(req.user.id);
    
    if (!user) {
      console.log('User not found with ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields
    user.industry = industry || user.industry;
    user.subIndustry = subIndustry || user.subIndustry;
    user.experience = experience || user.experience;
    user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    user.bio = bio || user.bio;
    user.authProvider = authProvider || user.authProvider;
    user.profilePicture = profilePicture || user.profilePicture;
    user.isProfileComplete = true; // Mark profile as complete
    
    // Save updated user
    await user.save();
    
    // Send back the updated user data
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      industry: user.industry,
      subIndustry: user.subIndustry,
      experience: user.experience,
      skills: user.skills,
      bio: user.bio,
      profilePicture: user.profilePicture,
      authProvider: user.authProvider,
      isProfileComplete: user.isProfileComplete
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      message: 'Server error while updating profile', 
      error: error.message 
    });
  }
};