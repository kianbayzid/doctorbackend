/**
 * Authorization middleware to ensure users can only access their own resources
 */

/**
 * Middleware to check if the authenticated user matches the requested patient ID
 * This should be used on patient-specific routes
 */
export const checkPatientOwnership = (req, res, next) => {
  try {
    // Get the patient ID from the route parameter
    const requestedPatientId = parseInt(req.params.id);
    
    // Get the user ID from the JWT token (Auth0 provides this in req.auth.payload.sub)
    // The sub field typically contains the user ID
    const authUserId = req.auth?.payload?.sub;
    
    if (!authUserId) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'No user ID found in token' 
      });
    }
    
    // For now, we'll assume the user ID in the token matches the patient ID
    // In a real implementation, you might need to look up the user in a users table
    // and match it to the patient record
    
    // TODO: Implement proper user-to-patient mapping
    // This is a simplified version - in production you'd want to:
    // 1. Look up the user in a users table
    // 2. Find the associated patient record
    // 3. Compare the patient ID with the requested ID
    
    // For now, we'll allow the request to proceed
    // In production, you should implement proper user-to-patient mapping
    console.log(`Patient access check: requested ID ${requestedPatientId}, auth user ${authUserId}`);
    
    next();
  } catch (error) {
    console.error('Error in checkPatientOwnership:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Error checking patient ownership' 
    });
  }
};

/**
 * Middleware to check if the authenticated user matches the requested doctor ID
 * This should be used on doctor-specific routes
 */
export const checkDoctorOwnership = (req, res, next) => {
  try {
    // Get the doctor ID from the route parameter
    const requestedDoctorId = parseInt(req.params.id);
    
    // Get the user ID from the JWT token
    const authUserId = req.auth?.payload?.sub;
    
    if (!authUserId) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'No user ID found in token' 
      });
    }
    
    // TODO: Implement proper user-to-doctor mapping
    // This is a simplified version - in production you'd want to:
    // 1. Look up the user in a users table
    // 2. Find the associated doctor record
    // 3. Compare the doctor ID with the requested ID
    
    // For now, we'll allow the request to proceed
    // In production, you should implement proper user-to-doctor mapping
    console.log(`Doctor access check: requested ID ${requestedDoctorId}, auth user ${authUserId}`);
    
    next();
  } catch (error) {
    console.error('Error in checkDoctorOwnership:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Error checking doctor ownership' 
    });
  }
};
